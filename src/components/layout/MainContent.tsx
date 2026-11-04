import { useCallback } from 'react'
import { InfoBox } from '../common/index.ts'
import {
  CustomIngredientInput,
  EnergySection,
  IngredientGrid,
  SubmitButton,
} from '../pantry/index.ts'
import {
  CulinaryNotes,
  RecipeCard,
  WaitingSkilletCard,
} from '../recipe/index.ts'
import {
  QUICK_INSPIRATIONS,
  type QuickInspiration,
} from '../../constants/quickInspirations.ts'
import { MIN_RECIPE_INGREDIENTS } from '../../constants/recipeConfig.ts'
import { usePantry, useRecipeGenerator } from '../../hooks/index.ts'
import { getFriendlyErrorMessage } from '../../utils/errorHandler.ts'

/**
 * Main application workspace housing the interactive pantry form and recipe display.
 * Colocates pantry and recipe generation state to prevent unnecessary root re-renders.
 */
export function MainContent() {
  const pantry = usePantry()
  const recipeGen = useRecipeGenerator()

  // Quick Inspiration selection: immediately prefills pantry configuration and generated recipe
  const handleSelectQuickInspiration = useCallback(
    (item: QuickInspiration) => {
      pantry.applyPantryInspiration(item.stapleIds, item.customIngredients, item.energyMode)
      recipeGen.setRecipe(item.recipe)
      recipeGen.clearError()
    },
    [pantry, recipeGen]
  )

  // Generate / Spin recipe action
  const handleGenerateRecipe = useCallback(() => {
    recipeGen.generateRecipe(pantry.allIngredients, pantry.energyMode)
  }, [pantry.allIngredients, pantry.energyMode, recipeGen])

  return (
    <main className="mx-auto mt-10 max-w-6xl">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Left Column (Pantry Form Sections) */}
        <section
          aria-label="Recipe configuration"
          className="rounded-3xl border border-surface-border bg-surface-card p-5 sm:p-7 shadow-xs space-y-7 lg:col-span-7"
        >
          {/* Step 1: Ingredient Grid */}
          <IngredientGrid
            selectedIds={pantry.selectedIngredientIds}
            onToggleIngredient={pantry.handleToggleIngredient}
            onClearSelection={pantry.handleClearSelectedIngredients}
          />

          <hr className="border-surface-border" />

          {/* Step 2: Custom Ingredient Input */}
          <CustomIngredientInput
            customIngredients={pantry.customIngredients}
            onAddIngredient={pantry.handleAddCustomIngredient}
            onRemoveIngredient={pantry.handleRemoveCustomIngredient}
            onClearIngredients={pantry.handleClearCustomIngredients}
          />

          <hr className="border-surface-border" />

          {/* Step 3: Energy Mode */}
          <EnergySection
            selectedMode={pantry.energyMode}
            onSelectMode={pantry.setEnergyMode}
          />

          {/* Submit Action */}
          <SubmitButton
            onClick={handleGenerateRecipe}
            isLoading={recipeGen.isLoading}
            disabled={
              recipeGen.isLoading ||
              pantry.totalIngredientsCount < MIN_RECIPE_INGREDIENTS
            }
          />

          {/* Error notice banner: placed right below submit button for immediate mobile & desktop visibility */}
          {Boolean(recipeGen.error) && (
            <InfoBox
              variant="error"
              title="Kitchen Notice"
              onDismiss={recipeGen.clearError}
            >
              {getFriendlyErrorMessage(recipeGen.error)}
            </InfoBox>
          )}
        </section>

        {/* Right Column (Recipe Display or Waiting Skillet Default) */}
        <section
          aria-label="Generated recipe and notes"
          className="space-y-6 lg:col-span-5 lg:sticky lg:top-8"
        >
          {recipeGen.recipe ? (
            <>
              {/* Tonight's Special Recipe Card */}
              <RecipeCard
                recipe={recipeGen.recipe}
                isLoading={recipeGen.isLoading}
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
              <CulinaryNotes tip={recipeGen.recipe.tip} />
            </>
          ) : (
            <WaitingSkilletCard
              onSelectInspiration={handleSelectQuickInspiration}
              isLoading={recipeGen.isLoading}
            />
          )}
        </section>
      </div>
    </main>
  )
}
