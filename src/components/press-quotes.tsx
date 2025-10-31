export default function PressQuotes({ quotes = [] as any[] }) {
  return (
    <section className="container">
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {quotes.map((q) => (
          <div key={q._id} className="card p-6">
            <div className="text-sm text-gray-500">{q.outlet}</div>
            <p className="mt-2 text-lg italic">“{q.text}”</p>
          </div>
        ))}
      </div>
    </section>
  )
}
