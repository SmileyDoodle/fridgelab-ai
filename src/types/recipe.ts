/**
 * Recipe & Pantry domain types for FridgeLab AI.
 */

export type IngredientCategory = 'all' | 'dairy' | 'produce' | 'carbs'

export interface Ingredient {
  id: string
  name: string
  emoji: string
  icon?: string
  category: IngredientCategory
}

export type EnergyMode = 'tired' | 'cozy' | 'hungry'

export type DietaryFilter = 'vegetarian' | 'gluten-free' | 'high-protein'

export interface Recipe {
  title: string
  cookingTime: string
  technique: string
  ingredientsUsed: string[]
  steps: string[]
  tip: string
}

export interface EnergyModeOption {
  id: EnergyMode
  title: string
  timingPill: string
  description: string
  sweetSpot?: boolean
  emoji?: string
}

export interface DietaryFilterOption {
  id: DietaryFilter
  label: string
  emoji?: string
}
