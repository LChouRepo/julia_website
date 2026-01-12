export default function Releases({ releases = [] as any[], lang = "en" }: { releases?: any[]; lang?: "en" | "de" }) {
  return (
    <section id="media" className="section container">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="h2">Media & Releases</h2>
          <p className="subtle">Albums, videos, and press highlights.</p>
        </div>
      </div>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {releases.map((r) => {
          const cover = typeof r.cover === "string" && r.cover ? r.cover : undefined
          return (
            <div key={r.slug ?? r._id ?? (typeof r.title==="string"? r.title : JSON.stringify(r.title))} className="card overflow-hidden">
              <div className="grid gap-0 md:grid-cols-2">
                {cover && <img src={cover} alt={t(r.title, lang, "")} className="h-full w-full object-cover" />}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{t(r.title, lang, "")}</h3>
                  {r.subtitle && <p className="mt-1 text-sm text-gray-500">{t(r.subtitle, lang, "")}</p>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {r.links?.map((l: any, j: number) => (
                      <a key={j} className="btn btn-secondary text-sm" href={l.href} target="_blank" rel="noreferrer">
                        {t(l.label, lang, "")}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {releases.length === 0 && <div className="p-6 text-sm text-gray-500">No releases yet.</div>}
      </div>
    </section>
  )
}
