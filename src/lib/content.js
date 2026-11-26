// Content lives in /content as JSON (edited through /admin). Every field that differs by language is { en, de }.
const one = (m) => Object.values(m)[0]?.default ?? Object.values(m)[0]
const all = (m) => Object.entries(m).map(([path, mod]) => ({ slug: path.split('/').pop().replace(/\.json$/, ''), ...(mod.default ?? mod) }))

export const settings = one(import.meta.glob('../../content/settings.json', { eager: true }))
export const about = one(import.meta.glob('../../content/about.json', { eager: true }))
export const videos = all(import.meta.glob('../../content/releases/*.json', { eager: true })).sort((a, b) => (a.weight ?? 99) - (b.weight ?? 99))
export const photos = all(import.meta.glob('../../content/gallery/*.json', { eager: true })).sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (a.weight ?? 99) - (b.weight ?? 99))
const events = all(import.meta.glob('../../content/events/*.json', { eager: true })).filter(e => e.date).sort((a, b) => +new Date(a.date) - +new Date(b.date))
// built at deploy time: a concert moves to "past" on the next rebuild after its date
export const upcoming = events.filter(e => +new Date(e.date) >= Date.now() - 864e5)

/** pick the language, fall back to English, accept plain strings */
export const t = (v, lang) => (v == null ? '' : typeof v === 'string' ? v : v[lang] || v.en || '')
export const youtubeId = (url = '') => (url.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/) || [])[1]

/** pixel size of an image in /public, read from the file header at build time (JPEG or PNG), so the page knows each
    photo's shape before it loads. Returns {} when unknown; callers then fall back to the browser's own measuring. */
import { readFileSync } from 'node:fs'
export function imageSize (src = '') {
  try {
    const b = readFileSync(new URL('../../public' + decodeURI(src), import.meta.url))
    if (b[0] === 0x89 && b[1] === 0x50) return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) }
    for (let i = 2; i < b.length - 9;) {                       // JPEG: walk the segments to the frame header (SOF0–SOF15, not DHT/JPG/DAC)
      if (b[i] !== 0xff) { i++; continue }
      const m = b[i + 1], len = b.readUInt16BE(i + 2)
      if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5) }
      i += 2 + len
    }
  } catch {}
  return {}
}
