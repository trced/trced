import type { Lang } from '../content/index.ts'

/** Le nom n'est pas traduit : il s'écrit pareil dans les deux langues. */
export const BRAND = 'trced.'

export const ORG_URL = 'https://github.com/trced'
export const PERSONAL_URL = 'https://github.com/alarboulletmarin'

/** Adresses des applications en ligne, indexées par leur nom — lequel est
 *  identique dans les deux langues, les tests s'en assurent. Une adresse
 *  n'est pas du texte : elle n'a rien à faire dans les dictionnaires.
 *  Absente d'ici, l'application n'est pas encore ouverte. */
export const APP_URLS: Record<string, string> = {
  'habit.': 'https://habit-eight-blue.vercel.app/',
  'journal.': 'https://journal-seven-fawn.vercel.app/',
  'race.': 'https://race-ochre.vercel.app/',
  'urge.': 'https://urge-omega.vercel.app/',
}

/** La langue est dans l'URL : une adresse par langue, partageable telle
 *  quelle. Ces chemins sont aussi ceux des fichiers produits par le build. */
export const PATHS: Record<Lang, string> = { fr: '/', en: '/en/' }
