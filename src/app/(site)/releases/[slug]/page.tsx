import { getRelease } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export const runtime = "nodejs"
export const revalidate = 60

export default async function ReleaseDetail({ params }: { params: { slug: string } }) {
  const [lang, data] = await Promise.all([getLang(), getRelease(params.slug)])
  if (!data) return <section className="container section">Release not found.</section>

  return (
    <section className="container section">
      <div className="grid gap-8 md:grid-cols-2">
        {data.cover && <img className="w-full rounded-2xl border" src={data.cover} alt={t(data.title, lang, "")} />}
        <div>
          <h1 className="h1">{t(data.title, lang, "")}</h1>
          {data.subtitle && <p className="subtle mt-2">{t(data.subtitle, lang, "")}</p>}
          <div className="mt-6 flex flex-wrap gap-2">
            {data.links?.map((l: any, i: number) => (
              <a key={i} className="btn btn-secondary" href={l.href} target="_blank" rel="noreferrer">
                {t(l.label, lang, "")}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
