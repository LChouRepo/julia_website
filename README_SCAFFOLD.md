# julia_website – Viano-style site (Next.js + Sanity)

## 1) Prereqs
- Node 18+
- A Sanity project (get Project ID & Dataset in sanity.io/manage)
- `.env.local` from `.env.example`

## 2) Copy files
Unzip this scaffold into your repo root. It expects a **src/** layout created by `create-next-app`.

## 3) Install (if not already)
```bash
npm i sanity next-sanity @sanity/image-url lucide-react framer-motion class-variance-authority clsx tailwind-merge
```

## 4) Sanity Studio
Inside `/sanity`, run:
```bash
npm run studio
```
Create documents:
- siteSettings (siteTitle, tagline, heroImage, contactEmail, instagram, facebook)
- events
- releases
- quotes

## 5) Run the site
```bash
npm run dev
```

## 6) Optional: ISR Revalidate Webhook
Add a webhook in Sanity pointing to:
```
POST https://your-domain.com/api/revalidate?secret=REVALIDATE_SECRET
```
