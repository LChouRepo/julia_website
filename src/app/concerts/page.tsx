import Sidebar from "@/components/home/Sidebar"
import { getEvents } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t, type I18nText } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type Event = {
  title: I18nText
  date: string
  venue?: I18nText
  city?: string
  ticketUrl?: string
  slug?: string
}

function startOfToday() {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t.getTime()
}

export default async function ConcertsPage() {
  const [lang, eventsRaw] = await Promise.all([getLang(), getEvents()])
  const events = eventsRaw as Event[]

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const today = startOfToday()
  const upcoming = sorted.filter((e) => new Date(e.date).getTime() >= today)
  const past = sorted.filter((e) => new Date(e.date).getTime() < today).reverse()

  const dateLocale = lang === "de" ? "de-DE" : "en-US"

  const Row = ({ e }: { e: Event }) => (
    <div className="grid gap-3 border-b py-4 md:grid-cols-[12rem_1fr_auto] md:items-center">
      <div className="text-sm text-neutral-500">
        {new Date(e.date).toLocaleString(dateLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div>
        <div className="font-semibold">{t(e.title, lang, "")}</div>
        <div className="text-sm text-neutral-600">
          {[t(e.venue, lang, ""), e.city].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div className="flex gap-2 md:justify-end">
        {e.slug && (
          <a className="rounded border px-3 py-1 text-sm" href={`/events/${e.slug}`}>
            {lang === "de" ? "Details" : "Details"}
          </a>
        )}
        {e.ticketUrl && (
          <a
            className="rounded border px-3 py-1 text-sm"
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

  return (
    <main className="relative content-with-sidebar">
      <Sidebar />
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          {lang === "de" ? "Konzerte" : "Concerts"}
        </h1>

        <h2 className="mt-10 mb-2 text-xl font-semibold">
          {lang === "de" ? "Anstehend" : "Upcoming"}
        </h2>
        <div className="divide-y">
          {upcoming.length ? (
            upcoming.map((e, i) => <Row key={i} e={e} />)
          ) : (
            <p className="py-6 text-neutral-500">
              {lang === "de" ? "Noch keine Termine angekündigt." : "No upcoming events yet."}
            </p>
          )}
        </div>

        <h2 className="mt-12 mb-2 text-xl font-semibold">
          {lang === "de" ? "Vergangen" : "Past"}
        </h2>
        <div className="divide-y">
          {past.length ? (
            past.map((e, i) => <Row key={i} e={e} />)
          ) : (
            <p className="py-6 text-neutral-500">
              {lang === "de" ? "Keine vergangenen Termine." : "No past events."}
            </p>
          )}
        </div>
      </section>
    </main>
  )
}
