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
  else if (tdraw) gsap.from('.table .t-text > *', { opacity: 0, y: 20, duration: .7, stagger: .08, ease: 'power3.out', delay: .15 })
  if (tdraw) {   // the violin below the photograph draws itself when it comes into view, then its pegs lead out to the pages
    const ink = $('.ink', tdraw), L = screenLen(ink)
    gsap.set(ink, { strokeDasharray: L, strokeDashoffset: L }); gsap.set([$('.cav', tdraw), ...$$('.call', tdraw)], { opacity: 0 })
    once(tdraw, gsap.timeline({ paused: true })
      .to(ink, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 0)
      .to($('.cav', tdraw), { opacity: 1, duration: .4 }, 1.5)
      .to($$('.call', tdraw), { opacity: 1, duration: .5, stagger: .12 }, 1.9))
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

/* landing intro (version C, 3D): the camera looks down the four strings of a solid ink violin and dollies toward the bridge; a bow
   crosses and each string throws a vermilion note up to its place on the header staff; the strings peel off and straighten into
   the staff lines; the camera turns to the f-hole and drops through it, her photograph pulling into focus; the photograph stays,
   full screen, and is marked up as a drafting plate (crop marks, registration targets, dimension line, stamp). */
function landingIntro (tdraw) {
  const seen = () => { try { localStorage.setItem('introSeen', '1') } catch {} }   // first visit only; the footer link replays it
  window.__introRunning = true
  const phone = innerWidth <= 860                // phones: the same story, timed (a tap fast-forwards)
  scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true })
  const NS = 'http://www.w3.org/2000/svg', run = $('.intro-run'), heroImg = $('.plate-photo img', run), marks = $$('.plate-photo .mk', run)
  const h1 = $('.table h1', run)
  const W = innerWidth, H = innerHeight, INK = '#18181B', PAPER = '#F7F3EA'

  // the stage: a canvas for the instrument and bow, an svg for the f-hole and the photograph behind it
  const stage = document.createElement('div'); stage.className = 'dstage'; stage.setAttribute('aria-hidden', 'true')
  const cv = document.createElement('canvas'), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, 2)
  cv.width = W * dpr; cv.height = H * dpr
  const img = heroImg.currentSrc || heroImg.src
  stage.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>
      <filter id="fblur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="0"/></filter>
      <mask id="fmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
      <rect width="${W}" height="${H}" fill="#000"/><path id="fg" fill="#fff"/><rect id="ffill" width="${W}" height="${H}" fill="#fff" opacity="0"/></mask></defs>
    <g mask="url(#fmask)"><g id="fpg" opacity="0"><image id="fphoto" href="${img}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/></g></g>
    <path id="fline" fill="none" stroke="${INK}" stroke-width="1"/></svg>`
  stage.prepend(cv); document.body.appendChild(stage)
  const fg = $('#fg', stage), fline = $('#fline', stage), fpg = $('#fpg', stage), photo = $('#fphoto', stage), ffill = $('#ffill', stage), blur = $('feGaussianBlur', stage)

  // the violin in millimetres, from the site's own drawing (src/lib/violin.js): x across, z along the instrument
  // (nut −132, bridge 190), y up off the top plate. Outlines are sampled once into 3D points.
  const sample = (d, n) => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d); $('defs', stage).appendChild(p)
    const L = p.getTotalLength(); return Array.from({ length: n }, (_, i) => { const q = p.getPointAtLength(L * i / n); return [q.x, q.y] }) }
  const plate = pts => pts.map(([x, z]) => [x, 0, z])
  const BODY = plate(sample(tdraw.dataset.body, 200))
  // half-width of the body at each z (every 2 mm), from the outline: the arching is measured against it
  const WZ = new Float32Array(180)
  BODY.forEach((P, i) => { const Q = BODY[(i + 1) % BODY.length]     // walk every outline segment so no 2 mm band is skipped
    const k0 = Math.ceil(Math.min(P[2], Q[2]) / 2), k1 = Math.floor(Math.max(P[2], Q[2]) / 2)
    for (let k = Math.max(0, k0); k <= Math.min(179, k1); k++) { const u = Q[2] === P[2] ? 0 : (k * 2 - P[2]) / (Q[2] - P[2]); WZ[k] = Math.max(WZ[k], Math.abs(P[0] + (Q[0] - P[0]) * u)) } })
  for (let pass = 0; pass < 3; pass++) for (let k = 1; k < 179; k++) WZ[k] = (WZ[k - 1] + 2 * WZ[k] + WZ[k + 1]) / 4   // smooth, so contours run clean
  const wz = z => WZ[Math.max(0, Math.min(179, Math.round(z / 2)))] || 1
  const ARCH = 15, gz = z => Math.pow(Math.sin(Math.PI * Math.max(0, Math.min(1, z / 356))), .55)
  const we = z => Math.max(wz(z), 70)                                                     // the arch narrows only a little at the waist
  const arch = (x, z) => Math.max(0, ARCH * gz(z) * (1 - Math.min(1, (x / we(z)) ** 2)))
  const onTop = pts => pts.map(([x, z]) => [x, arch(x, z) + .15, z])
  // a contour of the arching (all points at height h), as a closed loop: right side down, left side back up
  const contour = h => { const R = [], L = []
    for (let z = 1; z < 356; z += 1.5) { const A = ARCH * gz(z); if (A <= h) continue; const x = Math.min(wz(z) - 2.5, we(z) * Math.sqrt(1 - h / A)); R.push([x, h, z]); L.unshift([-x, h, z]) }
    return R.concat(L) }
  const CONTOURS = [4, 8, 11.5].map(contour), PURFLING = contour(.9)
  const RIB = 30, RIBS = BODY.map(([x, , z]) => [x, -RIB, z])
  const FH = tdraw.dataset.fhole.split(/(?=M)/).slice(0, 3).map((d, i) => onTop(sample(d, i ? 20 : 90)))   // right f-hole: outline + two eyes, cut into the arch
  const area = s => s.reduce((A, p, i) => { const q = s[(i + 1) % s.length]; return A + p[0] * q[2] - q[0] * p[2] }, 0)
  FH.forEach(s => { if (Math.sign(area(s)) !== Math.sign(area(FH[0]))) s.reverse() })   // one winding, so the eyes add to the cut instead of punching through it
  const FHL = FH.map(s => s.map(([x, y, z]) => [-x, y, z]))
  const NUT = -132, BRIDGE = 190, FB_END = 136
  const brY = x => 33 - (x / 20) ** 2 * 3                                     // the bridge's arched top
  const NOTES = [{ n: 'G', f: 196.00, w: .24, nut: -8.25, br: -17.25 }, { n: 'D', f: 293.66, w: .19, nut: -2.75, br: -5.75 },
    { n: 'A', f: 440.00, w: .15, nut: 2.75, br: 5.75 }, { n: 'E', f: 659.25, w: .11, nut: 8.25, br: 17.25 }]
  const strAt = (s, u) => [s.nut + (s.br - s.nut) * u, 20 + (brY(s.br) - 20) * u, NUT + (BRIDGE - NUT) * u]   // u: 0 nut → 1 bridge
  const fbY = z => 19.5 + 10 * (z - NUT) / (BRIDGE - NUT)
  const FB = [[-12, NUT], [12, NUT], [21, FB_END - 4], [17, FB_END], [-17, FB_END], [-21, FB_END - 4]].map(([x, z]) => [x, fbY(z), z])
  const side = [[20, 29], [16.5, 22], [14, 17], [16, 12], [20.5, 4], [21, 0], [11, 0], [9, 5], [5, 8], [0, 9]]   // arched top down the waist to a foot and the arch between the feet
  const BR = [...Array.from({ length: 13 }, (_, i) => { const x = -20 + i * 40 / 12; return [x, brY(x), BRIDGE] }),
    ...side.map(([x, y]) => [x, Math.max(y, arch(x, BRIDGE) - 1), BRIDGE]), ...side.slice(0, -1).reverse().map(([x, y]) => [-x, Math.max(y, arch(-x, BRIDGE) - 1), BRIDGE])]   // the feet stand on the arch

  // the camera: four stations (position, look-at); S.cam runs 0→3 between them
  const AF = arch(36, 189)
  const KEYS = phone
    ? [[[0, 50, -175], [0, 4, 240]], [[0, 56, 70], [0, 28, 260]], [[36, 136, 150], [36, AF, 189]], [[36, AF + 1.4, 189], [36, AF - 60, 189.4]]]
    : [[[0, 42, -168], [0, -8, 250]], [[0, 52, 70], [0, 28, 260]], [[36, 106, 150], [36, AF, 189]], [[36, AF + 1.4, 189], [36, AF - 60, 189.4]]]
  const F = Math.min(W * 1.6, H * 1.1), NEAR = .8
  const S = { cam: 0, bow: -1.4, note: 1, open: 0, blur: phone ? 8 : 14, fade: 1, settle: 0, lift: 0, k0: 0, k1: 0, k2: 0, k3: 0 }
  const amp = [0, 0, 0, 0]
  let C, R, U, Fw
  function camera () {
    const k = Math.min(2, Math.floor(S.cam)), t = S.cam - k, a = KEYS[k], b = KEYS[k + 1], mix = (p, q) => p.map((v, i) => v + (q[i] - v) * t)
    C = mix(a[0], b[0]); const T = mix(a[1], b[1]), d = T.map((v, i) => v - C[i]), m = Math.hypot(...d)
    Fw = d.map(v => v / m); const yaw = Math.atan2(Fw[0], Fw[2])
    R = [Math.cos(yaw), 0, -Math.sin(yaw)]
    U = [Fw[1] * R[2] - Fw[2] * R[1], Fw[2] * R[0] - Fw[0] * R[2], Fw[0] * R[1] - Fw[1] * R[0]]
  }
  const view = P => { const d = [P[0] - C[0], P[1] - C[1], P[2] - C[2]], dot = v => d[0] * v[0] + d[1] * v[1] + d[2] * v[2]; return [dot(R), dot(U), dot(Fw)] }
  const scr = c => [W / 2 + F * c[0] / c[2], H / 2 - F * c[1] / c[2]]
  const cut = (a, b) => { const t = (NEAR - a[2]) / (b[2] - a[2]); return a.map((v, i) => v + (b[i] - v) * t) }
  // a polyline in 3D, clipped at the near plane so lines behind the camera never wrap round
  function path3 (pts, close) {
    const c = pts.map(view), n = c.length
    for (let i = 0; i < (close ? n : n - 1); i++) {
      let a = c[i], b = c[(i + 1) % n]
      if (a[2] < NEAR && b[2] < NEAR) continue
      if (a[2] < NEAR) a = cut(a, b); if (b[2] < NEAR) b = cut(b, a)
      const A = scr(a), B = scr(b); g.moveTo(A[0], A[1]); g.lineTo(B[0], B[1])
    }
  }
  // a filled band between two 3D rails (a string's body, a sounding string's blur), dropped where it passes the near plane
  function band (L, Rr) {
    const l = L.map(view), r = Rr.map(view), keep = l.map((p, i) => p[2] > NEAR && r[i][2] > NEAR)
    const ls = l.filter((_, i) => keep[i]).map(scr), rs = r.filter((_, i) => keep[i]).map(scr).reverse()
    if (ls.length < 2) return
    g.beginPath(); [...ls, ...rs].forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill()
  }
  function poly3 (pts) {
    const c = pts.map(view), out = []
    for (let i = 0; i < c.length; i++) { const a = c[i], b = c[(i + 1) % c.length]
      if (a[2] >= NEAR) out.push(a); if ((a[2] >= NEAR) !== (b[2] >= NEAR)) out.push(cut(a, b)) }
    if (out.length < 3) return false
    g.beginPath(); out.map(scr).forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); return true
  }
  const SHADE = '#E7DDC9', DARK = '#D9CDB4'
  // the instrument as a solid: shadow on the paper, ribs with hatching on the shaded side, the arched top with its
  // contours and purfling, the fingerboard and the bridge as blocks, and each string's shadow on what lies under it
  function instrument () {
    g.save(); g.filter = 'blur(16px)'; g.fillStyle = 'rgba(40,30,10,.13)'
    if (poly3(BODY.map(([x, , z]) => [x + 16, -RIB - .5, z + 12]))) g.fill(); g.restore()
    g.strokeStyle = INK; g.lineWidth = .8; g.fillStyle = SHADE
    if (poly3(RIBS)) { g.fill(); g.stroke() }
    g.globalAlpha *= .45; g.lineWidth = .6; g.beginPath()
    BODY.forEach(([x, , z], i) => { if (i % 2 === 0 && x > 6) path3([[x, 0, z], [x, -RIB, z]]) }); g.stroke(); g.globalAlpha /= .45
    g.lineWidth = .9; g.beginPath(); [24, 50, 76, 124, 150, 176].forEach(i => path3([BODY[i], RIBS[i]])); g.stroke()   // the corners and bouts, as edges
    g.fillStyle = PAPER; g.lineWidth = 1.1; if (poly3(BODY)) { g.fill(); g.stroke() }
    g.lineWidth = .6; g.beginPath(); path3(PURFLING, true); g.stroke()
    g.globalAlpha *= .4; g.beginPath(); CONTOURS.forEach(c => path3(c, true)); g.stroke(); g.globalAlpha /= .4
    g.lineWidth = 1; g.fillStyle = PAPER; g.beginPath(); FHL.forEach(s => path3(s, true)); g.stroke()
    // fingerboard: a block 5 mm thick, sides in shade, top lit
    const FBB = FB.map(([x, y, z]) => [x, y - 5, z])
    g.fillStyle = DARK; g.lineWidth = .8
    FB.forEach((p, i) => { const q = FB[(i + 1) % FB.length]; if (poly3([p, q, FBB[(i + 1) % FB.length], FBB[i]])) { g.fill(); g.stroke() } })
    g.fillStyle = PAPER; if (poly3(FB)) { g.fill(); g.stroke() }
    // bridge: two faces 4 mm apart joined along the arched top
    const BRB = BR.map(([x, y, z]) => [x * .96, y, z + 4.2])
    g.fillStyle = DARK; if (poly3(BRB)) { g.fill(); g.stroke() }
    g.fillStyle = SHADE; for (let i = 0; i < 12; i++) if (poly3([BR[i], BR[i + 1], BRB[i + 1], BRB[i]])) { g.fill(); g.stroke() }
    g.fillStyle = PAPER; if (poly3(BR)) { g.fill(); g.stroke() }
    g.beginPath(); path3([[-12, 20.5, NUT], [12, 20.5, NUT]]); g.stroke()
    // string shadows, thrown a little to the right onto the fingerboard or the top
    g.strokeStyle = 'rgba(24,24,27,.16)'; g.lineWidth = 1.4; g.beginPath()
    NOTES.forEach(s => {   // a shadow falls on the fingerboard, then drops onto the top: two separate runs, never one line between them
      const on = [], off = []
      for (let j = 0; j <= 40; j++) { const [x, , z] = strAt(s, j / 40), sx = x + 3; (z < FB_END ? on : off).push([sx, (z < FB_END ? fbY(z) : arch(sx, z)) + .2, z]) }
      if (on.length > 1) path3(on); if (off.length > 1) path3(off) })
    g.stroke(); g.strokeStyle = INK
  }
  const label = (P, txt, dx, dy) => { const c = view(P); if (c[2] < NEAR) return; const [x, y] = scr(c); g.fillText(txt, x + dx, y + dy) }

  // the bow, lying across the strings between fingerboard and bridge: hair ribbon, cambered stick, frog and head
  const ZB = 166, HY = 32
  function drawBow (cx) {
    const x0 = cx - 300, x1 = cx + 300
    g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = 1
    const hair = [[x0 + 22, HY, ZB], [x1 - 8, HY, ZB], [x1 - 8, HY + 2.4, ZB], [x0 + 22, HY + 2.4, ZB]]
    band([hair[0], hair[1]], [hair[3], hair[2]]); g.beginPath(); path3(hair, true); g.stroke()
    const stick = Array.from({ length: 25 }, (_, i) => { const u = i / 24; return [x0 + u * 600, HY + 9 + 3.5 * Math.sin(Math.PI * u) - 4 * u, ZB] })
    const mid = view([cx, HY + 10, ZB])[2]
    g.lineWidth = Math.min(7, Math.max(1.4, 2.2 * F / Math.max(mid, 1))); g.lineCap = 'round'; g.beginPath(); path3(stick); g.stroke()
    g.fillStyle = INK
    band([[x0, HY, ZB], [x0 + 26, HY, ZB]], [[x0, HY + 11, ZB], [x0 + 26, HY + 11, ZB]])                          // frog
    band([[x1 - 10, HY, ZB], [x1, HY, ZB]], [[x1 - 12, HY + 6, ZB], [x1 + 2, HY + 8, ZB]])                       // head
    g.fillStyle = PAPER; const e = view([x0 + 13, HY + 6, ZB]); if (e[2] > NEAR) { const [x, y] = scr(e); g.beginPath(); g.arc(x, y, Math.max(1, 2.2 * F / e[2]), 0, 7); g.fill() }  // pearl eye
    return [x0 + 22, x1 - 8]
  }

  // the stage photograph is laid out exactly like the hero image (cover, at the hero's object-position), so the hand-off is invisible
  function placePhoto () {
    const iw = heroImg.naturalWidth || 1983, ih = heroImg.naturalHeight || 793, k = Math.max(W / iw, H / ih), w = iw * k, h = ih * k
    const [px, py] = getComputedStyle(heroImg).objectPosition.split(' ').map(v => parseFloat(v) / 100)
    photo.setAttribute('preserveAspectRatio', 'none')
    photo.setAttribute('x', (W - w) * px); photo.setAttribute('y', (H - h) * py); photo.setAttribute('width', w); photo.setAttribute('height', h)
  }
  // a note leaves the point where the bow met the string and lands on its place on the header staff (G under About … E under Contact)
  const noteTarget = i => { const n = navStaff && !phone ? $$('.nt', navStaff)[i] : null; if (!n) return [W * (.3 + i * .13), -20]; const b = n.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2] }
  function flyNotes () {
    NOTES.forEach((s, i) => {
      const k = S['k' + i]; if (k <= 0 || k >= 1) return
      const c = view(strAt(s, (ZB - NUT) / (BRIDGE - NUT))); if (c[2] < NEAR) return
      const [x0, y0] = scr(c), [x1, y1] = noteTarget(i), e = k
      const cx = (x0 + x1) / 2 + (i - 1.5) * 60, cy = Math.min(y0, y1) - 120                // a little arc, each note on its own path
      const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * x1, y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * y1
      const r = 3.6 + 7 * Math.sin(Math.PI * e) * (1 - e * .6)
      g.save(); g.globalAlpha = Math.min(1, k * 6) * (1 - Math.max(0, (k - .92) / .08))
      g.translate(x, y); g.rotate(-.38); g.fillStyle = '#B91C1C'; g.beginPath(); g.ellipse(0, 0, r, r * .7, 0, 0, 7); g.fill(); g.restore()
    })
  }
  // a string leaving the instrument: its visible part straightens into one line of the header staff (G the lowest)
  function liftString (s, i) {
    const pts = []
    for (let j = 0; j <= 40; j++) { const c = view(strAt(s, j / 40)); if (c[2] > NEAR) pts.push(scr(c)) }
    if (pts.length < 2) return
    const e = S.lift, N = 40, staff = navStaff && !phone
    const y = staff ? navStaff.getBoundingClientRect().top + TOP + (4 - i) * GAP : -20
    const x0 = staff ? navStaff.getBoundingClientRect().left + staffX[0] : W * .2, x1 = staff ? navStaff.getBoundingClientRect().left + staffX[1] : W * .8
    g.beginPath()
    const at = u => { const f = u * (pts.length - 1), k = Math.min(pts.length - 2, Math.floor(f)), r = f - k; return [pts[k][0] + (pts[k + 1][0] - pts[k][0]) * r, pts[k][1] + (pts[k + 1][1] - pts[k][1]) * r] }
    for (let j = 0; j <= N; j++) { const u = j / N, p = at(u), tx = x0 + (x1 - x0) * u
      const x = p[0] + (tx - p[0]) * e, yy = p[1] + (y - p[1]) * e; j ? g.lineTo(x, yy) : g.moveTo(x, yy) }
    g.strokeStyle = INK; g.lineWidth = 1.6 - e * .9; g.globalAlpha = S.fade * (1 - Math.max(0, (e - .9) / .1)); g.stroke(); g.globalAlpha = S.fade
  }
  let lastBow = S.bow, t0 = performance.now()
  function frame () {
    const t = (performance.now() - t0) / 1000
    camera()
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H)
    if (S.fade > .002) {
      g.globalAlpha = S.fade; g.strokeStyle = INK; g.lineCap = 'round'; g.lineJoin = 'round'
      // drafting construction: the horizon and the vanishing point the strings run toward
      if (S.note > .01) {
        const vx = W / 2 + F * R[2] / Fw[2], vy = H / 2 - F * U[2] / Fw[2]
        g.globalAlpha = S.fade * S.note * .35; g.lineWidth = .6; g.setLineDash([2, 5])
        g.beginPath(); g.moveTo(W * .06, vy); g.lineTo(W * .94, vy); g.stroke(); g.setLineDash([])
        g.beginPath(); g.arc(vx, vy, 3, 0, 7); g.stroke()
        g.globalAlpha = S.fade * S.note * .5; g.fillStyle = INK; g.font = '10px "Archivo Narrow", sans-serif'; g.textAlign = 'left'
        g.fillText('V.P.', vx + 7, vy - 6); if (!phone) g.fillText('HORIZON', W * .06, vy - 6)
      }
      // the instrument: body outline, the left f-hole, fingerboard, bridge, nut, in a constant hairline like the rest of the site
      g.globalAlpha = S.fade; g.lineWidth = 1
      instrument()
      // strings: tapering bands in depth; a string the bow (or a click) sets going turns vermilion and blurs, like a long exposure
      const speed = Math.abs(S.bow - lastBow); lastBow = S.bow
      const showBow = S.bow > -1.35 && S.bow < 1.35, bx = S.bow * 520, hair = showBow ? [bx - 278, bx + 292] : [0, -1]
      NOTES.forEach((s, i) => {
        if (S.lift > 0) { liftString(s, i); return }
        const xb = strAt(s, (ZB - NUT) / (BRIDGE - NUT))[0]
        if (xb > hair[0] && xb < hair[1]) amp[i] = Math.min(1, amp[i] + speed * 16)
        amp[i] *= .965
        const A = amp[i] * 1.3, wv = 2 * Math.PI * s.f / 196 * 3.1, N = 48, on = amp[i] > .08
        const pts = Array.from({ length: N + 1 }, (_, j) => { const u = j / N, p = strAt(s, u)
          p[0] += A * (Math.sin(Math.PI * u) * Math.sin(t * wv) + .3 * Math.sin(2 * Math.PI * u) * Math.sin(t * wv * 2.01 + 1)); return [p, u] })
        if (A > .05) { g.fillStyle = `rgba(185,28,28,${.1 + amp[i] * .12})`
          band(pts.map(([p, u]) => [p[0] + A * Math.sin(Math.PI * u), p[1], p[2]]), pts.map(([p, u]) => [p[0] - A * Math.sin(Math.PI * u), p[1], p[2]])) }
        g.fillStyle = g.strokeStyle = on ? '#B91C1C' : INK
        band(pts.map(([p]) => [p[0] - s.w, p[1], p[2]]), pts.map(([p]) => [p[0] + s.w, p[1], p[2]]))
        g.lineWidth = .7; g.beginPath(); path3(pts.map(([p]) => p)); g.stroke()
        if (S.note > .01) { g.globalAlpha = S.fade * S.note; g.font = '500 16px Cinzel, serif'; g.textAlign = 'center'; label(strAt(s, 0), s.n, 0, 30); g.globalAlpha = S.fade }
      })
      g.strokeStyle = INK; g.fillStyle = INK
      if (showBow) drawBow(bx)
      if (S.note > .01 && !phone) {   // drafting notes
        g.globalAlpha = S.fade * S.note * .55; g.font = '10px "Archivo Narrow", sans-serif'; g.textAlign = 'left'
        label([12, 20.5, NUT], 'NUT', 12, 4); label([22, 33, BRIDGE], 'BRIDGE', 8, -4); label([56, 0, 222], 'F-HOLE', 8, 4)
        g.fillText('G 196 · D 294 · A 440 · E 659 HZ', W * .7, H * .5); g.fillText('CLICK A STRING TO HEAR IT', W * .7, H * .5 + 16)
      }
    }
    g.globalAlpha = 1
    // the right f-hole is cut in the svg: its outline in ink, and the photograph behind it
    const c = FH.map(s => s.map(view)), ok = c.every(s => s.every(p => p[2] > NEAR))
    const d = ok ? c.map(s => 'M' + s.map(p => scr(p).map(v => v.toFixed(1)).join(',')).join('L') + 'Z').join('') : ''
    fg.setAttribute('d', d); fline.setAttribute('d', d); fline.style.opacity = S.fade
    fpg.setAttribute('opacity', S.open)
    if (S.blur > .1) { blur.setAttribute('stdDeviation', S.blur.toFixed(2)); photo.setAttribute('filter', 'url(#fblur)') } else photo.removeAttribute('filter')
    flyNotes(t)
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
    let best = -1, bd = 22
    NOTES.forEach((s, i) => { for (let j = 0; j <= 30; j++) { const c = view(strAt(s, j / 30)); if (c[2] < NEAR) continue
      const [x, y] = scr(c), dd = Math.hypot(e.clientX - x, e.clientY - y); if (dd < bd) { bd = dd; best = i } } })
    if (best >= 0) { amp[best] = 1; pluck(NOTES[best].f) }
  })
  const pointer = () => { cv.style.pointerEvents = S.cam < .3 && !phone ? 'auto' : 'none' }
  gsap.ticker.add(frame); gsap.ticker.add(pointer)

  placePhoto(); heroImg.complete || heroImg.addEventListener('load', placePhoto, { once: true })
  if (phone) document.documentElement.style.overflow = 'hidden'

  const end = () => { document.documentElement.style.overflow = ''; seen() }
  const tl = phone
    ? gsap.timeline({ delay: .4, onComplete: end })
    : gsap.timeline({ scrollTrigger: { trigger: run, start: 'top top', end: 'bottom bottom', scrub: 1, onLeave: seen } })
  const startW = innerWidth
  addEventListener('resize', function bail () {
    if (Math.abs(innerWidth - startW) < 2) return
    removeEventListener('resize', bail); tl.scrollTrigger?.kill(); tl.kill(); gsap.ticker.remove(frame); gsap.ticker.remove(pointer); stage.remove()
    gsap.set([...marks, heroImg, '.table .t-text', '.table .readout', ...letters], { clearProps: 'all' })
    gsap.set(navStaff, { clearProps: '--staff,--notes' })
    document.documentElement.classList.remove('intro'); document.documentElement.style.overflow = ''; scrollTo(0, 0); ScrollTrigger.refresh()
  })
  if (phone) { tl.timeScale(1.5); const skip = () => tl.timeScale(8); addEventListener('touchstart', skip, { once: true }); addEventListener('wheel', skip, { once: true }) }

  tl.to('.oneline-cue', { opacity: 0, duration: .3 }, .2)
    .to(S, { note: 0, duration: .8 }, .3)                                                // the drafting notes fall away as the camera moves
    .to(S, { cam: 1, duration: 2.5, ease: 'power1.inOut' }, 0)                           // the camera runs down the strings toward the bridge
    .to(S, { bow: 1.4, duration: 1.7, ease: 'power1.inOut' }, 1.1)                       // one long down-bow by the bridge; the strings ring…
  NOTES.forEach((_, i) => tl.to(S, { ['k' + i]: 1, duration: .95, ease: 'power2.inOut' }, 1.55 + i * .12))   // …and each one throws its note up to the staff
  if (navStaff && !phone) tl.fromTo(navStaff, { '--notes': 0 }, { '--notes': 1, duration: .2 }, 2.85)
  tl.to(S, { lift: 1, duration: .95, ease: 'power2.inOut' }, 2.8)                        // the four strings peel off and straighten into the staff
  if (navStaff && !phone) tl.fromTo(navStaff, { '--staff': 0 }, { '--staff': 1, duration: .2 }, 3.6)
  tl.to(S, { cam: 2, duration: 1, ease: 'power2.inOut' }, 2.75)                          // the camera rises and turns to the f-hole…
    .to(S, { open: 1, duration: .6, ease: 'power1.out' }, 3.0)                            // …where she is, out of focus
    .to(S, { cam: 3, duration: 1, ease: 'power2.in' }, 3.7)                               // the camera drops through the f-hole
    .to(S, { blur: 0, duration: .9, ease: 'power2.in' }, 3.75)                            // and the photograph comes into focus
    .to(ffill, { opacity: 1, duration: .15, ease: 'power1.in' }, 4.62)
    .to(S, { fade: 0, duration: .15 }, 4.65)
    .set(heroImg, { opacity: 1 }, 4.8)                                                   // the page's own photograph, under the stage's identical one…
    .to(stage, { opacity: 0, duration: .2 }, 4.85)                                        // nothing moves: the stage's photograph and the page's are the same picture
    .fromTo(marks.filter(m => !m.matches('.dim,.stamp')), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .35, stagger: .05, ease: 'power3.out' }, 4.95)   // the plate is marked up
    .fromTo($('.plate-photo .dim', run), { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .55, ease: 'power3.inOut' }, 5.05)
    .fromTo($('.plate-photo .stamp', run), { opacity: 0, scale: 1.7, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: .22, ease: 'power4.in' }, 5.5)   // and stamped
    .fromTo('.table .t-text', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .5 }, 5.15)
    .to(S, { settle: 1, duration: 1.4, ease: 'power2.out' }, 5.15)                        // the name rings, then rests
    .to('.table .readout', { opacity: .75, duration: .4 }, 5.6)
  tl.to({}, { duration: .4 })
}
