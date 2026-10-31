import type { Vibe } from '../types'

export const FOOD_EMOJIS = [
  { emoji: '🥚', name: 'Egg' },
  { emoji: '🧀', name: 'Cheese' },
  { emoji: '🍞', name: 'Bread' },
  { emoji: '🍅', name: 'Tomato' },
  { emoji: '🥔', name: 'Potato' },
  { emoji: '🧈', name: 'Butter' },
  { emoji: '🍚', name: 'Rice' },
  { emoji: '🥑', name: 'Avocado' },
  { emoji: '🧅', name: 'Onion' },
  { emoji: '🥫', name: 'Beans' },
  { emoji: '🥛', name: 'Milk' },
  { emoji: '🍝', name: 'Pasta' },
] as const

export const VIBES: Vibe[] = [
  {
    id: 'tired',
    label: 'Tired / Microwave Only',
    minutes: 5,
    emoji: '😴',
    prompt: 'Tired, microwave only, about 5 minutes, 1 bowl, no stove',
    dishes: '1 bowl',
  },
  {
    id: 'cozy',
    label: 'Cozy Stovetop',
    minutes: 10,
    emoji: '🫖',
    prompt: 'Cozy stovetop cooking, about 10 minutes, 1 pan',
    dishes: '1 pan',
  },
  {
    id: 'hungry',
    label: 'Hungry Chef',
    minutes: 20,
    emoji: '👩‍🍳',
    prompt: 'Hungry chef, up to 20 minutes, 2 pots or pans allowed',
    dishes: '2 pans',
  },
]

// Quick client-side guard so obviously inedible input never reaches the model.
const NON_EDIBLE =
  /\b(bleach|detergent|soap|shampoo|gasoline|petrol|poison|battery|batteries|glue|paint|plastic|cement|rock|rocks|stone|dirt|sand|metal|nail|nails|screw|screws|cigarette|cigarettes|laptop|phone|shoe|shoes|sock|socks|toilet|antifreeze|chemical|chemicals|acid|detergent|lego|paper|cardboard)\b/i

export function findNonEdible(items: string[]): string | null {
  return items.find((i) => NON_EDIBLE.test(i)) ?? null
}

export const TAKEOUT_QUIPS = [
  'Whoa there, chef! 🛑 That doesn’t sound edible. Step away from the kitchen and order some takeout — your stomach (and your cookware) will thank you.',
]
