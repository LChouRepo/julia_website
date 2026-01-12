import { cookies } from "next/headers"

export type Lang = "en" | "de"
const COOKIE = "lang"

async function getCookieStore() {
  // Next 16 can type cookies() as Promise<ReadonlyRequestCookies>
  // Older types return ReadonlyRequestCookies directly.
  const store = cookies() as any
  return typeof store?.then === "function" ? await store : store
}

export async function getLang(): Promise<Lang> {
  const store = await getCookieStore()
  const v = store.get(COOKIE)?.value
  return v === "de" ? "de" : "en"
}

export async function getLangCookieValue(): Promise<string> {
  const store = await getCookieStore()
  return store.get(COOKIE)?.value ?? "en"
}
