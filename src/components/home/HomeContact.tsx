type Props = { email?: string; instagram?: string; facebook?: string; image?: string }

export default function HomeContactPreview({ email, instagram, facebook, image }: Props) {
  return (
    <section id="contact" className="relative isolate">
      {image ? <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} /> : null}
      <div className="absolute inset-0 -z-10 bg-black/60" />
      <div className="mx-auto max-w-5xl px-4 py-16 text-white md:py-24">
        <h2 className="text-3xl font-extrabold tracking-wide md:text-4xl">Stay Updated</h2>
        <div className="mt-4 space-y-3 text-white/90">
          {email && <div>Email: <a className="underline" href={`mailto:${email}`}>{email}</a></div>}
          <div className="flex gap-4">
            {instagram && <a className="underline" href={instagram} target="_blank" rel="noreferrer">Instagram</a>}
            {facebook && <a className="underline" href={facebook} target="_blank" rel="noreferrer">Facebook</a>}
          </div>
        </div>
        <a href="/contact" className="mt-6 inline-block rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black">
          Contact page
        </a>
      </div>
    </section>
  )
}
