import Sidebar from "@/components/home/Sidebar"
import { getAbout } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t, type I18nText } from "@/lib/i18n"
import { marked } from "marked"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type BioSection = {
  text?: I18nText
  image?: string
  credit?: string
}

async function renderMarkdown(md: string) {
  return md ? await marked(md) : ""
}

function ImageBlock({ src, credit }: { src?: string; credit?: string }) {
  if (!src) return null
  return (
    <figure className="overflow-hidden rounded-2xl border bg-white/60 shadow-sm">
      {/* Source dimensions vary per CMS upload, so leave intrinsic ratio. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" loading="lazy" className="w-full object-cover" />
      {credit ? (
        <figcaption className="px-3 py-2 text-xs text-neutral-500">© {credit}</figcaption>
      ) : null}
    </figure>
  )
}

export default async function AboutPage() {
  const [lang, about] = await Promise.all([getLang(), getAbout()])

  const s1: BioSection = about?.section1 ?? {}
  const s2: BioSection = about?.section2 ?? {}
  const s3: BioSection = about?.section3 ?? {}

  const s1Html = await renderMarkdown(t(s1.text, lang, ""))
  const s2Html = await renderMarkdown(t(s2.text, lang, ""))
  const s3Html = await renderMarkdown(t(s3.text, lang, ""))

  const title = lang === "de" ? "Biografie" : "Biography"

  return (
    <main className="relative content-with-sidebar">
      <Sidebar />

      <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h1 className="font-display text-3xl md:text-4xl tracking-[0.12em] uppercase text-neutral-900">
          {title}
        </h1>

        <div className="mt-6 h-px w-full bg-neutral-200" />

        <div className="mt-10 grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <article className="max-w-prose text-[15px] leading-7 text-neutral-800">
            <div
              className="prose prose-neutral max-w-none prose-p:my-0 prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: s1Html }}
            />
          </article>

          <div className="md:justify-self-end w-full">
            <ImageBlock src={s1.image} credit={s1.credit} />
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div className="w-full">
            <ImageBlock src={s2.image} credit={s2.credit} />
          </div>

          <article className="max-w-prose text-[15px] leading-7 text-neutral-800 md:pl-10">
            <div
              className="prose prose-neutral max-w-none prose-p:my-0 prose-p:mb-6"
              dangerouslySetInnerHTML={{ __html: s2Html }}
            />
          </article>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <article className="max-w-prose text-left text-[15px] leading-7 text-neutral-800">
            <div
              className="prose prose-neutral max-w-none prose-ul:my-0 prose-li:my-2"
              dangerouslySetInnerHTML={{ __html: s3Html }}
            />
          </article>

          <div className="md:justify-self-end w-full">
            <ImageBlock src={s3.image} credit={s3.credit} />
          </div>
        </div>
      </section>
    </main>
  )
}
