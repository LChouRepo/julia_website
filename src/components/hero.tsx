// src/components/hero.tsx
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export default function Hero({ settings, lang = "en" }: { settings: any; lang?: "en" | "de" }) {
  const bgUrl = settings?.heroImage || "/images/hero.jpg"
  return (
    <section id="hero" className="relative flex h-[90vh] items-center justify-center text-center text-white">
      <div className="absolute inset-0 -z-10 bg-cover bg-center" style={{ backgroundImage: `url(${bgUrl})` }} />
      <div className="absolute inset-0 -z-10 bg-black/50" />
      <div className="container">
        <h1 className="h1">{t(settings?.siteTitle, lang, "Julia-Xiaozhuo Wang")}</h1>
        <p className="mt-4 text-lg font-light text-gray-200">
          {t(settings?.tagline, lang, "Playing the violin is translation — a direct, human language.")}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a href="#events" className="btn btn-primary">Concerts</a>
          <a href="#contact" className="btn btn-secondary">Contact</a>
        </div>
      </div>
    </section>
  )
}
