import type { AriaRole, KeyboardEvent, ReactNode } from 'react'
import { AlertTriangle, Info, X } from 'lucide-react'

export interface InfoBoxProps {
  /** Semantic variant determining tone, colors, and accessibility role */
  variant?: 'tip' | 'warning' | 'error'
  /** Optional header title */
  title?: string
  /** Message body */
  children: ReactNode
  /** Custom icon override */
  icon?: ReactNode
  /** Callback when dismissed */
  onDismiss?: () => void
  /** Accessible label for the dismiss button */
  dismissLabel?: string
  /** Explicit ARIA role override */
  role?: AriaRole
  /** Custom classes */
  className?: string
}

const variantStyles: Record<
  NonNullable<InfoBoxProps['variant']>,
  { container: string; title: string; body: string; icon: string; close: string }
> = {
  tip: {
    container: 'bg-accent-green border-accent-green-text/20 text-accent-green-text',
    title: 'text-accent-green-text font-bold',
    body: 'text-accent-green-text/90',
    icon: 'text-accent-green-text',
    close: 'text-accent-green-text hover:bg-accent-green-text/10',
  },
  warning: {
    container: 'bg-accent-amber border-accent-amber-text/20 text-accent-amber-text',
    title: 'text-accent-amber-text font-bold',
    body: 'text-accent-amber-text/90',
    icon: 'text-accent-amber-text',
    close: 'text-accent-amber-text hover:bg-accent-amber-text/10',
  },
  error: {
    container: 'bg-brand-subtle border-brand-border text-brand-primary',
    title: 'text-brand-hover font-bold',
    body: 'text-brand-hover/90',
    icon: 'text-brand-primary',
    close: 'text-brand-primary hover:bg-brand-primary/10',
  },
}

/**
 * Informative callout box for culinary tips, warnings, and error notifications.
 */
export function InfoBox({
  variant = 'tip',
  title,
  children,
  icon,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  role,
  className = '',
}: InfoBoxProps) {
  const styles = variantStyles[variant]
  const isError = variant === 'error'
  const computedRole = role ?? (isError ? 'alert' : 'status')
  const ariaLive = isError ? 'assertive' : 'polite'

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onDismiss?.()
    }
  }

  const defaultIcon =
    variant === 'tip' ? (
      <Info className="h-5 w-5 shrink-0" aria-hidden="true" />
    ) : (
      <AlertTriangle className="h-5 w-5 shrink-0" aria-hidden="true" />
    )

  return (
    <div
      role={computedRole}
      aria-live={ariaLive}
      className={`relative flex items-start gap-3 rounded-2xl border p-4 text-sm leading-relaxed ${styles.container} ${className}`}
    >
      <div className={`mt-0.5 shrink-0 ${styles.icon}`}>
        {icon ?? defaultIcon}
      </div>

      <div className="flex-1 space-y-1">
        {title && (
          <h4 className={`text-xs uppercase tracking-wider ${styles.title}`}>
            {title}
          </h4>
        )}
        <div className={`text-sm ${styles.body}`}>{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          onKeyDown={handleKeyDown}
          aria-label={dismissLabel}
          className={`shrink-0 rounded-lg p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 ${styles.close}`}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
