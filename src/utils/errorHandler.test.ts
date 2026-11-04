import { describe, expect, it } from 'vitest'
import {
  FRIENDLY_ERROR_MESSAGES,
  getFriendlyErrorMessage,
} from './errorHandler.ts'

describe('getFriendlyErrorMessage', () => {
  it('maps inedible input flags to a friendly pantry message', () => {
    expect(getFriendlyErrorMessage('NOT_FOOD')).toBe(
      FRIENDLY_ERROR_MESSAGES.inedible
    )
    expect(
      getFriendlyErrorMessage(new Error('NOT_FOOD'))
    ).toBe(FRIENDLY_ERROR_MESSAGES.inedible)
    expect(
      getFriendlyErrorMessage('Item contains inedible ingredients')
    ).toBe(FRIENDLY_ERROR_MESSAGES.inedible)
  })

  it('maps NO_SAFE_RECIPE to an encouraging swap message', () => {
    expect(getFriendlyErrorMessage('NO_SAFE_RECIPE')).toBe(
      FRIENDLY_ERROR_MESSAGES.noSafeRecipe
    )
  })

  it('maps network disconnects to an offline message', () => {
    const fetchError = new TypeError('Failed to fetch')
    expect(getFriendlyErrorMessage(fetchError)).toBe(
      FRIENDLY_ERROR_MESSAGES.offline
    )
    expect(getFriendlyErrorMessage('Network request failed')).toBe(
      FRIENDLY_ERROR_MESSAGES.offline
    )
  })

  it('maps timeout and abort errors to a simmering timeout message', () => {
    const abortError = new DOMException('The user aborted a request.', 'AbortError')
    expect(getFriendlyErrorMessage(abortError)).toBe(
      FRIENDLY_ERROR_MESSAGES.timeout
    )
  })

  it('maps HTTP 429 and rate limit errors to high-demand kitchen message', () => {
    expect(getFriendlyErrorMessage({ status: 429, message: 'Too many requests' })).toBe(
      FRIENDLY_ERROR_MESSAGES.rateLimit
    )
  })

  it('maps HTTP 500 server errors to friendly kitchen nap message', () => {
    expect(getFriendlyErrorMessage({ status: 500, message: 'Internal Server Error' })).toBe(
      FRIENDLY_ERROR_MESSAGES.server
    )
  })

  it('maps ingredient limit errors to friendly guidance', () => {
    expect(
      getFriendlyErrorMessage('Please select between 2 and 12 ingredients.')
    ).toBe(FRIENDLY_ERROR_MESSAGES.invalidInput)
  })

  it('falls back safely for unknown errors or falsy values', () => {
    expect(getFriendlyErrorMessage(null)).toBe(FRIENDLY_ERROR_MESSAGES.fallback)
    expect(getFriendlyErrorMessage(undefined)).toBe(
      FRIENDLY_ERROR_MESSAGES.fallback
    )
    expect(getFriendlyErrorMessage({})).toBe(FRIENDLY_ERROR_MESSAGES.fallback)
  })
})
