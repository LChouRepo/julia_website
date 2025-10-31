import { sanityClient } from "@/lib/sanity.client"
import { releaseBySlugQuery } from "@/lib/queries"
import { urlFor } from "@/lib/sanity.image"

export const revalidate = 300

export default async function ReleaseDetail({ params }: { params: { slug: string } }) {
  const data = await sanityClient.fetch(releaseBySlugQuery, { slug: params.slug })
  if (!data) return <div className="container section">Release not found.</div>
  return (
    <section className="container section">
      <div className="grid gap-8 md:grid-cols-2">
        {data.cover && (
          <img className="w-full rounded-2xl border" src={urlFor(data.cover).width(1200).url()} alt={data.title} />
        )}
        <div>
          <h1 className="h1">{data.title}</h1>
          {data.subtitle && <p className="subtle mt-2">{data.subtitle}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {data.links?.map((l: any, i: number) => (
              <a key={i} className="btn btn-secondary" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
