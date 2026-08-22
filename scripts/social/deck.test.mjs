/**
 * Le jeu de cartes n'a pas le droit de dériver.
 *
 * Deux dérives sont possibles, et ce fichier les refuse toutes les deux :
 *
 *  — entre les deux langues : une carte de plus d'un côté, une ligne de moins
 *    de l'autre, et le jeu français ne dit plus la même chose que l'anglais ;
 *  — entre les cartes et la page : les promesses, les principes et les
 *    versions sont écrits dans `src/content/`, et repris ici. Une carte ne
 *    reformule pas ce que la vitrine a déjà écrit, et ne la contredit pas.
 */

import { describe, expect, it } from 'vitest'

import { CONTENT } from '../../src/content/index.ts'
import { DECKS, LANGS, RATIOS } from './deck.mjs'
import { cardFilename, renderCard } from './render.mjs'

/** Les champs qui nomment la forme d'une carte, pas ce qu'elle dit. */
const SHAPE = new Set(['kind', 'slug', 'tone', 'leadKind'])

/** Le seul champ qui a le droit d'être vide : la ligne « … » de la liste des
 *  applications n'a pas de version, comme en page. */
const MAY_BE_EMPTY = new Set(['meta'])

/** Tous les textes d'une carte, quel que soit son type, avec leur champ. */
function strings(card) {
  const flat = []
  const take = (key, value) => {
    if (SHAPE.has(key)) return
    if (typeof value === 'string') flat.push([key, value])
    else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === 'string') flat.push([key, item])
        else for (const [k, v] of Object.entries(item)) take(k, v)
      }
    }
  }
  for (const [key, value] of Object.entries(card)) take(key, value)
  return flat
}

function card(lang, slug) {
  const found = DECKS[lang].cards.find((c) => c.slug === slug)
  expect(found, `carte « ${slug} » en ${lang}`).toBeDefined()
  return found
}

describe('les deux jeux sont le miroir l’un de l’autre', () => {
  it('portent les mêmes cartes, dans le même ordre', () => {
    const slugs = LANGS.map((lang) => DECKS[lang].cards.map((c) => c.slug))
    expect(slugs[1]).toEqual(slugs[0])
  })

  it('donnent à chaque carte la même forme et le même fond', () => {
    for (const [index, fr] of DECKS.fr.cards.entries()) {
      const en = DECKS.en.cards[index]
      expect(en.kind, fr.slug).toBe(fr.kind)
      expect(en.tone, fr.slug).toBe(fr.tone)
      expect(en.leadKind, fr.slug).toBe(fr.leadKind)
      expect(Object.keys(en).sort(), fr.slug).toEqual(Object.keys(fr).sort())

      for (const key of ['rows', 'body']) {
        if (!Array.isArray(fr[key])) continue
        expect(en[key].length, `${fr.slug}.${key}`).toBe(fr[key].length)
      }
    }
  })

  it("n'ont ni texte vide ni espace en trop", () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        for (const [key, text] of strings(c)) {
          const where = `${lang}/${c.slug}.${key}`
          expect(text, where).toBe(text.trim())
          if (MAY_BE_EMPTY.has(key)) continue
          expect(text.length, where).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('les cartes reprennent la page mot pour mot', () => {
  it('reprennent sa promesse et sa signature', () => {
    for (const lang of LANGS) {
      const page = CONTENT[lang]
      expect(DECKS[lang].footer).toBe(page.footer)
      expect(card(lang, 'cover').tagline).toBe(page.tagline)
      expect(card(lang, 'fin').tagline).toBe(page.tagline)
    }
  })

  it('reprennent ses principes, dans son ordre', () => {
    for (const lang of LANGS) {
      const rows = card(lang, 'principes').rows
      expect(rows).toEqual(
        CONTENT[lang].principles.map((p) => ({ lead: p.n, text: p.text })),
      )
    }
  })

  it('reprennent ses applications, leur promesse et leur version', () => {
    for (const lang of LANGS) {
      const rows = card(lang, 'applications').rows
      expect(rows).toEqual(
        CONTENT[lang].apps.map((a) => ({ lead: a.name, text: a.desc, meta: a.status })),
      )
    }
  })

  it("consacrent une carte à chaque application publiée, et à elles seules", () => {
    for (const lang of LANGS) {
      const published = CONTENT[lang].apps.filter((a) => a.status !== '')
      const cards = DECKS[lang].cards.filter((c) => c.kind === 'app')

      expect(cards.map((c) => c.name)).toEqual(published.map((a) => a.name))

      for (const [index, c] of cards.entries()) {
        const app = published[index]
        expect(c.promise, c.slug).toBe(app.desc)
        // La mention de droite porte la version telle que la page l'affiche.
        expect(c.note, c.slug).toContain(app.status)
      }
    }
  })

  it('nomment la famille sur chaque carte d’application', () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards.filter((x) => x.kind === 'app')) {
        expect(c.footer, c.slug).toContain('trced.')
      }
    }
  })
})

describe('les formats', () => {
  it('sont bien un 16:9 et un 9:16', () => {
    const ratio = (id) => {
      const found = RATIOS.find((r) => r.id === id)
      return found.width / found.height
    }
    expect(ratio('16x9')).toBeCloseTo(16 / 9, 5)
    expect(ratio('9x16')).toBeCloseTo(9 / 16, 5)
  })

  it("gardent en portrait la bande qu'une story ne recouvre pas", () => {
    const portrait = RATIOS.find((r) => r.id === '9x16')
    // Instagram pose son interface sur environ 250 px en haut comme en bas.
    expect(portrait.padTop).toBeGreaterThanOrEqual(250)
    expect(portrait.padBottom).toBeGreaterThanOrEqual(250)
  })
})

describe('le rendu', () => {
  const css = ':root { --x: 0 }'

  it('range les images dans l’ordre où elles se postent', () => {
    const names = DECKS.fr.cards.map((c, i) => cardFilename(c, i))
    expect(names[0]).toBe('01-cover.png')
    expect(names.at(-1)).toBe('09-fin.png')
    expect([...names].sort()).toEqual(names)
  })

  it('écrit un document complet, à la taille exacte du média', () => {
    for (const lang of LANGS) {
      for (const ratio of RATIOS) {
        DECKS[lang].cards.forEach((c, index) => {
          const html = renderCard({
            card: c,
            index,
            lang,
            ratio,
            footer: DECKS[lang].footer,
            css,
          })
          expect(html.startsWith('<!doctype html>')).toBe(true)
          expect(html).toContain(`<html lang="${lang}"`)
          expect(html).toContain(`width:${ratio.width}px;height:${ratio.height}px`)
        })
      }
    }
  })

  it('échappe ce qui viendrait fermer une balise', () => {
    const html = renderCard({
      card: { slug: 'x', kind: 'cover', tone: 'ink', tagline: '</style><b>', note: 'n' },
      index: 0,
      lang: 'fr',
      ratio: RATIOS[0],
      footer: 'f',
      css,
    })
    expect(html).not.toContain('<b>')
    expect(html).toContain('&lt;/style&gt;&lt;b&gt;')
  })
})
