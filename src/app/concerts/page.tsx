import Sidebar from "@/components/home/Sidebar"
import { getEvents } from "@/lib/cms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

function startOfToday() {
  const t = new Date()
  t.setHours(0, 0, 0, 0)
  return t.getTime()
}

export default async function ConcertsPage() {
  const events = await getEvents()

  const sorted = [...events].sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const today = startOfToday()
  const upcoming = sorted.filter((e: any) => new Date(e.date).getTime() >= today)
  const past = sorted.filter((e: any) => new Date(e.date).getTime() < today).reverse()

  const Row = ({ e }: { e: any }) => (
    <div className="grid gap-3 border-b py-4 md:grid-cols-[12rem_1fr_auto] md:items-center">
      <div className="text-sm text-neutral-500">
        {new Date(e.date).toLocaleString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
      <div>
        <div className="font-semibold">{e.title}</div>
        <div className="text-sm text-neutral-600">
          {[e.venue, e.city].filter(Boolean).join(" · ")}
        </div>
      </div>
      <div className="flex gap-2 md:justify-end">
        {e.slug && (
          <a className="rounded border px-3 py-1 text-sm" href={`/events/${e.slug}`}>
            Details
          </a>
        )}
        {e.ticketUrl && (
          <a
            className="rounded border px-3 py-1 text-sm"
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

  return (
    <main className="relative md:pl-56">
      <Sidebar />
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">Concerts</h1>

        <h2 className="mt-10 mb-2 text-xl font-semibold">Upcoming</h2>
        <div className="divide-y">
          {upcoming.length ? upcoming.map((e: any, i: number) => <Row key={i} e={e} />) : (
            <p className="py-6 text-neutral-500">No upcoming events yet.</p>
          )}
        </div>

        <h2 className="mt-12 mb-2 text-xl font-semibold">Past</h2>
        <div className="divide-y">
          {past.length ? past.map((e: any, i: number) => <Row key={i} e={e} />) : (
            <p className="py-6 text-neutral-500">No past events.</p>
          )}
        </div>
      </section>
    </main>
  )
}
