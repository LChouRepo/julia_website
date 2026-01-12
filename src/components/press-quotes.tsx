export default function PressQuotes({ quotes = [] as any[], lang = "en" }: { quotes?: any[]; lang?: "en" | "de" }) {
  return (
    <section className="container">
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {quotes.map((q) => (
          <div key={q._id} className="card p-6">
            <div className="text-sm text-gray-500">{q.outlet}</div>
            <p className="mt-2 text-lg italic">“{t(q.text, lang, "")}”</p>
          </div>
        ))}
      </div>
    </section>
  )
}
