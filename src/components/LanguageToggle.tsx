"use client"

import { useEffect, useState } from "react"

type Lang = "en" | "de"
const COOKIE = "lang"

function getCookie(name: string) {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"))
  return m ? decodeURIComponent(m[2]) : null
}

function setCookie(name: string, value: string, days = 365) {
  const exp = new Date()
  exp.setDate(exp.getDate() + days)
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${exp.toUTCString()}; path=/; SameSite=Lax`
}

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    const v = (getCookie(COOKIE) as Lang) || "en"
    setLang(v === "de" ? "de" : "en")
  }, [])

  function toggle() {
    const next: Lang = lang === "en" ? "de" : "en"
    setCookie(COOKIE, next)
    setLang(next)
    // simplest: full refresh so all server components pick up cookie
    window.location.reload()
  }

  return (
    <button
      onClick={toggle}
      className="rounded-md border border-white/40 bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20"
      aria-label="Switch language"
      title="Switch language"
      type="button"
    >
      {lang === "en" ? "EN → DE" : "DE → EN"}
    </button>
  )
}
