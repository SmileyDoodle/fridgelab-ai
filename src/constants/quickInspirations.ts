import type { DietaryFilter, EnergyMode, Recipe } from '../types/recipe.ts'

export interface QuickInspiration {
  id: string
  title: string
  subtitle: string
  emoji: string
  stapleIds: string[]
  customIngredients: string[]
  energyMode: EnergyMode
  dietaryFilters?: DietaryFilter[]
  recipe: Recipe
}

/**
 * Quick inspiration presets pre-populated on the default page.
 * Clicking any inspiration immediately prefills all pantry selections on the left
 * and displays the pre-cooked recipe on the right without unnecessary LLM calls.
 */
export const QUICK_INSPIRATIONS: readonly QuickInspiration[] = [
  {
    id: 'late-night-comfort',
    title: 'Late-Night Comfort',
    subtitle: 'Egg + Bread + Butter',
    emoji: '🍳',
    stapleIds: ['egg', 'bread', 'butter'],
    customIngredients: [],
    energyMode: 'tired',
    dietaryFilters: ['vegetarian'],
    recipe: {
      title: 'Golden Butter Toast with Jammy Skillet Eggs',
      cookingTime: '7 mins',
      technique: 'Cozy Stovetop',
      ingredientsUsed: ['Egg', 'Bread', 'Butter'],
      steps: [
        'Melt generous butter in a heavy skillet over medium heat until gently foaming.',
        'Toast slices of bread in the browned butter until crisp and golden brown on both sides.',
        'Slide toast to the side and crack in eggs, gently basting tops with bubbling butter until whites are set and yolks remain runny.',
        'Serve warm eggs over the buttered toast, spooning remaining pan butter across the top.',
      ],
      tip: 'Browning the butter slightly in the skillet creates a deep nutty aroma that instantly turns humble pantry toast into bistro comfort food.',
    },
  },
  {
    id: '5-min-warm-bowl',
    title: '5-Min Warm Bowl',
    subtitle: 'Rice + Egg + Garlic + Soy Sauce',
    emoji: '🍚',
    stapleIds: ['rice', 'egg'],
    customIngredients: ['Garlic', 'Soy Sauce'],
    energyMode: 'cozy',
    dietaryFilters: ['vegetarian'],
    recipe: {
      title: 'Sizzling Garlic Soy Butter Rice Bowl',
      cookingTime: '5 mins',
      technique: 'Single Skillet',
      ingredientsUsed: ['Rice', 'Egg', 'Garlic', 'Soy Sauce'],
      steps: [
        'Heat a slick of butter or oil in a skillet and sizzle minced garlic for 30 seconds until fragrant.',
        'Add cold cooked rice, pressing flat to sear and catch golden edges against the hot pan.',
        'Drizzle soy sauce around the hot edges of the skillet to caramelize before stirring through the rice.',
        'Slide in the egg, folding gently into the steaming rice until velvety, glossy, and warming.',
      ],
      tip: 'Pouring soy sauce around the searing rim of the pan instead of directly onto the rice caramelizes the sugars and delivers an authentic smoky wok-style aroma.',
    },
  },
  {
    id: 'midnight-skillet-pasta',
    title: 'Midnight Skillet Pasta',
    subtitle: 'Pasta + Tomato + Cheese',
    emoji: '🍝',
    stapleIds: ['pasta', 'tomato', 'cheese'],
    customIngredients: [],
    energyMode: 'cozy',
    dietaryFilters: [],
    recipe: {
      title: 'Blistered Tomato & Melted Cheese Skillet Pasta',
      cookingTime: '12 mins',
      technique: 'One-Pan Skillet',
      ingredientsUsed: ['Pasta', 'Tomato', 'Cheese'],
      steps: [
        'Cook pasta in salted boiling water until al dente, reserving a small cup of starchy cooking water.',
        'In a hot skillet, blister sliced tomatoes until skins burst and release sweet, rich juices.',
        'Toss the drained pasta into the skillet along with a splash of reserved cooking water to create a glossy emulsion.',
        'Turn off heat, fold in shredded cheese until creamy and melted throughout, and serve hot.',
      ],
      tip: 'The starchy pasta cooking water emulsifies with the natural acidity of tomato juices and melted cheese fat, creating a rich sauce without needing cream.',
    },
  },
] as const
