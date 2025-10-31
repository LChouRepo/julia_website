import { getEvent } from "@/lib/cms"

export const runtime = "nodejs"
export const revalidate = 60

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const data = await getEvent(params.slug)
  if (!data) return <section className="container section">Event not found.</section>

  return (
    <section className="container section">
      <h1 className="h1">{data.title}</h1>
      <p className="subtle mt-2">
        {new Date(data.date).toLocaleString()} · {data.venue} · {data.city}
      </p>
      {data.ticketUrl && (
        <a className="btn btn-primary mt-6 inline-flex" href={data.ticketUrl} target="_blank" rel="noreferrer">
          Buy Tickets
        </a>
      )}
    </section>
  )
}
