import Sidebar from "@/components/home/Sidebar"
import { getReleases, getQuotes } from "@/lib/cms"
import fs from "fs/promises"
import path from "path"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type Photo = { src: string; title?: string; credit?: string; weight?: number }

async function readPortraits(): Promise<Photo[]> {
  // OPTIONAL: reads content/portraits.json if present
  try {
    const file = path.join(process.cwd(), "content", "portraits.json")
    const raw = await fs.readFile(file, "utf-8")
    const arr = JSON.parse(raw) as Photo[]
    return arr
      .filter(p => p?.src)
      .sort((a, b) => (a.weight ?? 9999) - (b.weight ?? 9999))
  } catch {
    return []
  }
}

export default async function MediaPage() {
  const [releases, quotes, portraits] = await Promise.all([
    getReleases(),
    getQuotes(),
    readPortraits(), // optional; returns [] if file not found
  ])

  return (
    <main className="relative md:pl-56">
      <Sidebar />

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">Media</h1>
        <p className="mt-2 text-neutral-600">Releases, press, and portraits.</p>

        {/* Releases */}
        <h2 className="mt-10 mb-4 text-xl font-semibold">Releases</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r: any, i: number) => (
            <figure key={i} className="overflow-hidden rounded-xl border">
              {r.cover ? (
                <img src={r.cover} alt={r.title} className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center bg-neutral-50 text-neutral-500">No cover</div>
              )}
              <figcaption className="px-3 py-3">
                <div className="font-semibold">{r.title}</div>
                {r.subtitle && <div className="text-sm text-neutral-600">{r.subtitle}</div>}
                {Array.isArray(r.links) && r.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.links.map((l: any, j: number) => (
                      <a key={j} href={l.href} target="_blank" rel="noreferrer" className="rounded border px-3 py-1 text-sm">
                        {l.label}
                      </a>
                    ))}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
          {!releases.length && <p className="py-6 text-neutral-500">No releases yet.</p>}
        </div>

        {/* Press quotes */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">Press</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quotes.map((q: any, i: number) => (
            <blockquote key={i} className="rounded-xl border px-4 py-3 text-neutral-800">
              <p className="leading-relaxed">“{q.text}”</p>
              <cite className="mt-2 block text-sm text-neutral-500">— {q.outlet}</cite>
            </blockquote>
          ))}
          {!quotes.length && <p className="py-6 text-neutral-500">No press yet.</p>}
        </div>

        {/* Portraits (optional simple grid from a single JSON) */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">Portraits</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portraits.map((p, i) => (
            <figure key={i} className="overflow-hidden rounded-xl border">
              <img src={p.src} alt={p.title ?? "Portrait"} className="h-64 w-full object-cover" />
              {(p.title || p.credit) && (
                <figcaption className="px-3 py-2 text-sm text-neutral-600">
                  {p.title}
                  {p.credit && <span className="block text-xs text-neutral-500">© {p.credit}</span>}
                </figcaption>
              )}
            </figure>
          ))}
          {!portraits.length && <p className="py-6 text-neutral-500">No portraits uploaded yet.</p>}
        </div>
      </section>
    </main>
  )
}
