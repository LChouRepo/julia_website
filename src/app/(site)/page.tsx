import Navbar from "@/components/navbar"
import Hero from "@/components/hero"
import EventsList from "@/components/events-list"
import About from "@/components/about"
import Releases from "@/components/releases"
import PressQuotes from "@/components/press-quotes"
import Contact from "@/components/contact"
import Footer from "@/components/footer"

import { getSettings, getEvents, getReleases, getQuotes } from "@/lib/cms"
import { getLang } from "@/lib/lang"

export const revalidate = 60

export default async function HomePage() {
  const [settings, events, releases, quotes] = await Promise.all([
    getSettings(),
    getEvents(),
    getReleases(),
    getQuotes(),
  ])

  return (
    <div>
      <Navbar siteTitle={t(settings?.siteTitle, lang, "Your Ensemble")} />
      <main>
        <Hero settings={settings} lang={lang} />
        <section id="events" className="section container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="h2">Upcoming Concerts</h2>
              <p className="subtle">Catch us on tour. New dates added regularly.</p>
            </div>
          </div>
          <EventsList events={events} lang={lang} />
        </section>
        <About />
        <Releases releases={releases} lang={lang} />
        <PressQuotes quotes={quotes} lang={lang} />
        <Contact email={settings?.contactEmail} instagram={settings?.instagram} facebook={settings?.facebook} />
      </main>
      <Footer siteTitle={t(settings?.siteTitle, lang, "")} />
    </div>
  )
}
