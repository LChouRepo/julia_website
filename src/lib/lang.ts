import { cookies } from "next/headers"

export type Lang = "en" | "de"

function isRequestScopeError(e: unknown) {
  return (
    e instanceof Error &&
    typeof e.message === "string" &&
    e.message.includes("outside a request scope")
  )
}

export async function getLang(): Promise<Lang> {
  try {
    const store = await cookies()
    const v = store.get("lang")?.value
    return v === "de" ? "de" : "en"
  } catch (e) {
    // During next build / collect page data, there is no request scope.
    // Default to English so the build can complete.
    if (isRequestScopeError(e)) return "en"
    throw e
  }
}
