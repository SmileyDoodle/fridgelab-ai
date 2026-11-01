import { useCallback, useRef, useState } from 'react'
import type { AIStatus, LoadProgress } from '../types'

const EMPTY_PROGRESS: LoadProgress = { percent: 100, loadedMB: 0, totalMB: 0, label: '' }

/**
 * Orchestrates recipe generation via the Cloudflare Pages Function edge backend (/api/recipe).
 */
export function useCozyAI() {
  const [status, setStatus] = useState<AIStatus>('idle')
  const [progress] = useState<LoadProgress>(EMPTY_PROGRESS)
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const generate = useCallback(async (ingredients: string[], vibePrompt: string) => {
    // Cancel any previous in-flight request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    setError(null)
    setOutput('')
    setStatus('generating')

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients,
          energy: vibePrompt,
        }),
        signal: controller.signal,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`)
      }

      if (data.result) {
        setOutput(data.result)
        setStatus('ready')
      } else {
        throw new Error('No recipe was returned from the kitchen.')
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setStatus('ready')
        return
      }
      setError(err.message || 'Cooking failed. Please try again.')
      setStatus('error')
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
      }
    }
  }, [])

  const interrupt = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setStatus('ready')
  }, [])

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
      abortControllerRef.current = null
    }
    setOutput('')
    setError(null)
    setStatus('idle')
  }, [])

  return {
    status,
    progress,
    output,
    device: null,
    error,
    isModelReady: true,
    generate,
    interrupt,
    reset,
  }
}
