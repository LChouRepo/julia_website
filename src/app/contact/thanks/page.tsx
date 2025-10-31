import Sidebar from "@/components/home/Sidebar"

export const runtime = "nodejs"

export default function ContactThanksPage() {
  return (
    <main className="relative md:pl-56">
      <Sidebar />
      <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">Thank you</h1>
        <p className="mt-4 text-neutral-700">
          Your message has been sent. We’ll get back to you shortly.
        </p>
        <a href="/" className="mt-8 inline-block rounded border px-4 py-2 text-sm font-semibold">
          Back to home
        </a>
      </section>
    </main>
  )
}
