/**
 * Carte → HTML, en fonctions pures : mêmes entrées, même document.
 *
 * Le document produit est autonome — la feuille et la fonte y sont écrites,
 * pas liées. C'est ce qui permet de l'ouvrir dans n'importe quel navigateur
 * pour vérifier une carte à l'œil avant de la photographier.
 */

import { BRAND, SITE } from './deck.mjs'

/**
 * Le filet de sécurité, écrit dans chaque carte.
 *
 * Le jeu est dessiné pour tenir : à l'échelle du format, aucune carte ne
 * déborde. Mais une phrase rallongée, ou une langue plus bavarde, suffirait à
 * pousser la dernière ligne sous le pied de page — et une carte fausse ne se
 * voit qu'après la capture. Ce script recule alors l'échelle d'un cran jusqu'à
 * ce que la carte tienne, avant le premier rendu. Tant que le texte tient, il
 * ne change rien.
 */
const FIT = `
      ;(function () {
        var card = document.querySelector('.card')
        var k = parseFloat(card.style.getPropertyValue('--k'))
        while (card.scrollHeight > card.clientHeight && k > 0.4) {
          k = Math.round((k - 0.02) * 100) / 100
          card.style.setProperty('--k', k)
        }
      })()
    `

const ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Tout texte de contenu passe par ici avant d'entrer dans le document. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char)
}

/**
 * La carte dans la version que le format demande.
 *
 * En paysage, elle est entière. En portrait — une story, lue debout, le pouce
 * prêt à passer à la suivante — elle passe à sa version courte : `story` ne
 * remplace que les champs qu'il nomme, et un champ mis à `null` disparaît.
 */
export function forRatio(card, ratio) {
  return ratio.brief && card.story ? { ...card, ...card.story } : card
}

/** Le rang de la carte dans le jeu, tel qu'il s'affiche : deux chiffres. */
export function ordinalLabel(index) {
  return String(index + 1).padStart(2, '0')
}

function sectionHead(number, title, note) {
  const aside = note
    ? `\n      <span class="section-head__note">${escapeHtml(note)}</span>`
    : ''
  return `<div class="section-head">
      <span class="section-head__number">${escapeHtml(number)}</span>
      <span class="section-head__title">${escapeHtml(title)}</span>${aside}
    </div>`
}

function rows(items, variant) {
  const lines = items.map((item) => {
    const meta =
      item.meta === undefined || item.meta === ''
        ? ''
        : `\n        <span class="row__meta">${escapeHtml(item.meta)}</span>`
    return `      <li class="row row--${variant}">
        <span class="row__lead">${escapeHtml(item.lead)}</span>
        <span class="row__text">${escapeHtml(item.text)}</span>${meta}
      </li>`
  })
  return `<ul class="rows">\n${lines.join('\n')}\n    </ul>`
}

/** Le corps de la carte, selon ce qu'elle a à dire. */
function body(card, number) {
  if (card.kind === 'cover') {
    return `<p class="cover__brand">${escapeHtml(BRAND)}</p>
      <p class="cover__tagline">${escapeHtml(card.tagline)}</p>
      <p class="cover__note">${escapeHtml(card.note)}</p>`
  }

  if (card.kind === 'outro') {
    return `<p class="cover__brand">${escapeHtml(BRAND)}</p>
      <p class="cover__tagline">${escapeHtml(card.tagline)}</p>
      ${rows(card.rows, 'label')}`
  }

  if (card.kind === 'statement') {
    const paragraphs = card.body
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join('\n        ')
    return `${sectionHead(number, card.section, card.note)}
      <p class="statement__lead">${escapeHtml(card.lead)}</p>
      <div class="statement__text">
        ${paragraphs}
      </div>`
  }

  if (card.kind === 'rows') {
    return `${sectionHead(number, card.section, card.note)}
    ${rows(card.rows, card.leadKind)}`
  }

  if (card.kind === 'app') {
    // Le paragraphe explique ; la story s'en passe. L'adresse, elle, est là
    // dans les deux cas : c'est la seule chose qu'une carte demande de faire.
    const text = card.body
      ? `\n        <p class="app__text">${escapeHtml(card.body)}</p>`
      : ''
    return `${sectionHead(number, card.section, card.note)}
      <div class="app">
        <p class="app__name">${escapeHtml(card.name)}</p>
        <p class="app__promise">${escapeHtml(card.promise)}</p>${text}
        <div class="app__foot">
          <p class="app__refuses">${escapeHtml(card.refuses)}</p>
          <p class="app__link">${escapeHtml(card.url)}</p>
        </div>
      </div>`
  }

  throw new Error(`carte de type inconnu : ${card.kind}`)
}

/** Les valeurs qu'un format apporte à la feuille : elles viennent des
 *  données, pas d'une règle — une carte de plus ne se déclare qu'une fois. */
function ratioStyle(ratio) {
  return [
    `width:${ratio.width}px`,
    `height:${ratio.height}px`,
    `--k:${ratio.scale}`,
    `--pad-x:${ratio.padX}px`,
    `--pad-top:${ratio.padTop}px`,
    `--pad-bottom:${ratio.padBottom}px`,
  ].join(';')
}

/**
 * Le document d'une carte, prêt à être ouvert ou photographié.
 *
 * `css` est la feuille entière, fonte comprise : le document ne demande
 * aucun fichier, donc aucune requête ne peut arriver après la capture.
 */
export function renderCard({ card, index, lang, ratio, footer, css }) {
  const shown = forRatio(card, ratio)
  const theme = shown.tone === 'ink' ? 'dark' : 'light'
  const number = ordinalLabel(index)
  const foot = shown.footer ?? footer

  return `<!doctype html>
<html lang="${lang}" data-theme="${theme}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(BRAND)} — ${escapeHtml(shown.slug)} — ${escapeHtml(ratio.id)}</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div class="card card--${shown.kind}" style="${ratioStyle(ratio)}">
      <header class="card__head">${escapeHtml(BRAND)}</header>
      <main class="card__body">
      ${body(shown, number)}
      </main>
      <footer class="card__foot">
        <span>${escapeHtml(foot)}</span>
        <span class="card__site">${escapeHtml(SITE)}</span>
      </footer>
    </div>
    <script>${FIT}</script>
  </body>
</html>
`
}

/** Le nom du fichier d'une carte : son rang, puis ce qu'elle dit. Les images
 *  se rangent donc dans l'ordre où elles se postent, sans qu'on les trie. */
export function cardFilename(card, index) {
  return `${ordinalLabel(index)}-${card.slug}.png`
}
