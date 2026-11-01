import { Pill } from '../common/index.ts'
import type { EnergyMode, EnergyModeOption } from '../../types/recipe.ts'

export interface EnergyCardProps {
  /** Mode preset details */
  mode: EnergyModeOption
  /** Whether this energy mode is selected */
  selected: boolean
  /** Selection handler */
  onSelect: (id: EnergyMode) => void
  /** Disabled state */
  disabled?: boolean
  /** Additional custom classes */
  className?: string
}

/**
 * Selectable energy mode card featuring timing pill and optional sweet-spot banner.
 */
export function EnergyCard({
  mode,
  selected,
  onSelect,
  disabled = false,
  className = '',
}: EnergyCardProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={`${mode.title}, ${mode.timingPill}: ${mode.description}`}
      onClick={() => onSelect(mode.id)}
      disabled={disabled}
      className={`group relative flex flex-col justify-between rounded-2xl border p-3.5 sm:p-4 text-left transition-all duration-150 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        selected
          ? 'border-amber-400 ring-2 ring-amber-400/30 bg-surface-card shadow-xs'
          : 'border-surface-border bg-surface-card hover:border-cream-300 hover:shadow-2xs'
      } ${className}`}
    >
      {/* Anchored SWEET SPOT badge */}
      {mode.sweetSpot && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 shrink-0">
          <Pill variant="highlight" label="SWEET SPOT" className="shadow-xs text-[10px]" />
        </div>
      )}

      {/* Top row: Emoji & Timing Pill */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl sm:text-2xl" role="img" aria-hidden="true">
          {mode.emoji}
        </span>
        <Pill variant="timer" label={mode.timingPill} className="text-[11px]" />
      </div>

      {/* Card body */}
      <div>
        <h4 className="font-semibold text-xs sm:text-sm text-stone-900 leading-tight">
          {mode.title}
        </h4>
        <p className="text-[11px] sm:text-xs text-stone-500 mt-1 leading-snug">
          {mode.description}
        </p>
      </div>
    </button>
  )
}
