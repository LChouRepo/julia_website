import Sidebar from "@/components/home/Sidebar"
import HomeAboutPreview from "@/components/home/HomeAboutPreview"
import HomeConcertsPreview from "@/components/home/HomeConcerts"
import HomeMediaPreview from "@/components/home/HomeMedia"
import HomeContactPreview from "@/components/home/HomeContact"
import { getSettings, getEvents, getReleases, getQuotes } from "@/lib/cms"

export const runtime = "nodejs"
export const revalidate = 60

export default async function HomePage() {
  const [settings, events, releases, quotes] = await Promise.all([
    getSettings(),
    getEvents(),
    getReleases(),
    getQuotes()
  ])

  const heroImage = settings?.heroImage || "/images/hero.jpg"
  const aboutHtml = settings?.aboutHtml || null

  return (
    <main className="relative">   
    {/* HERO */}
    <section className="relative min-h-[100svh] md:min-h-[100vh]">
      {/* Background image or fallback */}
      {heroImage ? (
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-700 to-neutral-900" aria-hidden />
      )}
      {/* Darken for legibility */}
      <div className="absolute inset-0 -z-10 bg-black/45" />

      <Sidebar />

      {/* Full-height centering wrapper */}
      <div className="mx-auto flex h-[100svh] max-w-none items-center justify-center px-4 md:h-[100vh]">
        <div className="text-center text-white">
          <h1 className="text-balance text-4xl font-extrabold tracking-wide sm:text-6xl lg:text-7xl">
            JULIA WANG
          </h1>
          <p className="mt-4 text-lg text-white/90">
            {settings?.tagline ?? "Violinist"}
          </p>
          <div className="mt-8 flex justify-center gap-4">
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
      <HomeConcertsPreview events={events as any} bgImage={settings?.concertsImage || "/images/concerts_bg.jpg"} />


      {/* MEDIA PREVIEW */}
      <HomeMediaPreview release={(releases?.[0] as any)} quotes={quotes as any} />

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
