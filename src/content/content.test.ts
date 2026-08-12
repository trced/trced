import { describe, expect, test } from 'vitest'
import { CONTENT, LANGS } from './index.ts'

/** Le contenu est la seule source de vérité du site : les deux langues
 *  doivent rester des miroirs l'une de l'autre, sinon une page se retrouve
 *  amputée d'une ligne sans que rien ne le signale. */
describe('contenu', () => {
  test('les deux langues sont fournies', () => {
    expect(LANGS).toEqual(['fr', 'en'])
    for (const lang of LANGS) expect(CONTENT[lang]).toBeDefined()
  })

  test("aucun texte n'est vide", () => {
    for (const lang of LANGS) {
      const c = CONTENT[lang]
      const texts = [
        c.title,
        c.description,
        c.tagline,
        c.manifesto,
        c.principlesTitle,
        c.appsTitle,
        c.appsNote,
        c.aboutTitle,
        c.about,
        c.linksTitle,
        c.orgLabel,
        c.persoLabel,
        c.footer,
        c.skipToContent,
        c.langNavLabel,
        c.langCode,
        c.langSwitchLabel,
      ]
      for (const text of texts) expect(text.trim()).not.toBe('')
    }
  })

  test('le code de langue correspond à sa clé', () => {
    for (const lang of LANGS) expect(CONTENT[lang].langCode).toBe(lang)
  })

  test('les listes ont la même longueur dans les deux langues', () => {
    expect(CONTENT.fr.principles).toHaveLength(CONTENT.en.principles.length)
    expect(CONTENT.fr.apps).toHaveLength(CONTENT.en.apps.length)
  })

  test('les principes sont numérotés de la même façon partout', () => {
    const numbers = CONTENT.fr.principles.map((p) => p.n)
    expect(numbers).toEqual(['01', '02', '03', '04', '05'])
    expect(CONTENT.en.principles.map((p) => p.n)).toEqual(numbers)
  })

  test('les applications sont nommées identiquement dans les deux langues', () => {
    // Le nom d'une application est un identifiant, pas une traduction.
    expect(CONTENT.en.apps.map((a) => a.name)).toEqual(
      CONTENT.fr.apps.map((a) => a.name),
    )
  })

  test('chaque application a une description', () => {
    for (const lang of LANGS) {
      for (const app of CONTENT[lang].apps) {
        expect(app.desc.trim()).not.toBe('')
      }
    }
  })

  test('la description tient dans la limite utile des moteurs', () => {
    for (const lang of LANGS) {
      expect(CONTENT[lang].description.length).toBeLessThanOrEqual(160)
    }
  })
})
