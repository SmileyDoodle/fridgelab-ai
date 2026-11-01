import type {
  DietaryFilterOption,
  EnergyModeOption,
  Ingredient,
  IngredientCategory,
} from '../types/recipe.ts'

/**
 * Initial pantry staples displayed in the 4-column selection grid.
 * Categorized into Dairy & Eggs, Produce, and Carbs.
 */
export const INITIAL_PANTRY_INGREDIENTS: readonly Ingredient[] = [
  { id: 'egg', name: 'Egg', emoji: '🥚', category: 'dairy' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀', category: 'dairy' },
  { id: 'bread', name: 'Bread', emoji: '🍞', category: 'carbs' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅', category: 'produce' },
  { id: 'potato', name: 'Potato', emoji: '🥔', category: 'produce' },
  { id: 'butter', name: 'Butter', emoji: '🧈', category: 'dairy' },
  { id: 'rice', name: 'Rice', emoji: '🍚', category: 'carbs' },
  { id: 'avocado', name: 'Avocado', emoji: '🥑', category: 'produce' },
  { id: 'onion', name: 'Onion', emoji: '🧅', category: 'produce' },
  { id: 'canned-beans', name: 'Canned Beans', emoji: '🥫', category: 'carbs' },
  { id: 'milk', name: 'Milk', emoji: '🥛', category: 'dairy' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', category: 'carbs' },
] as const

/**
 * Cooking effort and mood presets with timing pill badges and descriptions.
 */
export const ENERGY_MODES: readonly EnergyModeOption[] = [
  {
    id: 'tired',
    title: 'Tired / Low-Effort',
    timingPill: '< 8 min',
    description: 'Microwave, toaster, or 1 mug. Zero fuss.',
    emoji: '🥱',
  },
  {
    id: 'cozy',
    title: 'Cozy Stovetop',
    timingPill: '15 min',
    description: 'Single skillet, calming sizzle, easy cleanup.',
    sweetSpot: true,
    emoji: '🫖',
  },
  {
    id: 'hungry',
    title: 'Hungry Chef Mode',
    timingPill: '30+ min',
    description: 'Crisping, deglazing, creative pan sauces.',
    emoji: '👨‍🍳',
  },
] as const

/**
 * Dietary filter pill options displayed beneath energy mode selection.
 */
export const DIETARY_FILTERS: readonly DietaryFilterOption[] = [
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🌱' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'high-protein', label: 'High Protein', emoji: '💪' },
] as const

/**
 * Filter categories for the pantry shelf.
 */
export const PANTRY_CATEGORIES: readonly { id: IngredientCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'produce', label: 'Produce' },
  { id: 'carbs', label: 'Carbs' },
] as const
