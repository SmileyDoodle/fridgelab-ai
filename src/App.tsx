import { useCallback, useState } from 'react'
import { InfoBox } from './components/common/index.ts'
import {
  CustomIngredientInput,
  EnergySection,
  IngredientGrid,
  SubmitButton,
} from './components/pantry/index.ts'
import { CulinaryNotes, RecipeCard } from './components/recipe/index.ts'
import {
  INITIAL_PANTRY_INGREDIENTS,
  INITIAL_RECIPE,
} from './constants/pantryData.ts'
import { findNonEdible } from './lib/data.ts'
import { parseRecipe } from './lib/parseRecipe.ts'
import type { DietaryFilter, EnergyMode, Recipe } from './types/recipe.ts'
import { getFriendlyErrorMessage } from './utils/errorHandler.ts'

/**
 * Transforms edge API markdown result into structured Recipe interface.
 */
function parseApiResultToRecipe(raw: string, fallbackIngredients: string[]): Recipe {
  const parsed = parseRecipe(raw)
  if (!parsed) {
    return {
      title: 'Cozy Skillet Dish',
      cookingTime: '15 mins',
      technique: 'Cozy Stovetop',
      ingredientsUsed: fallbackIngredients,
      steps: [raw.replace(/^#+.*\n?/, '').trim()],
      tip: 'Season to taste with sea salt, freshly ground pepper, and gentle warmth.',
    }
  }

  const ingredientsList = parsed.ingredients
    ? parsed.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    : fallbackIngredients

  return {
    title: parsed.title || 'Cozy Pantry Dish',
    cookingTime: parsed.effort || '15 mins',
    technique: 'Cozy Stovetop',
    ingredientsUsed: ingredientsList.length > 0 ? ingredientsList : fallbackIngredients,
    steps:
      parsed.steps.length > 0
        ? parsed.steps
        : ['Combine and warm ingredients in a skillet until fragrant and golden.'],
    tip:
      parsed.tip ||
      'Cold day-old rice crisps twice as fast as freshly steamed rice because starch molecules retrograde in the fridge.',
  }
}

export default function App() {
  // Preset initial states mirroring the screenshot
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([
    'egg',
    'cheese',
    'butter',
    'rice',
  ])
  const [customIngredients, setCustomIngredients] = useState<string[]>([
    'Chili Crisp',
    'Fresh Garlic',
  ])
  const [energyMode, setEnergyMode] = useState<EnergyMode>('cozy')
  const [dietaryFilters, setDietaryFilters] = useState<DietaryFilter[]>([])

  const [recipe, setRecipe] = useState<Recipe>(INITIAL_RECIPE)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown | null>(null)

  // Toggle staple ingredient by ID
  const handleToggleIngredient = useCallback((id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  // Append custom ingredient string
  const handleAddCustomIngredient = useCallback((name: string) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setCustomIngredients((prev) =>
      prev.some((item) => item.toLowerCase() === trimmed.toLowerCase())
        ? prev
        : [...prev, trimmed]
    )
  }, [])

  // Remove custom ingredient string
  const handleRemoveCustomIngredient = useCallback((name: string) => {
    setCustomIngredients((prev) => prev.filter((item) => item !== name))
  }, [])

  // Toggle dietary filter
  const handleToggleDietaryFilter = useCallback((filter: DietaryFilter) => {
    setDietaryFilters((prev) =>
      prev.includes(filter) ? prev.filter((item) => item !== filter) : [...prev, filter]
    )
  }, [])

  // Generate / Spin recipe action
  const handleGenerateRecipe = useCallback(async () => {
    const stapleNames = INITIAL_PANTRY_INGREDIENTS.filter((item) =>
      selectedIngredientIds.includes(item.id)
    ).map((item) => item.name)

    const allIngredients = [...stapleNames, ...customIngredients]

    if (allIngredients.length === 0) {
      setError('Please select between 1 and 12 ingredients.')
      return
    }

    if (allIngredients.length > 12) {
      setError('Please select between 1 and 12 ingredients.')
      return
    }

    // Client-side inedible check guardrail
    if (findNonEdible(allIngredients)) {
      setError('NOT_FOOD')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ingredients: allIngredients,
          energy: energyMode,
          dietary: dietaryFilters,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || `Server error (${res.status})`)
      }

      if (data.result) {
        const nextRecipe = parseApiResultToRecipe(data.result, allIngredients)
        setRecipe(nextRecipe)
      } else {
        throw new Error('No recipe was returned from the kitchen.')
      }
    } catch (err: unknown) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedIngredientIds, customIngredients, energyMode, dietaryFilters])

  return (
    <div className="min-h-screen bg-cream-100 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 text-stone-900 font-sans">
      {/* Editorial Page Header */}
      <header className="mx-auto max-w-2xl text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
          FridgeLab AI
        </h1>
        <p className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl italic text-brand font-normal">
          will invent a cozy dish.
        </p>
        <p className="mx-auto mt-4 max-w-lg text-center text-xs sm:text-sm text-stone-600 leading-relaxed">
          Select whatever ingredients are on hand. Instant culinary combinations
          computed straight in the browser with zero grocery runs.
        </p>
      </header>

      {/* Main Content: Two-column desktop grid, single column mobile */}
      <main className="mx-auto mt-10 max-w-6xl">
        {/* Error notice banner */}
        {Boolean(error) && (
          <div className="mb-6">
            <InfoBox
              variant="error"
              title="Kitchen Notice"
              onDismiss={() => setError(null)}
            >
              {getFriendlyErrorMessage(error)}
            </InfoBox>
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Left Column (Pantry Form Sections) */}
          <section
            aria-label="Recipe configuration"
            className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-7 shadow-xs space-y-7 lg:col-span-7"
          >
            {/* Step 1: Ingredient Grid */}
            <IngredientGrid
              selectedIds={selectedIngredientIds}
              onToggleIngredient={handleToggleIngredient}
            />

            <hr className="border-surface-border" />

            {/* Step 2: Custom Ingredient Input */}
            <CustomIngredientInput
              customIngredients={customIngredients}
              onAddIngredient={handleAddCustomIngredient}
              onRemoveIngredient={handleRemoveCustomIngredient}
            />

            <hr className="border-surface-border" />

            {/* Step 3: Energy Mode & Dietary Filters */}
            <EnergySection
              selectedMode={energyMode}
              onSelectMode={setEnergyMode}
              selectedDietaryFilters={dietaryFilters}
              onToggleDietaryFilter={handleToggleDietaryFilter}
            />

            {/* Submit Action */}
            <SubmitButton
              onClick={handleGenerateRecipe}
              isLoading={isLoading}
              disabled={isLoading}
            />
          </section>

          {/* Right Column (Recipe Display & Side Notes) */}
          <section
            aria-label="Generated recipe and notes"
            className="space-y-6 lg:col-span-5 lg:sticky lg:top-8"
          >
            {/* Tonight's Special Recipe Card */}
            <RecipeCard
              recipe={recipe}
              isLoading={isLoading}
              onRetry={handleGenerateRecipe}
            />

            {/* Culinary Side Notes & AI Disclaimer */}
            <CulinaryNotes tip={recipe?.tip} />
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-stone-500 font-sans tracking-tight">
        FridgeLab AI v0.1.0 · 2026 · All rights reserved.
      </footer>
    </div>
  )
}
