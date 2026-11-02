import { StepIndicator } from '../common/index.ts'
import { ENERGY_MODES } from '../../constants/pantryData.ts'
import type { EnergyMode } from '../../types/recipe.ts'
import { EnergyCard } from './EnergyCard.tsx'

export interface EnergySectionProps {
  /** Currently selected energy mode or null if none selected */
  selectedMode: EnergyMode | null
  /** Selection callback for energy mode */
  onSelectMode: (mode: EnergyMode) => void
  /** Additional custom classes */
  className?: string
}

/**
 * Step 3: "Energy mode" section with 3 preset effort cards.
 */
export function EnergySection({
  selectedMode,
  onSelectMode,
  className = '',
}: EnergySectionProps) {
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
    </section>
  )
}
