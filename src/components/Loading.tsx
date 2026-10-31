import { useEffect, useState } from 'react'
import type { LoadProgress } from '../types'

const WAITING = [
  'Chopping imaginary onions…',
  'Whisking up some ideas…',
  'Asking the fridge for advice…',
  'Warming the pan of imagination…',
  'Sprinkling a pinch of coziness…',
]

export function LoadingBar({ progress, device }: { progress: LoadProgress; device: string | null }) {
  const pct = Math.round(progress.percent)
  return (
    <div className="animate-rise rounded-3xl border-[3px] border-sage bg-white p-6 shadow-lg" role="status">
      <div className="flex items-center gap-3">
        <span className="animate-bob text-4xl">🍲</span>
        <div>
          <p className="font-display text-lg font-bold">Stocking the kitchen (first time only)</p>
          <p className="text-sm font-semibold opacity-60">
            Downloading the AI chef to your browser · cached afterwards{device ? ` · ${device === 'webgpu' ? 'WebGPU ⚡' : 'CPU mode'}` : ''}
          </p>
        </div>
      </div>
      <div className="mt-4 h-5 overflow-hidden rounded-full bg-cream" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-stripes h-full rounded-full bg-terracotta transition-[width] duration-200"
          style={{ width: `${Math.max(pct, 3)}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs font-bold opacity-70">
        <span className="truncate pr-2">{progress.label || 'Warming up…'}</span>
        <span>
          {pct}%{progress.totalMB > 0 && ` · ${progress.loadedMB.toFixed(0)}/${progress.totalMB.toFixed(0)} MB`}
        </span>
      </div>
    </div>
  )
}

export function CookingAnimation() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % WAITING.length), 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="animate-rise rounded-3xl border-[3px] border-butter bg-white p-8 text-center shadow-lg" role="status">
      <div className="flex justify-center gap-3 text-4xl">
        {['🥄', '🍳', '🧂'].map((e, k) => (
          <span key={e} className="animate-bob" style={{ animationDelay: `${k * 0.2}s` }}>{e}</span>
        ))}
      </div>
      <p className="mt-4 font-display text-lg font-bold">{WAITING[i]}</p>
    </div>
  )
}
