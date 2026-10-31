import { useCallback, useState } from 'react'
import { HardDrive, Trash2 } from 'lucide-react'

// transformers.js stores downloaded model files in this Cache Storage bucket.
const CACHE_NAME = 'transformers-cache'

interface Entry {
  url: string
  name: string
  mb: number
}

export function ModelStorage({ disabled }: { disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [entries, setEntries] = useState<Entry[]>([])

  const refresh = useCallback(async () => {
    if (!('caches' in window) || !(await caches.has(CACHE_NAME))) return setEntries([])
    const cache = await caches.open(CACHE_NAME)
    const reqs = await cache.keys()
    const list = await Promise.all(
      reqs.map(async (r) => {
        const res = await cache.match(r)
        const len = Number(res?.headers.get('content-length') ?? 0)
        return {
          url: r.url,
          name: r.url.replace(/^https:\/\/huggingface\.co\//, '').replace('/resolve/main', ''),
          mb: len / 1048576,
        }
      }),
    )
    setEntries(list.sort((a, b) => b.mb - a.mb))
  }, [])

  const toggleOpen = () => {
    const next = !open
    setOpen(next)
    if (next) {
      void refresh()
    }
  }

  const remove = async (url: string) => {
    const cache = await caches.open(CACHE_NAME)
    await cache.delete(url)
    refresh()
  }
  const removeAll = async () => {
    await caches.delete(CACHE_NAME)
    // The running worker still holds the model in memory; reload to free it.
    window.location.reload()
  }

  const total = entries.reduce((s, e) => s + e.mb, 0)

  return (
    <div className="mt-4 text-center">
      <button
        onClick={toggleOpen}
        className="inline-flex items-center gap-1.5 text-xs font-bold underline-offset-2 hover:underline"
      >
        <HardDrive size={13} /> Manage downloaded models
      </button>
      {open && (
        <div className="mx-auto mt-3 max-w-lg rounded-2xl border-2 border-cocoa/15 bg-white/80 p-4 text-left text-xs">
          {entries.length === 0 ? (
            <p className="font-semibold">Nothing stored. Files are downloaded only when you cook.</p>
          ) : (
            <>
              <ul className="space-y-1.5">
                {entries.map((e) => (
                  <li key={e.url} className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold" title={e.name}>{e.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      {e.mb.toFixed(1)} MB
                      <button
                        aria-label={`Delete ${e.name}`}
                        disabled={disabled}
                        onClick={() => remove(e.url)}
                        className="rounded p-1 hover:bg-red-100 disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t border-cocoa/10 pt-3">
                <span className="font-bold">Total: {total.toFixed(0)} MB</span>
                <button
                  onClick={removeAll}
                  disabled={disabled}
                  className="rounded-full bg-red-600 px-3 py-1 font-bold text-white disabled:opacity-40"
                >
                  Delete all &amp; reload
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
