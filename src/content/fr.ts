import type { Content } from './types.ts'

export const fr: Content = {
  title: 'trced. — une chose, bien faite.',
  description:
    'Une famille de micro-applications. Chacune fait une seule chose. Sans compte, sans traceur, hors ligne.',

  tagline: 'Une chose, bien faite.',
  manifesto:
    "Une famille de micro-applications. Chacune fait une seule chose. Gratuites, sans compte, sans publicité ni traceur. Elles fonctionnent hors ligne : les données restent sur l'appareil et s'exportent quand on veut. Conception complète, du design system à la mise en production.",

  principlesTitle: 'principes',
  principles: [
    { n: '01', text: "Une chose à la fois. Ce qui n'est pas essentiel n'est pas construit." },
    { n: '02', text: 'Aucun compte. On ouvre, on utilise.' },
    { n: '03', text: 'Aucun traceur, aucune publicité, aucune collecte.' },
    { n: '04', text: 'Hors ligne par défaut. Données locales, exportables, réimportables.' },
    { n: '05', text: 'Un seul design system pour toute la famille.' },
  ],

  appsTitle: 'applications',
  appsNote: 'trois publiées',
  // Chaque description est la promesse que l'application affiche
  // elle-même sur sa page d'accueil : la vitrine ne reformule pas.
  apps: [
    { name: 'habit.', desc: 'une semaine, une grille', status: 'v0.1.1' },
    {
      name: 'race.',
      desc: 'toutes vos courses, une ligne chacune',
      status: 'v0.1.2',
    },
    {
      name: 'urge.',
      desc: 'une envie, trente jours, une question',
      status: 'v0.1.0',
    },
    { name: '…', desc: "d'autres suivront, une à la fois", status: '' },
  ],

  aboutTitle: 'à propos',
  about:
    "trced. est construit par une personne, Andrea Larboullet Marin. Design, code, mise en production. Pas d'équipe, pas de feuille de route publique : une application sort en v0.1.0 quand elle est prête. Ensuite elle évolue — correctifs, versions mineures, majeures, nouvelles fonctions — toujours en accord avec la philosophie, jamais contre elle.",

  linksTitle: 'liens',
  orgLabel: 'org',
  persoLabel: 'perso',

  footer: 'sans compte · sans traceur · hors ligne',

  skipToContent: 'aller au contenu',

  langNavLabel: 'langue',
  langCode: 'fr',
  langSwitchLabel: 'Voir cette page en français',

  themeLabel: 'thème',
  themeAuto: 'auto',
  themeLight: 'clair',
  themeDark: 'sombre',
}
