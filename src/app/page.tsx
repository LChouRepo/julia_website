import Sidebar from "@/components/home/Sidebar"
import HomeAboutPreview from "@/components/home/HomeAboutPreview"
import HomeConcertsPreview from "@/components/home/HomeConcerts"
import HomeMediaPreview from "@/components/home/HomeMedia"
import HomeContactPreview from "@/components/home/HomeContact"
import { getSettings, getEvents, getReleases, getQuotes } from "@/lib/cms"
import { getLang } from "@/lib/lang"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function HomePage() {
  const lang = await getLang()
  const [settings, events, releases, quotes] = await Promise.all([
    getSettings(),
    getEvents(),
    getReleases(),
    getQuotes(),
  ])

  const heroImage = settings?.heroImage || "/images/hero.jpg"
  const aboutHtml = settings?.aboutHtml || null

  return (
    <main className="relative">
      <Sidebar />

      {/* HERO — spans full width, the fixed sidebar overlays via translucent glass */}
      <section className="relative min-h-[100svh]">
        {heroImage ? (
          <div
            className="absolute inset-0 -z-10 bg-cover bg-no-repeat"
            style={{
              backgroundImage: `url(${heroImage})`,
              backgroundPosition: "50% 30%",
            }}
            aria-hidden
          />
        ) : (
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-neutral-700 to-neutral-900"
            aria-hidden
          />
        )}
        <div className="absolute inset-0 -z-10 bg-black/20" />

        <div className="mx-auto flex min-h-[100svh] items-center justify-center px-4">
          <div className="text-center text-white">
            <h1 className="font-display text-balance text-4xl tracking-wide sm:text-6xl lg:text-7xl">
              JULIA WANG
            </h1>
            <div className="font-display mt-8 flex justify-center gap-4">
              <a
                href="/concerts"
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition"
              >
                {lang === "de" ? "Konzerte" : "Concerts"}
              </a>
              <a
                href="/about"
                className="rounded-md border px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black transition"
              >
                {lang === "de" ? "Biografie" : "About"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* All non-hero sections respect the fixed sidebar at xl+ */}
      <div className="content-with-sidebar">
        <HomeAboutPreview
          html={aboutHtml ?? undefined}
          image={settings?.aboutImage || "/images/about.jpg"}
        />
        <HomeConcertsPreview
          events={events as Parameters<typeof HomeConcertsPreview>[0]["events"]}
          bgImage={settings?.concertsImage || "/images/concerts_bg.jpg"}
          lang={lang}
        />
        <HomeMediaPreview
          release={releases?.[0] as Parameters<typeof HomeMediaPreview>[0]["release"]}
          quotes={quotes as Parameters<typeof HomeMediaPreview>[0]["quotes"]}
          lang={lang}
        />
        <HomeContactPreview
          email={settings?.contactEmail}
          instagram={settings?.instagram}
          facebook={settings?.facebook}
          image={settings?.contactImage || "/images/contact.jpg"}
        />
      </div>
    </main>
  )
}
