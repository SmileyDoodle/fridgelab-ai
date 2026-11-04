import { DIETARY_TAGS, type DietaryTag, type Recipe } from '../types/recipe.ts'

export interface ParsedRecipe {
  title: string
  effort: string
  dietary: DietaryTag[]
  ingredients: string
  steps: string[]
  tip: string
}

const clean = (s: string) => s.replace(/\*\*/g, '').replace(/^\[|\]$/g, '').trim()

/** Keeps only tags from the fixed list (case-insensitive); anything else is dropped. */
function parseDietary(value: string): DietaryTag[] {
  const found = new Set<DietaryTag>()
  for (const part of value.split(/[,;]/)) {
    const key = part.trim().toLowerCase().replace(/\s+/g, '-')
    const tag = DIETARY_TAGS.find((t) => t.toLowerCase() === key)
    if (tag) found.add(tag)
  }
  return [...found]
}

/** Tolerant, streaming-friendly parser for the model's markdown output. */
export function parseRecipe(raw: string): ParsedRecipe | null {
  if (!/^\s*#{1,4}\s+\S/m.test(raw)) return null
  const lines = raw.split('\n')
  const recipe: ParsedRecipe = { title: '', effort: '', dietary: [], ingredients: '', steps: [], tip: '' }

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    const heading = t.match(/^#{1,4}\s+(.*)/)
    if (heading && !recipe.title) {
      recipe.title = clean(heading[1])
      continue
    }
    const field = t.match(/^[-*]?\s*\**\s*(Effort|Vibe|Energy|Dietary|Ingredients(?: Used)?|Steps|Chef['’]s Cozy Tip|Cozy Tip|Tip)\s*:?\**\s*:?\s*(.*)$/i)
    if (field) {
      const key = field[1].toLowerCase()
      const val = clean(field[2])
      if (key.startsWith('effort') || key.startsWith('vibe') || key.startsWith('energy')) recipe.effort = val
      else if (key.startsWith('dietary')) recipe.dietary = parseDietary(val)
      else if (key.startsWith('ingredient')) recipe.ingredients = val
      else if (!key.startsWith('step')) recipe.tip = val
      continue
    }
    const step = t.match(/^[-*]?\s*\d+[.)]\s+(.*)/)
    if (step) {
      recipe.steps.push(clean(step[1]))
    }
  }
  return recipe
}

/**
 * Transforms edge API markdown result into structured Recipe interface.
 * Returns null if the markdown indicates non-food or cannot be parsed into a real recipe.
 */
export function parseApiResultToRecipe(raw: string, fallbackIngredients: string[]): Recipe | null {
  const upper = raw.toUpperCase()
  if (
    upper.includes('NOT_FOOD') ||
    /not\s+(an?\s+)?(edible|food|typical\s+pantry)/i.test(raw)
  ) {
    return null
  }

  const parsed = parseRecipe(raw)
  if (!parsed || !parsed.title || parsed.steps.length === 0) {
    return null
  }

  const ingredientsList = parsed.ingredients
    ? parsed.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
    : fallbackIngredients

  return {
    title: parsed.title,
    cookingTime: parsed.effort || '15 mins',
    dietary: parsed.dietary,
    ingredientsUsed: ingredientsList.length > 0 ? ingredientsList : fallbackIngredients,
    steps: parsed.steps,
    tip:
      parsed.tip ||
      'Cold day-old rice crisps twice as fast as freshly steamed rice because starch molecules retrograde in the fridge.',
  }
}

