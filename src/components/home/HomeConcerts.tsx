import Link from "next/link"
import { t, type I18nText } from "@/lib/i18n"

type Event = {
  title: I18nText
  date: string
  venue?: I18nText
  city?: string
  ticketUrl?: string
  slug?: string
}

function formatDate(iso: string, lang: "en" | "de") {
  const d = new Date(iso)
  const locale = lang === "de" ? "de-DE" : "en-US"
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export default function HomeConcertsPreview({
  events = [],
  bgImage,
  lang,
}: {
  events?: Event[]
  bgImage?: string
  lang: "en" | "de"
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const cutoff = today.getTime()

  const upcoming = [...events]
    .filter((e) => {
      const t = new Date(e.date).getTime()
      return !Number.isNaN(t) && t >= cutoff
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4)

  // Hide the Concerts preview entirely when there are no upcoming events.
  // It auto-reappears as soon as a future event is added via the CMS.
  if (upcoming.length === 0) return null

  const hasBg = Boolean(bgImage)

  return (
    <section
      id="concerts"
      aria-labelledby="concerts-heading"
      className={`relative py-16 md:py-24 ${hasBg ? "text-white" : "bg-neutral-50"}`}
      style={
        hasBg
          ? {
              backgroundImage: `url(${bgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {hasBg && <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />}

      <div className="container mx-auto max-w-5xl px-4">
        <div className="font-display mb-8 flex items-end justify-between">
          <h2 id="concerts-heading" className="text-3xl tracking-wide md:text-4xl">
            {lang === "de" ? "Konzerte" : "Concerts"}
          </h2>
          <Link
            href="/concerts"
            className={`text-sm font-semibold underline ${hasBg ? "text-white/90 hover:text-white" : ""}`}
          >
            {lang === "de" ? "Alle anzeigen" : "See all"}
          </Link>
        </div>

        <div className={hasBg ? "divide-y divide-white/20" : "divide-y"}>
          {upcoming.map((e, i) => {
            const meta = [t(e.venue, lang, ""), e.city].filter(Boolean).join(" · ")
            return (
              <div key={i} className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className={`text-xs tracking-widest ${hasBg ? "text-white/80" : "text-neutral-500"}`}>
                    {formatDate(e.date, lang)}
                  </p>
                  <h3 className="text-lg font-semibold">{t(e.title, lang, "")}</h3>
                  {meta && (
                    <p className={`text-sm ${hasBg ? "text-white/85" : "text-neutral-600"}`}>
                      {meta}
                    </p>
                  )}
                </div>
                <div className="flex gap-2 md:justify-end">
                  {e.slug && (
                    <Link
                      className={`rounded border px-3 py-1 text-sm ${
                        hasBg ? "border-white/60 hover:bg-white hover:text-black" : ""
                      }`}
                      href={`/events/${e.slug}`}
                    >
                      {lang === "de" ? "Details" : "Details"}
                    </Link>
                  )}
                  {e.ticketUrl && (
                    <a
                      className={`rounded border px-3 py-1 text-sm ${
                        hasBg ? "border-white/60 hover:bg-white hover:text-black" : ""
                      }`}
                      href={e.ticketUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {lang === "de" ? "Tickets" : "Tickets"}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
