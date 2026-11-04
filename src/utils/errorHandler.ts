/**
 * Standardized friendly messages for different failure modes.
 */
export const FRIENDLY_ERROR_MESSAGES = {
  offline: 'Could not connect to the kitchen. Please check your internet connection and try again.',
  timeout: 'The kitchen took a little too long to simmer. Please give it another spin!',
  rateLimit: 'The kitchen is buzzing with too many orders right now. Please wait a moment and try again.',
  server: 'The kitchen is taking a quick nap. Please give it a moment and try again!',
  parse: "We had trouble plating this recipe. Let's try another spin!",
  invalidInput: 'Please select between 1 and 12 ingredients to create a recipe.',
  inedible: 'Some of those items do not seem like kitchen staples. Try picking tasty pantry ingredients!',
  noSafeRecipe:
    "We couldn't find a safe, tasty way to combine those ingredients. Try adding or swapping an ingredient and spin again!",
  fallback: 'Something unexpected simmered up. Please try again in a moment.',
} as const

/**
 * Intercepts technical API, network, or parser failures and converts them into
 * delightful, safe, user-facing error text.
 *
 * @param error - Any caught exception, rejection value, or error payload
 * @returns Human-friendly message string
 */
export function getFriendlyErrorMessage(error: unknown): string {
  if (!error) {
    return FRIENDLY_ERROR_MESSAGES.fallback
  }

  let message = ''
  let status: number | undefined
  let name = ''

  if (typeof error === 'string') {
    message = error
  } else if (typeof error === 'object') {
    const errObj = error as Record<string, unknown>
    if (typeof errObj.name === 'string') {
      name = errObj.name
    }
    if (typeof errObj.message === 'string') {
      message = errObj.message
    }
    if (typeof errObj.error === 'string') {
      message = errObj.error
    }
    if (typeof errObj.status === 'number') {
      status = errObj.status
    }
  }

  const normalized = message.toLowerCase()

  // 0. AI could not build a safe dish from the (edible) ingredients
  if (normalized.includes('no_safe_recipe')) {
    return FRIENDLY_ERROR_MESSAGES.noSafeRecipe
  }

  // 1. Inedible ingredient guardrail triggered
  if (normalized.includes('not_food') || normalized.includes('not food') || normalized.includes('inedible')) {
    return FRIENDLY_ERROR_MESSAGES.inedible
  }

  // 2. Client-side input validation
  if (
    normalized.includes('between 1 and 12') ||
    normalized.includes('select between') ||
    (status === 400 && normalized.includes('ingredient'))
  ) {
    return FRIENDLY_ERROR_MESSAGES.invalidInput
  }

  // 3. Network connectivity / offline
  if (
    (name === 'TypeError' && normalized.includes('failed to fetch')) ||
    normalized.includes('network') ||
    normalized.includes('offline') ||
    normalized.includes('econnrefused') ||
    normalized.includes('net::err')
  ) {
    return FRIENDLY_ERROR_MESSAGES.offline
  }

  // 4. Request timeout or abort
  if (
    name === 'AbortError' ||
    name === 'TimeoutError' ||
    normalized.includes('timeout') ||
    normalized.includes('aborted')
  ) {
    return FRIENDLY_ERROR_MESSAGES.timeout
  }

  // 5. Rate limiting or quota exceeded
  if (
    status === 429 ||
    normalized.includes('429') ||
    normalized.includes('rate limit') ||
    normalized.includes('too many requests') ||
    normalized.includes('quota')
  ) {
    return FRIENDLY_ERROR_MESSAGES.rateLimit
  }

  // 6. JSON parsing / formatting failure
  if (
    name === 'SyntaxError' ||
    normalized.includes('unexpected token') ||
    normalized.includes('json') ||
    normalized.includes('syntax')
  ) {
    return FRIENDLY_ERROR_MESSAGES.parse
  }

  // 7. Server / AI service downtime
  if (
    (status !== undefined && status >= 500) ||
    normalized.includes('internal server') ||
    normalized.includes('service unavailable') ||
    normalized.includes('bad gateway') ||
    normalized.includes('500') ||
    normalized.includes('502') ||
    normalized.includes('503') ||
    normalized.includes('504') ||
    normalized.includes('kitchen is taking a quick nap')
  ) {
    return FRIENDLY_ERROR_MESSAGES.server
  }

  // 8. Safe generic fallback
  return FRIENDLY_ERROR_MESSAGES.fallback
}
