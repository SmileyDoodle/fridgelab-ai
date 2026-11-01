import { useState } from 'react'
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

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="step-1-heading">
      {/* Step 1 Header & Category Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

        {/* Category filter bar */}
        <div
          role="tablist"
          aria-label="Filter pantry ingredients by category"
          className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto"
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
