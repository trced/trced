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
  appsNote: 'none shipped yet',
  apps: [
    { name: 'month.', desc: 'your month on one page', status: 'in progress' },
    { name: 'habit.', desc: 'keeping a habit', status: 'in progress' },
    { name: 'race.', desc: 'running, nothing else', status: 'in progress' },
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
