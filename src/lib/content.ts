// src/lib/content.ts
import fs from "fs/promises"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"

const CONTENT_DIR = path.join(process.cwd(), "content")

// ---- helpers ----
async function readJson<T = unknown>(absPath: string): Promise<T | null> {
  try {
    const raw = await fs.readFile(absPath, "utf-8")
    return JSON.parse(raw) as T
  } catch (e) {
    console.warn("[content] invalid JSON, skipping:", absPath, e)
    return null
  }
}

async function readDirSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir)
  } catch {
    return []
  }
}

// ---- SETTINGS ----
type I18nText = string | { en?: string; de?: string }

export type SiteSettings = {
  siteTitle?: I18nText
  tagline?: I18nText
  homeHello?: I18nText
  contactEmail?: string
  instagram?: string
  facebook?: string
  heroImage?: string
  aboutImage?: string
  aboutHtml?: string
  concertsImage?: string
  contactImage?: string
  galleryHero?: string
}

export async function readSettings(): Promise<SiteSettings | null> {
  noStore()
  const file = path.join(CONTENT_DIR, "settings.json")
  return await readJson<SiteSettings>(file)
}

// ---- ABOUT (Official Biography) ----
export type AboutBioSection = {
  text?: string
  image?: string
  credit?: string
}

export type About = {
  section1?: AboutBioSection
  section2?: AboutBioSection
  section3?: AboutBioSection

  bioShort?: string
  bioLong?: string
  headshots?: { src: string; alt?: string; credit?: string }[]
  pressKit?: string
}

export async function readAbout(): Promise<About | null> {
  noStore()
  const file = path.join(CONTENT_DIR, "about.json")
  return await readJson<About>(file)
}

// ---- EVENTS ----
type EventItem = {
  title: string
  date: string
  venue?: string
  city?: string
  ticketUrl?: string
  slug?: string
}

export async function readEvents(): Promise<EventItem[]> {
  noStore()
  const dir = path.join(CONTENT_DIR, "events")
  const files = (await readDirSafe(dir)).filter((f) => f.toLowerCase().endsWith(".json"))

  const items = await Promise.all(
    files.map(async (f) => {
      const abs = path.join(dir, f)
      const obj = await readJson<EventItem>(abs)
      if (!obj) return null

      if (!obj.slug) {
        obj.slug = f.replace(/\.json$/i, "")
      }
      return obj
    }),
  )

  const events = (items.filter(Boolean) as EventItem[])
    .filter((e) => e?.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  if (process.env.NODE_ENV !== "production") {
    console.log("[content] events:", events.map((e) => `${e.title} @ ${e.date}`))
  }
  return events
}

export async function readEventBySlug(slug: string) {
  noStore()
  const file = path.join(CONTENT_DIR, "events", `${slug}.json`)
  return await readJson<EventItem>(file)
}

// ---- RELEASES ----
type ReleaseItem = {
  title: string
  subtitle?: string
  cover?: string
  links?: { label: string; href: string }[]
  slug?: string
}

export async function readReleases(): Promise<ReleaseItem[]> {
  noStore()
  const dir = path.join(CONTENT_DIR, "releases")
  const files = (await readDirSafe(dir)).filter((f) => f.toLowerCase().endsWith(".json"))

  const items = await Promise.all(
    files.map(async (f) => {
      const abs = path.join(dir, f)
      const obj = await readJson<ReleaseItem>(abs)
      if (!obj) return null
      if (!obj.slug) obj.slug = f.replace(/\.json$/i, "")
      return obj
    }),
  )

  return items.filter(Boolean) as ReleaseItem[]
}

export async function readReleaseBySlug(slug: string) {
  noStore()
  const file = path.join(CONTENT_DIR, "releases", `${slug}.json`)
  return await readJson<ReleaseItem>(file)
}

// ---- QUOTES ----
type QuoteItem = { outlet: string; text: string }

export async function readQuotes(): Promise<QuoteItem[]> {
  noStore()
  const dir = path.join(CONTENT_DIR, "quotes")
  const files = (await readDirSafe(dir)).filter((f) => f.toLowerCase().endsWith(".json"))
  const items = await Promise.all(files.map((f) => readJson<QuoteItem>(path.join(dir, f))))
  return items.filter(Boolean) as QuoteItem[]
}

// ---- GALLERY ----
type GalleryItem = {
  title?: { en?: string; de?: string }
  image: string
  credit?: string
  weight?: number
  featured?: boolean
}

export async function readGallery(): Promise<GalleryItem[]> {
  noStore()
  const dir = path.join(CONTENT_DIR, "gallery")
  const files = (await readDirSafe(dir)).filter((f) => f.toLowerCase().endsWith(".json"))

  const items = await Promise.all(
    files.map(async (f) => {
      const abs = path.join(dir, f)
      return await readJson<GalleryItem>(abs)
    }),
  )

  return (items.filter(Boolean) as GalleryItem[]).sort(
    (a, b) => (a.weight ?? 9999) - (b.weight ?? 9999),
  )
}
