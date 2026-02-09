"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Item = {
  image: string
  title?: { en?: string; de?: string }
  credit?: string
  featured?: boolean
}

function getCaption(it: Item, lang: "en" | "de") {
  return it.title?.[lang] || it.title?.en || it.title?.de || ""
}

export default function Gallery({ items, lang }: { items: Item[]; lang: "en" | "de" }) {
  const ordered = useMemo(() => {
    const featured = items.filter(i => i.featured)
    const rest = items.filter(i => !i.featured)
    return [...featured, ...rest].filter(i => i?.image)
  }, [items])

  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const dragging = useRef(false)

  const current = ordered[index]
  const total = ordered.length

  function go(next: number) {
    if (!total) return
    const wrapped = (next + total) % total
    setIndex(wrapped)
  }

  useEffect(() => {
    // if items change and index becomes invalid
    if (index > total - 1) setIndex(0)
  }, [total, index])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!total) return
      if (e.key === "ArrowRight") go(index + 1)
      if (e.key === "ArrowLeft") go(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, total])

  if (!total) {
    return <p className="text-sm text-neutral-500">No photos yet.</p>
  }

  const caption = current ? getCaption(current, lang) : ""

  return (
    <section className="mt-8">
      {/* Slider frame */}
      <div className="relative overflow-hidden rounded-2xl border bg-black/5">
        {/* Main image */}
        <div
          className="relative h-[60vh] min-h-[360px] w-full bg-neutral-950/10"
          onPointerDown={(e) => {
            dragging.current = true
            startX.current = e.clientX
          }}
          onPointerMove={(e) => {
            if (!dragging.current || startX.current == null) return
            const dx = e.clientX - startX.current
            // don’t do anything while moving; we decide on pointer up
          }}
          onPointerUp={(e) => {
            if (!dragging.current || startX.current == null) return
            const dx = e.clientX - startX.current
            dragging.current = false
            startX.current = null

            // swipe threshold
            if (Math.abs(dx) > 45) {
              if (dx < 0) go(index + 1)
              else go(index - 1)
            }
          }}
          onPointerCancel={() => {
            dragging.current = false
            startX.current = null
          }}
        >
          <img
            src={current.image}
            alt={caption || "Gallery photo"}
            className="absolute inset-0 h-full w-full select-none object-contain"
            draggable={false}
          />

          {/* Soft edge fade (very subtle, makes it feel “designed”) */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10" />

          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous"
            onClick={() => go(index - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => go(index + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/45 px-3 py-2 text-white backdrop-blur hover:bg-black/60"
          >
            ›
          </button>

          {/* Caption overlay */}
          {(caption || current.credit) && (
            <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-10 text-white">
              {caption && <div className="text-sm font-medium">{caption}</div>}
              {current.credit && <div className="text-xs text-white/70">© {current.credit}</div>}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="mt-4 flex items-center gap-3">
        <div className="text-xs text-neutral-500 tabular-nums">
          {index + 1} / {total}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-2 pr-2">
            {ordered.map((it, i) => {
              const isActive = i === index
              const cap = getCaption(it, lang)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={[
                    "relative h-16 w-24 flex-none overflow-hidden rounded-lg border transition",
                    isActive
                      ? "border-black/60 ring-2 ring-black/20"
                      : "border-black/10 hover:border-black/30 opacity-90 hover:opacity-100",
                  ].join(" ")}
                  title={cap || "Photo"}
                >
                  <img
                    src={it.image}
                    alt={cap || "Thumbnail"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
