import Sidebar from "@/components/home/Sidebar"
import Gallery from "@/components/media/Gallery"
import { getReleases, getQuotes, getGallery } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t, type I18nText } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type ReleaseLink = { label: I18nText; href: string }
type Release = {
  title: I18nText
  subtitle?: I18nText
  cover?: string
  links?: ReleaseLink[]
}

type Quote = { outlet: string; text: I18nText }

type GalleryItem = {
  image: string
  title?: { en?: string; de?: string }
  credit?: string
  featured?: boolean
}

export default async function MediaPage() {
  const [lang, releasesRaw, quotesRaw, galleryRaw] = await Promise.all([
    getLang(),
    getReleases(),
    getQuotes(),
    getGallery(),
  ])

  const releases = releasesRaw as Release[]
  const quotes = quotesRaw as Quote[]
  const gallery = galleryRaw as GalleryItem[]

  return (
    <main className="relative content-with-sidebar">
      <Sidebar />

      <section className="container mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          {lang === "de" ? "Medien" : "Media"}
        </h1>
        <p className="mt-2 text-neutral-600">
          {lang === "de"
            ? "Veröffentlichungen, Presse und Galerie."
            : "Releases, press, and gallery."}
        </p>

        {/* Releases */}
        <h2 className="mt-10 mb-4 text-xl font-semibold">
          {lang === "de" ? "Veröffentlichungen" : "Releases"}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((r, i) => (
            <figure key={i} className="overflow-hidden rounded-xl border bg-white">
              {r.cover ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={r.cover}
                  alt={t(r.title, lang, "")}
                  loading="lazy"
                  className="h-64 w-full object-cover"
                />
              ) : (
                <div className="flex h-64 items-center justify-center bg-neutral-50 text-neutral-500">
                  {lang === "de" ? "Kein Cover" : "No cover"}
                </div>
              )}
              <figcaption className="px-3 py-3">
                <div className="font-semibold">{t(r.title, lang, "")}</div>
                {r.subtitle && (
                  <div className="text-sm text-neutral-600">{t(r.subtitle, lang, "")}</div>
                )}
                {Array.isArray(r.links) && r.links.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.links.map((l, j) => (
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
          {!releases.length && (
            <p className="py-6 text-neutral-500">
              {lang === "de" ? "Noch keine Veröffentlichungen." : "No releases yet."}
            </p>
          )}
        </div>

        {/* Press */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">
          {lang === "de" ? "Presse" : "Press"}
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {quotes.map((q, i) => (
            <blockquote key={i} className="rounded-xl border bg-white px-4 py-3 text-neutral-800">
              <p className="leading-relaxed">“{t(q.text, lang, "")}”</p>
              <cite className="mt-2 block text-sm text-neutral-500">— {q.outlet}</cite>
            </blockquote>
          ))}
          {!quotes.length && (
            <p className="py-6 text-neutral-500">
              {lang === "de" ? "Noch keine Presse." : "No press yet."}
            </p>
          )}
        </div>

        {/* Gallery */}
        <h2 className="mt-12 mb-4 text-xl font-semibold">
          {lang === "de" ? "Galerie" : "Gallery"}
        </h2>
        <Gallery items={gallery} lang={lang} />
      </section>
    </main>
  )
}
