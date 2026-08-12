import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'
import { PATHS } from './links.ts'

/** Les deux règles de cache, et la frontière entre elles.
 *
 *  Les pages sont écrites au build et servies telles quelles : c'est
 *  l'hébergeur, et lui seul, qui décide si quelqu'un reçoit la version
 *  publiée ou celle d'avant. Une page gardée en cache renvoie aussi les
 *  fichiers qu'elle nomme, puisqu'elle les nomme par leur empreinte — la
 *  version précédente revient alors entière, et rien dans le projet ne le
 *  signalerait.
 *
 *  Ni service worker ni réécriture ici : trced. n'est pas une application
 *  installée, et ses deux pages existent à leur adresse. Le seul réglage qui
 *  compte est donc celui-ci. */
const vercel = JSON.parse(
  readFileSync(resolve(process.cwd(), 'vercel.json'), 'utf8'),
) as {
  rewrites?: unknown
  headers: { source: string; headers: { key: string; value: string }[] }[]
}

const rule = (source: string) =>
  vercel.headers
    .find((entry) => entry.source === source)
    ?.headers.find((header) => header.key === 'Cache-Control')?.value

const DOCUMENTS = '/((?!assets/).*)'
const ASSETS = '/assets/(.*)'

describe('cache du déploiement', () => {
  test('fait revalider tout ce qui garde son nom d’une version à l’autre', () => {
    expect(rule(DOCUMENTS)).toMatch(/max-age=0/)
    expect(rule(DOCUMENTS)).toMatch(/must-revalidate/)
  })

  test('garde immuable ce qui porte son empreinte dans son nom', () => {
    // Les fichiers d'`assets` changent de nom à chaque build : les revalider
    // ne trouverait jamais rien de neuf.
    expect(rule(ASSETS)).toMatch(/immutable/)
  })

  test('couvre les deux pages, et rien de ce qui est déjà versionné', () => {
    const pattern = new RegExp(`^${DOCUMENTS}$`)

    // Les deux langues, à l'adresse que le site leur donne.
    for (const path of Object.values(PATHS)) {
      expect(pattern.test(path), `${path} devrait être revalidé`).toBe(true)
    }
    // Et les fichiers statiques dont le nom ne bouge pas d'un build à l'autre.
    for (const path of ['/manifest.webmanifest', '/icon-192.png', '/robots.txt']) {
      expect(pattern.test(path), `${path} devrait être revalidé`).toBe(true)
    }

    // La frontière : ces deux-là relèvent de l'autre règle, et deux règles
    // qui se recouvrent laisseraient l'ordre décider à notre place.
    for (const path of ['/assets/main-Bbec137i.css', '/assets/main-C5dml-ag.js']) {
      expect(pattern.test(path), `${path} ne doit pas être revalidé`).toBe(false)
    }
  })

  test('ne réécrit rien : le site a deux pages, pas une coquille', () => {
    expect(vercel.rewrites).toBeUndefined()
  })
})
