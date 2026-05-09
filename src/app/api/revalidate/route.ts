import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

export const runtime = "nodejs"

const PATHS_TO_REFRESH = [
  "/",
  "/about",
  "/concerts",
  "/contact",
  "/media",
]

export async function POST(req: NextRequest) {
  const expected = process.env.REVALIDATE_SECRET
  const provided = req.nextUrl.searchParams.get("secret")

  if (!expected || provided !== expected) {
    return NextResponse.json(
      { revalidated: false, message: "Invalid secret" },
      { status: 401 },
    )
  }

  for (const p of PATHS_TO_REFRESH) revalidatePath(p)
  revalidatePath("/events/[slug]", "page")
  revalidatePath("/releases/[slug]", "page")

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
