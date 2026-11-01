import type { ReactNode } from 'react'
import { Loader2, Sparkles } from 'lucide-react'

export interface SubmitButtonProps {
  /** Click action */
  onClick?: () => void
  /** Loading state while recipe is simmering */
  isLoading?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Optional custom button label */
  label?: string
  /** Children to override label */
  children?: ReactNode
  /** Additional custom classes */
  className?: string
}

/**
 * Full-width CTA button with terracotta gradient, hover depth, and active press scale.
 */
export function SubmitButton({
  onClick,
  isLoading = false,
  disabled = false,
  label = 'Invent Cozy Dish',
  children,
  className = '',
}: SubmitButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`group relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-hover px-6 py-3.5 sm:py-4 font-sans text-base sm:text-lg font-semibold text-surface-card shadow-xs transition-all duration-150 select-none cursor-pointer hover:shadow-md hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-xs disabled:hover:brightness-100 disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          <span>Simmering recipe...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-5 w-5 transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110" aria-hidden="true" />
          <span>{children ?? label}</span>
        </>
      )}
    </button>
  )
}
