import { MapPin, Ticket } from "lucide-react"

export default function EventsList({ events = [] as any[] }) {
  return (
    <div className="mt-8 divide-y card">
      {events.map((ev) => (
        <div key={ev._id} className="grid gap-4 p-5 sm:grid-cols-12 sm:items-center">
          <div className="sm:col-span-3">
            <div className="text-sm text-gray-500">{new Date(ev.date).toLocaleDateString()}</div>
            <div className="text-base font-medium">{ev.title}</div>
          </div>
          <div className="sm:col-span-6">
            <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4" /> {ev.venue}</div>
            <div className="text-sm text-gray-500">{ev.city}</div>
          </div>
          <div className="sm:col-span-3 sm:justify-self-end">
            {ev.ticketUrl && (
              <a className="btn btn-primary" href={ev.ticketUrl} target="_blank" rel="noreferrer">
                <Ticket className="h-4 w-4" /> Tickets
              </a>
            )}
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <div className="p-6 text-sm text-gray-500">No upcoming concerts posted yet.</div>
      )}
    </div>
  )
}
