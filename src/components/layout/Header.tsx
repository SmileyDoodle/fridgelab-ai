/**
 * Editorial header displaying brand title and tagline.
 */
export function Header() {
  return (
    <header className="mx-auto max-w-2xl text-center">
      <h1 className="font-serif text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
        FridgeLab AI
      </h1>
      <p className="mt-1 font-serif text-2xl sm:text-3xl lg:text-4xl italic text-brand font-normal">
        will invent a cozy dish.
      </p>
      <p className="mx-auto mt-4 max-w-xl text-center text-xs sm:text-sm text-stone-600 leading-relaxed">
        Select your available ingredients and discover recipes you can make right now.
      </p>
    </header>
  )
}
