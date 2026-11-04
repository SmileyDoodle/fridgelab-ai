import { describe, expect, it } from 'vitest'
import { parseApiResultToRecipe, parseRecipe } from './parseRecipe.ts'

const VALID_LLM_OUTPUT = `### Rustic Potato & Egg Skillet
- **Effort:** 15 min
- **Dietary:** Vegetarian, Gluten-free
- **Ingredients Used:** Potato, Egg, Butter
- **Steps:**
1. Slice the potatoes thinly and par-cook in a skillet with butter.
2. Crack the eggs directly over the potatoes.
3. Cover and cook until whites are set and yolks remain runny.
- **Chef's Cozy Tip:** Use a pinch of smoked paprika for deep warmth.`

describe('parseRecipe', () => {
  it('parses valid markdown recipe structure into fields', () => {
    const parsed = parseRecipe(VALID_LLM_OUTPUT)

    expect(parsed).not.toBeNull()
    expect(parsed?.title).toBe('Rustic Potato & Egg Skillet')
    expect(parsed?.effort).toBe('15 min')
    expect(parsed?.dietary).toEqual(['Vegetarian', 'Gluten-free'])
    expect(parsed?.ingredients).toBe('Potato, Egg, Butter')
    expect(parsed?.steps).toHaveLength(3)
    expect(parsed?.steps[0]).toContain('Slice the potatoes')
    expect(parsed?.tip).toContain('smoked paprika')
  })

  it('filters out unrecognized dietary tags and normalizes casing', () => {
    const raw = `### Quick Toast
- **Dietary:** vegan, Halal, Kosher, nut-free, unknown-diet
- **Steps:**
1. Toast the bread.`

    const parsed = parseRecipe(raw)
    expect(parsed?.dietary).toEqual(['Vegan', 'Nut-free'])
  })

  it('returns null if no markdown heading is present', () => {
    const raw = 'Just a paragraph describing a soup without headings.'
    expect(parseRecipe(raw)).toBeNull()
  })
})

describe('parseApiResultToRecipe', () => {
  const fallbackIngredients = ['Potato', 'Egg']

  it('converts parsed markdown to Recipe domain model', () => {
    const recipe = parseApiResultToRecipe(VALID_LLM_OUTPUT, fallbackIngredients)

    expect(recipe).not.toBeNull()
    expect(recipe?.title).toBe('Rustic Potato & Egg Skillet')
    expect(recipe?.cookingTime).toBe('15 min')
    expect(recipe?.dietary).toEqual(['Vegetarian', 'Gluten-free'])
    expect(recipe?.ingredientsUsed).toEqual(['Potato', 'Egg', 'Butter'])
    expect(recipe?.steps).toHaveLength(3)
    expect(recipe?.tip).toContain('smoked paprika')
  })

  it('rejects input containing NOT_FOOD flag', () => {
    const raw = 'NOT_FOOD: The item provided cannot be used in cooking.'
    expect(parseApiResultToRecipe(raw, fallbackIngredients)).toBeNull()
  })

  it('uses fallback ingredients when LLM output omits ingredients field', () => {
    const raw = `### Simple Eggs
- **Effort:** 5 min
- **Steps:**
1. Fry eggs in a pan.`

    const recipe = parseApiResultToRecipe(raw, fallbackIngredients)
    expect(recipe).not.toBeNull()
    expect(recipe?.ingredientsUsed).toEqual(fallbackIngredients)
  })

  it('returns null if steps are missing', () => {
    const raw = `### Incomplete Dish
- **Effort:** 10 min`

    expect(parseApiResultToRecipe(raw, fallbackIngredients)).toBeNull()
  })
})
