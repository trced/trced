/** Choix du thème : le seul état que ce site retienne, et le seul endroit
 *  où il exécute quelque chose. Trois valeurs, dont l'automatique — qui
 *  n'écrit rien sur la racine et laisse prefers-color-scheme décider. */

export const STORAGE_KEY = 'trced-theme'

export const THEMES = ['auto', 'light', 'dark'] as const

export type Theme = (typeof THEMES)[number]

/** Le strict nécessaire de l'API Storage, pour pouvoir la remplacer. */
export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

function isTheme(value: unknown): value is Theme {
  return THEMES.includes(value as Theme)
}

export function readTheme(storage: StorageLike | null): Theme {
  try {
    const saved = storage?.getItem(STORAGE_KEY)
    return isTheme(saved) ? saved : 'auto'
  } catch {
    // Stockage refusé : le système fait foi.
    return 'auto'
  }
}

export function storeTheme(storage: StorageLike | null, theme: Theme): void {
  try {
    storage?.setItem(STORAGE_KEY, theme)
  } catch {
    // Le choix ne survivra pas à la visite ; la page, elle, continue.
  }
}

export function applyTheme(root: HTMLElement, theme: Theme): void {
  if (theme === 'auto') root.removeAttribute('data-theme')
  else root.setAttribute('data-theme', theme)
}

/** Rend le réglage vivant : il n'apparaît que si l'on arrive jusqu'ici. */
export function initThemeSwitch(doc: Document, storage: StorageLike | null): void {
  const group = doc.querySelector('[data-theme-switch]')
  if (!group) return

  const options = [...doc.querySelectorAll<HTMLButtonElement>('[data-theme-value]')]

  const show = (theme: Theme) => {
    applyTheme(doc.documentElement, theme)
    for (const option of options) {
      option.setAttribute(
        'aria-pressed',
        String(option.dataset['themeValue'] === theme),
      )
    }
  }

  for (const option of options) {
    option.addEventListener('click', () => {
      const chosen = option.dataset['themeValue']
      if (!isTheme(chosen)) return
      storeTheme(storage, chosen)
      show(chosen)
    })
  }

  show(readTheme(storage))
  group.removeAttribute('hidden')
}
