import { X } from 'lucide-react'
import { StepIndicator } from '../common/index.ts'
import { INITIAL_PANTRY_INGREDIENTS } from '../../constants/pantryData.ts'
import type { Ingredient } from '../../types/recipe.ts'
import { IngredientTile } from './IngredientTile.tsx'

export interface IngredientGridProps {
  /** Pantry ingredients list, defaults to initial 12 staples */
  ingredients?: readonly Ingredient[]
  /** Array or set of currently selected ingredient IDs */
  selectedIds: readonly string[] | Set<string>
  /** Callback when an ingredient tile is toggled */
  onToggleIngredient: (id: string) => void
  /** Callback when clearing all selected ingredients */
  onClearSelection?: () => void
  /** Additional custom classes */
  className?: string
}

/**
 * Step 1: "What's in the pantry?" section with responsive grid.
 */
export function IngredientGrid({
  ingredients = INITIAL_PANTRY_INGREDIENTS,
  selectedIds,
  onToggleIngredient,
  onClearSelection,
  className = '',
}: IngredientGridProps) {
  const isSelected = (id: string) => {
    if (selectedIds instanceof Set) {
      return selectedIds.has(id)
    }
    return selectedIds.includes(id)
  }

  const selectedCount =
    selectedIds instanceof Set ? selectedIds.size : selectedIds.length

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="step-1-heading">
      {/* Step 1 Header */}
      <div className="flex items-start gap-3">
        <StepIndicator step={1} />
        <div className="flex-1 min-w-0">
          <h3
            id="step-1-heading"
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight"
          >
            What&apos;s in the pantry?
          </h3>
          <div className="mt-0.5 flex items-center justify-between gap-3">
            <p className="text-xs text-stone-500 flex-1 min-w-0">
              Tap all the ingredients available right now
            </p>
            {/* Clear selection button */}
            <button
              type="button"
              onClick={onClearSelection}
              disabled={selectedCount === 0}
              aria-label={`Clear selected ingredients (${selectedCount})`}
              className="inline-flex shrink-0 items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-stone-400 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear selection ({selectedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4-column responsive grid (3 cols on screens < 640px) */}
      <div
        role="group"
        aria-label="Pantry ingredients"
        className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3"
      >
        {ingredients.map((ingredient) => (
          <IngredientTile
            key={ingredient.id}
            ingredient={ingredient}
            selected={isSelected(ingredient.id)}
            onToggle={onToggleIngredient}
          />
        ))}
      </div>
    </section>
  )
}
