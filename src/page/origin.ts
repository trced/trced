/** Domaine du site, connu seulement au moment du build.
 *  Il sert aux adresses canoniques et aux alternances de langue : tant
 *  qu'il est inconnu, mieux vaut n'en publier aucune que d'en inventer. */

export interface OriginEnv {
  /** Réglage explicite, à préférer dès qu'un domaine est arrêté. */
  SITE_ORIGIN?: string | undefined
  /** Netlify : adresse principale du site. */
  URL?: string | undefined
  /** Vercel : domaine de production, sans protocole. */
  VERCEL_PROJECT_PRODUCTION_URL?: string | undefined
}

export function resolveOrigin(env: OriginEnv): string {
  const explicit = env.SITE_ORIGIN?.trim()
  if (explicit) return trimSlash(explicit)

  const netlify = env.URL?.trim()
  if (netlify) return trimSlash(netlify)

  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (vercel) return trimSlash(`https://${vercel}`)

  return ''
}

function trimSlash(url: string): string {
  return url.endsWith('/') ? url.slice(0, -1) : url
}
