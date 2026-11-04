import type {
  EnergyModeOption,
  Ingredient,
} from '../types/recipe.ts'

/**
 * Initial pantry staples displayed in the 4-column selection grid.
 */
export const INITIAL_PANTRY_INGREDIENTS: readonly Ingredient[] = [
  { id: 'egg', name: 'Egg', emoji: '🥚' },
  { id: 'cheese', name: 'Cheese', emoji: '🧀' },
  { id: 'bread', name: 'Bread', emoji: '🍞' },
  { id: 'tomato', name: 'Tomato', emoji: '🍅' },
  { id: 'potato', name: 'Potato', emoji: '🥔' },
  { id: 'lettuce', name: 'Lettuce', emoji: '🥬' },
  { id: 'rice', name: 'Rice', emoji: '🍚' },
  { id: 'avocado', name: 'Avocado', emoji: '🥑' },
  { id: 'onion', name: 'Onion', emoji: '🧅' },
  { id: 'canned-beans', name: 'Canned Beans', emoji: '🥫' },
  { id: 'bacon', name: 'Bacon', emoji: '🥓' },
  { id: 'pasta', name: 'Pasta', emoji: '🍝' },
] as const

/**
 * Cooking effort and mood presets with timing pill badges and descriptions.
 */
export const ENERGY_MODES: readonly EnergyModeOption[] = [
  {
    id: 'tired',
    title: 'Tired / Low-Effort',
    timingPill: '5 min',
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
    timingPill: '25+ min',
    description: 'Crisping, deglazing, creative pan sauces.',
    emoji: '👨‍🍳',
  },
] as const

