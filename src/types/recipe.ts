/**
 * Recipe & Pantry domain types for FridgeLab AI.
 */

export interface Ingredient {
  id: string
  name: string
  emoji: string
  icon?: string
}

export type EnergyMode = 'tired' | 'cozy' | 'hungry'

export const DIETARY_TAGS = [
  'Vegetarian',
  'Vegan',
  'Gluten-free',
  'Dairy-free',
  'Egg-free',
  'Nut-free',
] as const

export type DietaryTag = (typeof DIETARY_TAGS)[number]

export interface Recipe {
  title: string
  cookingTime: string
  dietary: DietaryTag[]
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
