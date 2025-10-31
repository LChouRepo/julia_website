import Sidebar from "@/components/home/Sidebar"
import { getAbout, getSettings } from "@/lib/cms"
import { marked } from "marked"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function AboutPage() {
  const [about, settings] = await Promise.all([getAbout(), getSettings()])

  // Prefer official long bio; fall back to settings.aboutHtml if provided
  const raw = about?.bioLong ?? (settings as any)?.aboutHtml ?? ""
  const html = raw ? await marked(raw) : "<p>Official biography coming soon.</p>"

  return (
    <main className="relative md:pl-56">
      <Sidebar />
      <section className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">Official Biography</h1>

        <article
          className="prose mt-6 max-w-none"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {about?.headshots?.length ? (
          <>
            <h2 className="mt-12 text-2xl font-semibold">Headshots</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {about.headshots.map((h, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border">
                  <img src={h.src} alt={h.alt ?? "Headshot"} className="w-full object-cover" />
                  {(h.alt || h.credit) && (
                    <figcaption className="px-3 py-2 text-sm text-neutral-600">
                      {h.alt}
                      {h.credit && <span className="block text-xs text-neutral-500">© {h.credit}</span>}
                    </figcaption>
                  )}
                </figure>
              ))}
            </div>
          </>
        ) : null}

        {about?.pressKit && (
          <a href={about.pressKit} className="mt-10 inline-block rounded border px-4 py-2">
            Download Press Kit
          </a>
        )}
      </section>
    </main>
  )
}
