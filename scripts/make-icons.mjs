/**
 * Génère les icônes et l'image de partage, sans dépendance externe.
 *
 * La marque est le mot : « trced » devient « t. » — l'initiale
 * dans la fonte de l'interface, suivie du point « ● », seul signe que la
 * famille « . » possède en propre. L'image de partage porte le mot entier.
 *
 * Les tracés sont figés ci-dessous, relevés le 2026-08-12 dans
 * JetBrainsMonoNerdFont-Regular.ttf (hauteur d'x 14/32).
 *
 * Le dépôt régénère donc ses images sans la fonte et sans paquet :
 *
 *   node scripts/make-icons.mjs
 */

import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')

const INK = [0x17, 0x18, 0x1a]
const PAPER = [0xf2, 0xf3, 0xf2]

/** Le mark sur la grille 32 : l'initiale, puis le point sur sa ligne de base. */
const MARK_PATH = 'M12.322 24.973Q10.591 24.973 9.548 23.967Q8.504 22.962 8.504 21.282L8.504 13.06L4.482 13.06L4.482 10.973L8.504 10.973L8.504 7.027L10.795 7.027L10.795 10.973L16.522 10.973L16.522 13.06L10.795 13.06L10.795 21.282Q10.795 21.994 11.215 22.44Q11.635 22.885 12.322 22.885L16.395 22.885L16.395 24.973L12.322 24.973L12.322 24.973Z'
const MARK_DOT = { cx: 25.431, cy: 22.885, r: 2.087 }

/** Le wordmark : le mot entier, origine à gauche, ligne de base à 0. */
const WORD_PATH = 'M9.036 0Q7.305 0 6.262 -1.005Q5.218 -2.011 5.218 -3.691L5.218 -11.913L1.196 -11.913L1.196 -14L5.218 -14L5.218 -17.945L7.509 -17.945L7.509 -14L13.236 -14L13.236 -11.913L7.509 -11.913L7.509 -3.691Q7.509 -2.978 7.929 -2.533Q8.349 -2.087 9.036 -2.087L13.109 -2.087L13.109 0L9.036 0L9.036 0ZM17.36 0L17.36 -14L19.651 -14L19.651 -11.327L19.702 -11.327Q19.88 -12.676 20.847 -13.465Q21.815 -14.255 23.444 -14.255Q25.633 -14.255 26.816 -12.944Q28 -11.633 28 -9.215L28 -8.018L25.709 -8.018L25.709 -9.215Q25.709 -12.269 22.731 -12.269Q21.229 -12.269 20.44 -11.404Q19.651 -10.538 19.651 -8.909L19.651 0L17.36 0L17.36 0ZM36.858 0.255Q34.313 0.255 32.785 -1.171Q31.258 -2.596 31.258 -5.091L31.258 -8.909Q31.258 -11.404 32.785 -12.829Q34.313 -14.255 36.858 -14.255Q39.276 -14.255 40.765 -12.956Q42.255 -11.658 42.331 -9.418L40.04 -9.418Q39.964 -10.767 39.124 -11.493Q38.284 -12.218 36.858 -12.218Q35.356 -12.218 34.453 -11.365Q33.549 -10.513 33.549 -8.935L33.549 -5.091Q33.549 -3.513 34.453 -2.647Q35.356 -1.782 36.858 -1.782Q38.284 -1.782 39.124 -2.52Q39.964 -3.258 40.04 -4.582L42.331 -4.582Q42.255 -2.342 40.765 -1.044Q39.276 0.255 36.858 0.255L36.858 0.255ZM51.164 0.255Q48.695 0.255 47.18 -1.235Q45.665 -2.724 45.665 -5.345L45.665 -8.655Q45.665 -11.276 47.18 -12.765Q48.695 -14.255 51.164 -14.255Q52.818 -14.255 54.053 -13.593Q55.287 -12.931 55.975 -11.735Q56.662 -10.538 56.662 -8.909L56.662 -6.415L47.905 -6.415L47.905 -5.091Q47.905 -3.538 48.796 -2.635Q49.687 -1.731 51.164 -1.731Q52.436 -1.731 53.264 -2.227Q54.091 -2.724 54.269 -3.564L56.56 -3.564Q56.331 -1.807 54.855 -0.776Q53.378 0.255 51.164 0.255L51.164 0.255ZM47.905 -8.196L54.422 -8.196L54.422 -8.909Q54.422 -10.564 53.569 -11.467Q52.716 -12.371 51.164 -12.371Q49.611 -12.371 48.758 -11.467Q47.905 -10.564 47.905 -8.909L47.905 -8.196L47.905 -8.196ZM64.858 0.255Q62.771 0.255 61.511 -1.145Q60.251 -2.545 60.251 -4.938L60.251 -9.036Q60.251 -11.455 61.498 -12.855Q62.745 -14.255 64.858 -14.255Q66.436 -14.255 67.467 -13.465Q68.498 -12.676 68.702 -11.327L68.727 -11.327L68.676 -14.509L68.676 -18.582L70.967 -18.582L70.967 0L68.676 0L68.676 -2.673L68.651 -2.673Q68.473 -1.298 67.455 -0.522Q66.436 0.255 64.858 0.255L64.858 0.255ZM65.622 -1.731Q67.047 -1.731 67.862 -2.622Q68.676 -3.513 68.676 -5.091L68.676 -8.909Q68.676 -10.487 67.862 -11.378Q67.047 -12.269 65.622 -12.269Q64.171 -12.269 63.356 -11.518Q62.542 -10.767 62.542 -9.036L62.542 -4.964Q62.542 -3.258 63.356 -2.495Q64.171 -1.731 65.622 -1.731L65.622 -1.731Z'
const WORD_DOT = { cx: 80.182, cy: -2.087, r: 2.087 }
const WORD_BOX = { x0: 1.196, y0: -18.582, width: 81.073, height: 18.836 }

/** Icône masquable : le mark tient dans la zone sûre de 80 %. */
const MASKABLE_ZOOM = 0.8

/** Image de partage : le format qu'attendent les aperçus de lien. */
const OG = { width: 1200, height: 630, measure: 0.62 }

const CRC_TABLE = (() => {
  const table = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c
  }
  return table
})()

function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

/** PNG truecolore 8 bits, sans transparence — l'image est toujours pleine. */
function encodePng(width, height, pixels) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // profondeur
  ihdr[9] = 2 // truecolor
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(pixels, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/** « d » SVG (M/L/Q/Z uniquement) → polygones, courbes aplaties. */
function flatten(d, steps = 24) {
  const tokens = d.match(/[MLQZ][^MLQZ]*/gi) ?? []
  const polygons = []
  let current = null
  let start = null
  let cursor = { x: 0, y: 0 }

  const numbers = (s) => (s.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? []).map(Number)

  for (const token of tokens) {
    const op = token[0].toUpperCase()
    const n = numbers(token.slice(1))

    if (op === 'M') {
      if (current && current.length > 2) polygons.push(current)
      cursor = { x: n[0], y: n[1] }
      start = cursor
      current = [cursor]
    } else if (op === 'L') {
      cursor = { x: n[0], y: n[1] }
      current.push(cursor)
    } else if (op === 'Q') {
      const c = { x: n[0], y: n[1] }
      const to = { x: n[2], y: n[3] }
      for (let i = 1; i <= steps; i++) {
        const t = i / steps
        const u = 1 - t
        current.push({
          x: u * u * cursor.x + 2 * u * t * c.x + t * t * to.x,
          y: u * u * cursor.y + 2 * u * t * c.y + t * t * to.y,
        })
      }
      cursor = to
    } else if (op === 'Z') {
      if (current && start) current.push(start)
      if (current && current.length > 2) polygons.push(current)
      current = null
    }
  }
  if (current && current.length > 2) polygons.push(current)
  return polygons
}

/** Cercle → polygone, dans les mêmes coordonnées. */
function circlePolygon({ cx, cy, r }, sides = 160) {
  const points = []
  for (let i = 0; i <= sides; i++) {
    const a = (i / sides) * Math.PI * 2
    points.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
  }
  return points
}

/** Met les polygones à l'échelle et les décale — vers des pixels. */
function place(polygons, { scale = 1, dx = 0, dy = 0 }) {
  return polygons.map((poly) => poly.map((p) => ({ x: p.x * scale + dx, y: p.y * scale + dy })))
}

/**
 * Couverture par balayage : remplissage non-zero, 4 sous-lignes par pixel,
 * couverture horizontale exacte. Les polygones sont déjà en pixels.
 */
function coverage(polygons, width, height) {
  const SUB = 4
  const cover = new Float32Array(width * height)

  const edges = []
  for (const poly of polygons) {
    for (let i = 0; i < poly.length - 1; i++) {
      const a = poly[i]
      const b = poly[i + 1]
      if (a.y === b.y) continue
      edges.push({ x0: a.x, y0: a.y, x1: b.x, y1: b.y, winding: b.y > a.y ? 1 : -1 })
    }
  }

  const crossings = []
  for (let sy = 0; sy < height * SUB; sy++) {
    const y = (sy + 0.5) / SUB
    crossings.length = 0

    for (const e of edges) {
      const top = Math.min(e.y0, e.y1)
      const bottom = Math.max(e.y0, e.y1)
      if (y < top || y >= bottom) continue
      const t = (y - e.y0) / (e.y1 - e.y0)
      crossings.push({ x: e.x0 + t * (e.x1 - e.x0), winding: e.winding })
    }
    if (crossings.length < 2) continue

    crossings.sort((a, b) => a.x - b.x)

    const row = Math.floor(sy / SUB) * width
    let winding = 0
    for (let i = 0; i < crossings.length - 1; i++) {
      winding += crossings[i].winding
      if (winding === 0) continue

      let xa = crossings[i].x
      let xb = crossings[i + 1].x
      if (xb <= 0 || xa >= width) continue
      if (xa < 0) xa = 0
      if (xb > width) xb = width

      const first = Math.floor(xa)
      const last = Math.min(Math.ceil(xb) - 1, width - 1)
      for (let px = first; px <= last; px++) {
        const left = Math.max(xa, px)
        const right = Math.min(xb, px + 1)
        if (right > left) cover[row + px] += (right - left) / SUB
      }
    }
  }
  return cover
}

/** Compose le PNG : fond plein, tracé dans la couleur opposée. */
function render(options) {
  const { width, height, polygons, background, foreground } = options
  const cover = coverage(polygons, width, height)
  const stride = width * 3 + 1
  const pixels = Buffer.alloc(stride * height)

  for (let y = 0; y < height; y++) {
    const row = y * stride
    pixels[row] = 0 // filtre « none »
    for (let x = 0; x < width; x++) {
      const alpha = Math.min(1, cover[y * width + x])
      const offset = row + 1 + x * 3
      for (let c = 0; c < 3; c++) {
        pixels[offset + c] = Math.round(
          background[c] + (foreground[c] - background[c]) * alpha,
        )
      }
    }
  }
  return encodePng(width, height, pixels)
}

const markPolygons = [...flatten(MARK_PATH), circlePolygon(MARK_DOT)]
const wordPolygons = [...flatten(WORD_PATH), circlePolygon(WORD_DOT)]

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#17181a"/>
  <path d="${MARK_PATH}" fill="#f2f3f2"/>
  <circle cx="${MARK_DOT.cx}" cy="${MARK_DOT.cy}" r="${MARK_DOT.r}" fill="#f2f3f2"/>
</svg>
`

/** L'icône carrée : la grille 32 portée à la taille demandée. */
function icon(size, zoom = 1) {
  const scale = (size / 32) * zoom
  const shift = (size * (1 - zoom)) / 2
  return render({
    width: size,
    height: size,
    polygons: place(markPolygons, { scale, dx: shift, dy: shift }),
    background: INK,
    foreground: PAPER,
  })
}

/** L'image de partage : le mot, centré, sur toute la surface. */
function share() {
  const scale = (OG.width * OG.measure) / WORD_BOX.width
  return render({
    width: OG.width,
    height: OG.height,
    polygons: place(wordPolygons, {
      scale,
      dx: (OG.width - WORD_BOX.width * scale) / 2 - WORD_BOX.x0 * scale,
      dy: (OG.height - WORD_BOX.height * scale) / 2 - WORD_BOX.y0 * scale,
    }),
    background: INK,
    foreground: PAPER,
  })
}

mkdirSync(OUT, { recursive: true })

const files = [
  ['icon-192.png', icon(192)],
  ['icon-512.png', icon(512)],
  ['icon-maskable-512.png', icon(512, MASKABLE_ZOOM)],
  ['apple-touch-icon.png', icon(180)],
  ['og.png', share()],
  ['favicon.svg', Buffer.from(favicon, 'utf8')],
]

for (const [name, data] of files) {
  writeFileSync(join(OUT, name), data)
  console.log(`${name} — ${data.length} o`)
}
