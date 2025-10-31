import { sanityClient } from "@/lib/sanity.client"
import { eventBySlugQuery } from "@/lib/queries"

export const revalidate = 300

export default async function EventDetail({ params }: { params: { slug: string } }) {
  const data = await sanityClient.fetch(eventBySlugQuery, { slug: params.slug })
  if (!data) return <div className="container section">Event not found.</div>
  return (
    <section className="container section">
      <h1 className="h1">{data.title}</h1>
      <p className="subtle mt-2">{new Date(data.date).toLocaleString()} · {data.venue} · {data.city}</p>
      {data.ticketUrl && (
        <a className="btn btn-primary mt-6 inline-flex" href={data.ticketUrl} target="_blank" rel="noreferrer">Buy Tickets</a>
      )}
      {data.description && (
        <div className="prose mt-8 max-w-none">
          {/* TODO: Render Portable Text blocks */}
        </div>
      )}
    </section>
  )
}
