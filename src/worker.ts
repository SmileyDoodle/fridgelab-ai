/// <reference lib="webworker" />
import {
  InterruptableStoppingCriteria,
  TextStreamer,
  pipeline,
  env,
} from '@huggingface/transformers'
import type { WorkerRequest, WorkerResponse } from './types'

const MODEL_ID = 'onnx-community/Qwen2.5-0.5B-Instruct'

// Models are fetched from the HF Hub and persisted in the browser Cache Storage,
// so later visits load instantly (no re-download).
env.allowLocalModels = false
env.useBrowserCache = true

const SYSTEM_PROMPT = `You are a cozy, warm culinary assistant. Given a list of pantry items and an effort level, invent one simple, comforting dish. Output strictly in this format:
### [Dish Name]
- **Effort:** [e.g. 5 mins, 1 pan]
- **Ingredients Used:** [items]
- **Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]
- **Chef's Cozy Tip:** [one witty, warm tip]

If any item is not safe, edible food, reply with exactly: NOT_FOOD`

// Few-shot demonstration to enforce structured markdown output on quantized models.
const EXAMPLE_USER = 'Pantry items: Rice, Egg\nEffort level: about 10 minutes, 1 pan'
const EXAMPLE_ASSISTANT = `### Golden Egg Fried Rice
- **Effort:** 10 mins, 1 pan
- **Ingredients Used:** Rice, Egg
- **Steps:**
1. Heat a little oil in a pan and scramble the egg until just set.
2. Add the cooked rice and stir for 3 minutes until hot.
3. Season with salt and pepper, then serve warm.
- **Chef's Cozy Tip:** Day-old rice fries best, so yesterday's you did this one a favor.`

// Minimal structural type: the full pipeline union type is too heavy for tsc.
type Generator = ((
  messages: { role: string; content: string }[],
  options: Record<string, unknown>,
) => Promise<unknown>) & { tokenizer: ConstructorParameters<typeof TextStreamer>[0] }

const post = (msg: WorkerResponse) => self.postMessage(msg)

const stopping = new InterruptableStoppingCriteria()
let generatorPromise: Promise<Generator> | null = null

async function detectDevice(): Promise<'webgpu' | 'wasm'> {
  try {
    const gpu = (navigator as unknown as { gpu?: { requestAdapter(): Promise<unknown> } }).gpu
    if (gpu && (await gpu.requestAdapter())) return 'webgpu'
  } catch {
    /* fall through */
  }
  return 'wasm'
}

/** Aggregate per-file download events into one overall percentage. */
function makeProgressTracker() {
  const files = new Map<string, { loaded: number; total: number }>()
  let lastSent = 0
  return (e: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (e.status === 'progress' && e.file && e.total) {
      files.set(e.file, { loaded: e.loaded ?? 0, total: e.total })
    } else if (e.status === 'done' && e.file) {
      const f = files.get(e.file)
      if (f) files.set(e.file, { loaded: f.total, total: f.total })
    } else if (e.status !== 'initiate') {
      return
    }
    const now = performance.now()
    if (now - lastSent < 80) return // throttle UI updates
    lastSent = now
    let loaded = 0
    let total = 0
    files.forEach((f) => {
      loaded += f.loaded
      total += f.total
    })
    post({
      type: 'progress',
      progress: {
        percent: total ? Math.min(100, (loaded / total) * 100) : 0,
        loadedMB: loaded / 1048576,
        totalMB: total / 1048576,
        label: e.file ? e.file.split('/').pop() ?? '' : '',
      },
    })
  }
}

function getGenerator(): Promise<Generator> {
  if (generatorPromise) return generatorPromise
  generatorPromise = (async () => {
    post({ type: 'loading' })
    const device = await detectDevice()
    post({ type: 'device', device })
    const tracker = makeProgressTracker()
    const make = (dev: 'webgpu' | 'wasm') =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (pipeline as any)('text-generation', MODEL_ID, {
        // WebGPU uses q4 with fp32 activations for numerical stability across GPUs; WASM falls back to q8.
        dtype: dev === 'webgpu' ? 'q4' : 'q8',
        device: dev,
        progress_callback: tracker,
      }) as Promise<Generator>
    let gen: Generator
    try {
      gen = await make(device)
    } catch (err) {
      if (device === 'webgpu') {
        // e.g. no shader-f16 support -> retry on CPU
        post({ type: 'device', device: 'wasm' })
        gen = await make('wasm')
      } else {
        throw err
      }
    }
    // Warm-up pass compiles shaders so the first real request is snappy.
    try {
      await gen([{ role: 'user', content: 'hi' }], { max_new_tokens: 1 })
    } catch {
      /* non-fatal */
    }
    post({ type: 'ready' })
    return gen
  })()
  generatorPromise.catch(() => {
    generatorPromise = null // allow retry
  })
  return generatorPromise
}

async function generate(ingredients: string[], vibePrompt: string) {
  const gen = await getGenerator()
  stopping.reset()
  post({ type: 'start' })
  let text = ''
  const streamer = new TextStreamer(gen.tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (chunk: string) => {
      text += chunk
      post({ type: 'token', text: chunk })
    },
  })
  await gen(
    [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: EXAMPLE_USER },
      { role: 'assistant', content: EXAMPLE_ASSISTANT },
      {
        role: 'user',
        content: `Pantry items: ${ingredients.join(', ')}\nEffort level: ${vibePrompt}`,
      },
    ],
    {
      max_new_tokens: 350,
      do_sample: true,
      temperature: 0.6,
      top_p: 0.9,
      repetition_penalty: 1.05,
      streamer,
      stopping_criteria: stopping,
    },
  )
  post({ type: 'complete', text })
}

self.addEventListener('message', async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data
  try {
    if (msg.type === 'load') await getGenerator()
    else if (msg.type === 'generate') await generate(msg.ingredients, msg.vibePrompt)
    else if (msg.type === 'interrupt') stopping.interrupt()
  } catch (err) {
    post({ type: 'error', message: err instanceof Error ? err.message : String(err) })
  }
})
