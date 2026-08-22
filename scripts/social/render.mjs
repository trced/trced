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

/** Le rang de la carte dans le jeu, sur deux chiffres. Il ne s'affiche nulle
 *  part : il ne sert qu'à nommer les fichiers, pour qu'ils se rangent dans
 *  l'ordre où on les poste. */
export function ordinalLabel(index) {
  return String(index + 1).padStart(2, '0')
}

/** Bandeau de section : ce qu'on présente, et parfois une mention à droite.
 *
 *  Le rang de la carte n'y figure pas. Il ordonne un jeu, or une carte se
 *  poste seule : « 04 » ne dit rien à qui la reçoit, et laisse entendre
 *  qu'il manque les trois d'avant. Il reste où il sert — en tête du nom de
 *  fichier, pour que les images se rangent dans l'ordre où on les poste.
 *
 *  Un numéro de version renseigne qui suit le projet ; il n'apprend rien à
 *  qui découvre la carte, et une story n'a pas de place à lui donner. */
function sectionHead(title, note) {
  const aside = note
    ? `\n      <span class="section-head__note">${escapeHtml(note)}</span>`
    : ''
  return `<div class="section-head">
      <span class="section-head__title">${escapeHtml(title)}</span>${aside}
    </div>`
}

/**
 * Le corps d'une présentation : le nom, ce que c'est, ce qu'on y fait, puis
 * ce que ça refuse et où ça se trouve.
 *
 * Une carte doit d'abord dire ce qu'est la chose. Une baseline le fait sur
 * la page de l'application, à côté d'une capture ; seule sur un fond uni,
 * elle ne dit plus rien — la story remplace donc la promesse par ce que
 * c'est, en clair, et garde une phrase sur le mécanisme réel.
 *
 * Ce qu'elle laisse tomber, c'est ce qui n'apprend rien à qui découvre :
 * le numéro de version, et l'énumération des refus — un lecteur les lit
 * avant même de savoir de quoi on parle. Et l'adresse de l'application, qui
 * ne se clique pas dans une image : une story la porte en lien, et le pied
 * de la carte garde celle de la famille.
 *
 * Sans refus ni adresse, le bloc du bas n'a plus rien à séparer : c'est le
 * filet du pied qui ferme alors la carte, et il n'en faut pas deux.
 */
function body(card) {
  const text = card.body
    ? `\n        <p class="app__text">${escapeHtml(card.body)}</p>`
    : ''
  const lines = [
    card.refuses && `<p class="app__refuses">${escapeHtml(card.refuses)}</p>`,
    card.url && `<p class="app__link">${escapeHtml(card.url)}</p>`,
  ].filter(Boolean)
  const foot = lines.length
    ? `\n        <div class="app__foot">\n          ${lines.join('\n          ')}\n        </div>`
    : ''

  return `${sectionHead(card.section, card.note)}
      <div class="app">
        <p class="app__name">${escapeHtml(card.name)}</p>
        <p class="app__promise">${escapeHtml(card.promise)}</p>${text}${foot}
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
export function renderCard({ card, lang, ratio, tone, footer, css }) {
  const shown = forRatio(card, ratio)
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
      ${body(shown)}
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
