import { useState, type KeyboardEvent } from 'react'
import { Plus, Search } from 'lucide-react'
import { Pill, StepIndicator } from '../common/index.ts'

export interface CustomIngredientInputProps {
  /** Array of currently added custom ingredient names */
  customIngredients: readonly string[]
  /** Callback fired when a new ingredient is added */
  onAddIngredient: (name: string) => void
  /** Callback fired when an added ingredient is dismissed */
  onRemoveIngredient: (name: string) => void
  /** Placeholder text for the input */
  placeholder?: string
  /** Additional custom classes */
  className?: string
}

/**
 * Step 2: "Anything else in the fridge?" section with chip tag list and search input.
 */
export function CustomIngredientInput({
  customIngredients,
  onAddIngredient,
  onRemoveIngredient,
  placeholder = 'Type ingredient (e.g. Greek yogurt)',
  className = '',
}: CustomIngredientInputProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return

    // Avoid duplicate additions
    if (!customIngredients.some((ing) => ing.toLowerCase() === trimmed.toLowerCase())) {
      onAddIngredient(trimmed)
    }
    setInputValue('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <section className={`space-y-3.5 ${className}`} aria-labelledby="step-2-heading">
      {/* Step 2 Header */}
      <div className="flex items-start gap-3">
        <StepIndicator step={2} />
        <div>
          <h3
            id="step-2-heading"
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight"
          >
            Anything else in the fridge?
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Add half-jars of sauce, condiments, leftover herbs, or odd pantry items
          </p>
        </div>
      </div>

      {/* Input container with chips and add action */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-surface-border bg-surface-card p-2 sm:p-2.5 shadow-2xs transition-all focus-within:border-brand/60 focus-within:ring-2 focus-within:ring-brand/20">
        <Search className="ml-1.5 h-4 w-4 shrink-0 text-stone-400" aria-hidden="true" />

        {/* Existing custom ingredient pills */}
        {customIngredients.map((item) => (
          <Pill
            key={item}
            label={item}
            onRemove={() => onRemoveIngredient(item)}
            className="shrink-0"
          />
        ))}

        {/* Text input */}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Add custom ingredient"
          className="min-w-[140px] flex-1 bg-transparent px-2 py-1 text-xs sm:text-sm text-stone-800 placeholder:text-stone-400 focus:outline-none"
        />

        {/* Add button */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={!inputValue.trim()}
          aria-label="Add ingredient to pantry"
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-cream-300 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Add</span>
        </button>
      </div>
    </section>
  )
}
