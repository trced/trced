import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import { CONTENT } from '../content/index.ts'
import { BRAND, PATHS } from './links.ts'

/** Le manifeste est un fichier statique : rien ne le régénère, donc rien ne
 *  le corrige s'il dérive. Ces tests sont ce qui l'y oblige. */
const PUBLIC_DIR = resolve(process.cwd(), 'public')

const manifest = JSON.parse(
  readFileSync(resolve(PUBLIC_DIR, 'manifest.webmanifest'), 'utf8'),
) as {
  name: string
  short_name: string
  description: string
  lang: string
  start_url: string
  scope: string
  display: string
  background_color: string
  theme_color: string
  icons: { src: string; sizes: string; type: string; purpose?: string }[]
}

describe('manifeste', () => {
  test('porte le nom de la famille, tel qu’il s’écrit', () => {
    expect(manifest.name).toBe(BRAND)
    expect(manifest.short_name).toBe(BRAND)
  })

  test('reprend la description de la page, sans la recopier de travers', () => {
    expect(manifest.description).toBe(CONTENT.fr.description)
    expect(manifest.lang).toBe('fr')
  })

  test('ouvre à la racine, la version par défaut', () => {
    expect(manifest.start_url).toBe(PATHS.fr)
    expect(manifest.scope).toBe('/')
  })

  test('reste un site : il ne se déguise pas en application', () => {
    // Aucun service worker, rien à installer. Le manifeste ne sert qu'à
    // fournir une icône correcte à qui ajoute la page à son écran.
    expect(manifest.display).toBe('browser')
  })

  test('annonce les couleurs du thème clair', () => {
    expect(manifest.background_color).toBe('#f2f3f2')
    expect(manifest.theme_color).toBe('#f2f3f2')
  })

  test('déclare les trois icônes, et elles existent', () => {
    expect(manifest.icons.map((i) => [i.sizes, i.purpose])).toEqual([
      ['192x192', undefined],
      ['512x512', undefined],
      ['512x512', 'maskable'],
    ])
    for (const icon of manifest.icons) {
      expect(icon.type).toBe('image/png')
      const path = resolve(PUBLIC_DIR, icon.src.slice(1))
      expect(existsSync(path), `icône manquante : ${icon.src}`).toBe(true)
    }
  })
})
