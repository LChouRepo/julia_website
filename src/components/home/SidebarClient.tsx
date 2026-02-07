"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import LanguageToggle from "@/components/LanguageToggle"

type Labels = {
  about: string
  concerts: string
  media: string
  contact: string
}

export default function SidebarClient({
  lang,
  labels,
}: {
  lang: "en" | "de"
  labels: Labels
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // close drawer on route change
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const items = [
    { href: "/about", label: labels.about },
    { href: "/concerts", label: labels.concerts },
    { href: "/media", label: labels.media },
    { href: "/contact", label: labels.contact },
  ]

  return (
    <>
      {/* ===== DESKTOP (xl+) fixed glass sidebar ===== */}
      <aside className="hidden xl:flex fixed inset-y-0 left-0 z-[60] w-72 flex-col bg-black/45 backdrop-blur-md border-r border-white/10 px-7 py-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-display text-xl tracking-wide hover:opacity-90">
            JULIA WANG
          </Link>
          <LanguageToggle />
        </div>

        <div className="mt-4 h-px w-full bg-white/10" />

        <nav className="mt-5 flex flex-col gap-1">
          {items.map((it) => {
            const active = pathname === it.href
            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold",
                  "text-white/90 hover:text-white",
                  "hover:bg-white/10",
                  active ? "bg-white/10 text-white" : "",
                ].join(" ")}
              >
                <span className="opacity-80">♪</span>
                <span>{it.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 text-xs text-white/60">© {new Date().getFullYear()} Julia Wang</div>
      </aside>

      {/* ===== TABLET + MOBILE (< xl): left drawer, glass look ===== */}
      <div className="xl:hidden">
        {/* Left “rail” (shows on tablet/phone) */}
        <div className="fixed left-0 top-0 z-[70] h-14 w-full bg-black/35 backdrop-blur-md border-b border-white/10">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                aria-label="Open menu"
              >
                {/* simple hamburger */}
                <span className="block h-[2px] w-5 bg-white/90 mb-1" />
                <span className="block h-[2px] w-5 bg-white/90 mb-1" />
                <span className="block h-[2px] w-5 bg-white/90" />
              </button>

              <Link href="/" className="font-display text-lg tracking-wide text-white hover:opacity-90">
                JULIA WANG
              </Link>
            </div>

            <LanguageToggle />
          </div>
        </div>

        {/* Overlay */}
        <div
          className={[
            "fixed inset-0 z-[80] bg-black/50 transition-opacity",
            open ? "opacity-100" : "pointer-events-none opacity-0",
          ].join(" ")}
          onClick={() => setOpen(false)}
          aria-hidden
        />

        {/* Drawer */}
        <aside
          className={[
            "fixed inset-y-0 left-0 z-[90] w-72 bg-black/55 backdrop-blur-md border-r border-white/10",
            "transform transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-label="Site navigation"
        >
          <div className="px-6 py-6 text-white">
            <div className="flex items-center justify-between gap-3">
              <Link href="/" className="font-display text-xl tracking-wide hover:opacity-90">
                JULIA WANG
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 h-px w-full bg-white/10" />

            <nav className="mt-5 flex flex-col gap-1">
              {items.map((it) => {
                const active = pathname === it.href
                return (
                  <Link
                    key={it.href}
                    href={it.href}
                    className={[
                      "group flex items-center gap-3 rounded-xl px-3 py-2 text-[16px] font-semibold",
                      "text-white/90 hover:text-white",
                      "hover:bg-white/10",
                      active ? "bg-white/10 text-white" : "",
                    ].join(" ")}
                  >
                    <span className="opacity-80">♪</span>
                    <span>{it.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 text-xs text-white/60">© {new Date().getFullYear()} Julia Wang</div>
          </div>
        </aside>

        {/* Spacer so content doesn't sit under the top bar */}
        <div className="h-14" />
      </div>
    </>
  )
}
