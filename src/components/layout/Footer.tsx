import { APP_COPYRIGHT_YEAR } from '../../constants/recipeConfig.ts'

export function Footer() {
  return (
    <footer className="mt-16 text-center text-xs text-stone-500 font-sans tracking-tight">
      FridgeLab AI v{__APP_VERSION__} · {APP_COPYRIGHT_YEAR} · All rights reserved.
    </footer>
  )
}
