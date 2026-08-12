/** Rendu des pages, en fonctions pures : mêmes entrées, même HTML.
 *  Appelé au build (vite.config.ts) pour écrire les fichiers statiques —
 *  le site n'embarque aucun JavaScript, il n'y a rien à hydrater. */

import { CONTENT, LANGS } from '../content/index.ts'
import type { Lang } from '../content/index.ts'
import { BRAND, ORG_URL, PATHS, PERSONAL_URL } from './links.ts'

const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

/** Tout texte de contenu passe par ici avant d'entrer dans le document. */
export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => ESCAPES[char] ?? char)
}

/** Chaque fragment s'écrit sans marge ; c'est son point d'insertion qui
 *  décide de sa profondeur. La source livrée reste lisible. */
function indent(html: string, level: number): string {
  const pad = '  '.repeat(level)
  return html
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n')
    .trimStart()
}

function otherLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr'
}

/** En-tête du document : titre, description, et les adresses des deux
 *  langues quand le domaine est connu. */
export function renderHead(lang: Lang, origin: string): string {
  const c = CONTENT[lang]
  const lines = [
    `<title>${escapeHtml(c.title)}</title>`,
    `<meta name="description" content="${escapeHtml(c.description)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escapeHtml(c.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(c.description)}" />`,
    `<meta property="og:locale" content="${lang === 'fr' ? 'fr_FR' : 'en_GB'}" />`,
  ]

  if (origin) {
    const url = (l: Lang) => `${origin}${PATHS[l]}`
    lines.push(`<meta property="og:url" content="${url(lang)}" />`)
    // L'image de partage porte le nom entier, pas le mark : elle est vue en
    // grand, dans un fil, loin de tout contexte.
    lines.push(`<meta property="og:image" content="${origin}/og.png" />`)
    lines.push(`<meta property="og:image:width" content="1200" />`)
    lines.push(`<meta property="og:image:height" content="630" />`)
    lines.push(`<meta property="og:image:alt" content="${BRAND}" />`)
    lines.push(`<meta name="twitter:card" content="summary_large_image" />`)
    lines.push(`<link rel="canonical" href="${url(lang)}" />`)
    for (const l of LANGS) {
      lines.push(`<link rel="alternate" hreflang="${l}" href="${url(l)}" />`)
    }
    // Le français est la version par défaut : c'est la racine du site.
    lines.push(`<link rel="alternate" hreflang="x-default" href="${url('fr')}" />`)
  }

  return lines.join('\n    ')
}

function renderLangNav(lang: Lang): string {
  const other = otherLang(lang)
  const o = CONTENT[other]
  return `<nav class="lang" aria-label="${escapeHtml(CONTENT[lang].langNavLabel)}">
  <span class="lang__current" aria-current="page">${escapeHtml(CONTENT[lang].langCode)}</span>
  <a class="lang__link" href="${PATHS[other]}" hreflang="${other}" lang="${other}" aria-label="${escapeHtml(o.langSwitchLabel)}">${escapeHtml(o.langCode)}</a>
</nav>`
}

/** Bandeau de section : un numéro, un titre, parfois une mention à droite. */
function renderSectionHead(n: string, title: string, note?: string): string {
  const aside = note
    ? `\n  <span class="section__note">${escapeHtml(note)}</span>`
    : ''
  return `<div class="section__head">
  <span class="section__number" aria-hidden="true">${n}</span>
  <h2 class="section__title">${escapeHtml(title)}</h2>${aside}
</div>`
}

function renderPrinciples(lang: Lang): string {
  const items = CONTENT[lang].principles
    .map(
      (p) => `  <li class="row row--principle">
    <span class="row__number" aria-hidden="true">${escapeHtml(p.n)}</span>
    <span class="row__text">${escapeHtml(p.text)}</span>
  </li>`,
    )
    .join('\n')
  return `<ol class="rows" data-list="principles">\n${items}\n</ol>`
}

function renderApps(lang: Lang): string {
  const items = CONTENT[lang].apps
    .map((a) => {
      const status = a.status
        ? `\n    <span class="row__status">${escapeHtml(a.status)}</span>`
        : ''
      return `  <li class="row row--app">
    <span class="row__name">${escapeHtml(a.name)}</span>
    <span class="row__desc">${escapeHtml(a.desc)}</span>${status}
  </li>`
    })
    .join('\n')
  return `<ul class="rows" data-list="apps">\n${items}\n</ul>`
}

function renderLinks(lang: Lang): string {
  const c = CONTENT[lang]
  const row = (label: string, url: string) => {
    const shown = url.replace(/^https:\/\//, '')
    return `  <li class="row row--link">
    <span class="row__label">${escapeHtml(label)}</span>
    <a href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(shown)}</a>
  </li>`
  }
  return `<ul class="rows" data-list="links">
${row(c.orgLabel, ORG_URL)}
${row(c.persoLabel, PERSONAL_URL)}
</ul>`
}

/** Une section numérotée : son bandeau, puis ce qu'elle porte. */
function renderSection(head: string, body: string): string {
  return `<section class="section">
        ${indent(head, 4)}
        ${indent(body, 4)}
      </section>`
}

/** Corps du document, du raccourci d'accès au pied de page.
 *  L'année est un paramètre : le rendu ne lit pas l'horloge. */
export function renderBody(lang: Lang, year: number): string {
  const c = CONTENT[lang]

  return `<a class="skip-link" href="#content">${escapeHtml(c.skipToContent)}</a>

    <div class="page">
      <header class="page__header">
        <div class="page__title">
          <h1 class="brand">${BRAND}</h1>
          ${indent(renderLangNav(lang), 5)}
        </div>
        <p class="tagline">${escapeHtml(c.tagline)}</p>
      </header>

      <main class="page__main" id="content">
        <section class="manifesto">
          <p>${escapeHtml(c.manifesto)}</p>
        </section>

        ${renderSection(renderSectionHead('01', c.principlesTitle), renderPrinciples(lang))}

        ${renderSection(renderSectionHead('02', c.appsTitle, c.appsNote), renderApps(lang))}

        ${renderSection(renderSectionHead('03', c.aboutTitle), `<p>${escapeHtml(c.about)}</p>`)}

        ${renderSection(renderSectionHead('04', c.linksTitle), renderLinks(lang))}
      </main>

      <footer class="page__footer">
        <span>${BRAND} — ${year}</span>
        <span>${escapeHtml(c.footer)}</span>
      </footer>
    </div>`
}
