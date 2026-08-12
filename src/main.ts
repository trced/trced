/** Le seul script de la page, et il ne sert qu'au réglage du thème.
 *  Tout le reste est écrit dans le fichier au moment du build. */

import { initThemeSwitch } from './page/theme.ts'
import type { StorageLike } from './page/theme.ts'

/** Le seul accès à localStorage peut déjà lever, selon le réglage du
 *  navigateur : on le tente une fois, ici, et plus jamais ailleurs. */
function storage(): StorageLike | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

initThemeSwitch(document, storage())
