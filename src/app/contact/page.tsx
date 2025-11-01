import Sidebar from "@/components/home/Sidebar"
import { getSettings } from "@/lib/cms"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function ContactPage() {
  const settings = await getSettings()
  const contactImage = settings?.contactImage || "/images/contact.jpg"

  return (
    <main className="relative md:pl-56">
      <Sidebar />

      {/* Banner */}
      <section className="relative min-h-[40vh]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${contactImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />
        <div className="container mx-auto flex h-[40vh] max-w-5xl items-center px-4">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white">
            Contact
          </h1>
        </div>
      </section>

      {/* Details + Form */}
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          {/* Left: details */}
          <div>
            <h2 className="text-xl font-semibold">For bookings & media</h2>
            <p className="mt-2 text-neutral-600">
              For concert bookings, collaborations, masterclasses, or press inquiries, please use the form or reach out directly.
            </p>

            <div className="mt-6 space-y-2 text-sm">
              {settings?.contactEmail && (
                <div>
                  <span className="font-semibold">Email:</span>{" "}
                  <a className="underline" href={`mailto:${settings.contactEmail}`}>
                    {settings.contactEmail}
                  </a>
                </div>
              )}
              {settings?.instagram && (
                <div>
                  <span className="font-semibold">Instagram:</span>{" "}
                  <a className="underline" href={settings.instagram} target="_blank" rel="noreferrer">
                    {settings.instagram}
                  </a>
                </div>
              )}
              {settings?.facebook && (
                <div>
                  <span className="font-semibold">Facebook:</span>{" "}
                  <a className="underline" href={settings.facebook} target="_blank" rel="noreferrer">
                    {settings.facebook}
                  </a>
                </div>
              )}
            </div>

            <p className="mt-8 text-sm text-neutral-500">
              Tip: include proposed dates, venue, and program if available.
            </p>
          </div>

          {/* Right: Netlify form */}
          <div className="rounded-xl border p-6">
            {/* Netlify forms: name + hidden input + honeypot + data-netlify */}
            <form
              name="contact"
              method="POST"
              action="/contact/thanks"
              data-netlify="true"


              netlify-honeypot="bot-field"
              className="space-y-4"
            >
              {/* Netlify needs this hidden input to map to the form name */}
              <input type="hidden" name="form-name" value="contact" />
              {/* Honeypot field */}
              <p className="hidden">
                <label>
                  Don’t fill this out if you’re human:
                  <input name="bot-field" />
                </label>
              </p>

              <div>
                <label className="block text-sm font-medium">Your name</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="text"
                  name="name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="email"
                  name="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Subject</label>
                <input
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="text"
                  name="subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Message</label>
                <textarea
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  name="message"
                  rows={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md border px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
              >
                Send
              </button>
            </form>


          </div>
        </div>
      </section>
    </main>
  )
}
