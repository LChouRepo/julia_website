import * as F from '@/lib/data.fallback'
import { readSettings, readEvents, readReleases, readQuotes } from '@/lib/content'

export async function getSettings() {
  const data = await readSettings()
  return data ?? F.settings
}

export async function getEvents() {
  const list = await readEvents()
  return (list?.length ? list : F.events)
}

export async function getReleases() {
  const list = await readReleases()
  return (list?.length ? list : F.releases)
}

export async function getQuotes() {
  const list = await readQuotes()
  return (list?.length ? list : F.quotes)
}
