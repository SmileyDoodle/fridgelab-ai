import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { X } from 'lucide-react'

export interface PillProps {
  /** Text content for the pill, alternative to children */
  label?: string
  /** Pill content or label */
  children?: ReactNode
  /** Visual variant conforming to design tokens */
  variant?: 'neutral' | 'sweet-spot' | 'highlight' | 'timer' | 'tag' | 'chip'
  /** Sizing of the pill */
  size?: 'sm' | 'md'
  /** Optional icon prefix */
  icon?: ReactNode
  /** Whether the pill is selected (for toggleable chips) */
  selected?: boolean
  /** Optional click handler making pill interactive */
  onClick?: (event: MouseEvent<HTMLSpanElement | HTMLButtonElement>) => void
  /** If provided, renders a dismissible button with '×' icon */
  onRemove?: () => void
  /** Accessible label for the remove button */
  removeLabel?: string
  /** Disables click or remove interactions */
  disabled?: boolean
  /** Additional custom classes */
  className?: string
  /** Optional accessible label for the pill container */
  ariaLabel?: string
}

const variantStyles: Record<NonNullable<PillProps['variant']>, string> = {
  neutral: 'bg-surface-card text-stone-700 border border-surface-border',
  'sweet-spot':
    'bg-accent-amber text-accent-amber-text border border-amber-300/60 font-bold uppercase tracking-wider',
  highlight:
    'bg-accent-amber text-accent-amber-text border border-amber-300/60 font-bold uppercase tracking-wider',
  timer: 'bg-cream-200 text-stone-700 border border-cream-300 font-medium',
  tag: 'bg-cream-100 text-stone-800 border border-surface-border font-medium',
  chip: 'bg-cream-200 text-stone-800 border border-surface-border font-medium',
}

const sizeStyles: Record<NonNullable<PillProps['size']>, string> = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
}

/**
 * Unified pill primitive supporting static labels, timers, interactive toggles,
 * and dismissible custom ingredient chips.
 */
export function Pill({
  label,
  children,
  variant,
  size = 'sm',
  icon,
  selected = false,
  onClick,
  onRemove,
  removeLabel,
  disabled = false,
  className = '',
  ariaLabel,
}: PillProps) {
  // Default to 'chip' if dismissible, otherwise 'neutral'
  const resolvedVariant = variant ?? (onRemove ? 'chip' : 'neutral')
  const content = children ?? label
  const itemText = typeof content === 'string' ? content : label ?? 'item'
  const computedRemoveLabel = removeLabel ?? `Remove ${itemText}`

  const baseClasses =
    'inline-flex items-center gap-1.5 rounded-full select-none transition-colors'
  const selectedClasses = selected
    ? 'bg-brand text-surface-card border-brand shadow-xs'
    : variantStyles[resolvedVariant]

  const interactiveClasses =
    onClick && !onRemove
      ? 'cursor-pointer hover:opacity-90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
      : ''

  const combinedClasses = `${baseClasses} ${sizeStyles[size]} ${selectedClasses} ${interactiveClasses} ${className}`

  const handleRemoveClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    if (disabled) return
    onRemove?.()
  }

  const handleRemoveKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      event.stopPropagation()
      onRemove?.()
    }
  }

  // Interactive standalone button (when clickable and not dismissible)
  if (onClick && !onRemove) {
    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onClick(event as unknown as MouseEvent<HTMLButtonElement>)
      }
    }

    return (
      <button
        type="button"
        onClick={onClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-pressed={selected}
        className={combinedClasses}
        aria-label={ariaLabel}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{content}</span>
      </button>
    )
  }

  return (
    <span className={combinedClasses} aria-label={ariaLabel}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{content}</span>
      {onRemove && (
        <button
          type="button"
          onClick={handleRemoveClick}
          onKeyDown={handleRemoveKeyDown}
          disabled={disabled}
          aria-label={computedRemoveLabel}
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-cream-300 hover:text-stone-800 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          <X className="h-3 w-3" aria-hidden="true" />
        </button>
      )}
    </span>
  )
}
