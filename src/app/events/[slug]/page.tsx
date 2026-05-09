import Sidebar from "@/components/home/Sidebar"
import { getEvent } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function EventDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [lang, data] = await Promise.all([getLang(), getEvent(slug)])

  if (!data) {
    return (
      <main className="relative content-with-sidebar">
        <Sidebar />
        <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            {lang === "de" ? "Veranstaltung nicht gefunden" : "Event not found"}
          </h1>
        </section>
      </main>
    )
  }

  return (
    <main className="relative xl:pl-72">
      <Sidebar />
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          {t(data.title, lang, "")}
        </h1>
        <p className="mt-3 text-neutral-600">
          {new Date(data.date).toLocaleString()}
          {data.venue ? ` · ${t(data.venue, lang, "")}` : ""}
          {data.city ? ` · ${data.city}` : ""}
        </p>
        {data.ticketUrl && (
          <a
            className="mt-8 inline-block rounded border px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            href={data.ticketUrl}
            target="_blank"
            rel="noreferrer"
          >
            {lang === "de" ? "Tickets kaufen" : "Buy tickets"}
          </a>
        )}
      </section>
    </main>
  )
}
