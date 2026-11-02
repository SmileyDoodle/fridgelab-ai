import { useState } from 'react'
import { X } from 'lucide-react'
import { Pill, StepIndicator } from '../common/index.ts'
import {
  INITIAL_PANTRY_INGREDIENTS,
  PANTRY_CATEGORIES,
} from '../../constants/pantryData.ts'
import type { Ingredient, IngredientCategory } from '../../types/recipe.ts'
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
  /** Controlled active category, if managed externally */
  activeCategory?: IngredientCategory
  /** Callback when category filter changes */
  onSelectCategory?: (category: IngredientCategory) => void
  /** Additional custom classes */
  className?: string
}

/**
 * Step 1: "What's in the pantry?" section with category filter and responsive grid.
 */
export function IngredientGrid({
  ingredients = INITIAL_PANTRY_INGREDIENTS,
  selectedIds,
  onToggleIngredient,
  onClearSelection,
  activeCategory: controlledCategory,
  onSelectCategory,
  className = '',
}: IngredientGridProps) {
  const [internalCategory, setInternalCategory] =
    useState<IngredientCategory>('all')

  const currentCategory = controlledCategory ?? internalCategory

  const handleCategoryChange = (category: IngredientCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category)
    } else {
      setInternalCategory(category)
    }
  }

  // Filter ingredients based on selected category tab
  const filteredIngredients = ingredients.filter((item) => {
    if (currentCategory === 'all') return true
    return item.category === currentCategory
  })

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
        <div>
          <h3
            id="step-1-heading"
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight"
          >
            What&apos;s in the pantry?
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Tap all the ingredients available right now
          </p>
        </div>
      </div>

      {/* Category filter bar & Clear selection action */}
      <div className="flex items-center justify-between gap-2.5 flex-wrap">
        <div
          role="tablist"
          aria-label="Filter pantry ingredients by category"
          className="flex flex-wrap items-center gap-1.5"
        >
          {PANTRY_CATEGORIES.map((cat) => (
            <Pill
              key={cat.id}
              label={cat.label}
              selected={currentCategory === cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              ariaLabel={`Filter by ${cat.label}`}
              className="text-xs"
            />
          ))}
        </div>

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

      {/* 4-column responsive grid (3 cols on screens < 640px) */}
      <div
        role="group"
        aria-label="Pantry ingredients"
        className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 sm:gap-3"
      >
        {filteredIngredients.map((ingredient) => (
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
