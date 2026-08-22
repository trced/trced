/**
 * Génère les images de partage pour les réseaux, dans les deux formats
 * demandés — 16:9 pour un fil, 9:16 pour une story — et dans les deux
 * langues du site.
 *
 *   node scripts/make-social.mjs
 *
 * Chaque carte est d'abord un document HTML autonome, écrit avec la feuille
 * de la famille et la fonte embarquée : les cartes sont donc composées par le
 * même design system que la page, et non redessinées à côté. Un navigateur
 * sans interface les photographie ensuite, à la taille exacte du média.
 *
 * Le navigateur est le seul outil que ce script ne porte pas lui-même. Il est
 * cherché dans cet ordre :
 *
 *   1. CHROME_PATH — à renseigner si le vôtre est ailleurs ;
 *   2. PLAYWRIGHT_BROWSERS_PATH — le Chromium d'une installation Playwright ;
 *   3. les emplacements habituels, sur macOS puis sur Linux.
 *
 * Les documents intermédiaires restent dans `.social/` : on peut y ouvrir une
 * carte pour la relire à l'œil, sans repasser par la capture.
 */

import { execFileSync } from 'node:child_process'
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { DECKS, LANGS, RATIOS } from './social/deck.mjs'
import { cardFilename, renderCard } from './social/render.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = join(HERE, '..')
const STYLES = join(ROOT, 'src', 'styles')

/** Les images sont dans `public/` : elles partent donc avec le site, et se
 *  récupèrent depuis un téléphone au moment de poster, sans cloner le dépôt. */
const OUT = join(ROOT, 'public', 'social')
const WORK = join(ROOT, '.social')

/* ————— la feuille ————— */

/** Les `@font-face` de la famille, la fonte écrite dedans plutôt que liée :
 *  un document qui ne demande aucun fichier ne peut pas être photographié
 *  avant que sa fonte soit arrivée. */
function inlineFonts() {
  const css = readFileSync(join(STYLES, 'fonts.css'), 'utf8')
  return css.replace(/url\('\.\/fonts\/([^']+)'\)/g, (_, file) => {
    const data = readFileSync(join(STYLES, 'fonts', file)).toString('base64')
    return `url('data:font/woff2;base64,${data}')`
  })
}

/** La feuille d'une carte : la famille, puis ce qui lui est propre. Les
 *  valeurs viennent de `tokens.css`, comme en page — une carte n'est pas
 *  une affiche à part, c'est un document de plus. */
function stylesheet() {
  return [
    inlineFonts(),
    readFileSync(join(STYLES, 'tokens.css'), 'utf8'),
    readFileSync(join(STYLES, 'base.css'), 'utf8'),
    readFileSync(join(HERE, 'social', 'card.css'), 'utf8'),
  ].join('\n')
}

/* ————— le navigateur ————— */

const MAC = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
]

const LINUX = [
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/snap/bin/chromium',
]

/** Le Chromium d'une installation Playwright, quelle que soit sa révision. */
function playwrightChrome() {
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH
  if (!base || !existsSync(base)) return []

  return readdirSync(base)
    .filter((name) => name.startsWith('chromium-'))
    .sort()
    .reverse()
    .flatMap((name) => [
      join(base, name, 'chrome-linux', 'chrome'),
      join(base, name, 'chrome-mac', 'Chromium.app', 'Contents', 'MacOS', 'Chromium'),
    ])
}

function findChrome() {
  const candidates = [
    ...(process.env.CHROME_PATH ? [process.env.CHROME_PATH] : []),
    ...playwrightChrome(),
    ...MAC,
    ...LINUX,
  ]

  const found = candidates.find((path) => existsSync(path))
  if (found) return found

  throw new Error(
    'aucun navigateur trouvé. Renseignez CHROME_PATH avec le chemin d’un Chrome ou d’un Chromium.',
  )
}

/**
 * Photographie un document, à la taille exacte du média.
 *
 * Le temps virtuel remplace l'attente : le navigateur avance ses horloges
 * jusqu'à ce que la page n'ait plus rien à faire, puis rend. La capture ne
 * dépend donc pas de la machine qui la fait.
 */
function shoot(chrome, htmlPath, pngPath, { width, height }) {
  execFileSync(
    chrome,
    [
      '--headless',
      '--disable-gpu',
      '--no-sandbox',
      '--no-first-run',
      '--disable-dev-shm-usage',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      // Rendu du texte identique d'une machine à l'autre : niveaux de gris,
      // sans indication de grille — c'est la forme des lettres qui compte,
      // pas leur alignement sur des pixels qu'on ne verra pas.
      '--disable-lcd-text',
      '--font-render-hinting=none',
      '--virtual-time-budget=5000',
      `--window-size=${width},${height}`,
      `--screenshot=${pngPath}`,
      `file://${htmlPath}`,
    ],
    { stdio: ['ignore', 'ignore', 'ignore'] },
  )
}

/* ————— le jeu ————— */

const chrome = findChrome()
const css = stylesheet()
const made = []

for (const lang of LANGS) {
  const deck = DECKS[lang]

  for (const ratio of RATIOS) {
    const htmlDir = join(WORK, lang, ratio.id)
    const pngDir = join(OUT, lang, ratio.id)
    mkdirSync(htmlDir, { recursive: true })
    mkdirSync(pngDir, { recursive: true })

    deck.cards.forEach((card, index) => {
      const name = cardFilename(card, index)
      const htmlPath = join(htmlDir, name.replace(/\.png$/, '.html'))
      const pngPath = join(pngDir, name)

      writeFileSync(
        htmlPath,
        renderCard({ card, index, lang, ratio, footer: deck.footer, css }),
      )
      shoot(chrome, htmlPath, pngPath, ratio)
      made.push([join('public', 'social', lang, ratio.id, name), pngPath])
    })
  }
}

console.log(`${chrome}\n`)
for (const [shown, path] of made) {
  const { size } = statSync(path)
  console.log(`${shown} — ${size} o`)
}
console.log(`\n${made.length} images, ${LANGS.length} langues, ${RATIOS.length} formats.`)
