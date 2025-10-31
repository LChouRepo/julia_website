
'use client'
// src/components/contact.tsx
export default function Contact({
  email,
  instagram,
  facebook,
}: {
  email?: string
  instagram?: string
  facebook?: string
}) {
  return (
    <section id="contact" className="section container">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="h2">Contact &amp; Representation</h2>
          <p className="mt-2 text-gray-600">
            For bookings, collaborations, or media inquiries, reach out via email or socials.
          </p>
          <div className="mt-6 space-y-2 text-sm">
            {email && (
              <div>
                Email:{" "}
                <a className="underline" href={`mailto:${email}`}>
                  {email}
                </a>
              </div>
            )}
            {instagram && (
              <div>
                Instagram:{" "}
                <a className="underline" href={instagram} target="_blank" rel="noreferrer">
                  {instagram}
                </a>
              </div>
            )}
            {facebook && (
              <div>
                Facebook:{" "}
                <a className="underline" href={facebook} target="_blank" rel="noreferrer">
                  {facebook}
                </a>
              </div>
            )}
          </div>
        </div>

    {/* Simple non-functional form placeholder */}
        <div className="card p-6">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="mb-1 block text-sm font-medium">Name</label>
              <input className="w-full rounded-2xl border p-2" placeholder="Your name" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input className="w-full rounded-2xl border p-2" type="email" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                className="w-full rounded-2xl border p-2"
                placeholder="Tell us a bit about your inquiry..."
                rows={5}
                required
              />
            </div>
            <button className="btn btn-primary w-full" type="submit">
              Send message
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
