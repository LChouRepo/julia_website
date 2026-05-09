import Image from "next/image"
import Sidebar from "@/components/home/Sidebar"
import { getRelease } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type ReleaseLink = { label: string | { en?: string; de?: string }; href: string }

export default async function ReleaseDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [lang, data] = await Promise.all([getLang(), getRelease(slug)])

  if (!data) {
    return (
      <main className="relative content-with-sidebar">
        <Sidebar />
        <section className="container mx-auto max-w-3xl px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
            {lang === "de" ? "Veröffentlichung nicht gefunden" : "Release not found"}
          </h1>
        </section>
      </main>
    )
  }

  const links = Array.isArray(data.links) ? (data.links as ReleaseLink[]) : []

  return (
    <main className="relative content-with-sidebar">
      <Sidebar />
      <section className="container mx-auto max-w-5xl px-4 py-16 md:py-24">
        <div className="grid gap-8 md:grid-cols-2">
          {data.cover && (
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-neutral-50">
              <Image
                src={data.cover}
                alt={t(data.title, lang, "")}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-wide">
              {t(data.title, lang, "")}
            </h1>
            {data.subtitle && (
              <p className="mt-3 text-neutral-600">{t(data.subtitle, lang, "")}</p>
            )}
            {links.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {links.map((l, i) => (
                  <a
                    key={i}
                    className="rounded border px-3 py-1 text-sm hover:bg-neutral-50"
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(l.label, lang, "")}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
