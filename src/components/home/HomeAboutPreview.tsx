type Props = {
  html?: string
  image?: string
}

export default function HomeAboutPreview({ html, image }: Props) {
  return (
    <section id="about" className="relative isolate">
      {image ? (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
          aria-hidden
        />
      ) : null}
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <div className="mx-auto max-w-5xl px-4 py-20 text-white md:py-28">
        <h2 className="mb-4 text-3xl font-extrabold tracking-wide md:text-4xl">Hello!</h2>
        {html ? (
          <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <p className="max-w-2xl text-white/90">
            Short artist statement goes here. Use the CMS “Site Settings” or “About” content to update.
          </p>
        )}
        <a href="/about" className="mt-6 inline-block rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black">
          Official Biography
        </a>
      </div>
    </section>
  )
}
