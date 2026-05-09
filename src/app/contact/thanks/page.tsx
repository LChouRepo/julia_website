import Link from "next/link"
import Sidebar from "@/components/home/Sidebar"
import { getLang } from "@/lib/lang"

export const runtime = "nodejs"

export default async function ContactThanksPage() {
  const lang = await getLang()
  return (
    <main className="relative content-with-sidebar">
      <Sidebar />
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
          {lang === "de" ? "Danke" : "Thank you"}
        </h1>
        <p className="mt-4 text-neutral-700">
          {lang === "de"
            ? "Ihre Nachricht wurde gesendet. Wir melden uns in Kürze."
            : "Your message has been sent. We’ll get back to you shortly."}
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded border px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
        >
          {lang === "de" ? "Zur Startseite" : "Back to home"}
        </Link>
      </section>
    </main>
  )
}
