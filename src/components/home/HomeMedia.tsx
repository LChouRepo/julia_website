type Release = { title: string; subtitle?: string; cover?: string; links?: {label:string; href:string}[]; slug?: string }
type Quote = { outlet: string; text: string }

export default function HomeMediaPreview({ release, quotes = [] as Quote[] }: { release?: Release, quotes?: Quote[] }) {
  return (
    <section id="media" className="bg-rose-700 text-white">
      <div className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <h2 className="mb-8 text-3xl font-extrabold tracking-wide md:text-4xl">Portraits</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-white/20 p-4 md:p-6">
            {release?.cover && (
              <img src={release.cover} alt={release.title} className="mb-4 w-full rounded-lg object-cover" />
            )}
            <h3 className="text-xl font-semibold">{release?.title ?? 'Featured release'}</h3>
            {release?.subtitle && <p className="mt-1 text-sm text-white/80">{release.subtitle}</p>}
            <div className="mt-4 flex flex-wrap gap-2">
              {release?.links?.map((l,i)=> (
                <a key={i} className="rounded border border-white/40 px-3 py-1 text-sm hover:bg-white hover:text-black" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
              ))}
            </div>
          </div>
          <div className="grid place-items-center">
            <div className="grid max-w-xl gap-6 text-center">
              {quotes.slice(0,5).map((q,i)=>(
                <blockquote key={i} className="text-lg leading-relaxed text-white/90">“{q.text}” <span className="block text-sm text-white/70 mt-1">— {q.outlet}</span></blockquote>
              ))}
            </div>
          </div>
        </div>
        <a href="/media" className="mt-10 inline-block rounded-md border px-4 py-2 text-sm font-semibold">More media</a>
      </div>
    </section>
  )
}
