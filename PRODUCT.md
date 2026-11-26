# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Primary: concert presenters, orchestra and festival managers, and artist agents who need to judge, in a few minutes, whether to engage Julia-Xiaozhuo Wang, then make contact. They arrive from a competition result, a programme, or a recommendation, usually on a desktop at work; some check again on a phone. Secondary: audiences and fans looking for upcoming concerts and recordings.

## Product Purpose
The official website of violinist Julia-Xiaozhuo Wang (born c. 2007, Shanghai, based in Vienna). It proves her standing (prizes, orchestras, conductors, festivals), lets visitors hear her play (YouTube performance videos), lists upcoming concerts, and routes booking and press inquiries to the contact form or email. Success: a presenter leaves knowing who she is, having heard her, and with an obvious way to write.

## Positioning
Her own words frame her playing as cinema: "I see images when I play—like a painting coming to life or a film where every note moves the story forward." The site can own that idea honestly; no other violinist's site can quote it.

## Operating Context
- Bilingual: English and German (`en`/`de` fields in every content file).
- Contact via a Netlify form named `contact` (name, email, subject, message, honeypot `bot-field`) plus a mailto address.
- Hosted on Netlify from the `master` branch of github.com/LChouRepo/julia_website.
- Content editing method may change (ruled 2026-11-26: the old Decap /admin backend is not binding). Content stays as JSON files in `content/`.

## Capabilities and Constraints
- Sections: home, about (biography in three parts plus prizes list), media (performance videos + photo gallery), concerts (upcoming / past), contact.
- Videos are YouTube links; no self-hosted audio or video exists.
- Concert entries in the repo today are test data; real upcoming dates are unknown. The site must look complete with zero upcoming concerts.

## Brand Commitments
- Name as written: Julia-Xiaozhuo Wang.
- Tagline (existing, en/de): "Playing the violin is translation — a direct, human language."
- Client requests from the "Website Instructions" doc in the resource pack (Drive folder 14imlwLx39RZm8o4pqr-GdbvwPrbos-RU, last edited 2026-02-07). Whether the redesign keeps the font asks is open (Leo to rule):
  - Fonts: "Julia Wang" wordmark in Lovechild; Cinzel for titles, Arial for body (asked 2026-01-24).
  - A Gallery page with all photos; higher photo quality; landing image larger.
  - Concerts image: landscape, a full auditorium with people seated.
  - Link out to Instagram (and other socials) instead of YouTube embeds in that spot; Julia's Instagram, email, Facebook.
  - On phones, nothing may cover her face (bars, bio text); no sidebar overlap on Mac/iPad.
  - "My Story" (not "Hello") as the home intro, 3–4 sentences.
  - No duplicate "Prizes & Recognition" text; the artist statement moves into the bio.

## Evidence on Hand
- Biography and prizes: `content/about.json` (Stuttgart 2024 youngest major prize winner, Cooper 2025 2nd prize, Grumiaux 2022 1st prize, Zhuhai Mozart 2023 top award, Wieniawski-Lipinski 2021 3rd prize, Dubai 2022 finalist, Szymanowski & Ernst 2021 2nd prize).
- Orchestras/conductors/festivals named in the bio: Stuttgart Philharmonic, Armenian State Symphony Orchestra, Salzburg Chamber Soloists; Ariel Zuckermann, Sergey Smbatyan; Armenian International Music Festival, Cervo festival, "Licht ins Dunkel" (ORF).
- Teachers/mentors: Alexander Pyankovsky, Dora Schwarzberg, Boris Kuschnir, Ana Chumachenco, Zakhar Bron, Leonidas Kavakos (DE text adds Christian Tetzlaff).
- Four performance videos (Tchaikovsky concerto, Ysaÿe Poème élégiaque, Mozart No. 4 Andante, Szymanowski sonata) in `content/releases/`.
- One studio photo shoot (blue gown and ivory gown, grey seamless backdrop), ~20 frames in `public/uploads`, `public/images`, `src/images`; photographer credit unknown.
- Resource pack (Drive, see Brand Commitments): German long bio (20260104), short bio, full repertoire list (concertos, sonatas, solo, virtuoso pieces), artist rider, Chinese CVs, the shoot photos plus a newer IMG_6032.JPG (2026-01) not yet in the repo.
- Absent, must not be invented: press quotes from outlets, reviews, real upcoming dates, recordings/labels, management agency.

## Product Principles
1. Hear her first: a video is never more than one click from anywhere.
2. Proof is specific: name the competition, year and placing, never "award-winning".
3. Contact is always one step away.
4. Empty is honest: with no upcoming concerts, say so gracefully and point to contact.
