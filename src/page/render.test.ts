import { describe, expect, test } from 'vitest'
import { escapeHtml, renderBody, renderHead } from './render.ts'
import { CONTENT } from '../content/index.ts'
import { ORG_URL, PERSONAL_URL } from './links.ts'

const ORIGIN = 'https://trced.example'

function parseBody(html: string): Document {
  return new DOMParser().parseFromString(html, 'text/html')
}

function parseHead(html: string): Document {
  return new DOMParser().parseFromString(
    `<!doctype html><html><head>${html}</head><body></body></html>`,
    'text/html',
  )
}

describe('escapeHtml', () => {
  test('neutralise les caractères qui feraient du balisage', () => {
    expect(escapeHtml('<script>alert("x" & \'y\')</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot; &amp; &#39;y&#39;)&lt;/script&gt;',
    )
  })

  test('laisse un texte ordinaire intact', () => {
    expect(escapeHtml('Une chose, bien faite.')).toBe('Une chose, bien faite.')
  })
})

describe('renderBody', () => {
  test('le titre et la promesse ouvrent la page', () => {
    const doc = parseBody(renderBody('fr', 2026))
    expect(doc.querySelector('h1')?.textContent).toBe('trced.')
    expect(doc.body.textContent).toContain(CONTENT.fr.tagline)
    expect(doc.body.textContent).toContain(CONTENT.fr.manifesto)
  })

  test('les cinq principes sont rendus dans l’ordre', () => {
    const doc = parseBody(renderBody('fr', 2026))
    const items = [...doc.querySelectorAll('ol li')]
    expect(items).toHaveLength(5)
    expect(items[0]?.textContent).toContain(CONTENT.fr.principles[0]!.text)
    expect(items[4]?.textContent).toContain(CONTENT.fr.principles[4]!.text)
  })

  test('chaque application occupe une ligne, nom, description et statut', () => {
    const doc = parseBody(renderBody('en', 2026))
    const items = [...doc.querySelectorAll('[data-list="apps"] li')]
    expect(items).toHaveLength(CONTENT.en.apps.length)
    expect(items[0]?.textContent).toContain('month.')
    expect(items[0]?.textContent).toContain(CONTENT.en.apps[0]!.desc)
    expect(items[0]?.textContent).toContain(CONTENT.en.apps[0]!.status)
  })

  test('la langue courante est indiquée, l’autre est un lien', () => {
    const doc = parseBody(renderBody('fr', 2026))
    const current = doc.querySelector('[aria-current="page"]')
    expect(current?.textContent).toBe('fr')
    expect(current?.tagName).not.toBe('A')

    const link = doc.querySelector('nav a[hreflang]')
    expect(link?.getAttribute('href')).toBe('/en/')
    expect(link?.getAttribute('hreflang')).toBe('en')
    expect(link?.getAttribute('lang')).toBe('en')
    expect(link?.getAttribute('aria-label')).toBe(CONTENT.en.langSwitchLabel)
    expect(link?.textContent).toBe('en')
  })

  test('les deux langues gardent leur place d’une page à l’autre', () => {
    // Un bouton qui se déplace quand on l'actionne se retrouve sous le
    // curseur de quelqu'un qui voulait faire autre chose.
    for (const lang of ['fr', 'en'] as const) {
      const doc = parseBody(renderBody(lang, 2026))
      const items = [...doc.querySelectorAll('nav.segments .segments__item')]
      expect(items.map((el) => el.textContent)).toEqual(['fr', 'en'])
    }
  })

  test('depuis l’anglais, le lien ramène à la racine française', () => {
    const doc = parseBody(renderBody('en', 2026))
    const link = doc.querySelector('nav a[hreflang]')
    expect(link?.getAttribute('href')).toBe('/')
    expect(link?.getAttribute('hreflang')).toBe('fr')
    expect(doc.querySelector('[aria-current="page"]')?.textContent).toBe('en')
  })

  test('les liens sortants sont ceux des dépôts, et ne fuient pas la page', () => {
    const doc = parseBody(renderBody('fr', 2026))
    const externals = [...doc.querySelectorAll('a[target="_blank"]')]
    expect(externals.map((a) => a.getAttribute('href'))).toEqual([
      ORG_URL,
      PERSONAL_URL,
    ])
    for (const a of externals) {
      expect(a.getAttribute('rel')).toContain('noopener')
    }
  })

  test('le raccourci de contenu vise le contenu', () => {
    const doc = parseBody(renderBody('fr', 2026))
    const skip = doc.querySelector('a.skip-link')
    expect(skip?.getAttribute('href')).toBe('#content')
    expect(skip?.textContent).toBe(CONTENT.fr.skipToContent)
    expect(doc.querySelector('#content')?.tagName).toBe('MAIN')
  })

  test('l’année du pied de page est celle qu’on lui donne', () => {
    const doc = parseBody(renderBody('fr', 2026))
    expect(doc.querySelector('footer')?.textContent).toContain('trced. — 2026')
    expect(doc.querySelector('footer')?.textContent).toContain(CONTENT.fr.footer)
  })

  test('le réglage de thème n’existe que si le script tourne', () => {
    // Rendu caché : sans JavaScript, trois boutons morts vaudraient moins
    // que rien. C'est le script qui les révèle.
    const doc = parseBody(renderBody('fr', 2026))
    const group = doc.querySelector('[data-theme-switch]')
    expect(group?.hasAttribute('hidden')).toBe(true)
    expect(group?.getAttribute('role')).toBe('group')
    expect(group?.getAttribute('aria-label')).toBe(CONTENT.fr.themeLabel)

    const options = [...doc.querySelectorAll('[data-theme-switch] button')]
    expect(options.map((b) => b.getAttribute('data-theme-value'))).toEqual([
      'auto',
      'light',
      'dark',
    ])
    expect(options.map((b) => b.textContent)).toEqual([
      CONTENT.fr.themeAuto,
      CONTENT.fr.themeLight,
      CONTENT.fr.themeDark,
    ])
    // L'automatique est l'état rendu : c'est celui qu'on obtient sans rien
    // avoir choisi.
    expect(options.map((b) => b.getAttribute('aria-pressed'))).toEqual([
      'true',
      'false',
      'false',
    ])
    expect(options.every((b) => b.getAttribute('type') === 'button')).toBe(true)
  })

  test('la page pose ses trois repères', () => {
    // Dans un <main>, un <header> et un <footer> ne sont plus que des
    // boîtes : ils ne deviennent des repères de page qu'à sa hauteur.
    const doc = parseBody(renderBody('fr', 2026))
    const page = doc.querySelector('.page')
    expect([...(page?.children ?? [])].map((el) => el.tagName)).toEqual([
      'HEADER',
      'MAIN',
      'FOOTER',
    ])
  })

  test('les numéros de rappel ne sont pas lus deux fois', () => {
    // Ils redoublent une numérotation déjà portée par la liste ordonnée et
    // par la structure : à l'écran ils repèrent, à l'oreille ils encombrent.
    const doc = parseBody(renderBody('fr', 2026))
    for (const el of doc.querySelectorAll('.section__number, .row__number')) {
      expect(el.getAttribute('aria-hidden')).toBe('true')
    }
    expect(doc.querySelectorAll('[aria-hidden="true"]')).toHaveLength(9)
  })

  test('le contenu est échappé plutôt qu’injecté', () => {
    const html = renderBody('fr', 2026)
    // Aucun texte de contenu ne contient de balisage ; si un jour c'est le
    // cas, il doit ressortir en texte, pas en éléments.
    expect(html).not.toContain('<script')
  })
})

describe('renderHead', () => {
  test('porte le titre et la description de la langue rendue', () => {
    const doc = parseHead(renderHead('en', ORIGIN))
    expect(doc.title).toBe(CONTENT.en.title)
    expect(
      doc.querySelector('meta[name="description"]')?.getAttribute('content'),
    ).toBe(CONTENT.en.description)
  })

  test('déclare les deux langues et la version canonique', () => {
    const doc = parseHead(renderHead('fr', ORIGIN))
    const alternates = [...doc.querySelectorAll('link[rel="alternate"]')]
    expect(
      alternates.map((l) => [
        l.getAttribute('hreflang'),
        l.getAttribute('href'),
      ]),
    ).toEqual([
      ['fr', `${ORIGIN}/`],
      ['en', `${ORIGIN}/en/`],
      ['x-default', `${ORIGIN}/`],
    ])
    expect(
      doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
    ).toBe(`${ORIGIN}/`)
  })

  test('annonce l’image de partage, en adresse absolue', () => {
    // Les moissonneurs d'aperçu ne résolvent pas les chemins relatifs :
    // sans domaine, mieux vaut pas d'image qu'une adresse qu'ils rejettent.
    const doc = parseHead(renderHead('fr', ORIGIN))
    const meta = (p: string) =>
      doc.querySelector(`meta[property="${p}"]`)?.getAttribute('content')
    expect(meta('og:image')).toBe(`${ORIGIN}/og.png`)
    expect(meta('og:image:width')).toBe('1200')
    expect(meta('og:image:height')).toBe('630')
    expect(meta('og:image:alt')).toBe('trced.')
    expect(
      doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content'),
    ).toBe('summary_large_image')
  })

  test('sans domaine connu, aucune URL absolue n’est inventée', () => {
    expect(renderHead('fr', '')).not.toContain('og:image')
    // Le domaine est fourni au build ; tant qu'il ne l'est pas, mieux vaut
    // omettre canonical et hreflang que publier des adresses fausses.
    const doc = parseHead(renderHead('fr', ''))
    expect(doc.querySelectorAll('link[rel="alternate"]')).toHaveLength(0)
    expect(doc.querySelector('link[rel="canonical"]')).toBeNull()
    expect(doc.title).toBe(CONTENT.fr.title)
  })
})
