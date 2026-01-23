import Sidebar from "@/components/home/Sidebar"
import { getAbout } from "@/lib/cms"
import { getLang } from "@/lib/lang"
import { t } from "@/lib/i18n"
import { marked } from "marked"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const revalidate = 60

type BioSection = {
  text?: any
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
      <img src={src} alt="" className="w-full object-cover" />
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
    <main className="relative md:pl-64">
      <Sidebar />

      <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
        <h1 className="font-display text-3xl md:text-4xl tracking-[0.12em] uppercase text-neutral-900">
          {title}
        </h1>

        {/* subtle divider */}
        <div className="mt-6 h-px w-full bg-neutral-200" />

        {/* ===== Section 1 (top-left text) ===== */}
        <div className="mt-10 grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <article
            className="prose max-w-none prose-p:leading-relaxed prose-p:text-neutral-700"
            dangerouslySetInnerHTML={{ __html: s1Html || "<p>Coming soon.</p>" }}
          />
          <div className="md:pt-10">
            <ImageBlock src={s1.image} credit={s1.credit} />
          </div>
        </div>

        {/* ===== Section 2 (image left / text right-center like reference) ===== */}
        <div className="mt-14 grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="md:pr-10">
            <ImageBlock src={s2.image} credit={s2.credit} />
          </div>

          <article
            className="prose max-w-none prose-p:leading-relaxed prose-p:text-neutral-700 md:pl-8"
            dangerouslySetInnerHTML={{ __html: s2Html || "" }}
          />
        </div>

        {/* ===== Section 3 (bottom block centered like reference) ===== */}
        <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1fr]">
          <div className="hidden md:block" />
          <article
            className="prose max-w-none text-center prose-p:leading-relaxed prose-p:text-neutral-700 md:text-left"
            dangerouslySetInnerHTML={{ __html: s3Html || "" }}
          />
        </div>

        {/* Optional: Press kit */}
        {about?.pressKit ? (
          <div className="mt-14">
            <a
              href={about.pressKit}
              className="inline-flex rounded-full border px-5 py-2 text-sm font-semibold hover:bg-neutral-900 hover:text-white transition"
            >
              {lang === "de" ? "Pressemappe herunterladen" : "Download Press Kit"}
            </a>
          </div>
        ) : null}
      </section>
    </main>
  )
}
