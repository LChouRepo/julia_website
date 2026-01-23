"use client"

import Image from "next/image"
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
  document.cookie = `${name}=${value}; expires=${exp.toUTCString()}; path=/; SameSite=Lax`
}

export default function LanguageToggle() {
  const [lang, setLang] = useState<Lang>("en")

  useEffect(() => {
    const v = (getCookie(COOKIE) as Lang) || "en"
    setLang(v === "de" ? "de" : "en")
  }, [])

  function switchLang(next: Lang) {
    if (next === lang) return
    setCookie(COOKIE, next)
    window.location.reload()
  }

  return (
    <div className="flex items-center gap-2">
      {(["en", "de"] as Lang[]).map(l => (
        <button
          key={l}
          onClick={() => switchLang(l)}
          className={`rounded-full border transition ${
            lang === l
              ? "border-white"
              : "border-white/30 opacity-60 hover:opacity-100"
          }`}
          aria-label={`Switch to ${l}`}
        >
          <Image
            src={`/flags/${l}.png`}
            alt={l}
            width={22}
            height={22}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  )
}
