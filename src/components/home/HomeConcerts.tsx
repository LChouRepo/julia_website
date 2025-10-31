import Link from "next/link"

type Event = {
  title: string
  date: string          // ISO string recommended
  venue?: string
  city?: string
  ticketUrl?: string
  slug?: string
}

function formatDate(iso: string) {
  // Robust, locale-aware formatting
  const d = new Date(iso)
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d)
}

export default function HomeConcertsPreview({
  events = [] as Event[],
  bgImage,
}: {
  events?: Event[]
  bgImage?: string   // allow override from CMS
}) {
  // Sort by date ascending and keep only upcoming (today or later)
  const now = Date.now()
  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const upcoming = sorted.filter(e => {
    const t = new Date(e.date).getTime()
    return !Number.isNaN(t) && t >= now
  }).slice(0, 4)

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
      {/* Overlay only when background image is used (improves contrast) */}
      {hasBg && <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />}

      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <h2 id="concerts-heading" className="text-3xl font-extrabold tracking-wide md:text-4xl">
            Concerts
          </h2>
          <Link
            href="/concerts"
            className={`text-sm font-semibold underline ${hasBg ? "text-white/90 hover:text-white" : ""}`}
          >
            See all
          </Link>
        </div>

        <div className={hasBg ? "divide-y divide-white/20" : "divide-y"}>
          {upcoming.map((e, i) => {
            const meta = [e.venue, e.city].filter(Boolean).join(" · ")
            return (
              <div key={i} className="grid gap-3 py-6 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className={`text-xs tracking-widest ${hasBg ? "text-white/80" : "text-neutral-500"}`}>
                    {formatDate(e.date)}
                  </p>
                  <h3 className="text-lg font-semibold">{e.title}</h3>
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
                      Details
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
                      Tickets
                    </a>
                  )}
                </div>
              </div>
            )
          })}

          {upcoming.length === 0 && (
            <p className={`py-8 text-sm ${hasBg ? "text-white/80" : "text-neutral-500"}`}>
              No upcoming events yet.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
