import { useCallback, useEffect, useRef, useState } from 'react'
import type {
  AIStatus,
  LoadProgress,
  WorkerRequest,
  WorkerResponse,
} from '../types'

const EMPTY_PROGRESS: LoadProgress = { percent: 0, loadedMB: 0, totalMB: 0, label: '' }

/** Orchestrates the inference Web Worker: loading, streaming and errors. */
export function useCozyAI() {
  const workerRef = useRef<Worker | null>(null)
  const [status, setStatus] = useState<AIStatus>('idle')
  const [progress, setProgress] = useState<LoadProgress>(EMPTY_PROGRESS)
  const [output, setOutput] = useState('')
  const [device, setDevice] = useState<'webgpu' | 'wasm' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isModelReady, setIsModelReady] = useState(false)

  useEffect(() => {
    const worker = new Worker(new URL('../worker.ts', import.meta.url), { type: 'module' })
    workerRef.current = worker

    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      const msg = e.data
      switch (msg.type) {
        case 'device':
          setDevice(msg.device)
          break
        case 'loading':
          setStatus('loading')
          break
        case 'progress':
          setProgress(msg.progress)
          break
        case 'ready':
          setIsModelReady(true)
          setStatus((s) => (s === 'loading' ? 'ready' : s))
          break
        case 'start':
          setOutput('')
          setStatus('generating')
          break
        case 'token':
          setOutput((o) => o + msg.text)
          break
        case 'complete':
          setOutput(msg.text)
          setStatus('ready')
          break
        case 'error':
          setError(msg.message)
          setStatus('error')
          break
      }
    }
    worker.onerror = (e) => {
      setError(e.message || 'The kitchen worker crashed.')
      setStatus('error')
    }

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  const send = useCallback((msg: WorkerRequest) => workerRef.current?.postMessage(msg), [])

  const generate = useCallback(
    (ingredients: string[], vibePrompt: string) => {
      setError(null)
      setOutput('')
      // Show the loading/generating UI immediately; worker refines the status.
      setStatus(isModelReady ? 'generating' : 'loading')
      send({ type: 'generate', ingredients, vibePrompt })
    },
    [isModelReady, send],
  )

  const interrupt = useCallback(() => send({ type: 'interrupt' }), [send])
  const reset = useCallback(() => {
    setOutput('')
    setError(null)
    setStatus(isModelReady ? 'ready' : 'idle')
  }, [isModelReady])

  return { status, progress, output, device, error, isModelReady, generate, interrupt, reset }
}
