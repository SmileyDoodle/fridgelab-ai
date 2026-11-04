import { useCallback, useState } from 'react'
import {
  DEFAULT_ENERGY_MODE,
  MAX_RECIPE_INGREDIENTS,
  MIN_RECIPE_INGREDIENTS,
} from '../constants/recipeConfig.ts'
import { requestRecipe } from '../services/recipeService.ts'
import type { EnergyMode, Recipe } from '../types/recipe.ts'

export interface RecipeState {
  recipe: Recipe | null
  isLoading: boolean
  error: unknown | null
}

export const INITIAL_RECIPE_STATE: RecipeState = {
  recipe: null,
  isLoading: false,
  error: null,
}

/**
 * Custom hook managing recipe generation lifecycle, network state, and errors.
 */
export function useRecipeGenerator(initialState: RecipeState = INITIAL_RECIPE_STATE) {
  const [recipe, setRecipe] = useState<Recipe | null>(initialState.recipe)
  const [isLoading, setIsLoading] = useState<boolean>(initialState.isLoading)
  const [error, setError] = useState<unknown | null>(initialState.error)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const generateRecipe = useCallback(
    async (ingredients: string[], energyMode: EnergyMode | null) => {
      if (
        ingredients.length < MIN_RECIPE_INGREDIENTS ||
        ingredients.length > MAX_RECIPE_INGREDIENTS
      ) {
        setRecipe(null)
        setError('Please select between 2 and 12 ingredients.')
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const nextRecipe = await requestRecipe({
          ingredients,
          energy: energyMode ?? DEFAULT_ENERGY_MODE,
        })
        setRecipe(nextRecipe)
      } catch (err: unknown) {
        setRecipe(null)
        setError(err)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  return {
    // State
    recipe,
    isLoading,
    error,
    // Methods / Actions
    setRecipe,
    setError,
    clearError,
    generateRecipe,
  }
}
