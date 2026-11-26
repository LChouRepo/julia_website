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
