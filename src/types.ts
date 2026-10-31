export type VibeId = 'tired' | 'cozy' | 'hungry'

export interface Vibe {
  id: VibeId
  label: string
  minutes: number
  emoji: string
  /** Hint passed to the model describing the effort level. */
  prompt: string
  dishes: string
}

export type AIStatus = 'idle' | 'loading' | 'generating' | 'ready' | 'error'

export interface LoadProgress {
  percent: number
  loadedMB: number
  totalMB: number
  label: string
}

/** Messages: main thread -> worker */
export type WorkerRequest =
  | { type: 'load' }
  | { type: 'generate'; ingredients: string[]; vibePrompt: string }
  | { type: 'interrupt' }

/** Messages: worker -> main thread */
export type WorkerResponse =
  | { type: 'device'; device: 'webgpu' | 'wasm' }
  | { type: 'loading' }
  | { type: 'progress'; progress: LoadProgress }
  | { type: 'ready' }
  | { type: 'start' }
  | { type: 'token'; text: string }
  | { type: 'complete'; text: string }
  | { type: 'error'; message: string }
