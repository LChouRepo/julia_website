import Sidebar from "@/components/home/Sidebar"
import HomeAboutPreview from "@/components/home/HomeAboutPreview"
import HomeConcertsPreview from "@/components/home/HomeConcerts"
import HomeMediaPreview from "@/components/home/HomeMedia"
import HomeContactPreview from "@/components/home/HomeContact"
import { getSettings, getEvents, getReleases, getQuotes } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"
export const runtime = "nodejs"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  const lang = await getLang()
  const [settings, events, releases, quotes] = await Promise.all([
    getSettings(),
    getEvents(),
    getReleases(),
    getQuotes()
  ])

  const heroImage = settings?.heroImage || "/images/hero.jpg"
  const aboutHtml = settings?.aboutHtml || null

  return (
    <main className="relative ">   
    {/* HERO */}
<section className="relative min-h-[100svh] md:min-h-[100vh]">
  {heroImage ? (
    <>
      {/* Mobile background */}
      <div
        className="absolute inset-0 -z-10 bg-cover md:hidden"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "50% 12%", // mobile: center on face/upper body
        }}
        aria-hidden
      />

      {/* Desktop background */}
      <div
        className="absolute inset-0 -z-10 hidden bg-cover md:block"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: "60% 10%", // desktop: your preferred focal point
        }}
        aria-hidden
      />
    </>
  ) : (
    <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-700 to-neutral-900" aria-hidden />
  )}
      {/* Darken for legibility */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <Sidebar />

      {/* Full-height centering wrapper */}
      <div className="mx-auto flex h-[100svh] max-w-none items-center justify-center px-4 md:h-[100vh]">
        <div className="text-center text-white">
          <h1 className="font-display text-balance text-4xl tracking-wide sm:text-6xl lg:text-7xl">
            JULIA WANG
          </h1>
          <p className="italic mt-4 text-lg text-white/90">
            {t(settings?.tagline, lang, "Violinist")}
          </p>
          <div className="font-display mt-8 flex justify-center gap-4">
            <a href="#concerts" className="rounded-md border px-4 py-2 text-sm font-semibold">
              Concerts
            </a>
            <a href="#about" className="rounded-md border px-4 py-2 text-sm font-semibold">
              About
            </a>
          </div>
        </div>
      </div>
    </section>



      {/* ABOUT PREVIEW */}
      <HomeAboutPreview html={aboutHtml ?? undefined} image={settings?.aboutImage|| "/images/about.jpg"} />

      {/* CONCERTS PREVIEW */}
      <HomeConcertsPreview events={events as any} bgImage={settings?.concertsImage || "/images/concerts_bg.jpg"} lang={lang} />


      {/* MEDIA PREVIEW */}
      <HomeMediaPreview release={(releases?.[0] as any)} quotes={quotes as any} lang={lang} />

      {/* CONTACT PREVIEW */}
      <HomeContactPreview
        email={settings?.contactEmail}
        instagram={settings?.instagram}
        facebook={settings?.facebook}
        image={settings?.contactImage || "/images/contact.jpg"}
      />
    </main>
  )
}
