import { QUICK_INSPIRATIONS, type QuickInspiration } from '../../constants/quickInspirations.ts'

export interface WaitingSkilletCardProps {
  onSelectInspiration: (inspiration: QuickInspiration) => void
  className?: string
}

/**
 * Default empty state card displayed in the right column when coming to the page.
 * Displays the "Your skillet is waiting" and 3 quick inspiration presets.
 */
export function WaitingSkilletCard({
  onSelectInspiration,
  className = '',
}: WaitingSkilletCardProps) {
  return (
    <article
      aria-label="Your skillet is waiting"
      className={`overflow-hidden rounded-3xl border border-surface-border bg-surface-card shadow-xs ${className}`}
    >
      {/* Top Banner & Invitation */}
      <div className="p-6 sm:p-7 text-center">
        {/* Pill Badge */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cream-100 border border-amber-300/50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-brand">
            <span role="img" aria-label="pan">🍳</span>
            <span>Your skillet is waiting</span>
          </div>
        </div>

        {/* Squircle Skillet Icon */}
        <div className="mt-5 flex justify-center">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border border-surface-border bg-cream-100/70 shadow-2xs">
            <span className="text-3xl sm:text-4xl" role="img" aria-label="Cozy Skillet">
              🥘
            </span>
          </div>
        </div>

        {/* Title */}
        <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
          Your skillet is waiting
        </h2>

        {/* Description */}
        <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-stone-600 leading-relaxed">
          Select ingredients from the pantry on the left or add any leftovers in your fridge.
          FridgeLab will invent a cozy dish right here.
        </p>
      </div>

      {/* Divider */}
      <hr className="border-surface-border" />

      {/* Quick Inspiration Section */}
      <div className="p-5 sm:p-6 bg-surface-card">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-brand mb-3">
          QUICK INSPIRATION
        </h3>

        <div className="space-y-2.5">
          {QUICK_INSPIRATIONS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectInspiration(item)}
              aria-label={`Select ${item.title}: ${item.subtitle}`}
              className="group flex w-full items-center gap-3.5 rounded-2xl border border-surface-border bg-cream-50/50 p-3.5 text-left transition-all duration-150 hover:border-brand/40 hover:bg-cream-100 hover:shadow-2xs active:scale-[0.99] cursor-pointer"
            >
              {/* Emoji Badge */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-surface-border bg-surface-card text-lg shadow-2xs transition-transform duration-150 group-hover:scale-105">
                <span role="img" aria-label={item.title}>
                  {item.emoji}
                </span>
              </div>

              {/* Title & Ingredients */}
              <div className="flex-1 min-w-0">
                <div className="text-sm sm:text-base font-bold text-stone-900 transition-colors group-hover:text-brand">
                  {item.title}
                </div>
                <div className="text-xs text-stone-500 mt-0.5 truncate">
                  {item.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
