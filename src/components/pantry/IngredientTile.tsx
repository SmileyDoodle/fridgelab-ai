import { Check } from 'lucide-react'
import type { Ingredient } from '../../types/recipe.ts'

export interface IngredientTileProps {
  /** The pantry ingredient */
  ingredient: Ingredient
  /** Whether the ingredient is currently selected */
  selected: boolean
  /** Toggle handler called when tile is clicked or pressed */
  onToggle: (id: string) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional custom class overrides */
  className?: string
}

/**
 * Interactive pantry ingredient card with terracotta checkmark badge on selection.
 */
export function IngredientTile({
  ingredient,
  selected,
  onToggle,
  disabled = false,
  className = '',
}: IngredientTileProps) {
  const handleClick = () => {
    if (disabled) return
    onToggle(ingredient.id)
  }

  return (
    <button
      type="button"
      role="button"
      aria-pressed={selected}
      aria-label={`${ingredient.name}${selected ? ' (selected)' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      className={`group relative flex flex-col items-center justify-center rounded-2xl border p-3 sm:p-4 text-center transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? 'border-brand bg-brand-subtle shadow-xs'
          : 'border-surface-border bg-surface-card hover:border-cream-300 hover:shadow-2xs'
      } ${className}`}
    >
      {/* Terracotta checkmark indicator badge */}
      {selected && (
        <span
          className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-brand text-surface-card shadow-xs"
          aria-hidden="true"
        >
          <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 stroke-[3]" />
        </span>
      )}

      {/* Emoji display */}
      <span
        className="text-2xl sm:text-3xl mb-1 sm:mb-1.5 transition-transform duration-150 group-hover:scale-110"
        role="img"
        aria-hidden="true"
      >
        {ingredient.emoji}
      </span>

      {/* Ingredient name */}
      <span
        className={`text-xs sm:text-sm font-medium tracking-tight truncate w-full ${
          selected ? 'text-brand-hover font-semibold' : 'text-stone-800'
        }`}
      >
        {ingredient.name}
      </span>
    </button>
  )
}
