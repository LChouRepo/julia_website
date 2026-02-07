import Sidebar from "@/components/home/Sidebar"
import Gallery from "@/components/media/Gallery"
import { getReleases, getQuotes, getGallery } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function MediaPage() {
  const [lang, releases, quotes, gallery] = await Promise.all([
    getLang(),
    getReleases(),
    getQuotes(),
    getGallery(),
  ])

  return (
    <main className="relative xl:pl-72">
      <Sidebar />

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          {lang === "de" ? "Medien" : "Media"}
        </h1>
        <p className="mt-2 text-neutral-600">
          {lang === "de" ? "Veröffentlichungen, Presse und Galerie." : "Releases, press, and gallery."}
        </p>

        {/* Releases */}
        <h2 className="mt-10 mb-4 text-xl font-semibold">
          {lang === "de" ? "Veröffentlichungen" : "Releases"}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r: any, i: number) => (
            <figure key={i} className="overflow-hidden rounded-xl border bg-white">
              {r.cover ? (
                <img src={r.cover} alt={t(r.title, lang, "")} className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center bg-neutral-50 text-neutral-500">No cover</div>
              )}
              <figcaption className="px-3 py-3">
                <div className="font-semibold">{t(r.title, lang, "")}</div>
                {r.subtitle && <div className="text-sm text-neutral-600">{t(r.subtitle, lang, "")}</div>}
                {Array.isArray(r.links) && r.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.links.map((l: any, j: number) => (
                      <a
                        key={j}
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded border px-3 py-1 text-sm hover:bg-neutral-50"
                      >
                        {t(l.label, lang, "")}
                      </a>
                    ))}
                  </div>
                )}
              </figcaption>
            </figure>
          ))}
          {!releases.length && <p className="py-6 text-neutral-500">No releases yet.</p>}
        </div>

        {/* Press */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">{lang === "de" ? "Presse" : "Press"}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quotes.map((q: any, i: number) => (
            <blockquote key={i} className="rounded-xl border bg-white px-4 py-3 text-neutral-800">
              <p className="leading-relaxed">“{t(q.text, lang, "")}”</p>
              <cite className="mt-2 block text-sm text-neutral-500">— {q.outlet}</cite>
            </blockquote>
          ))}
          {!quotes.length && <p className="py-6 text-neutral-500">No press yet.</p>}
        </div>

        {/* Gallery */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">{lang === "de" ? "Galerie" : "Gallery"}</h2>
        <Gallery items={gallery as any} lang={lang} />
      </section>
    </main>
  )
}
