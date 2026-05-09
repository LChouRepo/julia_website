import Sidebar from "@/components/home/Sidebar"
import { getSettings } from "@/lib/cms"
import { getLang } from "@/lib/lang"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

export default async function ContactPage() {
  const [lang, settings] = await Promise.all([getLang(), getSettings()])
  const contactImage = settings?.contactImage || "/images/contact.jpg"

  const copy = {
    title: lang === "de" ? "Kontakt" : "Contact",
    headline: lang === "de" ? "Für Buchungen & Medien" : "For bookings & media",
    blurb:
      lang === "de"
        ? "Für Konzertbuchungen, Kooperationen, Meisterklassen oder Presseanfragen nutzen Sie bitte das Formular oder schreiben Sie direkt."
        : "For concert bookings, collaborations, masterclasses, or press inquiries, please use the form or reach out directly.",
    tip:
      lang === "de"
        ? "Tipp: Bitte Wunschtermine, Veranstaltungsort und Programm angeben."
        : "Tip: include proposed dates, venue, and program if available.",
    nameLabel: lang === "de" ? "Ihr Name" : "Your name",
    emailLabel: lang === "de" ? "E-Mail" : "Email",
    subjectLabel: lang === "de" ? "Betreff" : "Subject",
    messageLabel: lang === "de" ? "Nachricht" : "Message",
    send: lang === "de" ? "Senden" : "Send",
    honeypotLabel:
      lang === "de"
        ? "Bitte nicht ausfüllen, wenn Sie ein Mensch sind:"
        : "Don’t fill this out if you’re human:",
  }

  return (
    <main className="relative content-with-sidebar">
      <Sidebar />

      {/* Banner */}
      <section className="relative min-h-[40vh]">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${contactImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-black/45" aria-hidden />
        <div className="container mx-auto flex min-h-[40vh] max-w-5xl items-center px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide text-white">
            {copy.title}
          </h1>
        </div>
      </section>

      {/* Details + Form */}
      <section className="container mx-auto max-w-5xl px-4 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-semibold">{copy.headline}</h2>
            <p className="mt-2 text-neutral-600">{copy.blurb}</p>

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

            <p className="mt-8 text-sm text-neutral-500">{copy.tip}</p>
          </div>

          <div className="rounded-xl border p-6">
            <form
              name="contact"
              method="POST"
              action="/contact/thanks"
              data-netlify="true"
              netlify-honeypot="bot-field"
              className="space-y-4"
            >
              <input type="hidden" name="form-name" value="contact" />

              {/* Honeypot */}
              <p className="hidden">
                <label htmlFor="contact-bot-field">
                  {copy.honeypotLabel}
                  <input id="contact-bot-field" name="bot-field" />
                </label>
              </p>

              <div>
                <label htmlFor="contact-name" className="block text-sm font-medium">
                  {copy.nameLabel}
                </label>
                <input
                  id="contact-name"
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="text"
                  name="name"
                  autoComplete="name"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium">
                  {copy.emailLabel}
                </label>
                <input
                  id="contact-email"
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium">
                  {copy.subjectLabel}
                </label>
                <input
                  id="contact-subject"
                  className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring"
                  type="text"
                  name="subject"
                />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium">
                  {copy.messageLabel}
                </label>
                <textarea
                  id="contact-message"
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
                {copy.send}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
