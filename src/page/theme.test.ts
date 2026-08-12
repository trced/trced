import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import {
  STORAGE_KEY,
  applyTheme,
  initThemeSwitch,
  readTheme,
  storeTheme,
} from './theme.ts'
import type { StorageLike, Theme } from './theme.ts'
import { renderBody } from './render.ts'

function fakeStorage(initial: Record<string, string> = {}): StorageLike {
  const data = { ...initial }
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => {
      data[k] = v
    },
  }
}

/** Un stockage peut refuser de répondre — navigation privée, réglage strict.
 *  Le thème doit alors dégrader vers le système, jamais casser la page. */
function hostileStorage(): StorageLike {
  return {
    getItem: () => {
      throw new Error('stockage indisponible')
    },
    setItem: () => {
      throw new Error('stockage indisponible')
    },
  }
}

describe('readTheme', () => {
  test('sans rien de mémorisé, le thème suit le système', () => {
    expect(readTheme(fakeStorage())).toBe('auto')
  })

  test('relit le choix mémorisé', () => {
    expect(readTheme(fakeStorage({ [STORAGE_KEY]: 'dark' }))).toBe('dark')
    expect(readTheme(fakeStorage({ [STORAGE_KEY]: 'light' }))).toBe('light')
  })

  test('une valeur inconnue vaut un choix absent', () => {
    expect(readTheme(fakeStorage({ [STORAGE_KEY]: 'sépia' }))).toBe('auto')
  })

  test('un stockage qui refuse ne fait pas tomber la page', () => {
    expect(readTheme(hostileStorage())).toBe('auto')
    expect(readTheme(null)).toBe('auto')
  })
})

describe('applyTheme', () => {
  let root: HTMLElement

  beforeEach(() => {
    root = document.createElement('html')
  })

  test('inscrit le choix sur la racine', () => {
    applyTheme(root, 'dark')
    expect(root.getAttribute('data-theme')).toBe('dark')
    applyTheme(root, 'light')
    expect(root.getAttribute('data-theme')).toBe('light')
  })

  test('en automatique, retire l’attribut plutôt que d’en inventer un', () => {
    // Sans attribut, c'est prefers-color-scheme qui décide — donc le
    // système, y compris s'il change pendant la visite.
    applyTheme(root, 'dark')
    applyTheme(root, 'auto')
    expect(root.hasAttribute('data-theme')).toBe(false)
  })
})

describe('storeTheme', () => {
  test('mémorise le choix', () => {
    const storage = fakeStorage()
    storeTheme(storage, 'dark')
    expect(storage.getItem(STORAGE_KEY)).toBe('dark')
  })

  test('un stockage qui refuse ne fait pas tomber la page', () => {
    expect(() => storeTheme(hostileStorage(), 'dark')).not.toThrow()
    expect(() => storeTheme(null, 'dark')).not.toThrow()
  })

  test('n’écrit rien sans motif', () => {
    const storage = fakeStorage()
    const spy = vi.spyOn(storage, 'setItem')
    const theme: Theme = 'auto'
    storeTheme(storage, theme)
    expect(spy).toHaveBeenCalledWith(STORAGE_KEY, 'auto')
  })
})

describe('initThemeSwitch', () => {
  const pressed = () =>
    [...document.querySelectorAll('[data-theme-value]')].map((b) =>
      b.getAttribute('aria-pressed'),
    )

  beforeEach(() => {
    document.body.innerHTML = renderBody('fr', 2026)
    document.documentElement.removeAttribute('data-theme')
  })

  afterEach(() => {
    document.body.innerHTML = ''
    document.documentElement.removeAttribute('data-theme')
  })

  test('montre le réglage — il était caché tant que rien ne l’animait', () => {
    const group = document.querySelector('[data-theme-switch]')!
    expect(group.hasAttribute('hidden')).toBe(true)
    initThemeSwitch(document, fakeStorage())
    expect(group.hasAttribute('hidden')).toBe(false)
  })

  test('un clic applique, mémorise et se voit', () => {
    const storage = fakeStorage()
    initThemeSwitch(document, storage)
    const dark = document.querySelector<HTMLButtonElement>('[data-theme-value="dark"]')!

    dark.click()

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(storage.getItem(STORAGE_KEY)).toBe('dark')
    expect(pressed()).toEqual(['false', 'false', 'true'])
  })

  test('revenir à l’automatique rend la main au système', () => {
    const storage = fakeStorage()
    initThemeSwitch(document, storage)
    document.querySelector<HTMLButtonElement>('[data-theme-value="dark"]')!.click()
    document.querySelector<HTMLButtonElement>('[data-theme-value="auto"]')!.click()

    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
    expect(storage.getItem(STORAGE_KEY)).toBe('auto')
    expect(pressed()).toEqual(['true', 'false', 'false'])
  })

  test('au chargement, le choix mémorisé est rétabli', () => {
    initThemeSwitch(document, fakeStorage({ [STORAGE_KEY]: 'light' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    expect(pressed()).toEqual(['false', 'true', 'false'])
  })
})
