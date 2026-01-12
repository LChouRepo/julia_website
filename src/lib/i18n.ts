export type Lang = "en" | "de"
export type I18nText =
  | string
  | { en?: string; de?: string }
  | null
  | undefined

export function t(v: I18nText, lang: Lang, fallback = ""): string {
  if (!v) return fallback
  if (typeof v === "string") return v
  return (v[lang] ?? v.en ?? v.de ?? fallback) as string
}
