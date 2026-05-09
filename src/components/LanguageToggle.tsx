"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"

type Lang = "en" | "de"
const COOKIE = "lang"

function setLangCookie(value: Lang, days = 365) {
  const exp = new Date()
  exp.setDate(exp.getDate() + days)
  document.cookie = `${COOKIE}=${value}; expires=${exp.toUTCString()}; path=/; SameSite=Lax`
}

export default function LanguageToggle({ initialLang = "en" }: { initialLang?: Lang }) {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>(initialLang)
  const [isPending, startTransition] = useTransition()

  function switchLang(next: Lang) {
    if (next === lang || isPending) return
    setLangCookie(next)
    setLang(next)
    startTransition(() => router.refresh())
  }

  return (
    <div className="flex items-center gap-2" aria-busy={isPending}>
      {(["en", "de"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchLang(l)}
          className={`rounded-full border transition ${
            lang === l
              ? "border-white"
              : "border-white/30 opacity-60 hover:opacity-100"
          }`}
          aria-label={l === "en" ? "Switch to English" : "Auf Deutsch umschalten"}
          aria-pressed={lang === l}
        >
          <Image
            src={`/flags/${l}.png`}
            alt=""
            width={22}
            height={22}
            className="rounded-full"
          />
        </button>
      ))}
    </div>
  )
}
