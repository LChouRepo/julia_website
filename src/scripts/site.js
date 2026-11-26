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
const setMenu = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', String(open)); open ? lenis?.stop() : lenis?.start(); if (open) $('.hm-list a', menu)?.focus() }
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
  f.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${f.dataset.yt}?autoplay=1" title="${a.getAttribute('aria-label')}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`
}))
const lb = $('dialog.lb')
if (lb) {
  $$('.gallery .photo').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); $('img', lb)?.remove()
    const im = new Image(); im.src = a.dataset.full; im.alt = $('img', a).alt; lb.prepend(im); lb.showModal()
  }))
  lb.addEventListener('click', () => lb.close())
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
      form.hidden = true; sent.style.display = 'block'
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
    .from(g.children, { y: -40, rotation: i => (i % 2 ? 5 : -5), opacity: 0, duration: .75, stagger: .07, ease: 'back.out(1.6)' })))
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

/* landing intro: the pen never lifts. The homepage violin is drawn as one continuous line, large and centred, then slides into
   its place and becomes the clean outline. The strokes a single line has to drag between parts peel off: some fly up and become
   the header staff and its notes, the rest gather into the red pin. A print drifts down from the top right like falling paper,
   and the pin strikes it: the print jolts, swings on the pin and comes to rest. */
function landingIntro (tdraw) {
  const phone = innerWidth <= 860   // phones: a short timed version over the normal layout; the violin settles into its faint corner
  scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true })   // everything below is measured from the opening frame
  const NS = 'http://www.w3.org/2000/svg', run = $('.intro-run'), line = $('.oneline', tdraw), ink = $('.ink', tdraw), tip = $('.oneline-tip', run)
  const print = $('.t-print', run), pin = $('.pin', print)
  // one stroke: sample every piece of the outline, chain the pieces nearest-end-first (reversing where shorter); remember the drag strokes between them
  const probe = document.createElementNS(NS, 'path'); tdraw.appendChild(probe)
  const pieces = ink.getAttribute('d').split(/(?=M)/).map(d => { probe.setAttribute('d', d); const L = probe.getTotalLength(), n = Math.max(2, Math.ceil(L / 1.2))
    return Array.from({ length: n + 1 }, (_, i) => { const q = probe.getPointAtLength(L * i / n); return [q.x, q.y] }) })
  tdraw.removeChild(probe)
  const pts = pieces.shift(), drags = [], dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1])
  while (pieces.length) {
    const end = pts[pts.length - 1]; let best = 0, rev = false, bd = Infinity
    pieces.forEach((pc, i) => { const a = dist(end, pc[0]), b = dist(end, pc[pc.length - 1]); if (a < bd) { bd = a; best = i; rev = false } if (b < bd) { bd = b; best = i; rev = true } })
    const pc = pieces.splice(best, 1)[0]; if (rev) pc.reverse()
    if (bd > 3) drags.push([end, pc[0], bd])
    pts.push(...pc)
  }
  let d = ''; const at = []
  pts.forEach(([x, y], i) => { d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); at.push(d.length) })

  // where things come to rest, measured before anything moves
  print.classList.add('developed')
  gsap.set(print, { opacity: 1, transformOrigin: '50% 0%', x: 0, y: 0, rotation: 2 })   // it hangs from the pin, so it swings about the pin
  const pr = pin.getBoundingClientRect(), PIN = [pr.left + pr.width / 2, pr.top + pr.height / 2], R = print.getBoundingClientRect()
  const r0 = tdraw.getBoundingClientRect(), top = $('nav').getBoundingClientRect().bottom + (phone ? 24 : 48), bot = innerHeight - (phone ? 60 : 24)
  const k0 = Math.min((bot - top) / r0.height, (phone ? .9 : 2) * innerWidth / r0.width)
  if (phone) { gsap.set(tdraw, { opacity: 1 }); document.documentElement.style.overflow = 'hidden' }   // hold the page still while it plays (a tap skips)
  gsap.set(tdraw, { x: innerWidth / 2 - (r0.left + r0.width / 2), y: (top + bot) / 2 - (r0.top + r0.height / 2), scale: k0 })

  // the print's motion, one function of two progress values: the fall (F) and the swing after the pin goes in (J)
  const M = { F: 0, J: 0 }, x0 = innerWidth - R.left - R.width * .25, y0 = -(R.bottom + 80)
  const sway = P => 80 * (1 - P) * Math.sin(Math.PI * 2 * 2.2 * P)                  // a falling sheet slides side to side, less as it slows
  function place () {
    const P = M.F, e = 1 - Math.pow(1 - P, 2.4), dP = .002
    const x = x0 * (1 - e) + sway(P), y = y0 * (1 - e)
    const Pv = Math.min(P, 1 - dP)                                                    // keep the slope sample inside [0, 1]: pow of a negative is NaN, and a NaN rotation freezes the print
    const vx = (x0 * (Math.pow(1 - Pv, 2.4) - Math.pow(1 - Pv - dP, 2.4)) + sway(Pv + dP) - sway(Pv)) / dP
    let rot = 2 + Math.max(-16, Math.min(16, vx * .018)) * (1 - P * .6)               // it tilts toward the way it is sliding
    const t = M.J * 1.1, k = Math.exp(-4.2 * t)                                       // struck: a swing about the pin that dies away
    rot += 4.5 * k * Math.sin(Math.PI * 2 * 1.5 * t)
    gsap.set(print, { x, y, rotation: rot })
  }
  place()

  // the drag strokes, as an overlay in screen space; longest five become the staff lines, the next four the notes, the rest the pin
  const fly = document.createElementNS(NS, 'svg'); fly.setAttribute('class', 'string-fly'); fly.setAttribute('aria-hidden', 'true'); document.body.appendChild(fly)
  drags.sort((a, b) => b[2] - a[2])
  const pick = (i) => drags[i % drags.length]
  const mk = ([a, b]) => { const l = document.createElementNS(NS, 'line'); l.dataset.a = a; l.dataset.b = b; for (const k of ['x1', 'y1', 'x2', 'y2']) l.setAttribute(k, 0); fly.appendChild(l); return l }
  const staffL = [0, 1, 2, 3, 4].map(i => mk(pick(i))), noteL = [5, 6, 7, 8].map(i => mk(pick(i))), pinL = (phone ? drags : drags.slice(9)).map(mk)
  const head = document.createElementNS(NS, 'circle'); head.setAttribute('class', 'pinhead'); head.setAttribute('cx', PIN[0]); head.setAttribute('cy', PIN[1] - 26); head.setAttribute('r', 0); fly.appendChild(head)
  const sc = (l, k) => { const [x, y] = l.dataset[k].split(',').map(Number), q = new DOMPoint(x, y).matrixTransform(ink.getScreenCTM()); return q }
  const from = l => ({ x1: () => sc(l, 'a').x, y1: () => sc(l, 'a').y, x2: () => sc(l, 'b').x, y2: () => sc(l, 'b').y })
  const staffTop = () => navStaff.getBoundingClientRect().top
  const notes = () => $$('.nt', navStaff).map(n => { const b = n.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2] })
  gsap.set(fly, { opacity: 0 })

  const S = { draw: 0 }
  let shown = -1
  gsap.ticker.add(() => {
    place()
    const n = Math.round(S.draw * (pts.length - 1))
    if (n !== shown) { line.setAttribute('d', n > 0 ? d.slice(0, at[n]) : ''); shown = n }
    if (S.draw > 0 && S.draw < 1) { const q = new DOMPoint(...pts[n]).matrixTransform(line.getScreenCTM()); tip.style.transform = `translate(${q.x}px,${q.y}px)`; tip.style.opacity = 1 } else tip.style.opacity = 0
  })

  const tl = phone
    ? gsap.timeline({ delay: .3, onComplete: () => { document.documentElement.style.overflow = '' } })
    : gsap.timeline({ scrollTrigger: { trigger: run, start: 'top top', end: 'bottom bottom', scrub: 1 } })
  if (phone) { tl.timeScale(1.6); const skip = () => tl.timeScale(8); addEventListener('touchstart', skip, { once: true }); addEventListener('wheel', skip, { once: true }) }
  tl.to(S, { draw: 1, duration: 2.6, ease: 'none' }, 0)
    .to('.oneline-cue', { opacity: 0, duration: .3 }, .3)
    .to(tdraw, { x: 0, y: 0, scale: 1, duration: .9, ease: 'power2.inOut' }, 2.8)        // the drawing slides into its place
  ;[...staffL, ...noteL, ...pinL].forEach(l => tl.set(l, { attr: from(l) }, 3.745))       // the drag strokes take their place on screen before the hand-off, so none blinks
  tl.set([ink, $('.cav', tdraw), fly], { opacity: 1 }, 3.75)                               // the clean outline takes over in one frame (no crossfade dip)…
    .set(line, { opacity: 0 }, 3.76)                                                      // …and only the drag strokes are left over
    .to(M, { F: 1, duration: 1.5, ease: 'none' }, 3.9)                   // the print drifts down from the top right
  if (phone) tl.to(tdraw, { opacity: .3, duration: .6 }, 4.1)                            // on phones the drawing steps back to a faint corner mark
  if (navStaff && !phone) {
    staffL.forEach((l, i) => tl.fromTo(l, { attr: from(l) }, { immediateRender: false, attr: { x1: () => navStaff.getBoundingClientRect().left + staffX[0], x2: () => navStaff.getBoundingClientRect().left + staffX[1], y1: () => staffTop() + TOP + i * GAP, y2: () => staffTop() + TOP + i * GAP }, duration: .9, ease: 'power3.inOut' }, 4.3 + i * .06))
    noteL.forEach((l, i) => tl.fromTo(l, { attr: from(l) }, { immediateRender: false, attr: { x1: () => notes()[i][0] - 3.6, x2: () => notes()[i][0] + 3.6, y1: () => notes()[i][1], y2: () => notes()[i][1] }, duration: .9, ease: 'power3.inOut' }, 4.5 + i * .06))
    tl.fromTo(navStaff, { '--staff': 0 }, { '--staff': 1, duration: .3 }, 5.25)
      .to(staffL, { opacity: 0, duration: .2 }, 5.3)
      .fromTo(navStaff, { '--notes': 0 }, { '--notes': 1, duration: .4, ease: 'back.out(2)' }, 5.45)
      .to(noteL, { opacity: 0, duration: .15 }, 5.45)
  } else gsap.set([...staffL, ...noteL], { display: 'none' })   // phones send every stroke to the pin instead
  pinL.forEach((l, i) => tl.fromTo(l, { attr: from(l) }, { immediateRender: false, attr: { x1: PIN[0], x2: PIN[0], y1: PIN[1] - 26, y2: PIN[1] - 26 }, stroke: '#B91C1C', duration: .7, ease: 'power3.in' }, 4.35 + i * .01))
  tl.to(head, { attr: { r: 7 }, duration: .2, ease: 'back.out(2)' }, 5.0)               // the gathered strokes roll up into the pin
    .to(pinL, { opacity: 0, duration: .12 }, 5.1)
    .to(head, { attr: { cy: PIN[1] }, duration: .15, ease: 'power2.in' }, 5.25)           // strike, landing the instant the print does
    .set(pin, { opacity: 1 }, 5.4).set(head, { opacity: 0 }, 5.4)
    .to(M, { J: 1, duration: 1.1, ease: 'none' }, 5.4)                  // the print jolts, swings on the pin, and is still
    .fromTo('.table .t-text', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5 }, 5.75)
    .to($$('.call', tdraw), { opacity: 1, duration: .4, stagger: .1 }, 5.85)
    .to('.table .readout', { opacity: .75, duration: .4 }, 6.1)
    .to({}, { duration: .5 })
}
