import { useState } from 'react'
import { AlertTriangle, Sparkles, Square } from 'lucide-react'
import { IngredientPicker } from './components/IngredientPicker'
import { CookingAnimation, LoadingBar } from './components/Loading'
import { ModelStorage } from './components/ModelStorage'
import { RecipeCard } from './components/RecipeCard'
import { useCozyAI } from './hooks/useCozyAI'
import { TAKEOUT_QUIPS, VIBES, findNonEdible } from './lib/data'
import type { VibeId } from './types'

export default function App() {
  const ai = useCozyAI()
  const [ingredients, setIngredients] = useState<string[]>([])
  const [vibeId, setVibeId] = useState<VibeId>('cozy')
  const [takeout, setTakeout] = useState<string | null>(null)

  const vibe = VIBES.find((v) => v.id === vibeId)!
  const busy = ai.status === 'loading' || ai.status === 'generating'
  const exists = (n: string) => ingredients.some((i) => i.toLowerCase() === n.toLowerCase())

  const add = (n: string) => !exists(n) && setIngredients((l) => [...l, n.trim()])
  const remove = (n: string) => setIngredients((l) => l.filter((i) => i !== n))
  const toggle = (n: string) => {
    if (exists(n)) setIngredients((l) => l.filter((i) => i.toLowerCase() !== n.toLowerCase()))
    else add(n)
  }

  const spin = () => {
    if (!ingredients.length || busy) return
    if (findNonEdible(ingredients)) {
      setTakeout(TAKEOUT_QUIPS[0])
      ai.reset()
      return
    }
    setTakeout(null)
    ai.generate(ingredients, vibe.prompt)
  }

  const hasOutput = ai.output.trim().length > 0

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8 text-center">
        <div className="text-5xl animate-bob inline-block">🧑‍🍳</div>
        <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">FridgeLab AI</h1>
        <p className="mx-auto mt-2 max-w-md font-semibold opacity-70">
          Tell me what's lurking in your fridge and I'll invent a cozy dish — 100% free, right in your browser.
        </p>
      </header>

      <main className="space-y-6">
        <div className="rounded-3xl border-[3px] border-white bg-white/60 p-5 shadow-lg backdrop-blur sm:p-7">
          <IngredientPicker
            ingredients={ingredients}
            onToggle={toggle}
            onAdd={add}
            onRemove={remove}
            vibe={vibeId}
            onVibe={setVibeId}
            disabled={busy}
          />

          <div className="mt-7 flex gap-3">
            <button
              id="cook-button"
              onClick={spin}
              disabled={!ingredients.length || busy}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-terracotta px-6 py-4 text-lg font-extrabold text-white shadow-[0_5px_0_0_#b85c43] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              <Sparkles size={20} />
              {ingredients.length ? 'Cook Something Cozy' : 'Pick some ingredients first'}
            </button>
            {ai.status === 'generating' && (
              <button
                onClick={ai.interrupt}
                aria-label="Stop generating"
                className="rounded-full border-2 border-cocoa bg-white px-5 font-bold"
              >
                <Square size={18} />
              </button>
            )}
          </div>
        </div>

        {ai.status === 'loading' && <LoadingBar progress={ai.progress} device={ai.device} />}
        {ai.status === 'generating' && !hasOutput && <CookingAnimation />}

        {ai.status === 'error' && (
          <div role="alert" className="flex gap-3 rounded-2xl border-2 border-red-300 bg-red-50 p-4 font-semibold text-red-800">
            <AlertTriangle className="shrink-0" />
            <div>
              Oops, the kitchen caught fire: {ai.error}
              <div className="mt-1 text-sm font-normal">
                Try a Chromium browser with WebGPU, or check your connection for the first download.
              </div>
            </div>
          </div>
        )}

        {takeout && (
          <div className="animate-rise rounded-3xl border-[3px] border-lilac bg-white p-6 text-center shadow-xl">
            <div className="text-5xl">🥡</div>
            <p className="mt-3 text-lg font-bold">{takeout}</p>
          </div>
        )}

        {hasOutput && !takeout && (
          <RecipeCard
            raw={ai.output}
            streaming={ai.status === 'generating'}
            dishes={vibe.dishes}
            onRetry={spin}
          />
        )}
      </main>

      <footer className="mt-10 text-center text-xs font-bold opacity-50">
        Runs locally with Qwen2.5-0.5B · {ai.device === 'webgpu' ? 'WebGPU accelerated' : ai.device === 'wasm' ? 'CPU / WASM' : 'no servers, no keys'}
      </footer>
      <ModelStorage disabled={busy} />
    </div>
  )
}
