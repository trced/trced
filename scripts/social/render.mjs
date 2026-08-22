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

/** Bandeau de section : un rang, ce qu'on présente, et une mention à droite. */
function sectionHead(number, title, note) {
  return `<div class="section-head">
      <span class="section-head__number">${escapeHtml(number)}</span>
      <span class="section-head__title">${escapeHtml(title)}</span>
      <span class="section-head__note">${escapeHtml(note)}</span>
    </div>`
}

/**
 * Le corps d'une présentation : le nom, la promesse qu'elle affiche
 * elle-même, ce qu'elle fait, puis ce qu'elle refuse et où elle se trouve.
 *
 * Le paragraphe explique, et personne ne lit une explication debout : la
 * story s'en passe. L'adresse, elle, est là dans les deux cas — c'est la
 * seule chose qu'une carte demande de faire.
 */
function body(card, number) {
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
 * Le thème est porté par `data-theme`, comme sur le site : la carte ne
 * connaît pas ses propres couleurs, elle les reçoit de `tokens.css`.
 */
export function renderCard({ card, index, lang, ratio, tone, footer, css }) {
  const shown = forRatio(card, ratio)
  const number = ordinalLabel(index)
  const foot = shown.footer ?? footer

  return `<!doctype html>
<html lang="${lang}" data-theme="${tone.theme}">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(BRAND)} — ${escapeHtml(shown.slug)} — ${escapeHtml(ratio.id)} — ${escapeHtml(tone.id)}</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div class="card" style="${ratioStyle(ratio)}">
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

/** Le nom du fichier d'une carte : son rang, ce qu'elle présente, et sur
 *  quel fond. Les images se rangent donc dans l'ordre où elles se postent,
 *  les deux fonds d'une même présentation côte à côte. */
export function cardFilename(card, index, tone) {
  return `${ordinalLabel(index)}-${card.slug}-${tone.id}.png`
}
