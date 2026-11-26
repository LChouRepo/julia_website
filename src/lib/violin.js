// Front view of a full-size violin in millimetres. Origin = top centre of the body, y points down.
// v2 (2026-11-26): outline re-drawn from landmarks traced off a CC0 reference photo
// (Wikimedia Commons "File:Violin VL100.png", by Just plain Bill) and checked against Stradivari figures
// (body 354–356, upper bout ~167, C-bout ~108–112, lower bout ~206). Traced: upper 172, C 114, lower 213.
// Shared by D2 (painted) and I / L (line drawings).
const VIOLIN = (() => {
  // right half of the body as cubic segments from the top centre (0,0) to the bottom centre (0,356)
  const HALF = [
    [[24, 0], [47, 2], [63, 10]],          // shoulder at the neck button
    [[77, 20], [85, 40], [86, 62]],        // upper bout, widest at y≈64
    [[87, 82], [83, 98], [79, 108]],       // falling in toward the upper corner
    [[81, 112], [85, 115], [84.5, 119.5]], // upper corner tip
    [[80, 122], [73, 122.5], [68, 125]],   // underside of the corner
    [[60, 131], [57, 142], [57, 153]],     // into the C-bout (narrowest ≈ 57)
    [[57, 170], [60, 186], [70, 196]],     // out of the C-bout
    [[77, 200.5], [87, 201], [93.5, 202.5]], // underside of the lower corner, out to its tip
    [[95.5, 205], [94.5, 210], [92, 214]], // tip turns down
    [[99, 232], [106, 252], [106, 272]],   // lower bout, widest at y≈274
    [[106, 300], [96, 324], [80, 339]],
    [[62, 353], [34, 356], [0, 356]],      // bottom centre
  ]
  const f = n => +n.toFixed(2)
  function bodyPath() {
    let d = 'M0,0 '
    for (const [a, b, c] of HALF) d += `C${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]} `
    // left half: same segments reversed and mirrored
    const pts = [[0, 0], ...HALF.map(s => s[2])]
    for (let i = HALF.length - 1; i >= 0; i--) { const [a, b] = HALF[i], p = pts[i]
      d += `C${f(-b[0])},${b[1]} ${f(-a[0])},${a[1]} ${f(-p[0])},${p[1]} ` }
    return d + 'Z'
  }
  const BODY = bodyPath()
  const NUT = -132, FB_END = 136, BRIDGE = 190, TAIL_TOP = 246, TAIL_BOT = 312, TOP = -229, BOTTOM = 356
  const FINGERBOARD = `M-12,${NUT} L12,${NUT} L21,${FB_END - 4} Q21,${FB_END} 17,${FB_END} L-17,${FB_END} Q-21,${FB_END} -21,${FB_END - 4} Z`
  const NECK = `M-13.5,0 L-11.5,${NUT} L11.5,${NUT} L13.5,0`
  // pegbox and scroll from the front (re-drawn from the reference close-up): two cheeks that narrow upward
  // around a dark peg cavity, then the scroll head with its two volute "ears" and the fluted spine
  const PEGBOX = `M-12,${NUT} L-9.5,-184 C-13,-185 -19.5,-189 -20.5,-197 C-21.5,-206 -17,-213 -10.5,-214 C-9,-221 -5.5,-227 0,-228 C5.5,-227 9,-221 10.5,-214 C17,-213 21.5,-206 20.5,-197 C19.5,-189 13,-185 9.5,-184 L12,${NUT} Z`
  const CAVITY = `M-3.6,${NUT - 3} L3.6,${NUT - 3} L3,-181 Q0,-183.5 -3,-181 Z`
  // carving: volute turns on each ear, the eye, the two flutes along the spine, the throat under the head
  const ear = s => `M${10.5 * s},-214 C${17 * s},-213 ${21.5 * s},-206 ${20.5 * s},-197 M${11 * s},-209 C${16 * s},-208.5 ${18 * s},-204 ${17.5 * s},-198.5 C${17 * s},-194 ${13.5 * s},-191.5 ${11 * s},-192.5 M${12.6 * s},-203.5 a2.4,2.4 0 1,${s > 0 ? 1 : 0} ${2.2 * s},3.4 `
  const SCROLL = ear(1) + ear(-1) + 'M-3.2,-186 C-3.4,-205 -3,-219 -1.2,-226 M3.2,-186 C3.4,-205 3,-219 1.2,-226 M-9.5,-184 C-5,-187.5 5,-187.5 9.5,-184'
  // pegs: G and D on the left (bass side), E and A on the right; staggered, each with collar, shaft and a pear-shaped thumb piece
  const PEGS = [{ s: -1, y: -144, n: 'G' }, { s: -1, y: -167, n: 'D' }, { s: 1, y: -178, n: 'A' }, { s: 1, y: -155, n: 'E' }]
  const peg = (s, y) => `M${11 * s},${y - 3.4} L${13.5 * s},${y - 3.4} L${13.5 * s},${y + 3.4} L${11 * s},${y + 3.4} Z `
    + `M${13.5 * s},${y - 2.1} L${21 * s},${y - 2.4} L${21 * s},${y + 2.4} L${13.5 * s},${y + 2.1} Z `
    + `M${21 * s},${y - 4.6} C${25 * s},${y - 5.2} ${28 * s},${y - 8.2} ${33 * s},${y - 8} C${38.5 * s},${y - 7.8} ${40 * s},${y - 4} ${40 * s},${y} C${40 * s},${y + 4} ${38.5 * s},${y + 7.8} ${33 * s},${y + 8} C${28 * s},${y + 8.2} ${25 * s},${y + 5.2} ${21 * s},${y + 4.6} Z`
  const PEG_D = PEGS.map(p => peg(p.s, p.y)).join(' ')
  const PEG_EYE = PEGS.map(({ s, y }) => `M${34.5 * s},${y} m-1.6,0 a1.6,1.6 0 1,0 3.2,0 a1.6,1.6 0 1,0 -3.2,0 `).join('')
  const TAILPIECE = `M-19,${TAIL_TOP} Q0,${TAIL_TOP - 4} 19,${TAIL_TOP} L12,${TAIL_BOT} Q0,${TAIL_BOT + 5} -12,${TAIL_BOT} Z`
  const CHINREST = 'M-18,300 C-40,294 -72,297 -85,312 C-93,322 -89,339 -71,345 C-50,352 -8,350 9,342 C21,336 23,320 13,311 C5,304 -5,303 -18,300 Z'
  const BRIDGE_D = `M-21,${BRIDGE - 2.5} Q0,${BRIDGE - 5} 21,${BRIDGE - 2.5} L21,${BRIDGE + 2.5} L-21,${BRIDGE + 2.5} Z`
  // f-hole: centreline from upper eye to lower eye (traced: x 24–54, y 154–224), thickened into a filled outline
  function fhole(side) {
    const P = [[25, 157], [43, 171], [27, 207], [50, 221]]
    const pt = t => { const u = 1 - t; return [0, 1].map(k => u*u*u*P[0][k] + 3*u*u*t*P[1][k] + 3*u*t*t*P[2][k] + t*t*t*P[3][k]) }
    const L = [], R = []
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = pt(Math.max(0, t - .01)), b = pt(Math.min(1, t + .01)), c = pt(t)
      let nx = -(b[1] - a[1]), ny = b[0] - a[0]; const m = Math.hypot(nx, ny); nx /= m; ny /= m
      const w = .8 + 1.4 * Math.sin(Math.PI * t)
      L.push([c[0] + nx * w, c[1] + ny * w]); R.push([c[0] - nx * w, c[1] - ny * w]) }
    const pts = L.concat(R.reverse()).map(([x, y]) => [x * side, y])
    let d = 'M' + pts.map(p => p.map(v => v.toFixed(2)).join(',')).join(' L') + ' Z '
    const eye = (x, y, r) => `M${(x + r) * side},${y} A${r},${r} 0 1,1 ${(x - r) * side},${y} A${r},${r} 0 1,1 ${(x + r) * side},${y} Z `
    d += eye(25, 157, 3.8) + eye(50, 221, 5)
    d += `M${32 * side},${BRIDGE - 1.5} L${37 * side},${BRIDGE - 3} L${37.3 * side},${BRIDGE - 1} L${32.3 * side},${BRIDGE + .5} Z ` // notch at the bridge line
    return { d, centre: [37 * side, 189], line: P.map(([x, y]) => [x * side, y]) }
  }
  const F_R = fhole(1), F_L = fhole(-1)
  const STRINGS = [
    { n: 'G', f: 196.00, nut: -8.25, br: -17.25, tp: -14, w: .95, c: '#9b958a', wound: true },
    { n: 'D', f: 293.66, nut: -2.75, br: -5.75, tp: -4.7, w: .8, c: '#b9b2a6', wound: true },
    { n: 'A', f: 440.00, nut: 2.75, br: 5.75, tp: 4.7, w: .7, c: '#cfc9bf', wound: true },
    { n: 'E', f: 659.25, nut: 8.25, br: 17.25, tp: 14, w: .45, c: '#e9e4da', wound: false },
  ]
  const STRING_TAILS = STRINGS.map(st => { const p = PEGS.find(q => q.n === st.n); return `M${st.nut},${NUT} L${(p.s * 1.6).toFixed(1)},${p.y}` }).join(' ')
  return { STRING_TAILS, BODY, HALF, FINGERBOARD, NECK, PEGBOX, CAVITY, SCROLL, PEGS, PEG_D, PEG_EYE, peg, TAILPIECE, CHINREST, BRIDGE_D, F_R, F_L, STRINGS, NUT, FB_END, BRIDGE, TAIL_TOP, TAIL_BOT, TOP, BOTTOM }
})()

// full outline used by the line drawings (body, neck, head, pegs, fingerboard, f-holes, bridge, tailpiece, strings)
const fh = f => { const [[a, b], [c, d], [e, h], [i, j]] = f.line; return `M${a},${b} C${c},${d} ${e},${h} ${i},${j} ` }
export const OUTLINE = [VIOLIN.BODY, VIOLIN.NECK, VIOLIN.PEGBOX, VIOLIN.CAVITY, VIOLIN.SCROLL, VIOLIN.PEG_D, VIOLIN.STRING_TAILS, VIOLIN.FINGERBOARD,
  VIOLIN.F_R.d, VIOLIN.F_L.d, VIOLIN.BRIDGE_D, VIOLIN.TAILPIECE, ...VIOLIN.STRINGS.map(s => `M${s.nut},${VIOLIN.NUT} L${s.br},${VIOLIN.BRIDGE} L${s.tp},${VIOLIN.TAIL_TOP}`)].join(' ')
export const fholeLine = fh
export default VIOLIN
