import { getEvent } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export const runtime = "nodejs"
export const revalidate = 60

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const [lang, data] = await Promise.all([getLang(), getEvent(params.slug)])
  if (!data) return <section className="container section">Event not found.</section>

  return (
    <section className="container section">
      <h1 className="h1">{t(data.title, lang, "")}</h1>
      <p className="subtle mt-2">
        {new Date(data.date).toLocaleString()} · {t(data.venue, lang, "")} · {data.city}
      </p>
      {data.ticketUrl && (
        <a className="btn btn-primary mt-6 inline-flex" href={data.ticketUrl} target="_blank" rel="noreferrer">
          Buy Tickets
        </a>
      )}
    </section>
  )
}
