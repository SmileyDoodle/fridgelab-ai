import type { Recipe } from '../types/recipe.ts'

export type DietTag = 'vegan' | 'vegetarian' | 'lactose-free' | 'gluten-free'

export const DIET_TAG_TEXT: Record<DietTag, string> = {
  vegan: 'Vegan',
  vegetarian: 'Vegetarian',
  'lactose-free': 'Lactose-free',
  'gluten-free': 'Gluten-free',
}

interface Flags {
  meat?: boolean
  dairy?: boolean
  egg?: boolean
  /** Other animal products (honey, gelatin, ...) that rule out "vegan" */
  animal?: boolean
  gluten?: boolean
}

/**
 * Small ingredient knowledge base. An ingredient only counts as "known" if it matches an entry.
 * Entries without flags are known to be neutral (plain plant food, seasoning, oil...).
 * Anything not listed here is unknown, and an unknown ingredient means we claim nothing.
 */
const KNOWLEDGE: readonly { pattern: RegExp; flags: Flags }[] = [
  // Meat & fish (and their stocks)
  {
    pattern:
      /\b(bacon|ham|prosciutto|pancetta|chorizo|sausage|salami|pepperoni|chicken|turkey|duck|beef|steak|pork|lamb|veal|mince|meat|meatball|fish|salmon|tuna|cod|anchov\w*|sardine|shrimp|prawn|crab|lobster|squid|clam|mussel|oyster)/i,
    flags: { meat: true },
  },
  { pattern: /\b(lard|gelatin|gelatine|honey)\b/i, flags: { animal: true } },
  // Dairy & eggs
  {
    pattern:
      /(milk|cheese|butter|cream|yogh?urt|ghee|parmesan|mozzarella|cheddar|feta|ricotta|halloumi|paneer|kefir|custard)/i,
    flags: { dairy: true },
  },
  { pattern: /\b(eggs?|mayo|mayonnaise)\b/i, flags: { egg: true } },
  // Gluten
  {
    pattern:
      /\b(bread\w*|toast|pasta|spaghetti|macaroni|penne|lasagn\w*|noodles?|flour|tortillas?|wraps?|buns?|pita|naan|couscous|barley|bulgur|crackers?|panko|soy sauce|oats?|oatmeal|seitan|beer|wheat|rye|semolina|croutons?)\b/i,
    flags: { gluten: true },
  },
  // Known neutral foods
  {
    pattern:
      /\b(plantbased|rice|potato\w*|tomato\w*|onion\w*|shallot|garlic|avocado|beans?|chickpeas?|lentils?|peas?|corn|carrots?|celery|peppers?|chil+i\w*|cucumber|zucchini|courgette|spinach|kale|lettuce|cabbage|broccoli|cauliflower|mushrooms?|eggplant|aubergine|pumpkin|squash|sweet potato|ginger|herbs?|basil|parsley|cilantro|coriander|oregano|thyme|rosemary|dill|mint|cumin|paprika|turmeric|cinnamon|curry powder|salt|black pepper|oil|vinegar|sugar|lemon|lime|apple|banana|olives?|capers?|nuts?|almonds?|walnuts?|peanuts?|seeds?|sesame|tofu|tempeh|water|mustard|ketchup|maple syrup|spices?|seasoning)\b/i,
    flags: {},
  },
]

/** Plant-based "milks/butters" must not be mistaken for dairy ("oat" keeps its gluten flag). */
const PLANT_BASED =
  /\b(vegan|oat|almond|soy|coconut|rice|cashew|hazelnut|plant|nut|peanut|cocoa|shea)[ -]?(milk|cream|yogh?urt|butter|cheese)\b/gi
const BUTTER_BEANS = /\bbutter ?beans?\b/gi

function normalize(text: string): string {
  return text.replace(PLANT_BASED, '$1 plantbased').replace(BUTTER_BEANS, 'beans')
}

function matchFlags(text: string): { known: boolean; flags: Flags } {
  const normalized = normalize(text)
  const flags: Flags = {}
  let known = false
  for (const entry of KNOWLEDGE) {
    if (entry.pattern.test(normalized)) {
      known = true
      Object.assign(flags, Object.fromEntries(Object.entries(entry.flags).filter(([, v]) => v)))
    }
  }
  return { known, flags }
}

/**
 * Returns diet tags we are confident about, or an empty list when unsure.
 * Rules: every listed ingredient must be recognized, and the title/steps are also scanned so
 * an ingredient mentioned only in the method (e.g. "add a splash of milk") still counts.
 */
export function getRecipeDietTags(
  recipe: Pick<Recipe, 'title' | 'ingredientsUsed' | 'steps'>
): DietTag[] {
  if (recipe.ingredientsUsed.length === 0) return []

  const combined: Flags = {}
  for (const ingredient of recipe.ingredientsUsed) {
    const { known, flags } = matchFlags(ingredient)
    if (!known) return []
    Object.assign(combined, flags)
  }
  Object.assign(combined, matchFlags([recipe.title, ...recipe.steps].join(' ')).flags)

  const tags: DietTag[] = []
  if (!combined.meat) {
    const isVegan = !combined.dairy && !combined.egg && !combined.animal
    tags.push(isVegan ? 'vegan' : 'vegetarian')
  }
  if (!combined.dairy) tags.push('lactose-free')
  if (!combined.gluten) tags.push('gluten-free')
  return tags
}
