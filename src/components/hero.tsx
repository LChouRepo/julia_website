// src/components/hero.tsx
import { urlFor } from "@/lib/sanity.image"

export default function Hero({ settings }: { settings: any }) {
  const bgUrl = settings?.heroImage
    ? urlFor(settings.heroImage).width(1600).url()
    : "/images/hero.jpg"

  return (
    <section
      id="hero"
      className="relative flex h-[90vh] items-center justify-center text-center text-white"
    >
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgUrl})` }}
        aria-hidden
      />
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="container">
        <h1 className="h1">{settings?.siteTitle || "Julia-Xiaozhuo Wang"}</h1>
        <p className="mt-4 text-lg font-light text-gray-200">
          {settings?.tagline ||
            "Playing the violin is translation — a direct, human language."}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="#events" className="btn btn-primary">
            Concerts
          </a>
          <a href="#contact" className="btn btn-secondary">
            Contact
          </a>
        </div>
      </div>
    </section>
  )
}
