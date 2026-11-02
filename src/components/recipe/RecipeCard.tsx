import { useState } from 'react'
import { Check, Clock, Copy, Leaf, MilkOff, RefreshCw, WheatOff } from 'lucide-react'
import { Pill, StepIndicator } from '../common/index.ts'
import { DIET_TAG_TEXT, getRecipeDietTags, type DietTag } from '../../utils/diet.ts'
import type { Recipe } from '../../types/recipe.ts'

const DIET_ICONS = {
  vegan: Leaf,
  vegetarian: Leaf,
  'lactose-free': MilkOff,
  'gluten-free': WheatOff,
} satisfies Record<DietTag, unknown>

export interface RecipeCardProps {
  /** The recipe to display */
  recipe: Recipe
  /** Whether a new recipe is currently generating */
  isLoading?: boolean
  /** Handler invoked when user requests another recipe spin */
  onRetry?: () => void
  /** Optional custom classes */
  className?: string
}

/**
 * Editorial recipe card component with banner, ingredient list, numbered steps,
 * and copy/spin action triggers.
 */
export function RecipeCard({
  recipe,
  isLoading = false,
  onRetry,
  className = '',
}: RecipeCardProps) {
  const [copied, setCopied] = useState(false)
  const dietTags = getRecipeDietTags(recipe)

  const handleCopy = async () => {
    try {
      const formatted = [
        `🍳 ${recipe.title}`,
        dietTags.length > 0
          ? `⏱ Cooking Time: ${recipe.cookingTime} | ${dietTags.map((t) => DIET_TAG_TEXT[t]).join(', ')}`
          : `⏱ Cooking Time: ${recipe.cookingTime}`,
        '',
        `Ingredients Used: ${recipe.ingredientsUsed.join(', ')}`,
        '',
        'Steps:',
        ...recipe.steps.map((step, idx) => `${idx + 1}. ${step}`),
      ]
      if (recipe.tip) {
        formatted.push('', `💡 Culinary Tip: ${recipe.tip}`)
      }
      formatted.push('', 'Invented with FridgeLab AI')

      await navigator.clipboard.writeText(formatted.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback in case clipboard permission is denied
    }
  }

  return (
    <article
      aria-label={recipe.title}
      className={`overflow-hidden rounded-3xl border border-surface-border bg-surface-card shadow-xs ${className}`}
    >
      {/* Header banner with green accent tint */}
      <header className="border-b border-surface-border bg-accent-green/80 p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-green-text">
          <span role="img" aria-label="leaf">
            🍃
          </span>
          <span>TONIGHT&apos;S SPECIAL</span>
        </div>

        <h2 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          {recipe.title}
        </h2>

        {/* Meta pills row */}
        <div className="mt-3.5 flex flex-wrap items-center gap-2">
          <Pill
            variant="timer"
            icon={<Clock className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />}
            label={recipe.cookingTime}
          />
          {dietTags.map((tag) => {
            const DietIcon = DIET_ICONS[tag]
            return (
              <Pill
                key={tag}
                variant="neutral"
                icon={<DietIcon className="h-3.5 w-3.5 text-stone-500" aria-hidden="true" />}
                label={DIET_TAG_TEXT[tag]}
              />
            )
          })}
        </div>
      </header>

      {/* Main recipe content */}
      <div className="space-y-5 p-5 sm:p-6 bg-surface-card">
        {/* Ingredients used */}
        <section aria-labelledby="ingredients-used-heading">
          <h3
            id="ingredients-used-heading"
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500"
          >
            Ingredients Used
          </h3>
          <p className="mt-1 text-sm sm:text-base font-bold text-stone-900 leading-snug">
            {recipe.ingredientsUsed.join(', ')}
          </p>
        </section>

        {/* Steps section */}
        <section aria-labelledby="steps-heading">
          <h3
            id="steps-heading"
            className="text-[11px] font-bold uppercase tracking-wider text-stone-500"
          >
            Steps
          </h3>
          <ol className="mt-3 space-y-3.5">
            {recipe.steps.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-xs sm:text-sm text-stone-700 leading-relaxed"
              >
                <StepIndicator size="sm" step={idx + 1} className="mt-0.5" />
                <span className="flex-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Action bar separator */}
        <div className="border-t border-dashed border-stone-200 pt-4" />

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy recipe to clipboard"
            className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-surface-card px-4 py-2 text-xs sm:text-sm font-semibold text-stone-800 transition-colors hover:bg-cream-100 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-accent-green-text" aria-hidden="true" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" aria-hidden="true" />
                <span>Copy Recipe</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onRetry}
            disabled={isLoading}
            aria-label="Try another recipe spin"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-primary to-brand-hover px-4 py-2 text-xs sm:text-sm font-semibold text-surface-card shadow-xs transition-all hover:brightness-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Try Another Spin</span>
          </button>
        </div>
      </div>
    </article>
  )
}
