import { getRelease } from "@/lib/cms"

export const runtime = "nodejs"
export const revalidate = 60

export default async function ReleaseDetail({ params }: { params: { slug: string } }) {
  const data = await getRelease(params.slug)
  if (!data) return <section className="container section">Release not found.</section>

  return (
    <section className="container section">
      <div className="grid gap-8 md:grid-cols-2">
        {data.cover && <img className="w-full rounded-2xl border" src={data.cover} alt={data.title} />}
        <div>
          <h1 className="h1">{data.title}</h1>
          {data.subtitle && <p className="subtle mt-2">{data.subtitle}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {data.links?.map((l: any, i: number) => (
              <a key={i} className="btn btn-secondary" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
