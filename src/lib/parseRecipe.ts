export interface ParsedRecipe {
  title: string
  effort: string
  ingredients: string
  steps: string[]
  tip: string
}

const clean = (s: string) => s.replace(/\*\*/g, '').replace(/^\[|\]$/g, '').trim()

/** Tolerant, streaming-friendly parser for the model's markdown output. */
export function parseRecipe(raw: string): ParsedRecipe | null {
  if (!/^\s*#{1,4}\s+\S/m.test(raw)) return null
  const lines = raw.split('\n')
  const recipe: ParsedRecipe = { title: '', effort: '', ingredients: '', steps: [], tip: '' }

  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    const heading = t.match(/^#{1,4}\s+(.*)/)
    if (heading && !recipe.title) {
      recipe.title = clean(heading[1])
      continue
    }
    const field = t.match(/^[-*]?\s*\**\s*(Effort|Vibe|Energy|Ingredients(?: Used)?|Steps|Chef['’]s Cozy Tip|Cozy Tip|Tip)\s*:?\**\s*:?\s*(.*)$/i)
    if (field) {
      const key = field[1].toLowerCase()
      const val = clean(field[2])
      if (key.startsWith('effort') || key.startsWith('vibe') || key.startsWith('energy')) recipe.effort = val
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

export function recipeToText(r: ParsedRecipe): string {
  const lines: string[] = [`🍳 ${r.title}`]
  if (r.effort) lines.push(`Effort: ${r.effort}`)
  if (r.ingredients) lines.push(`Ingredients: ${r.ingredients}`)
  lines.push('', ...r.steps.map((s, i) => `${i + 1}. ${s}`))
  if (r.tip) lines.push('', `💡 Chef's Cozy Tip: ${r.tip}`)
  lines.push('', 'Made with FridgeLab AI')
  return lines.join('\n')
}

