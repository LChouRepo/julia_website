import Link from "next/link"
import LanguageToggle from "@/components/LanguageToggle"
import { getLang } from "@/lib/lang"

export default async function Sidebar() {
  const lang = await getLang()

  const labels = {
    about: lang === "de" ? "Biografie" : "About",
    concerts: lang === "de" ? "Konzerte" : "Concerts",
    media: lang === "de" ? "Medien" : "Media",
    contact: lang === "de" ? "Kontakt" : "Contact",
  }

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden sticky top-0 z-[70] bg-black/55 backdrop-blur border-b border-white/10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white tracking-wide hover:opacity-80">
              JULIA WANG
            </Link>
            <LanguageToggle />
          </div>

          {/* stack links vertically (fixes "all in one line") */}
          <nav className="mt-3 flex flex-col gap-2 text-white/90 text-sm">
            <Link href="/about" className="hover:text-white">{labels.about}</Link>
            <Link href="/concerts" className="hover:text-white">{labels.concerts}</Link>
            <Link href="/media" className="hover:text-white">{labels.media}</Link>
            <Link href="/contact" className="hover:text-white">{labels.contact}</Link>
          </nav>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-[60] w-56 flex-col bg-black/55 backdrop-blur border-r border-white/10 p-6 text-white">
        <div className="flex items-start justify-between gap-3">
          <Link href="/" className="text-xl font-extrabold tracking-wide hover:opacity-80">
            JULIA WANG
          </Link>
          <LanguageToggle />
        </div>

        <nav className="mt-6 flex flex-col gap-2 text-sm text-white/90">
          <Link href="/about" className="hover:text-white">{labels.about}</Link>
          <Link href="/concerts" className="hover:text-white">{labels.concerts}</Link>
          <Link href="/media" className="hover:text-white">{labels.media}</Link>
          <Link href="/contact" className="hover:text-white">{labels.contact}</Link>
        </nav>

        <div className="mt-auto pt-6 text-xs text-white/60">
          © {new Date().getFullYear()} Julia Wang
        </div>
      </aside>
    </>
  )
}
