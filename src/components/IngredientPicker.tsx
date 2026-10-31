import { useState, type KeyboardEvent } from 'react'
import { Plus, X } from 'lucide-react'
import { FOOD_EMOJIS, VIBES } from '../lib/data'
import type { VibeId } from '../types'

interface Props {
  ingredients: string[]
  onToggle: (name: string) => void
  onAdd: (name: string) => void
  onRemove: (name: string) => void
  vibe: VibeId
  onVibe: (v: VibeId) => void
  disabled?: boolean
}

const has = (list: string[], n: string) => list.some((i) => i.toLowerCase() === n.toLowerCase())

export function IngredientPicker({
  ingredients, onToggle, onAdd, onRemove, vibe, onVibe, disabled,
}: Props) {
  const [text, setText] = useState('')

  const commit = () => {
    const parts = text.split(',').map((s) => s.trim()).filter(Boolean)
    parts.forEach(onAdd)
    setText('')
  }
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      commit()
    } else if (e.key === 'Backspace' && !text && ingredients.length) {
      onRemove(ingredients[ingredients.length - 1])
    }
  }

  return (
    <div className="space-y-7">
      <section aria-labelledby="pantry-h">
        <h2 id="pantry-h" className="font-display text-xl font-bold">1. What's in your pantry?</h2>
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2.5">
          {FOOD_EMOJIS.map(({ emoji, name }) => {
            const on = has(ingredients, name)
            return (
              <button
                key={name}
                type="button"
                disabled={disabled}
                aria-pressed={on}
                onClick={() => onToggle(name)}
                className={`flex flex-col items-center gap-0.5 rounded-2xl border-2 px-2 py-3 text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 ${
                  on
                    ? 'border-terracotta bg-peach shadow-[0_4px_0_0_var(--color-terracotta)]'
                    : 'border-cocoa/15 bg-white/70 hover:border-terracotta/60'
                }`}
              >
                <span className={`text-3xl transition-transform ${on ? 'scale-110' : ''}`}>{emoji}</span>
                {name}
              </button>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="custom-h">
        <h2 id="custom-h" className="font-display text-xl font-bold">2. Anything else?</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2 rounded-2xl border-2 border-cocoa/15 bg-white/80 p-2.5 focus-within:border-terracotta">
          {ingredients.map((i) => (
            <span
              key={i}
              className="animate-pop inline-flex items-center gap-1 rounded-full bg-sage px-3 py-1 text-sm font-bold"
            >
              {i}
              <button
                type="button"
                aria-label={`Remove ${i}`}
                disabled={disabled}
                onClick={() => onRemove(i)}
                className="rounded-full p-0.5 hover:bg-cocoa/15"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <input
            id="ingredient-input"
            value={text}
            disabled={disabled}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKey}
            placeholder={ingredients.length ? 'Add more…' : 'Type an ingredient, press Enter'}
            className="min-w-[10rem] flex-1 bg-transparent px-2 py-1 text-base outline-none placeholder:text-cocoa/40"
          />
          <button
            type="button"
            aria-label="Add ingredient"
            onClick={commit}
            disabled={disabled || !text.trim()}
            className="rounded-full bg-terracotta p-1.5 text-white transition disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>
      </section>

      <section aria-labelledby="vibe-h">
        <h2 id="vibe-h" className="font-display text-xl font-bold">3. What's your energy?</h2>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3" role="radiogroup">
          {VIBES.map((v) => {
            const on = v.id === vibe
            return (
              <button
                key={v.id}
                type="button"
                role="radio"
                aria-checked={on}
                disabled={disabled}
                onClick={() => onVibe(v.id)}
                className={`rounded-2xl border-2 p-3 text-left transition-all hover:-translate-y-0.5 active:scale-95 ${
                  on
                    ? 'border-cocoa bg-butter shadow-[0_4px_0_0_var(--color-cocoa)]'
                    : 'border-cocoa/15 bg-white/70'
                }`}
              >
                <div className="text-2xl">{v.emoji}</div>
                <div className="text-sm font-extrabold leading-tight">{v.label}</div>
                <div className="text-xs font-semibold opacity-60">{v.minutes} min</div>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
