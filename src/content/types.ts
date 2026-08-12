/** Forme du contenu d'une page. fr.ts est la référence, en.ts son miroir :
 *  un champ manquant ou en trop échoue à la compilation. */

export interface Principle {
  /** Numéro affiché en marge — « 01 » à « 05 ». */
  n: string
  text: string
}

export interface App {
  /** Le nom est un identifiant, pas une traduction : « race. » dans les
   *  deux langues. */
  name: string
  desc: string
  /** Vide tant qu'il n'y a rien à dire — la ligne « … » n'a pas de statut. */
  status: string
}

export interface Content {
  /** Titre du document et description : la page n'a pas d'autre en-tête. */
  title: string
  description: string

  tagline: string
  manifesto: string

  principlesTitle: string
  principles: readonly Principle[]

  appsTitle: string
  /** Mention en regard du titre : l'état de la famille, en trois mots. */
  appsNote: string
  apps: readonly App[]

  aboutTitle: string
  about: string

  linksTitle: string
  orgLabel: string
  persoLabel: string

  footer: string

  skipToContent: string

  /** Navigation de langue. `langSwitchLabel` décrit cette langue-ci comme
   *  destination : il est lu depuis l'autre page, dans cette langue. */
  langNavLabel: string
  langCode: string
  langSwitchLabel: string

  /** Réglage du thème. `themeAuto` est l'état par défaut : le système. */
  themeLabel: string
  themeAuto: string
  themeLight: string
  themeDark: string
}
