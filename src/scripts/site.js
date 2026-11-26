// Client behaviour for every page. Everything here is enhancement: the pages read and work without it.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
const screenLen = el => el.getTotalLength() * el.getScreenCTM().a + 2  // non-scaling strokes measure dashes on screen
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)]

const lenis = reduce ? null : new Lenis({ lerp: .09 })
if (lenis) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0) }

/* phone menu: the pegbox, four pegs = four pages */
const menu = $('#headmenu'), btn = $('nav .menu')
const setMenu = open => { menu.classList.toggle('open', open); $$('main, footer').forEach(el => { el.inert = open }); btn.setAttribute('aria-expanded', String(open)); open ? lenis?.stop() : lenis?.start(); if (open) $('.hm-list a', menu)?.focus() }
btn?.addEventListener('click', () => setMenu(true))
$('.x', menu)?.addEventListener('click', () => { setMenu(false); btn.focus() })
addEventListener('keydown', e => { if (e.key === 'Escape' && menu.classList.contains('open')) { setMenu(false); btn.focus() } })

/* prints: the paper veil lifts when the photograph comes into view */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('developed'); io.unobserve(e.target) } }), { rootMargin: '0px 0px -8% 0px' })
$$('.print').forEach(p => io.observe(p))

/* concerts: a concert drops off the list the day after it happened, even before the next deploy */
const events = $$('.event[data-date]')
if (events.length) {
  events.filter(e => +new Date(e.dataset.date) < Date.now() - 864e5).forEach(e => e.parentNode.removeChild(e))
  if (!$$('.event').length) $('#events .empty')?.removeAttribute('hidden')
}

/* media: YouTube loads only when asked; gallery opens large */
$$('.frame[data-yt] .play').forEach(a => a.addEventListener('click', e => {
  const f = a.closest('.frame'); if (!f.dataset.yt) return
  e.preventDefault()
  const fr = document.createElement('iframe')
  fr.src = `https://www.youtube-nocookie.com/embed/${f.dataset.yt}?autoplay=1`; fr.title = a.getAttribute('aria-label')
  fr.allow = 'autoplay; encrypted-media; picture-in-picture'; fr.allowFullscreen = true
  f.replaceChildren(fr); fr.focus()
}))
const lb = $('dialog.lb')
if (lb) {
  $$('.gallery .photo').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); $('img', lb)?.remove()
    const im = new Image(); im.src = a.dataset.full; im.alt = $('img', a).alt; lb.prepend(im); lb.showModal(); lenis?.stop()
  }))
  lb.addEventListener('click', () => lb.close())
  lb.addEventListener('close', () => lenis?.start())
}

/* contact: post to Netlify Forms, show the thank-you state in place */
const form = $('form.booking')
if (form) {
  const err = $('.err', form), sent = $('.sent')
  form.setAttribute('novalidate', '')
  form.addEventListener('submit', async e => {
    e.preventDefault(); err.textContent = ''
    const bad = $$('[required]', form).find(i => !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value)))
    if (bad) { err.textContent = bad.type === 'email' ? form.dataset.errMail : form.dataset.errField.replace('{f}', bad.closest('label').firstChild.textContent.trim()); bad.focus(); return }
    const b = $('button', form), label = b.textContent; b.disabled = true; b.textContent = form.dataset.sending
    try {
      const r = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(form)).toString() })
      if (!r.ok) throw new Error(String(r.status))
      form.hidden = true; sent.style.display = 'block'; $('h3', sent)?.focus()
    } catch { err.textContent = form.dataset.errSend; b.disabled = false; b.textContent = label }
  })
}

/* header staff: treble clef, five lines, and the violin's four open strings (G3 D4 A4 E5) as whole notes under their pages */
const navStaff = $('nav .nav-staff'), GAP = 4, TOP = 9, BOTTOM = TOP + 4 * GAP
const STEP = { G: -5, D: -1, A: 3, E: 7 }                     // half-spaces above the bottom line (E4)
const staffY = st => BOTTOM - st * GAP / 2
let staffX = [0, 0]
function drawStaff () {
  if (!navStaff || innerWidth <= 860) return
  // the staff runs under the four page links only, clef at its left end
  const nav = navStaff.parentNode.getBoundingClientRect(), ls = $$('nav .links a').map(a => a.getBoundingClientRect())
  staffX = [ls[0].left - nav.left - 34, ls[ls.length - 1].right - nav.left + 10]
  let h = `<text x="${staffX[0] + 2}" y="${staffY(2) + 1}">\u{1D11E}</text>`
  for (let i = 0; i < 5; i++) h += `<line class="sl" x1="${staffX[0]}" x2="${staffX[1]}" y1="${TOP + i * GAP}" y2="${TOP + i * GAP}"/>`
  $$('nav .links a[data-string]').forEach(a => {
    const r = $('.peg', a)?.getBoundingClientRect() || a.getBoundingClientRect(), x = r.left + r.width / 2 - nav.left, st = STEP[a.dataset.string], y = staffY(st)
    let g = ''
    for (let l = -2; l >= st; l -= 2) g += `<line class="ledger" x1="${x - 7}" x2="${x + 7}" y1="${staffY(l)}" y2="${staffY(l)}"/>`  // ledger lines below the staff
    g += `<ellipse class="nt${a.getAttribute('aria-current') ? ' here' : ''}" cx="${x}" cy="${y}" rx="3.6" ry="2.5" transform="rotate(-22 ${x} ${y})"/>`
    h += `<g class="note">${g}</g>`
  })
  navStaff.innerHTML = h
}
drawStaff(); document.fonts?.ready.then(drawStaff); addEventListener('resize', drawStaff)

/* motion: each block enters the way its material would; one scroll-driven narrative on About */
gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
  const once = (el, tl) => ScrollTrigger.create({ trigger: el, start: 'top 82%', once: true, onEnter: () => tl.play() })

  // home: the ink violin draws itself, then its pegs lead out to the pages
  const tdraw = $('#tdraw')
  if (tdraw && document.documentElement.classList.contains('intro')) landingIntro(tdraw)
  else if (tdraw) {
    const ink = $('.ink', tdraw), L = screenLen(ink)
    gsap.set(ink, { strokeDasharray: L, strokeDashoffset: L }); gsap.set([$('.cav', tdraw), ...$$('.call', tdraw)], { opacity: 0 })
    gsap.timeline({ delay: .15 })
      .from('.table .t-text > *', { opacity: 0, y: 20, duration: .7, stagger: .08, ease: 'power3.out' }, 0)
      .to(ink, { strokeDashoffset: 0, duration: 2.6, ease: 'power1.inOut' }, 0)
      .to($('.cav', tdraw), { opacity: 1, duration: .4 }, 1.8)
      .to($$('.call', tdraw), { opacity: 1, duration: .5, stagger: .12 }, 2.3)
  }

  // titles rise out of a mask, line by line
  $$('.pagehead h1, .band h2, .plate h2, .letter h2, .darkroom h2').forEach(h => {
    h.innerHTML = h.innerHTML.split(/<br\s*\/?>/).map(l => `<span class="ln"><span>${l}</span></span>`).join('')
    const tl = gsap.timeline({ paused: true }).from($$('.ln > span', h), { yPercent: 105, duration: .8, stagger: .08, ease: 'power4.out' })
    if (h.closest('.pagehead')) tl.play(.1); else once(h, tl)
  })
  gsap.from('.pagehead .k, .pagehead p', { y: 14, opacity: 0, duration: .7, stagger: .1, delay: .25, ease: 'power3.out' })

  // paper settles onto the table
  $$('[data-in="paper"]').forEach(g => once(g, gsap.timeline({ paused: true })
    .fromTo(g.querySelector('.gcol') ? $$('.photo', g) : g.children, { y: -40, rotation: i => (i % 2 ? 5 : -5), opacity: 0 },   // gallery: the prints drop, not whole columns
      { y: 0, rotation: 0, opacity: 1, duration: .75, stagger: .07, ease: 'back.out(1.6)', clearProps: 'transform,opacity' })))   // then hand the tilt back to the stylesheet
  $$('.prose .print, .direct .print').forEach(p => once(p, gsap.timeline({ paused: true })
    .from(p, { y: -36, rotation: '+=6', opacity: 0, duration: .8, ease: 'back.out(1.5)' })))

  // video covers open from the left
  $$('.video .frame, .hall').forEach((f, i) => once(f, gsap.timeline({ paused: true, delay: (i % 2) * .08 })
    .fromTo(f, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: .9, ease: 'power3.inOut' })
    .from($('img', f), { scale: 1.08, duration: 1.1, ease: 'power2.out' }, 0)))

  // ledgers: the rule is drawn, then the entry lands
  $$('.ledger li, details.rep, .cols li, .event, .prizes > div').forEach(r => r.classList.add('ruled'))
  $$('.ledger, .cols, .prizes, #events').forEach(list => {
    const rows = $$('.ruled', list); if (!rows.length) return
    once(list, gsap.timeline({ paused: true })
      .fromTo(rows, { '--rule': 0 }, { '--rule': 1, duration: .6, stagger: .05, ease: 'power2.out' })
      .from(rows.flatMap(r => [...r.children]), { y: 12, opacity: 0, duration: .5, stagger: .04, ease: 'power3.out' }, .2))
  })

  // her words light up as they are read
  $$('[data-scrub="words"]').forEach(q => {
    const s = $('span', q)
    s.innerHTML = s.textContent.split(' ').map(w => `<span class="w">${w}</span>`).join(' ')
    gsap.fromTo($$('.w', s), { opacity: .14 }, { opacity: 1, stagger: .5, ease: 'none', scrollTrigger: { trigger: q, start: 'top 75%', end: 'bottom 45%', scrub: true } })
  })

  // About: the repertoire plate holds still while the violin is drawn, measured, and its f-hole circled
  const draw = $('#draw')
  if (draw) {
    const ink = $('.ink', draw), ring = $('.ring', draw), dims = $$('.dims > *', draw)
    const L = screenLen(ink), RL = screenLen(ring), wide = innerWidth > 860
    gsap.set(ink, { strokeDasharray: L, strokeDashoffset: L }); gsap.set(ring, { strokeDasharray: RL, strokeDashoffset: RL }); gsap.set(dims, { opacity: 0 })
    gsap.timeline({ scrollTrigger: wide ? { trigger: '.plate', start: 'top top', end: '+=140%', pin: true, scrub: 1 } : { trigger: draw, start: 'top 80%', end: 'bottom 40%', scrub: 1 } })
      .to(ink, { strokeDashoffset: 0, duration: 3, ease: 'none' })
      .to(dims, { opacity: 1, duration: .8, stagger: .04 }, 2.4)
      .to(ring, { strokeDashoffset: 0, duration: .8, ease: 'power1.inOut' }, 3.4)
      .from(wide ? $$('.plate .reps details') : [], { x: 30, opacity: 0, duration: .6, stagger: .15 }, 3.4)
      .to({}, { duration: .4 })
    // opening a repertoire list makes the plate taller: re-measure, or the pinned space stays at the old height and the footer draws over the list
    $$('.plate details').forEach(d => d.addEventListener('toggle', () => ScrollTrigger.refresh()))
  }

  // concerts: the drawn hall fills up, back rows first
  const hall = $('.hall-ink')
  if (hall) once(hall, gsap.timeline({ paused: true })
    .from($$('.ink', hall), { opacity: 0, duration: .6, stagger: .05 })
    .from($('.pool', hall), { scale: 0, transformOrigin: '50% 50%', duration: .7, ease: 'power3.out' }, .3)
    .from($$('.row', hall), { opacity: 0, y: 6, duration: .4, stagger: .07, ease: 'power2.out' }, .5))

  // concerts: the staff is ruled, a note lands
  $$('.staff').forEach(st => once(st, gsap.timeline({ paused: true })
    .from($$('line', st), { attr: { x2: 0 }, duration: .9, stagger: .09, ease: 'power2.inOut' })
    .from($('.note', st), { y: -40, opacity: 0, duration: .6, ease: 'back.out(2)' }, '-=.2')))

  if (form) once(form, gsap.timeline({ paused: true }).from($$('label', form), { y: 10, opacity: 0, duration: .5, stagger: .06, ease: 'power3.out' }))
})

/* landing intro, "four strings": the intro is the instrument. Four strings hang on the drafting paper; scrolling draws one long
   down-bow across them and they ring; they part, an f-hole opens between them and the camera goes through it to her; the
   photograph settles into the pinned print, and the four strings rise to become the header staff. Click a string to hear it. */
function landingIntro (tdraw) {
  const seen = () => { try { localStorage.setItem('introSeen', '1') } catch {} }   // first visit only; the footer link replays it
  window.__introRunning = true
  const phone = innerWidth <= 860                // phones: the same story, timed (a tap fast-forwards), no header staff to land on
  scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true })
  const NS = 'http://www.w3.org/2000/svg', run = $('.intro-run'), print = $('.t-print', run), pin = $('.pin', print), ph = $('.ph', print)
  const ink = $('.ink', tdraw), cav = $('.cav', tdraw), h1 = $('.table h1', run)
  const W = innerWidth, H = innerHeight, RED = '#B91C1C', INK = '#18181B'

  // the stage: a canvas for strings and bow, an svg for the f-hole and the photograph behind it
  const stage = document.createElement('div'); stage.className = 'dstage'; stage.setAttribute('aria-hidden', 'true')
  const cv = document.createElement('canvas'), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, 2)
  cv.width = W * dpr; cv.height = H * dpr
  const FHOLE = tdraw.dataset.fhole.split(/(?=M)/).slice(0, 3).join(' ')   // the f-hole outline from the site's own violin drawing (right-hand f, bbox ≈ x 24–55, y 154–226)
  const FH = { cx: 39.5, cy: 190, h: 72, pivot: [36.5, 189.5] }
  const s0 = (phone ? .42 : .5) * H / FH.h
  const img = $('img', ph).currentSrc || $('img', ph).src
  stage.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs><mask id="fmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="#000"/><g id="fg"><path d="${FHOLE}" fill="#fff"/></g><rect id="ffill" width="${W}" height="${H}" fill="#fff" opacity="0"/></mask></defs>
    <g mask="url(#fmask)"><image id="fphoto" href="${img}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/></g>
    <g id="fline"><path d="${FHOLE}" fill="none" stroke="${INK}" stroke-width="1" vector-effect="non-scaling-stroke"/></g></svg>`
  stage.prepend(cv); document.body.appendChild(stage)
  const fg = $('#fg', stage), fline = $('#fline', stage), photo = $('#fphoto', stage), ffill = $('#ffill', stage)

  // strings: nut at the top, bridge at the bottom, tapering like a real fingerboard; G is the thickest
  const NOTES = [{ n: 'G', f: 196.00, w: 2.3 }, { n: 'D', f: 293.66, w: 1.8 }, { n: 'A', f: 440.00, w: 1.35 }, { n: 'E', f: 659.25, w: .95 }]
  const S = { bow: -.3, spread: 0, open: 0, push: 1, lift: 0, fade: 1, shrink: 0, settle: 0 }
  const amp = [0, 0, 0, 0]
  const NUT = H * (phone ? .16 : .13), BRIDGE = H * (phone ? .8 : .84), BOW_Y = .7
  const staffTop = () => navStaff ? navStaff.getBoundingClientRect().top : 0, staffLeft = () => navStaff ? navStaff.getBoundingClientRect().left : 0
  function geom (i) {
    const k = i - 1.5, sp = 1 + S.spread * 4.5, n = phone ? 16 : 24, br = phone ? 26 : 40
    let a = { x0: W / 2 + k * n * sp, y0: NUT, x1: W / 2 + k * br * sp, y1: BRIDGE }
    if (S.lift > 0 && navStaff && !phone) {        // rising to the header: G becomes the bottom line, E the second from the top
      const y = staffTop() + TOP + (4 - i) * GAP, e = S.lift < .5 ? 2 * S.lift * S.lift : 1 - Math.pow(-2 * S.lift + 2, 2) / 2
      const b = { x0: staffLeft() + staffX[0], y0: y, x1: staffLeft() + staffX[1], y1: y }
      a = { x0: a.x0 + (b.x0 - a.x0) * e, y0: a.y0 + (b.y0 - a.y0) * e, x1: a.x1 + (b.x1 - a.x1) * e, y1: a.y1 + (b.y1 - a.y1) * e }
    }
    return a
  }
  // the bow: stick with a little camber, the hair, the frog with its pearl eye, the hatchet head; drawn in the site's ink
  function drawBow (cx, y) {
    const len = Math.min(W * .86, 1100), x = cx - len / 2
    g.save(); g.lineCap = 'round'
    g.fillStyle = '#F7F3EA'; g.fillRect(x + 20, y - 3, len - 28, 5)                                                                 // hair ribbon
    g.strokeStyle = INK; g.lineWidth = .9; g.strokeRect(x + 20, y - 3, len - 28, 5)
    g.lineWidth = 3.4; g.beginPath(); g.moveTo(x - 6, y - 15); g.quadraticCurveTo(x + len * .5, y - 24, x + len - 4, y - 12); g.stroke() // stick
    g.fillStyle = INK; g.beginPath(); g.moveTo(x + len - 8, y - 13); g.lineTo(x + len + 4, y - 15); g.lineTo(x + len - 2, y + 1); g.lineTo(x + len - 10, y + 1); g.closePath(); g.fill() // head
    g.strokeStyle = '#F7F3EA'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + len + 2, y - 13.5); g.lineTo(x + len - 3, y - .5); g.stroke()  // ivory face
    g.fillStyle = INK; g.beginPath(); g.roundRect(x - 2, y - 15, 26, 16, 3); g.fill()                                                // frog
    g.fillStyle = '#F7F3EA'; g.beginPath(); g.arc(x + 11, y - 7, 3, 0, 7); g.fill()                                                  // pearl eye
    g.fillStyle = INK; g.fillRect(x - 16, y - 13, 12, 6)                                                                              // button
    g.restore()
    return [x + 18, x + len - 6]
  }
  let lastBow = S.bow, t0 = performance.now()
  function frame () {
    const t = (performance.now() - t0) / 1000
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H)
    if (S.fade > .002) {   // strings and bow (the f-hole and photo below keep moving after they fade)
    g.globalAlpha = S.fade
    const speed = Math.abs(S.bow - lastBow); lastBow = S.bow
    const bowX = W * S.bow, by = NUT + (BRIDGE - NUT) * BOW_Y
    const showBow = S.bow > -.28 && S.bow < 1.24 && S.spread < .5
    const hair = showBow ? [bowX - Math.min(W * .86, 1100) / 2 + 18, bowX + Math.min(W * .86, 1100) / 2 - 6] : [0, -1]
    NOTES.forEach((s, i) => {
      const q = geom(i), xb = q.x0 + (q.x1 - q.x0) * BOW_Y
      if (xb > hair[0] && xb < hair[1]) amp[i] = Math.min(1, amp[i] + speed * 26)      // the hair is on the string: it sounds while the bow moves
      amp[i] *= .965
      const A = amp[i] * 9 * (1 - S.lift), wv = 2 * Math.PI * s.f / 196 * 3.1
      const y0 = q.y0, y1 = q.y1, len = Math.hypot(q.x1 - q.x0, y1 - y0), nx = (y1 - y0) / len, ny = -(q.x1 - q.x0) / len
      const at = (u, d) => [q.x0 + (q.x1 - q.x0) * u + nx * d, y0 + (y1 - y0) * u + ny * d]
      if (A > .3) {   // the blur of a sounding string, like a long exposure: a faint vermilion lens around it
        g.fillStyle = `rgba(185,28,28,${.1 + amp[i] * .12})`; g.beginPath()
        for (let j = 0; j <= 40; j++) { const u = j / 40, [x, y] = at(u, A * Math.sin(Math.PI * u)); j ? g.lineTo(x, y) : g.moveTo(x, y) }
        for (let j = 40; j >= 0; j--) { const u = j / 40, [x, y] = at(u, -A * Math.sin(Math.PI * u)); g.lineTo(x, y) }
        g.fill()
      }
      g.beginPath()
      for (let j = 0; j <= 80; j++) { const u = j / 80, d = A * (Math.sin(Math.PI * u) * Math.sin(t * wv) + .3 * Math.sin(2 * Math.PI * u) * Math.sin(t * wv * 2.01 + 1)); const [x, y] = at(u, d); j ? g.lineTo(x, y) : g.moveTo(x, y) }
      g.strokeStyle = amp[i] > .08 ? RED : INK; g.lineWidth = s.w * (1 - S.lift * .6); g.stroke()
      if (S.lift < .05 && S.spread < .3) {   // drafting notes at the nut: the string name and its pitch
        const a = 1 - S.spread / .3
        g.globalAlpha = S.fade * a; g.fillStyle = amp[i] > .08 ? RED : INK; g.textAlign = 'center'
        g.font = '500 16px Cinzel, serif'; g.fillText(s.n, q.x0, q.y0 - 16)
        g.globalAlpha = S.fade
      }
    })
    if (S.lift < .05 && S.spread < .3) {   // the nut and the bridge, drawn like a technical drawing
      const a = 1 - S.spread / .3; g.globalAlpha = S.fade * a; g.strokeStyle = INK; g.lineWidth = 1.2
      const n0 = geom(0), n3 = geom(3)
      g.beginPath(); g.moveTo(n0.x0 - 10, NUT); g.lineTo(n3.x0 + 10, NUT); g.stroke()
      g.beginPath(); g.moveTo(n0.x1 - 22, BRIDGE + 10); g.quadraticCurveTo(W / 2, BRIDGE - 8, n3.x1 + 22, BRIDGE + 10); g.lineTo(n3.x1 + 16, BRIDGE + 4); g.quadraticCurveTo(W / 2, BRIDGE - 13, n0.x1 - 16, BRIDGE + 4); g.closePath(); g.stroke()
      g.globalAlpha = S.fade * a * .5; g.font = '10px "Archivo Narrow", sans-serif'; g.textAlign = 'left'; g.fillStyle = INK
      if (!phone) {
        g.fillText('NUT', n3.x0 + 22, NUT + 4); g.fillText('BRIDGE', n3.x1 + 34, BRIDGE + 6)
        const nx = n3.x1 + 34, ny = NUT + (BRIDGE - NUT) * .36
        g.fillText('G 196 · D 294 · A 440 · E 659 HZ', nx, ny); g.fillText('CLICK A STRING TO HEAR IT', nx, ny + 16)
      }
      g.globalAlpha = S.fade
    }
    if (showBow) drawBow(bowX, by)
    }
    g.globalAlpha = 1
    // f-hole and photograph
    const s = s0 * S.open * S.push, p = FH.pivot
    const tr = `translate(${W / 2},${H / 2}) scale(${s}) translate(${-p[0]},${-p[1]})`
    fg.setAttribute('transform', tr); fline.setAttribute('transform', tr); fline.style.opacity = S.open > .02 ? Math.max(0, 1 - (S.push - 1) / 3) : 0
    // the photograph moves from full screen into the print's photo area
    const r = ph.getBoundingClientRect(), e = S.shrink
    photo.setAttribute('x', r.left * e); photo.setAttribute('y', r.top * e)
    photo.setAttribute('width', W + (r.width - W) * e); photo.setAttribute('height', H + (r.height - H) * e)
    // the name rings like a string, then comes to rest
    const a = (1 - S.settle) * 7
    letters.forEach((l, i) => { l.style.transform = a > .05 ? `translateY(${(Math.sin(t * 26 + i * .9) * a).toFixed(2)}px)` : '' })
  }
  // split the name into letters for the ringing
  const letters = []
  h1.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) { const f = document.createDocumentFragment(); [...n.textContent].forEach(c => { const sp = document.createElement('span'); sp.className = 'l'; sp.textContent = c; f.appendChild(sp); letters.push(sp) }); n.replaceWith(f) } })

  // click a string: a Karplus–Strong pluck at the string's true pitch (G3 D4 A4 E5)
  let ac
  const pluck = f => { ac = ac || new AudioContext(); const sr = ac.sampleRate, N = Math.round(sr / f), len = sr * 2.2
    const b = ac.createBuffer(1, len, sr), d = b.getChannelData(0), ring = new Float32Array(N).map(() => Math.random() * 2 - 1)
    for (let i = 0; i < len; i++) { const k = i % N, nx = (k + 1) % N; d[i] = ring[k]; ring[k] = .4985 * (ring[k] + ring[nx]) }
    const src = ac.createBufferSource(), gn = ac.createGain(); gn.gain.value = .3; src.buffer = b; src.connect(gn).connect(ac.destination); src.start() }
  cv.addEventListener('click', e => {
    let best = -1, bd = 26
    NOTES.forEach((s, i) => { const q = geom(i), u = (e.clientY - q.y0) / (q.y1 - q.y0); if (u < 0 || u > 1) return; const dx = Math.abs(e.clientX - (q.x0 + (q.x1 - q.x0) * u)); if (dx < bd) { bd = dx; best = i } })
    if (best >= 0) { amp[best] = 1; pluck(NOTES[best].f) }
  })
  const pointer = () => { cv.style.pointerEvents = S.spread < .1 && S.fade > .5 && !phone ? 'auto' : 'none' }
  gsap.ticker.add(frame); gsap.ticker.add(pointer)

  gsap.set(print, { opacity: 0 }); gsap.set(pin, { opacity: 0 })
  const L = screenLen(ink); gsap.set(ink, { strokeDasharray: L, strokeDashoffset: L, opacity: 1 }); gsap.set(cav, { opacity: 0 })
  if (phone) document.documentElement.style.overflow = 'hidden'

  const end = () => { document.documentElement.style.overflow = ''; seen() }
  const tl = phone
    ? gsap.timeline({ delay: .4, onComplete: end })
    : gsap.timeline({ scrollTrigger: { trigger: run, start: 'top top', end: 'bottom bottom', scrub: 1, onLeave: seen } })
  const startW = innerWidth
  addEventListener('resize', function bail () {
    if (Math.abs(innerWidth - startW) < 2) return
    removeEventListener('resize', bail); tl.scrollTrigger?.kill(); tl.kill(); gsap.ticker.remove(frame); gsap.ticker.remove(pointer); stage.remove()
    gsap.set([print, pin, ink, cav, ...$$('.call', tdraw), '.table .t-text', '.table .readout', ...letters], { clearProps: 'all' })
    gsap.set(navStaff, { clearProps: '--staff,--notes' })
    document.documentElement.classList.remove('intro'); document.documentElement.style.overflow = ''; scrollTo(0, 0); ScrollTrigger.refresh()
  })
  if (phone) { tl.timeScale(1.25); const skip = () => tl.timeScale(8); addEventListener('touchstart', skip, { once: true }); addEventListener('wheel', skip, { once: true }) }

  tl.to('.oneline-cue', { opacity: 0, duration: .3 }, .2)
    .to(S, { bow: 1.25, duration: 2.4, ease: 'power1.inOut' }, 0)                      // one long down-bow; the strings ring while it moves
    .to(S, { spread: 1, duration: 1, ease: 'power2.inOut' }, 2.3)                       // the strings part…
    .to(S, { open: 1, duration: .8, ease: 'power2.out' }, 2.5)                          // …and an f-hole opens between them
  if (navStaff && !phone) {
    tl.to(S, { lift: 1, duration: 1.1, ease: 'none' }, 2.9)                             // the four strings rise to the header and become the staff
      .fromTo(navStaff, { '--staff': 0 }, { '--staff': 1, duration: .3 }, 3.85)
      .to(S, { fade: 0, duration: .2 }, 4.0)
      .fromTo(navStaff, { '--notes': 0 }, { '--notes': 1, duration: .4, ease: 'back.out(2)' }, 4.1)
  } else tl.to(S, { fade: 0, duration: .5 }, 2.9)
  tl.to(S, { push: 30, duration: 1.4, ease: 'power3.in' }, 3.2)                         // the camera goes through the f-hole
    .to(ffill, { opacity: 1, duration: .45, ease: 'power1.in' }, 4.1)
    .to(S, { shrink: 1, duration: 1, ease: 'power3.inOut' }, 4.6)                       // the photograph settles where the print hangs
    .to(print, { opacity: 1, duration: .25 }, 5.45)
    .to(stage, { opacity: 0, duration: .2 }, 5.55)
    .fromTo(pin, { opacity: 0, y: -16 }, { opacity: 1, y: 0, duration: .3, ease: 'back.out(3)' }, 5.6)
    .fromTo('.table .t-text', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .5 }, 5.6)
    .to(S, { settle: 1, duration: 1.4, ease: 'power2.out' }, 5.6)                       // the name rings, then rests
    .to(ink, { strokeDashoffset: 0, duration: 1.2, ease: 'power1.inOut' }, 5.7)          // the homepage violin draws itself
    .to(cav, { opacity: 1, duration: .3 }, 6.6)
    .fromTo($$('.call', tdraw), { autoAlpha: 0 }, { autoAlpha: 1, duration: .4, stagger: .1 }, 6.7)
    .to('.table .readout', { opacity: .75, duration: .4 }, 7.0)
    .to({}, { duration: .4 })
}
