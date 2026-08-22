/**
 * Le jeu de cartes n'a pas le droit de dériver.
 *
 * Trois dérives sont possibles, et ce fichier les refuse toutes les trois :
 *
 *  — entre les deux langues : une carte de plus d'un côté, une ligne de moins
 *    de l'autre, et le jeu français ne dit plus la même chose que l'anglais ;
 *  — entre les cartes et la page : les promesses, les versions et les
 *    adresses sont écrites dans `src/`, et reprises ici. Une carte ne
 *    reformule pas ce que la vitrine a déjà écrit, et n'invente pas une
 *    adresse ;
 *  — entre les deux formats : la story doit vraiment être plus courte que la
 *    carte de fil, sans rien perdre de ce qui fait agir.
 */

import { describe, expect, it } from 'vitest'

import { CONTENT } from '../../src/content/index.ts'
import { APP_URLS } from '../../src/page/links.ts'
import { BRAND, DECKS, LANGS, RATIOS, SITE, TONES } from './deck.mjs'
import { cardFilename, forRatio, renderCard } from './render.mjs'

/** Une adresse telle qu'elle se lit sur une carte : sans protocole, sans
 *  barre finale. C'est la forme qu'on retape, pas celle qu'on clique. */
function readable(url) {
  return url.replace(/^https:\/\//, '').replace(/\/$/, '')
}

/** Les champs qui nomment la forme d'une carte, pas ce qu'elle dit. */
const SHAPE = new Set(['slug', 'story'])

/** Tous les textes d'une carte, avec le champ d'où ils viennent. Un champ
 *  mis à `null` par la version courte n'est pas un texte : il n'en est pas. */
function strings(card) {
  return Object.entries(card).filter(
    ([key, value]) => !SHAPE.has(key) && typeof value === 'string',
  )
}

/** Les applications que la page dit publiées — les seules à présenter. */
function published(lang) {
  return CONTENT[lang].apps.filter((a) => a.status !== '')
}

/** Les cartes d'application : le jeu, moins la famille qui l'ouvre. */
function apps(lang) {
  return DECKS[lang].cards.slice(1)
}

describe('les deux jeux sont le miroir l’un de l’autre', () => {
  it('portent les mêmes cartes, dans le même ordre', () => {
    const slugs = LANGS.map((lang) => DECKS[lang].cards.map((c) => c.slug))
    expect(slugs[1]).toEqual(slugs[0])
  })

  it('donnent à chaque carte les mêmes champs', () => {
    for (const [index, fr] of DECKS.fr.cards.entries()) {
      const en = DECKS.en.cards[index]
      expect(Object.keys(en).sort(), fr.slug).toEqual(Object.keys(fr).sort())
      expect(Object.keys(en.story ?? {}).sort(), `${fr.slug}.story`).toEqual(
        Object.keys(fr.story ?? {}).sort(),
      )
    }
  })

  it('ne raccourcissent que des champs qui existent', () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        for (const key of Object.keys(c.story ?? {})) {
          expect(c, `${lang}/${c.slug}.story.${key}`).toHaveProperty(key)
        }
      }
    }
  })

  it("n'ont ni texte vide ni espace en trop", () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        for (const [key, text] of [...strings(c), ...strings(c.story ?? {})]) {
          const where = `${lang}/${c.slug}.${key}`
          expect(text, where).toBe(text.trim())
          expect(text.length, where).toBeGreaterThan(0)
        }
      }
    }
  })
})

describe('le jeu présente la famille, puis chacune des siennes', () => {
  it("s'ouvre sur la famille", () => {
    for (const lang of LANGS) {
      const [first] = DECKS[lang].cards
      expect(first.slug).toBe('trced')
      expect(first.name).toBe(BRAND)
      expect(first.url).toBe(SITE)
    }
  })

  it('porte la philosophie sur chaque carte, dans les deux formats', () => {
    for (const lang of LANGS) {
      const philosophy = CONTENT[lang].tagline

      for (const ratio of RATIOS) {
        // Sous le nom de la famille, la philosophie tient lieu de promesse :
        // c'est la première chose qu'on lit, comme sur la page.
        expect(forRatio(DECKS[lang].cards[0], ratio).promise).toBe(philosophy)

        // Une application affiche sa propre promesse ; la philosophie passe
        // alors en signature, en toutes lettres et non sous-entendue.
        for (const c of apps(lang)) {
          expect(forRatio(c, ratio).footer, `${c.slug}/${ratio.id}`).toContain(
            philosophy,
          )
        }
      }
    }
  })

  it("n'emploie nulle part le point médian", () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        for (const [key, text] of [...strings(c), ...strings(c.story ?? {})]) {
          expect(text, `${lang}/${c.slug}.${key}`).not.toContain('·')
        }
      }
      expect(DECKS[lang].footer).not.toContain('·')
    }
  })

  it('présente les applications publiées, et elles seules', () => {
    for (const lang of LANGS) {
      expect(apps(lang).map((c) => c.name)).toEqual(
        published(lang).map((a) => a.name),
      )
    }
  })

  it('reprend de la page sa promesse et sa version', () => {
    for (const lang of LANGS) {
      for (const [index, c] of apps(lang).entries()) {
        const app = published(lang)[index]
        expect(c.promise, c.slug).toBe(app.desc)
        // La mention de droite porte la version telle que la page l'affiche.
        expect(c.note, c.slug).toContain(app.status)
        expect(forRatio(c, RATIOS[1]).note, c.slug).toContain(app.status)
      }
    }
  })

  it('donne de chaque application l’adresse que la page lui donne', () => {
    for (const lang of LANGS) {
      for (const c of apps(lang)) {
        const url = APP_URLS[c.name]
        expect(url, `${c.name} n'a pas d'adresse dans links.ts`).toBeDefined()
        expect(c.url, c.slug).toBe(readable(url))
      }
    }
  })

  it('écrit les adresses comme on les retape', () => {
    const urls = [SITE, ...LANGS.flatMap((l) => DECKS[l].cards.map((c) => c.url))]
    for (const url of urls) {
      expect(url, url).not.toContain('://')
      expect(url.endsWith('/'), url).toBe(false)
    }
  })

  it('nomme la famille sur chaque carte, dans les deux formats', () => {
    for (const lang of LANGS) {
      for (const c of apps(lang)) {
        for (const ratio of RATIOS) {
          expect(forRatio(c, ratio).footer, `${c.slug}/${ratio.id}`).toContain(BRAND)
        }
      }
    }
  })
})

describe('les formats et les fonds', () => {
  it('sont bien un 16:9 et un 9:16', () => {
    const ratio = (id) => {
      const found = RATIOS.find((r) => r.id === id)
      return found.width / found.height
    }
    expect(ratio('16x9')).toBeCloseTo(16 / 9, 5)
    expect(ratio('9x16')).toBeCloseTo(9 / 16, 5)
  })

  it("gardent en portrait la bande qu'une story ne recouvre pas", () => {
    const portrait = RATIOS.find((r) => r.brief)
    // Instagram pose son interface sur environ 250 px en haut comme en bas.
    expect(portrait.padTop).toBeGreaterThanOrEqual(250)
    expect(portrait.padBottom).toBeGreaterThanOrEqual(250)
  })

  it('sont les deux fonds de la famille, et rien d’autre', () => {
    expect(TONES.map((t) => t.id)).toEqual(['light', 'dark'])
    expect(TONES.map((t) => t.theme)).toEqual(['light', 'dark'])
  })

  it('font dix images par langue et par format', () => {
    for (const lang of LANGS) {
      expect(DECKS[lang].cards.length).toBe(1 + published(lang).length)
      expect(DECKS[lang].cards.length * TONES.length).toBe(10)
    }
  })
})

describe('la story va droit au but', () => {
  const portrait = RATIOS.find((r) => r.brief)
  const paysage = RATIOS.find((r) => !r.brief)

  it('ne raccourcit qu’en portrait', () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        expect(forRatio(c, paysage), c.slug).toBe(c)
      }
    }
  })

  it('en dit moins que la carte de fil, sur chaque carte', () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        const brief = forRatio(c, portrait)
        const length = (x) => (x.body ?? '').length
        expect(length(brief), `${lang}/${c.slug}`).toBeLessThan(length(c))
      }
    }
  })

  it('retire le paragraphe des cartes d’application', () => {
    for (const lang of LANGS) {
      for (const c of apps(lang)) {
        expect(c.body.length, c.slug).toBeGreaterThan(0)
        expect(forRatio(c, portrait).body, c.slug).toBeNull()
      }
    }
  })

  it('garde le nom, la promesse, le refus et l’adresse', () => {
    for (const lang of LANGS) {
      for (const c of DECKS[lang].cards) {
        const brief = forRatio(c, portrait)
        for (const key of ['name', 'promise', 'refuses', 'url']) {
          expect(brief[key], `${c.slug}.${key}`).toBe(c[key])
        }
      }
    }
  })
})

describe('le rendu', () => {
  const css = ':root { --x: 0 }'

  it('range les images dans l’ordre où elles se postent', () => {
    const names = DECKS.fr.cards.flatMap((c, i) =>
      TONES.map((tone) => cardFilename(c, i, tone)),
    )
    expect(names).toHaveLength(10)
    expect(names[0]).toBe('01-trced-light.png')
    expect(names[1]).toBe('01-trced-dark.png')
    expect(names.at(-1)).toBe('05-urge-dark.png')
    expect(new Set(names).size).toBe(names.length)
  })

  it('écrit un document complet, dans le fond et la taille demandés', () => {
    for (const lang of LANGS) {
      for (const ratio of RATIOS) {
        for (const tone of TONES) {
          DECKS[lang].cards.forEach((card, index) => {
            const html = renderCard({
              card,
              index,
              lang,
              ratio,
              tone,
              footer: DECKS[lang].footer,
              css,
            })
            expect(html.startsWith('<!doctype html>')).toBe(true)
            expect(html).toContain(`<html lang="${lang}" data-theme="${tone.theme}">`)
            expect(html).toContain(`width:${ratio.width}px;height:${ratio.height}px`)
            expect(html).toContain(card.url)
          })
        }
      }
    }
  })

  it('échappe ce qui viendrait fermer une balise', () => {
    const html = renderCard({
      card: {
        slug: 'x',
        section: 's',
        note: 'n',
        name: '</style><b>',
        promise: 'p',
        body: 'b',
        refuses: 'r',
        url: 'u',
      },
      index: 0,
      lang: 'fr',
      ratio: RATIOS[0],
      tone: TONES[0],
      footer: 'f',
      css,
    })
    expect(html).not.toContain('<b>')
    expect(html).toContain('&lt;/style&gt;&lt;b&gt;')
  })
})
