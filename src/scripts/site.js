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

/* home: hovering (or focusing) a peg rings its string, turns the peg and shows a preview of the page it leads to. Mouse and keyboard only. */
const strNav = $('.strings-nav')
if (strNav && innerWidth > 860) {
  const svg = $('#tdraw', strNav)
  let current = null, closeT
  const open = key => {
    clearTimeout(closeT); if (current === key) return; current = key
    $$('.call', svg).forEach(a => a.classList.toggle('on', a.dataset.key === key))
    $$('.str', svg).forEach(s => s.classList.toggle('on', !!key && $(`.call[data-key="${key}"]`, svg)?.dataset.s === s.dataset.s))
    $$('.sn-panel', strNav).forEach(p => p.classList.toggle('on', p.dataset.for === key))
  }
  $$('.call', svg).forEach(a => { a.addEventListener('mouseenter', () => open(a.dataset.key)); a.addEventListener('focus', () => open(a.dataset.key)) })
  $$('.sn-panel', strNav).forEach(p => p.addEventListener('mouseenter', () => clearTimeout(closeT)))
  strNav.addEventListener('mouseleave', () => { closeT = setTimeout(() => open(null), 250) })
  // touch screens: a tap on a peg simply opens its page (the panels are a mouse-hover extra)
}

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
    // the band holds still while the violin draws itself with the scroll, then its four pegs appear
    const wide = innerWidth > 860
    // drawing starts as the band comes up the screen and finishes while it holds still at the top
    if (wide) ScrollTrigger.create({ trigger: '.strings-nav', start: 'top top', end: '+=160%', pin: true })   // it stays a good while, so the pegs can be explored
    gsap.timeline({ scrollTrigger: wide ? { trigger: '.strings-nav', start: 'top 80%', end: () => '+=' + innerHeight * 1.3, scrub: .6 } : { trigger: tdraw, start: 'top 90%', end: 'top 25%', scrub: .6 } })
      .to(ink, { strokeDashoffset: 0, duration: 2.2, ease: 'none' }, 0)
      .to($('.cav', tdraw), { opacity: 1, duration: .3 }, 1.9)
      .to($$('.call', tdraw), { opacity: 1, duration: .4, stagger: .1 }, 2.0)
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

/* landing intro, "four strings" (A+B on the full-screen hero): four ink strings are drawn; one down-bow crosses them and each
   string, as the hair takes it, rings and throws its note up to the header staff (with "Sound" on, scrolling is bowing); the
   strings rise one by one and become the staff lines; a vermilion pen cuts an f-hole into the empty paper; her photograph is
   behind it, out of focus, and comes into focus as the camera goes through; it stays, full screen, and is marked up as a plate. */
function landingIntro (tdraw) {
  const seen = () => { try { localStorage.setItem('introSeen', '1') } catch {} }   // first visit only; the footer link replays it
  window.__introRunning = true
  const phone = innerWidth <= 860                // phones: the same film, timed (a tap fast-forwards), no header staff to land on
  const timed = phone || matchMedia('(pointer: coarse)').matches   // touch screens (tablets too): a swipe flings past a scroll-driven film, so it plays by itself
  if (timed) document.documentElement.classList.add('intro-timed')
  scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true })
  const run = $('.intro-run'), heroImg = $('.plate-photo img', run), marks = $$('.plate-photo .mk', run), h1 = $('.table h1', run)
  const W = innerWidth, H = innerHeight, RED = '#B91C1C', INK = '#18181B', PAPER = '#F7F3EA'
  const de = document.documentElement.lang === 'de'


  // the stage: a canvas for strings and bow, an svg for the cut, the photograph and its paper
  const FHOLE = tdraw.dataset.fhole.split(/(?=M)/).slice(0, 3).join(' ')   // the right-hand f-hole of the site's violin drawing (bbox ≈ x 24–55, y 154–226)
  const PIV = [36.5, 189.5], s0 = (phone ? .4 : .48) * H / 72
  const img = heroImg.currentSrc || heroImg.src
  const stage = document.createElement('div'); stage.className = 'dstage'; stage.setAttribute('aria-hidden', 'true')
  stage.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><defs>
      <mask id="fmask" maskUnits="userSpaceOnUse" x="-${W}" y="-${H}" width="${3 * W}" height="${3 * H}">
        <rect x="-${W}" y="-${H}" width="${3 * W}" height="${3 * H}" fill="#000"/><g class="fh"><path d="${FHOLE}" fill="#fff" class="fhfill"/></g>
        <circle class="ffill" cx="${W / 2}" cy="${H / 2}" r="0" fill="#fff"/></mask>
      <filter id="ffocus" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur class="fblur" stdDeviation="0"/></filter>
      <filter id="fsoft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".9"/></filter>
</defs>
    <g mask="url(#fmask)"><image class="fphoto" href="${img}" preserveAspectRatio="none"/><image class="fsoft" preserveAspectRatio="none"/>
      <g class="fh"><path d="${FHOLE}" fill="none" stroke="#000" stroke-opacity=".5" class="fshadow" /></g></g>
    <g class="fh"><path d="${FHOLE}" fill="none" stroke="${INK}" class="fcut"/></g><circle class="ftip" r="3.4" fill="${RED}" opacity="0"/></svg>
    <button class="snd" type="button" aria-pressed="false">${de ? 'Ton' : 'Sound'}</button>`
  const cv = document.createElement('canvas'), g = cv.getContext('2d'), dpr = Math.min(devicePixelRatio, matchMedia('(pointer: coarse)').matches ? 1.25 : 2)
  cv.width = W * dpr; cv.height = H * dpr; stage.prepend(cv); document.body.appendChild(stage)
  const fh = $$('.fh', stage), cut = $('.fcut', stage), hole = $('.fhfill', stage), shadow = $('.fshadow', stage)
  const soft = $('.fsoft', stage), fill = $('.ffill', stage), photo = $('.fphoto', stage), blur = $('.fblur', stage), tipDot = $('.ftip', stage), snd = $('.snd', stage)
  const CUT = cut.getTotalLength()
  cut.setAttribute('stroke-width', 1.1 / s0); cut.style.strokeDasharray = CUT; shadow.setAttribute('stroke-width', 3.2 / s0)

  // strings, nut at the top and bridge at the bottom, a little wider apart than life so the names can be read
  const NOTES = [{ n: 'G', f: 196.00, w: 2.4 }, { n: 'D', f: 293.66, w: 1.85 }, { n: 'A', f: 440.00, w: 1.4 }, { n: 'E', f: 659.25, w: 1 }]
  const S = { draw: 0, notes: 0, bowIn: 0, bow: 0, l0: 0, l1: 0, l2: 0, l3: 0, k0: 0, k1: 0, k2: 0, k3: 0, fade: 1, cut: 0, open: 0, push: 1, focus: 0, fill: 0, settle: 0 }
  const amp = [0, 0, 0, 0]
  const NUT = H * (phone ? .17 : .14), BRIDGE = H * (phone ? .78 : .82), BOW_Y = .68, CX = W / 2
  const SP = phone ? [20, 34] : [30, 52]
  const ease = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
  const staffTop = () => navStaff ? navStaff.getBoundingClientRect().top : 0, staffLeft = () => navStaff ? navStaff.getBoundingClientRect().left : 0
  const lerp = (a, b, e) => ({ x0: a.x0 + (b.x0 - a.x0) * e, y0: a.y0 + (b.y0 - a.y0) * e, x1: a.x1 + (b.x1 - a.x1) * e, y1: a.y1 + (b.y1 - a.y1) * e })
  function geom (i) {
    const k = i - 1.5
    const A = { x0: CX + k * SP[0], y0: NUT, x1: CX + k * SP[1], y1: BRIDGE }
    const e = S['l' + i]; if (!e) return A
    const staff = navStaff && !phone, y = staff ? staffTop() + TOP + (4 - i) * GAP : -30
    const L0 = staff ? staffLeft() + staffX[0] : A.x0 - 200, L1 = staff ? staffLeft() + staffX[1] : A.x1 + 200, mid = (L0 + L1) / 2
    const seg = (u, a, b) => Math.max(0, Math.min(1, (u - a) / (b - a)))
    const r = ease(seg(e, 0, .38)), f = ease(seg(e, .38, .7)), w = ease(seg(e, .7, 1))
    const top = { x: A.x0, y: A.y0 }, stub = 14                                        // 1. retract into the nut
    let p0 = { x: top.x, y: top.y }, p1 = { x: A.x1 + (top.x - A.x1) * r, y: A.y1 + (top.y + stub - A.y1) * r }
    if (f > 0) { const tx = mid, ty = y                                                  // 2. the short stroke flies up to its line, turning flat
      p0 = { x: top.x + (tx - stub - top.x) * f, y: top.y + (ty - top.y) * f }; p1 = { x: top.x + (tx + stub - top.x) * f, y: top.y + stub + (ty - top.y - stub) * f } }
    if (w > 0) { p0 = { x: mid - stub + (L0 - mid + stub) * w, y }; p1 = { x: mid + stub + (L1 - mid - stub) * w, y } }   // 3. ruled out across the staff
    return { x0: p0.x, y0: p0.y, x1: p1.x, y1: p1.y }
  }

  // the bow, side view: a cambered stick that tapers to the tip, the hair, the frog with its pearl eye, the hatchet head
  const BOWLEN = Math.min(W * (phone ? .7 : .5), 640)
  function drawBow (x0, y) {
    const L = BOWLEN, tip = x0 + L
    g.save(); g.lineJoin = 'round'
    g.fillStyle = PAPER; g.strokeStyle = INK; g.lineWidth = .8
    g.beginPath(); g.rect(x0 + 30, y, L - 40, 4); g.fill(); g.stroke()                               // hair
    g.fillStyle = INK; g.beginPath()                                                                    // stick, thick at the frog, fine at the tip, sagging toward the hair
    for (let j = 0; j <= 40; j++) { const u = j / 40; g.lineTo(x0 + 4 + (L - 8) * u, y - 15 + 6 * Math.sin(Math.PI * u) - (2.2 - 1.2 * u)) }
    for (let j = 40; j >= 0; j--) { const u = j / 40; g.lineTo(x0 + 4 + (L - 8) * u, y - 15 + 6 * Math.sin(Math.PI * u) + (2.2 - 1.2 * u)) }
    g.fill()
    g.beginPath(); g.moveTo(tip - 14, y + 4); g.lineTo(tip - 1, y + 4); g.lineTo(tip + 4, y - 15); g.quadraticCurveTo(tip - 4, y - 18, tip - 10, y - 15); g.closePath(); g.fill()   // head
    g.strokeStyle = PAPER; g.lineWidth = 1.1; g.beginPath(); g.moveTo(tip + 2.5, y - 13.5); g.lineTo(tip - 1.5, y + 2.5); g.stroke()                                              // ivory face
    g.fillStyle = INK; g.beginPath(); g.roundRect(x0, y - 15, 32, 23, [3, 3, 7, 3]); g.fill()                                                                                       // frog
    g.fillStyle = PAPER; g.beginPath(); g.arc(x0 + 15, y - 4, 3.6, 0, 7); g.fill()                                                                                                  // pearl eye
    g.fillStyle = '#B8B2A6'; g.fillRect(x0 + 30, y - 1, 3, 9)                                                                                                                      // ferrule
    g.fillStyle = INK; g.fillRect(x0 - 16, y - 14, 16, 7); g.fillStyle = '#B8B2A6'; g.fillRect(x0 - 10, y - 14, 2.5, 7)                                                            // button
    g.restore()
    return [x0 + 30, x0 + L - 10]
  }

  // sound: with "Sound" on, each open string is a bowed voice whose loudness follows the bow (and a pluck when clicked)
  let ac, voices = null
  function audio () {
    if (ac) return ac
    ac = new (window.AudioContext || window.webkitAudioContext)()
    const master = ac.createGain(); master.gain.value = .55
    const body = ac.createBiquadFilter(); body.type = 'peaking'; body.frequency.value = 290; body.Q.value = 1.4; body.gain.value = 6   // a little wooden body
    const air = ac.createBiquadFilter(); air.type = 'lowpass'; air.frequency.value = 3200
    body.connect(air).connect(master).connect(ac.destination)
    voices = NOTES.map(s => {
      const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = s.f
      const vib = ac.createOscillator(), vd = ac.createGain(); vib.frequency.value = 5.4; vd.gain.value = s.f * .004; vib.connect(vd).connect(o.frequency)
      const v = ac.createGain(); v.gain.value = 0; o.connect(v).connect(body); o.start(); vib.start()
      return v
    })
    ac.master = master; return ac
  }
  let soundOn = false
  snd.addEventListener('click', e => { e.stopPropagation(); soundOn = !soundOn; snd.setAttribute('aria-pressed', String(soundOn)); if (soundOn) audio().resume(); else ac?.suspend() })
  const pluck = f => { const a = audio(); a.resume(); const sr = a.sampleRate, N = Math.round(sr / f), len = sr * 2.2
    const b = a.createBuffer(1, len, sr), d = b.getChannelData(0), ring = new Float32Array(N).map(() => Math.random() * 2 - 1)
    for (let i = 0; i < len; i++) { const k = i % N, nx = (k + 1) % N; d[i] = ring[k]; ring[k] = .4985 * (ring[k] + ring[nx]) }
    const src = a.createBufferSource(), gn = a.createGain(); gn.gain.value = .3; src.buffer = b; src.connect(gn).connect(a.master); src.start()
    if (!soundOn) setTimeout(() => !soundOn && a.suspend(), 2400) }

  let lastBow = S.bow, t0 = performance.now()
  function frame () {
    const t = (performance.now() - t0) / 1000
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H)
    const speed = Math.abs(S.bow - lastBow); lastBow = S.bow
    const by = NUT + (BRIDGE - NUT) * BOW_Y
    // the down-bow: frog first, then the stick slides left until the tip is on the strings
    const bx0 = CX + 24 - BOWLEN * S.bow - 30
    const hair = S.bowIn > .5 ? [bx0 + 30, bx0 + BOWLEN - 10] : [0, -1]
    if (S.fade > .002) {
      g.globalAlpha = S.fade
      const lift = Math.max(S.l0, S.l1, S.l2, S.l3), labels = S.notes * (1 - Math.min(1, lift * 4))
      NOTES.forEach((s, i) => {
        const q = geom(i), xb = q.x0 + (q.x1 - q.x0) * BOW_Y
        if (xb > hair[0] && xb < hair[1]) amp[i] = Math.min(1, amp[i] + speed * 30)        // the hair is on the string: it sounds while the bow moves
        amp[i] *= .965
        if (voices) voices[i].gain.setTargetAtTime(soundOn ? amp[i] * .09 * S.fade : 0, ac.currentTime, .06)
        const reach = Math.max(0, Math.min(1, S.draw * 1.6 - i * .2))                       // drawn in from the nut, G first
        if (!reach) return
        const li = S['l' + i], A = amp[i] * 10 * (1 - li), wv = 2 * Math.PI * s.f / 196 * 3.1
        const len = Math.hypot(q.x1 - q.x0, q.y1 - q.y0) || 1, nx = (q.y1 - q.y0) / len, ny = -(q.x1 - q.x0) / len
        const at = (u, dd) => [q.x0 + (q.x1 - q.x0) * u + nx * dd, q.y0 + (q.y1 - q.y0) * u + ny * dd]
        if (A > .3) {   // a sounding string blurs, like a long exposure: a faint vermilion lens around it
          g.fillStyle = `rgba(185,28,28,${.09 + amp[i] * .12})`; g.beginPath()
          for (let j = 0; j <= 40; j++) { const u = j / 40, [x, y] = at(u, A * Math.sin(Math.PI * u)); j ? g.lineTo(x, y) : g.moveTo(x, y) }
          for (let j = 40; j >= 0; j--) { const u = j / 40, [x, y] = at(u, -A * Math.sin(Math.PI * u)); g.lineTo(x, y) }
          g.fill()
        }
        g.beginPath()
        for (let j = 0; j <= 80 * reach; j++) { const u = j / 80, dd = A * (Math.sin(Math.PI * u) * Math.sin(t * wv) + .3 * Math.sin(2 * Math.PI * u) * Math.sin(t * wv * 2.01 + 1)); const [x, y] = at(u, dd); j ? g.lineTo(x, y) : g.moveTo(x, y) }
        g.strokeStyle = amp[i] > .08 ? RED : INK; g.lineWidth = s.w * (1 - li * .6); g.lineCap = 'round'; g.stroke()
        if (labels > .01) { g.globalAlpha = S.fade * labels; g.fillStyle = amp[i] > .08 ? RED : INK; g.textAlign = 'center'; g.font = '500 17px Cinzel, serif'; g.fillText(s.n, q.x0, NUT - 18); g.globalAlpha = S.fade }
      })
      if (labels > .01) {   // the drawing's furniture: nut, bridge, the string length, the pitches
        g.globalAlpha = S.fade * labels; g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = 1.2
        const l = CX - 1.5 * SP[0], r = CX + 1.5 * SP[0], bl = CX - 1.5 * SP[1], br = CX + 1.5 * SP[1]
        g.beginPath(); g.moveTo(l - 12, NUT); g.lineTo(r + 12, NUT); g.stroke()
        g.beginPath(); g.moveTo(bl - 26, BRIDGE + 11); g.quadraticCurveTo(CX, BRIDGE - 9, br + 26, BRIDGE + 11); g.lineTo(br + 19, BRIDGE + 4); g.quadraticCurveTo(CX, BRIDGE - 15, bl - 19, BRIDGE + 4); g.closePath(); g.stroke()
        g.globalAlpha = S.fade * labels * .55; g.lineWidth = .7; g.font = '10px "Archivo Narrow", sans-serif'
        const dx = bl - (phone ? 30 : 64)                                                     // a dimension line for the vibrating length
        g.beginPath(); g.moveTo(dx, NUT); g.lineTo(dx, BRIDGE); g.moveTo(dx - 5, NUT); g.lineTo(dx + 5, NUT); g.moveTo(dx - 5, BRIDGE); g.lineTo(dx + 5, BRIDGE); g.stroke()
        g.save(); g.translate(dx - 8, (NUT + BRIDGE) / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.fillText('328 MM', 0, 0); g.restore()
        g.textAlign = 'left'
        if (!phone) {
          g.fillText(de ? 'SATTEL' : 'NUT', r + 22, NUT + 4); g.fillText(de ? 'STEG' : 'BRIDGE', br + 34, BRIDGE + 6)
          const nx = br + 40, ny = NUT + (BRIDGE - NUT) * .34
          g.fillText('G 196 · D 294 · A 440 · E 659 HZ', nx, ny); g.fillText(de ? 'EINE SAITE ANKLICKEN, UM SIE ZU HÖREN' : 'CLICK A STRING TO HEAR IT', nx, ny + 16)
        }
      }
      if (S.bowIn > .01) { g.globalAlpha = S.fade * S.bowIn; drawBow(bx0, by) }
      g.globalAlpha = 1
    }
    // the cut, the hole, the photograph
    const s = s0 * S.push, tr = `translate(${CX},${H / 2}) scale(${s}) translate(${-PIV[0]},${-PIV[1]})`
    fh.forEach(n => n.setAttribute('transform', tr))
    cut.style.strokeDashoffset = CUT * (1 - S.cut); cut.style.opacity = S.cut > 0 ? Math.max(0, 1 - (S.push - 1) / 2) : 0
    hole.style.opacity = S.open; shadow.style.opacity = S.open * Math.max(0, 1 - (S.push - 1) / 6)
    fill.setAttribute('r', (S.fill * Math.hypot(W, H) * .55).toFixed(1))   // an iris opening from the hole, not a cross-fade
    soft.style.opacity = 1 - S.focus                                                   // out of focus = a tiny copy stretched up; no per-frame blur filter (it stutters on iPad)
    if (S.cut > 0 && S.cut < 1) { const q = cut.getPointAtLength(CUT * S.cut).matrixTransform(cut.getCTM()); tipDot.setAttribute('cx', q.x); tipDot.setAttribute('cy', q.y); tipDot.setAttribute('opacity', 1) } else tipDot.setAttribute('opacity', 0)
    flyNotes()
    // the name rings like a string, then comes to rest
    const a = (1 - S.settle) * 7
    letters.forEach((l, i) => { l.style.transform = a > .05 ? `translateY(${(Math.sin(t * 26 + i * .9) * a).toFixed(2)}px)` : '' })
  }
  // the stage photograph is laid out exactly like the hero image, so when the stage lifts nothing moves
  function placePhoto () {
    const iw = heroImg.naturalWidth || 1983, ih = heroImg.naturalHeight || 793, k = Math.max(W / iw, H / ih), w = iw * k, h = ih * k
    const [px, py] = getComputedStyle(heroImg).objectPosition.split(' ').map(v => parseFloat(v) / 100)
    for (const im of [photo, soft]) { im.setAttribute('x', (W - w) * px); im.setAttribute('y', (H - h) * py); im.setAttribute('width', w); im.setAttribute('height', h) }
    try { const c = document.createElement('canvas'); c.width = 40; c.height = Math.round(40 * ih / iw); c.getContext('2d').drawImage(heroImg, 0, 0, c.width, c.height); soft.setAttribute('href', c.toDataURL('image/jpeg', .7)) } catch {}
  }
  // each note leaves the point where the hair met its string and lands on its place on the header staff
  const noteTarget = i => { const n = navStaff && !phone ? $$('.nt', navStaff)[i] : null; if (!n) return [W * (.3 + i * .13), -20]; const b = n.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2] }
  function flyNotes () {
    NOTES.forEach((s, i) => {
      const k = S['k' + i]; if (k <= 0 || k >= 1) return
      const q = geom(i), x0 = q.x0 + (q.x1 - q.x0) * BOW_Y, y0 = q.y0 + (q.y1 - q.y0) * BOW_Y, [x1, y1] = noteTarget(i)
      const cx = (x0 + x1) / 2 + (i - 1.5) * 70, cy = Math.min(y0, y1) - 90, e = k
      const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * x1, y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * y1
      const r = 3.6 + 7 * Math.sin(Math.PI * e) * (1 - e * .6)
      g.save(); g.globalAlpha = Math.min(1, k * 6) * (1 - Math.max(0, (k - .92) / .08))
      g.translate(x, y); g.rotate(-.38); g.fillStyle = RED; g.beginPath(); g.ellipse(0, 0, r, r * .7, 0, 0, 7); g.fill(); g.restore()
    })
  }
  const letters = []
  h1.childNodes.forEach(n => { if (n.nodeType === 3 && n.textContent.trim()) { const f = document.createDocumentFragment(); [...n.textContent].forEach(c => { const sp = document.createElement('span'); sp.className = 'l'; sp.textContent = c; f.appendChild(sp); letters.push(sp) }); n.replaceWith(f) } })

  cv.addEventListener('click', e => {
    let best = -1, bd = 26
    NOTES.forEach((s, i) => { const q = geom(i), u = (e.clientY - q.y0) / (q.y1 - q.y0); if (u < 0 || u > 1) return; const dx = Math.abs(e.clientX - (q.x0 + (q.x1 - q.x0) * u)); if (dx < bd) { bd = dx; best = i } })
    if (best >= 0) { amp[best] = 1; pluck(NOTES[best].f) }
  })
  const pointer = () => {
    cv.style.pointerEvents = !S.l0 && S.draw > .9 && S.fade > .5 && !phone ? 'auto' : 'none'
    snd.style.opacity = S.fade * S.notes; snd.style.pointerEvents = S.fade * S.notes > .3 ? 'auto' : 'none'
    if (S.fade < .01 && soundOn) { soundOn = false; snd.setAttribute('aria-pressed', 'false'); ac?.suspend() }
  }
  gsap.ticker.add(frame); gsap.ticker.add(pointer)

  placePhoto(); heroImg.complete || heroImg.addEventListener('load', placePhoto, { once: true })
  if (timed) document.documentElement.style.overflow = 'hidden'

  const end = () => { document.documentElement.style.overflow = ''; seen() }
  const tl = timed
    ? gsap.timeline({ delay: .3, onComplete: end })
    : gsap.timeline({ scrollTrigger: { trigger: run, start: 'top top', end: 'bottom bottom', scrub: 1, onLeave: seen } })
  const startW = innerWidth
  const finish = () => {
    tl.scrollTrigger?.kill(); tl.kill(); gsap.ticker.remove(frame); gsap.ticker.remove(pointer); stage.remove(); ac?.close()
    gsap.set([...marks, heroImg, '.table .t-text', '.table .readout', ...letters], { clearProps: 'all' })
    gsap.set(navStaff, { clearProps: '--staff,--notes' })
    document.documentElement.classList.remove('intro', 'intro-timed'); document.documentElement.style.overflow = ''; scrollTo(0, 0); ScrollTrigger.refresh()
  }
  addEventListener('resize', function bail () { if (Math.abs(innerWidth - startW) < 2) return; removeEventListener('resize', bail); finish() })
  if (timed) {
    tl.timeScale(1.15)
    const skip = e => { if (e.target.closest?.('.snd')) return; tl.timeScale(8); removeEventListener('touchstart', skip); removeEventListener('wheel', skip) }
    addEventListener('touchstart', skip); addEventListener('wheel', skip)
  }

  tl.to(S, { draw: 1, duration: .8, ease: 'power2.out' }, 0)                            // the strings are drawn in, G first
    .to(S, { notes: 1, duration: .4 }, .45)                                               // nut, bridge, names, the length
    .to('.oneline-cue', { opacity: 0, duration: .3 }, .9)
    .to(S, { bowIn: 1, duration: .3 }, .7)
    .to(S, { bow: 1, duration: 2, ease: 'power1.inOut' }, .8)                            // one down-bow, frog to tip…
  // …and as the hair takes each string, that string throws its note up to the header staff (E is reached first, G last)
  ;[3, 2, 1, 0].forEach((i, n) => tl.to(S, { ['k' + i]: 1, duration: .9, ease: 'power2.inOut' }, 1.25 + n * .28))
  if (navStaff && !phone) tl.fromTo(navStaff, { '--notes': 0 }, { '--notes': 1, duration: .2 }, 2.6)
  tl.to(S, { bowIn: 0, duration: .25 }, 2.7)
  NOTES.forEach((_, i) => tl.to(S, { ['l' + i]: 1, duration: .95, ease: 'none' }, 2.7 + i * .09))   // the strings rise one by one to their staff lines
  if (navStaff && !phone) tl.fromTo(navStaff, { '--staff': 0 }, { '--staff': 1, duration: .2 }, 3.85)
  tl.to(S, { fade: 0, duration: .15 }, 3.95)
    .to(S, { cut: 1, duration: .65, ease: 'power1.inOut' }, 3.65)                          // a vermilion pen cuts an f-hole into the empty paper
    .to(S, { open: 1, duration: .3 }, 4.05)                                               // her photograph is behind it, out of focus
    .to(S, { push: 34, duration: 1.3, ease: 'power3.in' }, 4.3)                           // the camera goes through…
    .to(S, { focus: 1, duration: 1.05, ease: 'power2.inOut' }, 4.45)                      // …and focus pulls in
    .to(S, { fill: 1, duration: .5, ease: 'power2.inOut' }, 5.15)                         // an iris opens from the hole
    .set(heroImg, { opacity: 1 }, 5.6)                                                    // the page's own photograph, under the identical one
    .to(stage, { opacity: 0, duration: .2 }, 5.65)
    .fromTo(marks.filter(m => !m.matches('.dim,.stamp')), { opacity: 0, scale: .6 }, { opacity: 1, scale: 1, duration: .35, stagger: .05, ease: 'power3.out' }, 5.75)   // the plate is marked up
    .fromTo($('.plate-photo .dim', run), { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: .55, ease: 'power3.inOut' }, 5.85)
    .fromTo($('.plate-photo .stamp', run), { opacity: 0, scale: 1.7, rotation: -14 }, { opacity: 1, scale: 1, rotation: -4, duration: .22, ease: 'power4.in' }, 6.3)   // and stamped
    .fromTo('.table .t-text', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: .5 }, 5.95)
    .to(S, { settle: 1, duration: 1.4, ease: 'power2.out' }, 5.95)                        // the name rings, then rests
    .to('.table .readout', { opacity: .75, duration: .4 }, 6.4)
    .to({}, { duration: .4 })
}
