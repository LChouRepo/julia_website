import * as F from "@/lib/data.fallback"
import {
  readSettings, readEvents, readReleases, readQuotes,
  readEventBySlug, readReleaseBySlug
} from "@/lib/content"
import { readAbout } from "@/lib/content";
import { readGallery } from "@/lib/content";

export async function getGallery() {
  const v = await readGallery();
  return v?.length ? v : [];
}

export async function getAbout() { return (await readAbout()) ?? null }

export async function getSettings()  { return (await readSettings()) ?? F.settings }
export async function getEvents()    { const v = await readEvents();   return v?.length ? v : F.events }
export async function getReleases()  { const v = await readReleases(); return v?.length ? v : F.releases }
export async function getQuotes()    { const v = await readQuotes();   return v?.length ? v : F.quotes }
export async function getEvent(slug: string)   { return (await readEventBySlug(slug))   ?? null }
export async function getRelease(slug: string) { return (await readReleaseBySlug(slug)) ?? null }
