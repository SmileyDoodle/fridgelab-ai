import { useState } from 'react'
import { Check, ChefHat, Clock, Copy, Lightbulb, RefreshCw, Utensils } from 'lucide-react'
import { parseRecipe, recipeToText } from '../lib/parseRecipe'

interface Props {
  raw: string
  streaming: boolean
  dishes: string
  onRetry: () => void
}

export function RecipeCard({ raw, streaming, dishes, onRetry }: Props) {
  const [copied, setCopied] = useState(false)
  const recipe = parseRecipe(raw)

  const copy = async () => {
    await navigator.clipboard.writeText(recipe ? recipeToText(recipe) : raw)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  // Not a recipe (e.g. the playful "order takeout" fallback).
  if (!recipe && !streaming) {
    return (
      <article className="animate-rise rounded-3xl border-[3px] border-lilac bg-white p-6 text-center shadow-xl">
        <div className="text-5xl">🥡</div>
        <p className="mt-3 text-lg font-bold">
          {raw.includes('NOT_FOOD')
            ? 'Whoa there, chef! 🛑 That doesn’t sound edible. Step away from the kitchen and order takeout.'
            : raw.trim()}
        </p>
        <button onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-full bg-cocoa px-5 py-2.5 font-bold text-cream">
          <RefreshCw size={16} /> Try again
        </button>
      </article>
    )
  }

  return (
    <article className="animate-rise overflow-hidden rounded-3xl border-[3px] border-peach bg-white shadow-xl">
      <div className="bg-gradient-to-r from-peach via-butter to-sage px-6 py-5">
        <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest opacity-70">
          <ChefHat size={14} /> Tonight's special
        </div>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight">
          {recipe?.title || 'Dreaming up a dish'}
          {streaming && <span className="ml-1 animate-pulse">▍</span>}
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe?.effort && (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-cocoa/20 bg-white/80 px-3 py-1 text-xs font-extrabold">
              <Clock size={13} /> {recipe.effort}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full border-2 border-cocoa/20 bg-white/80 px-3 py-1 text-xs font-extrabold">
            <Utensils size={13} /> Dishes used: {dishes}
          </span>
        </div>
      </div>

      <div className="space-y-5 p-6">
        {recipe?.ingredients && (
          <section>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-terracotta">Ingredients used</h3>
            <p className="mt-1 font-semibold">{recipe.ingredients}</p>
          </section>
        )}
        {recipe && recipe.steps.length > 0 && (
          <section>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-terracotta">Steps</h3>
            <ol className="mt-2 space-y-2.5">
              {recipe.steps.map((s, i) => (
                <li key={i} className="animate-rise flex gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-butter text-sm font-extrabold">
                    {i + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{s}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
        {recipe?.tip && (
          <aside className="flex gap-3 rounded-2xl border-2 border-dashed border-lilac bg-lilac/40 p-4">
            <Lightbulb className="mt-0.5 shrink-0 text-terracotta" size={20} />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-widest opacity-70">Chef's cozy tip</div>
              <p className="font-semibold italic">{recipe.tip}</p>
            </div>
          </aside>
        )}
        {recipe && !recipe.ingredients && recipe.steps.length === 0 && !recipe.tip && (
          <p className="whitespace-pre-wrap font-semibold leading-snug">
            {raw.replace(/^\s*#{1,4}.*\n?/, '').trim()}
          </p>
        )}
      </div>

      {!streaming && (
        <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-peach bg-cream/60 px-6 py-4">
          <button
            id="copy-recipe"
            onClick={copy}
            className="inline-flex items-center gap-2 rounded-full border-2 border-cocoa bg-white px-5 py-2.5 font-bold transition hover:-translate-y-0.5 active:scale-95"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? 'Copied!' : 'Copy Recipe'}
          </button>
          <button
            id="try-another"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 font-bold text-white shadow-[0_4px_0_0_#b85c43] transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <RefreshCw size={16} /> Try Another Spin
          </button>
        </div>
      )}
    </article>
  )
}
