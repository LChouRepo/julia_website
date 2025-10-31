export const eventsQuery = `*[_type == "event"] | order(date asc){ _id, title, date, venue, city, slug, ticketUrl }`
export const releasesQuery = `*[_type == "release"] | order(_createdAt desc){ _id, title, subtitle, cover, links, slug }`
export const quotesQuery = `*[_type == "quote"]{ _id, outlet, text }`
export const settingsQuery = `*[_type == "siteSettings"][0]{ siteTitle, tagline, heroImage, contactEmail, instagram, facebook }`

export const eventBySlugQuery = `*[_type == "event" && slug.current == $slug][0]{ _id, title, date, venue, city, ticketUrl, description }`
export const releaseBySlugQuery = `*[_type == "release" && slug.current == $slug][0]{ _id, title, subtitle, cover, links }`
