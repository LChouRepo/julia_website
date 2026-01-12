"use client"

import { useEffect, useMemo, useState } from "react"

type Item = {
  image: string
  title?: { en?: string; de?: string }
  credit?: string
  featured?: boolean
}

export default function Gallery({ items, lang }: { items: Item[]; lang: "en" | "de" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const ordered = useMemo(() => {
    const featured = items.filter(i => i.featured)
    const rest = items.filter(i => !i.featured)
    return [...featured, ...rest]
  }, [items])

  const current = openIndex == null ? null : ordered[openIndex]

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (openIndex == null) return
      if (e.key === "Escape") setOpenIndex(null)
      if (e.key === "ArrowRight") setOpenIndex((i) => (i == null ? i : Math.min(i + 1, ordered.length - 1)))
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i == null ? i : Math.max(i - 1, 0)))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [openIndex, ordered.length])

  useEffect(() => {
    if (openIndex == null) return
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [openIndex])

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.map((it, idx) => {
          const caption = it.title?.[lang] || it.title?.en || it.title?.de || ""
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setOpenIndex(idx)}
              className="group overflow-hidden rounded-xl border text-left"
            >
              <img
                src={it.image}
                alt={caption || "Gallery photo"}
                className="h-64 w-full object-cover transition group-hover:opacity-90"
                loading="lazy"
              />
              {(caption || it.credit) && (
                <div className="px-3 py-2">
                  {caption && <div className="text-sm font-medium">{caption}</div>}
                  {it.credit && <div className="text-xs text-neutral-500">© {it.credit}</div>}
                </div>
              )}
            </button>
          )
        })}
        {!ordered.length && <p className="text-sm text-neutral-500">No photos yet.</p>}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpenIndex(null)}
        >
          <div className="relative max-h-[90vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            <img
              src={current.image}
              alt="Full size"
              className="max-h-[90vh] max-w-[92vw] object-contain"
            />
            <button
              className="absolute right-2 top-2 rounded bg-black/60 px-3 py-1 text-sm text-white"
              onClick={() => setOpenIndex(null)}
            >
              ✕
            </button>

            <div className="mt-3 text-center text-white/80 text-sm">
              {(current.title?.[lang] || current.title?.en || current.title?.de) ?? ""}
              {current.credit && <div className="text-xs">© {current.credit}</div>}
              <div className="mt-1 text-xs text-white/60">← / → to navigate • Esc to close</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
