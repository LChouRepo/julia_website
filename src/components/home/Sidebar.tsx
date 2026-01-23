import Link from "next/link"
import LanguageToggle from "@/components/LanguageToggle"
import { getLang } from "@/lib/lang"

const Note = () => <span className="mr-2 opacity-70">♪</span>

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
      {/* ================= MOBILE ================= */}
      <header className="md:hidden sticky top-0 z-[70] bg-black/60 backdrop-blur border-b border-white/10">
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3">
            <Link href="/" className="font-display text-white tracking-wide">
              JULIA WANG
            </Link>
            <div className="flex items-center gap-3">
              <LanguageToggle />
              <span className="text-white text-lg group-open:rotate-90 transition">
                ☰
              </span>
            </div>
          </summary>

          <nav className="px-4 pb-4 flex flex-col gap-2 text-white/90 text-sm">
            <Link href="/about"><Note />{labels.about}</Link>
            <Link href="/concerts"><Note />{labels.concerts}</Link>
            <Link href="/media"><Note />{labels.media}</Link>
            <Link href="/contact"><Note />{labels.contact}</Link>
          </nav>
        </details>
      </header>

      {/* ================= DESKTOP ================= */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-[60] w-64 flex-col bg-black/55 backdrop-blur border-r border-white/10 p-6 text-white">
        {/* <div className="flex items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg tracking-wide hover:opacity-80"
          >
            JULIA WANG
          </Link>
          
          <LanguageToggle />
        </div> */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-display text-lg tracking-wide hover:opacity-80 whitespace-nowrap"
          >
            JULIA WANG
          </Link>

          <div className="shrink-0">
            <LanguageToggle />
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-3 text-base text-white/90">
          <Link href="/about" className="hover:text-white py-1">
            <Note />{labels.about}
          </Link>
          <Link href="/concerts" className="hover:text-white py-1">
            <Note />{labels.concerts}
          </Link>
          <Link href="/media" className="hover:text-white py-1">
            <Note />{labels.media}
          </Link>
          <Link href="/contact" className="hover:text-white py-1">
            <Note />{labels.contact}
          </Link>
        </nav>

        <div className="mt-auto pt-6 text-xs text-white/60">
          © {new Date().getFullYear()} Julia Wang
        </div>
      </aside>
    </>
  )
}
