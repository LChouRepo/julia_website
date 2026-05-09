"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import LanguageToggle from "@/components/LanguageToggle"

type Lang = "en" | "de"
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
  lang: Lang
  labels: Labels
}) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const lastPath = useRef(pathname)

  // Close drawer when route actually changes. Pathname is an external React
  // value, so reacting to it from an effect is the correct pattern here.
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false)
    }
  }, [pathname])

  // Lock body scroll when drawer is open (mobile/tablet only).
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  // Close drawer on Escape.
  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const items = [
    { href: "/about", label: labels.about },
    { href: "/concerts", label: labels.concerts },
    { href: "/media", label: labels.media },
    { href: "/contact", label: labels.contact },
  ]

  return (
    <>
      {/* ===== DESKTOP (xl+) fixed glass sidebar ===== */}
      <aside className="sidebar-desktop hidden xl:flex fixed inset-y-0 left-0 z-[60] w-72 flex-col bg-black/45 backdrop-blur-md border-r border-white/10 px-7 py-6 text-white">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-display text-xl tracking-wide hover:opacity-90">
            JULIA WANG
          </Link>
          <LanguageToggle initialLang={lang} />
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
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-[15px] font-display",
                  "text-white/90 hover:text-white",
                  "hover:bg-white/10",
                  active ? "bg-white/10 text-white" : "",
                ].join(" ")}
              >
                <span>{it.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto pt-6 text-xs text-white/60">© {new Date().getFullYear()} Julia Wang</div>
      </aside>

      {/* ===== TABLET + MOBILE (< xl): top bar + drawer ===== */}
      <div className="sidebar-touch xl:hidden">
        <div className="fixed left-0 top-0 z-[70] w-full bg-black/35 backdrop-blur-md border-b border-white/10 pt-[env(safe-area-inset-top)]">
          <div className="h-14 px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white/90 hover:bg-white/10"
                aria-label={lang === "de" ? "Menü öffnen" : "Open menu"}
                aria-expanded={open}
                aria-controls="site-drawer"
              >
                <span className="block h-[2px] w-5 bg-white/90 mb-1" />
                <span className="block h-[2px] w-5 bg-white/90 mb-1" />
                <span className="block h-[2px] w-5 bg-white/90" />
              </button>

              <Link href="/" className="font-display text-lg tracking-wide text-white hover:opacity-90">
                JULIA WANG
              </Link>
            </div>

            <LanguageToggle initialLang={lang} />
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
          id="site-drawer"
          className={[
            "fixed inset-y-0 left-0 z-[90] w-72 max-w-[85vw] bg-black/55 backdrop-blur-md border-r border-white/10",
            "transform transition-transform duration-200 pt-[env(safe-area-inset-top)]",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-label={lang === "de" ? "Navigation" : "Site navigation"}
          aria-hidden={!open}
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
                aria-label={lang === "de" ? "Menü schließen" : "Close menu"}
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
                    <span>{it.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="mt-8 text-xs text-white/60">© {new Date().getFullYear()} Julia Wang</div>
          </div>
        </aside>

        {/* Spacer so content doesn't sit under the top bar */}
        <div className="h-14" style={{ height: "calc(3.5rem + env(safe-area-inset-top))" }} />
      </div>
    </>
  )
}
