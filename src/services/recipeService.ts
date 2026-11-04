import { parseApiResultToRecipe } from '../lib/parseRecipe.ts'
import type { EnergyMode, Recipe } from '../types/recipe.ts'

export interface RequestRecipeParams {
  ingredients: string[]
  energy: EnergyMode
}

/**
 * Service function to request and parse a recipe from the edge API.
 * Handles network transmission, HTTP errors, domain guardrails, and parsing.
 */
export async function requestRecipe({
  ingredients,
  energy,
}: RequestRecipeParams): Promise<Recipe> {
  const res = await fetch('/api/recipe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ingredients,
      energy,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Server error (${res.status})`)
  }

  if (!data.result) {
    throw new Error('No recipe was returned from the kitchen.')
  }

  const rawUpper = data.result.toUpperCase()
  if (rawUpper.includes('NO_SAFE_RECIPE')) {
    throw new Error('NO_SAFE_RECIPE')
  }
  if (
    rawUpper.includes('NOT_FOOD') ||
    /not\s+(an?\s+)?(edible|food|typical\s+pantry)/i.test(data.result)
  ) {
    throw new Error('NOT_FOOD')
  }

  const nextRecipe = parseApiResultToRecipe(data.result, ingredients)
  if (!nextRecipe) {
    throw new Error('parse')
  }

  return nextRecipe
}
