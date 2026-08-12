import type { Lang } from '../content/index.ts'

/** Le nom n'est pas traduit : il s'écrit pareil dans les deux langues. */
export const BRAND = 'trced.'

export const ORG_URL = 'https://github.com/trced'
export const PERSONAL_URL = 'https://github.com/alarboulletmarin'

/** La langue est dans l'URL : une adresse par langue, partageable telle
 *  quelle. Ces chemins sont aussi ceux des fichiers produits par le build. */
export const PATHS: Record<Lang, string> = { fr: '/', en: '/en/' }
