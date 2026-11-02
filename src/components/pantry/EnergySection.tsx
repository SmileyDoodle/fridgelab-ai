import { Pill, StepIndicator } from '../common/index.ts'
import { DIETARY_FILTERS, ENERGY_MODES } from '../../constants/pantryData.ts'
import type { DietaryFilter, EnergyMode } from '../../types/recipe.ts'
import { EnergyCard } from './EnergyCard.tsx'

export interface EnergySectionProps {
  /** Currently selected energy mode or null if none selected */
  selectedMode: EnergyMode | null
  /** Selection callback for energy mode */
  onSelectMode: (mode: EnergyMode) => void
  /** Currently active dietary filters */
  selectedDietaryFilters: readonly DietaryFilter[]
  /** Toggle callback for dietary filter */
  onToggleDietaryFilter: (filter: DietaryFilter) => void
  /** Additional custom classes */
  className?: string
}

/**
 * Step 3: "Energy mode" section with 3 preset effort cards and dietary filter pills.
 */
export function EnergySection({
  selectedMode,
  onSelectMode,
  selectedDietaryFilters,
  onToggleDietaryFilter,
  className = '',
}: EnergySectionProps) {
  const isDietarySelected = (filter: DietaryFilter) =>
    selectedDietaryFilters.includes(filter)

  return (
    <section className={`space-y-4 ${className}`} aria-labelledby="step-3-heading">
      {/* Step 3 Header */}
      <div className="flex items-start gap-3">
        <StepIndicator step={3} />
        <div>
          <h3
            id="step-3-heading"
            className="font-serif text-lg sm:text-xl font-bold text-stone-900 leading-tight"
          >
            Energy mode
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Calibrates the cooking complexity and timing to current mood
          </p>
        </div>
      </div>

      {/* 3 selectable mode cards */}
      <div
        role="radiogroup"
        aria-label="Select cooking energy mode"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
      >
        {ENERGY_MODES.map((mode) => (
          <EnergyCard
            key={mode.id}
            mode={mode}
            selected={selectedMode === mode.id}
            onSelect={onSelectMode}
          />
        ))}
      </div>

      {/* Dietary filter pills row */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-stone-500 font-medium mr-1">Diet filters:</span>
        {DIETARY_FILTERS.map((diet) => (
          <Pill
            key={diet.id}
            label={diet.label}
            icon={diet.emoji ? <span role="img" aria-hidden="true">{diet.emoji}</span> : undefined}
            selected={isDietarySelected(diet.id)}
            onClick={() => onToggleDietaryFilter(diet.id)}
            ariaLabel={`Toggle ${diet.label} filter`}
            className="cursor-pointer"
          />
        ))}
      </div>
    </section>
  )
}
