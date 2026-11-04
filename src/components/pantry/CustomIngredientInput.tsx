import { useRef, useState, type KeyboardEvent } from 'react'
import { Plus, Search, X } from 'lucide-react'
import { Pill, StepIndicator } from '../common/index.ts'

export interface CustomIngredientInputProps {
  /** Array of currently added custom ingredient names */
  customIngredients: readonly string[]
  /** Callback fired when a new ingredient is added */
  onAddIngredient: (name: string) => void
  /** Callback fired when an added ingredient is dismissed */
  onRemoveIngredient: (name: string) => void
  /** Callback fired when all custom ingredients are cleared */
  onClearIngredients?: () => void
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
  onClearIngredients,
  placeholder = 'Type ingredient (e.g. Greek yogurt)',
  className = '',
}: CustomIngredientInputProps) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAdd = () => {
    // Sanitize: strip control characters/HTML-like syntax and limit length
    const cleaned = inputValue.replace(/[^\p{L}\p{N}\s\-'’,]/gu, '').trim()
    if (!cleaned) {
      inputRef.current?.focus()
      return
    }

    const trimmed = cleaned.slice(0, 40)

    // Avoid duplicate additions
    if (!customIngredients.some((ing) => ing.toLowerCase() === trimmed.toLowerCase())) {
      onAddIngredient(trimmed)
    }
    setInputValue('')
    inputRef.current?.focus()
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
        <div className="flex-1 min-w-0">
          <h3
            id="step-2-heading"
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight"
          >
            Anything else in the fridge?
          </h3>
          <div className="mt-0.5 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-stone-500">
              Add half-jars of sauce, leftover herbs, or odd pantry items
            </p>
            {/* Clear selection button */}
            <button
              type="button"
              onClick={onClearIngredients}
              disabled={customIngredients.length === 0}
              aria-label={`Clear custom ingredients (${customIngredients.length})`}
              className="inline-flex shrink-0 items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-stone-400 cursor-pointer"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Clear selection ({customIngredients.length})</span>
            </button>
          </div>
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
          ref={inputRef}
          type="text"
          maxLength={40}
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
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-cream-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors hover:bg-cream-300 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-cream-200 disabled:hover:text-stone-700 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Add</span>
        </button>
      </div>
    </section>
  )
}
