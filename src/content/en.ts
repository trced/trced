import type { Content } from './types.ts'

export const en: Content = {
  title: 'trced. — one thing, done well.',
  description:
    'A family of micro-apps. Each one does a single thing. No account, no trackers, offline.',

  tagline: 'One thing, done well.',
  manifesto:
    'A family of micro-apps. Each one does a single thing. Free, no account, no ads, no trackers. They work offline: data stays on the device and can be exported at any time. Designed and built end to end, from design system to production.',

  principlesTitle: 'principles',
  principles: [
    { n: '01', text: "One thing at a time. What isn't essential isn't built." },
    { n: '02', text: 'No account. Open it and use it.' },
    { n: '03', text: 'No trackers, no ads, no data collection.' },
    { n: '04', text: 'Offline by default. Local data, exportable and re-importable.' },
    { n: '05', text: 'One design system across the whole family.' },
  ],

  appsTitle: 'apps',
  appsNote: 'four shipped',
  // Chaque description est la promesse que l'application affiche
  // elle-même sur sa page d'accueil : la vitrine ne reformule pas.
  apps: [
    { name: 'habit.', desc: 'one week, one grid', status: 'v0.1.1' },
    {
      name: 'journal.',
      desc: 'one year, one day at a time',
      status: 'v0.1.0',
    },
    { name: 'race.', desc: 'all your races, one line each', status: 'v0.1.2' },
    {
      name: 'urge.',
      desc: 'one urge, thirty days, one question',
      status: 'v0.1.0',
    },
    { name: '…', desc: 'more will follow, one at a time', status: '' },
  ],

  aboutTitle: 'about',
  about:
    "trced. is built by one person, Andrea Larboullet Marin — design, code, shipping. No team, no public roadmap: an app ships as v0.1.0 when it's ready. From there it evolves — patches, minor and major versions, new features — always in line with the philosophy, never against it.",

  linksTitle: 'links',
  orgLabel: 'org',
  persoLabel: 'personal',

  footer: 'no account · no trackers · offline',

  skipToContent: 'skip to content',

  langNavLabel: 'language',
  langCode: 'en',
  langSwitchLabel: 'View this page in English',

  themeLabel: 'theme',
  themeAuto: 'auto',
  themeLight: 'light',
  themeDark: 'dark',
}
