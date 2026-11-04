import { useCallback, useState } from 'react'
import { InfoBox } from './components/common/index.ts'
import {
  CustomIngredientInput,
  EnergySection,
  IngredientGrid,
  SubmitButton,
} from './components/pantry/index.ts'
import {
  CulinaryNotes,
  RecipeCard,
  WaitingSkilletCard,
} from './components/recipe/index.ts'
import { INITIAL_PANTRY_INGREDIENTS } from './constants/pantryData.ts'
import {
  QUICK_INSPIRATIONS,
  type QuickInspiration,
} from './constants/quickInspirations.ts'
import { parseRecipe } from './lib/parseRecipe.ts'
import type { EnergyMode, Recipe } from './types/recipe.ts'
import { getFriendlyErrorMessage } from './utils/errorHandler.ts'

/**
 * Transforms edge API markdown result into structured Recipe interface.
 * Returns null if the markdown indicates non-food or cannot be parsed into a real recipe.
 */
function parseApiResultToRecipe(raw: string, fallbackIngredients: string[]): Recipe | null {
  const upper = raw.toUpperCase()
  if (
    upper.includes('NOT_FOOD') ||
    /not\s+(an?\s+)?(edible|food|typical\s+pantry)/i.test(raw)
  ) {
    return null
  }

  const parsed = parseRecipe(raw)
  if (!parsed || !parsed.title || parsed.steps.length === 0) {
    return null
  }

  const ingredientsList = parsed.ingredients
    ? parsed.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    : fallbackIngredients

  return {
    title: parsed.title,
    cookingTime: parsed.effort || '15 mins',
    dietary: parsed.dietary,
    ingredientsUsed: ingredientsList.length > 0 ? ingredientsList : fallbackIngredients,
    steps: parsed.steps,
    tip:
      parsed.tip ||
      'Cold day-old rice crisps twice as fast as freshly steamed rice because starch molecules retrograde in the fridge.',
  }
}

export default function App() {
  // Default clean state: nothing selected on the left side (1-3)
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<string[]>([])
  const [customIngredients, setCustomIngredients] = useState<string[]>([])
  const [energyMode, setEnergyMode] = useState<EnergyMode | null>('cozy')

  // Default to null so "Your skillet is waiting" card shows by default
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<unknown | null>(null)

  // Toggle staple ingredient by ID
  const handleToggleIngredient = useCallback((id: string) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }, [])

  // Clear all staple ingredients
  const handleClearSelectedIngredients = useCallback(() => {
    setSelectedIngredientIds([])
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

  // Clear all custom ingredients
  const handleClearCustomIngredients = useCallback(() => {
    setCustomIngredients([])
  }, [])

  // Quick Inspiration selection: immediately prefills ingredients, energy mode, and recipe
  const handleSelectQuickInspiration = useCallback((item: QuickInspiration) => {
    setSelectedIngredientIds(item.stapleIds)
    setCustomIngredients(item.customIngredients)
    setEnergyMode(item.energyMode)
    setRecipe(item.recipe)
    setError(null)
  }, [])

  // Generate / Spin recipe action
  const handleGenerateRecipe = useCallback(async () => {
    const stapleNames = INITIAL_PANTRY_INGREDIENTS.filter((item) =>
      selectedIngredientIds.includes(item.id)
    ).map((item) => item.name)

    const allIngredients = [...stapleNames, ...customIngredients]

    if (allIngredients.length < 2 || allIngredients.length > 12) {
      setRecipe(null)
      setError('Please select between 2 and 12 ingredients.')
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
          energy: energyMode ?? 'cozy',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setRecipe(null)
        throw new Error(data.error || `Server error (${res.status})`)
      }

      if (data.result) {
        const rawUpper = data.result.toUpperCase()
        if (rawUpper.includes('NO_SAFE_RECIPE')) {
          setRecipe(null)
          setError('NO_SAFE_RECIPE')
          return
        }
        if (
          rawUpper.includes('NOT_FOOD') ||
          /not\s+(an?\s+)?(edible|food|typical\s+pantry)/i.test(data.result)
        ) {
          setRecipe(null)
          setError('NOT_FOOD')
          return
        }

        const nextRecipe = parseApiResultToRecipe(data.result, allIngredients)
        if (!nextRecipe) {
          setRecipe(null)
          throw new Error('parse')
        }
        setRecipe(nextRecipe)
      } else {
        setRecipe(null)
        throw new Error('No recipe was returned from the kitchen.')
      }
    } catch (err: unknown) {
      setRecipe(null)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedIngredientIds, customIngredients, energyMode])

  const totalIngredientsCount = selectedIngredientIds.length + customIngredients.length

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
        <p className="mx-auto mt-4 max-w-xl text-center text-xs sm:text-sm text-stone-600 leading-relaxed">
          Select your available ingredients and discover recipes you can make right now.
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
              onClearSelection={handleClearSelectedIngredients}
            />

            <hr className="border-surface-border" />

            {/* Step 2: Custom Ingredient Input */}
            <CustomIngredientInput
              customIngredients={customIngredients}
              onAddIngredient={handleAddCustomIngredient}
              onRemoveIngredient={handleRemoveCustomIngredient}
              onClearIngredients={handleClearCustomIngredients}
            />

            <hr className="border-surface-border" />

            {/* Step 3: Energy Mode */}
            <EnergySection selectedMode={energyMode} onSelectMode={setEnergyMode} />

            {/* Submit Action */}
            <SubmitButton
              onClick={handleGenerateRecipe}
              isLoading={isLoading}
              disabled={isLoading || totalIngredientsCount < 2}
            />
          </section>

          {/* Right Column (Recipe Display or Waiting Skillet Default) */}
          <section
            aria-label="Generated recipe and notes"
            className="space-y-6 lg:col-span-5 lg:sticky lg:top-8"
          >
            {recipe ? (
              <>
                {/* Tonight's Special Recipe Card */}
                <RecipeCard
                  recipe={recipe}
                  isLoading={isLoading}
                  onRetry={handleGenerateRecipe}
                />

                {/* Quick Inspiration Switcher */}
                <div className="rounded-3xl border border-surface-border bg-surface-card p-4 sm:p-5 shadow-xs">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand mb-2.5">
                    QUICK INSPIRATION
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {QUICK_INSPIRATIONS.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectQuickInspiration(item)}
                        className="group flex items-center gap-3 rounded-xl border border-surface-border bg-cream-50/50 p-2.5 text-left transition-all duration-150 hover:bg-cream-100 hover:border-brand/40 cursor-pointer"
                      >
                        <span className="text-xl shrink-0">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-brand transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">
                            {item.subtitle}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Culinary Side Notes & AI Disclaimer */}
                <CulinaryNotes tip={recipe.tip} />
              </>
            ) : (
              <WaitingSkilletCard
                onSelectInspiration={handleSelectQuickInspiration}
                isLoading={isLoading}
              />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 text-center text-xs text-stone-500 font-sans tracking-tight">
        FridgeLab AI v{__APP_VERSION__} · {new Date().getFullYear()} · All rights reserved.
      </footer>
    </div>
  )
}
