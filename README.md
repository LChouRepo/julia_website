# juliaxiaozhuowang.com

Official website of violinist Julia-Xiaozhuo Wang. Static site built with Astro, deployed on Netlify.

## Run it

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # writes dist/
```

## Where things are

| What | Where |
|---|---|
| Text, photos, videos, concerts | `content/*.json` (edited through `/admin`) |
| Interface text (EN / DE) | `src/lib/i18n.js` |
| Pages | `src/views/*.astro` (one per page, renders EN or DE); routes in `src/pages/` and `src/pages/de/` |
| Look | `src/styles/site.css` |
| Motion, menu, form | `src/scripts/site.js` (GSAP, Lenis) |
| Violin drawing | `src/lib/violin.js` (outline traced from a CC0 photo, Wikimedia Commons "Violin VL100.png") |
| Editor config | `public/admin/config.yml` (Decap CMS, Netlify Identity) |

## Editing content

Log in at `/admin`. Every text has an English and a German field; an empty German field falls back to English.
Concerts appear on the Concerts page once their date is set; a past concert drops off at the next deploy.
The contact form is the Netlify form `contact`; messages arrive in the Netlify dashboard under Forms.
