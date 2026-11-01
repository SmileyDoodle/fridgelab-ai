import type { ReactNode } from 'react'

export interface StepIndicatorProps {
  /** The step number or label (e.g. 1, 2, 3) */
  step: number | string
  /** Visual variant for the indicator */
  variant?: 'muted' | 'subtle' | 'brand'
  /** Size dimension of the circle */
  size?: 'sm' | 'md' | 'lg'
  /** Optional custom class overrides */
  className?: string
  /** Accessible label override */
  ariaLabel?: string
  /** Optional icon to replace or supplement step text */
  children?: ReactNode
}

const variantStyles: Record<NonNullable<StepIndicatorProps['variant']>, string> = {
  muted: 'bg-cream-200 text-brand-hover border border-cream-300/80',
  subtle: 'bg-brand-subtle text-brand-primary border border-brand-border',
  brand: 'bg-brand text-surface-card border border-brand',
}

const sizeStyles: Record<NonNullable<StepIndicatorProps['size']>, string> = {
  sm: 'w-5 h-5 text-xs',
  md: 'w-6 h-6 text-xs font-semibold',
  lg: 'w-8 h-8 text-sm font-bold',
}

/**
 * Circular step indicator styled in warm muted tones.
 */
export function StepIndicator({
  step,
  variant = 'muted',
  size = 'md',
  className = '',
  ariaLabel,
  children,
}: StepIndicatorProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-sans select-none ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      aria-label={ariaLabel ?? `Step ${step}`}
    >
      {children ?? step}
    </span>
  )
}
