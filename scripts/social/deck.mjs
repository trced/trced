/**
 * Le contenu des cartes sociales, dans les deux langues.
 *
 * Une carte, une présentation : la famille, puis chacune de ses applications.
 * Toutes ont la même forme — un nom, une promesse, ce qu'elle fait, ce qu'elle
 * refuse, où elle se trouve. C'est la répétition de cette forme qui fait tenir
 * le jeu ensemble ; rien n'y a de mise en page particulière.
 *
 * Ce fichier ne connaît ni HTML ni pixels : il ne porte que du texte, comme
 * `src/content/`. Le français fait référence, l'anglais en est le miroir —
 * `deck.test.mjs` refuse une carte de plus d'un côté que de l'autre.
 *
 * Les promesses des applications sont celles qu'elles affichent elles-mêmes,
 * reprises mot pour mot de `src/content/`, et leurs adresses viennent de
 * `src/page/links.ts` : une carte ne reformule pas ce que la vitrine a déjà
 * écrit, et n'invente pas une adresse. Le même test s'en assure.
 */

export const BRAND = 'trced.'

/** Le domaine tel qu'on le lit sur une carte : sans protocole, il se retape.
 *  C'est l'adresse que le dépôt déclare aujourd'hui. Le jour où un domaine
 *  propre est arrêté, cette ligne est la seule à changer. */
export const SITE = 'trced.vercel.app'

/** Les deux formats demandés par les réseaux : le paysage pour un fil, le
 *  portrait pour un écran tenu à la verticale.
 *
 *  `safe` — en portrait, `padTop` et `padBottom` retiennent la bande que
 *  l'interface d'Instagram ne recouvre pas en story : rien d'important n'y
 *  descend ni n'y monte. En paysage, la marge est celle du confort de
 *  lecture, pas d'une interface.
 *
 *  `brief` — la carte passe à sa version courte. Une story se lit debout, le
 *  pouce déjà prêt à passer à la suivante : elle n'a pas le temps d'un
 *  paragraphe. Ce qu'elle garde est dans le champ `story` de chaque carte. */
export const RATIOS = [
  { id: '16x9', width: 1920, height: 1080, scale: 1, padX: 140, padTop: 96, padBottom: 96 },
  {
    id: '9x16',
    width: 1080,
    height: 1920,
    scale: 1,
    padX: 88,
    padTop: 260,
    padBottom: 280,
    brief: true,
  },
]

/** Chaque présentation est écrite deux fois, sur les deux fonds de la famille.
 *  Ce ne sont pas deux cartes : c'est la même, dans le thème qui ira le mieux
 *  au fil où on la pose. Les couleurs viennent de `tokens.css`, par `data-theme`
 *  — la carte ne connaît pas ses propres teintes. */
export const TONES = [
  { id: 'light', theme: 'light' },
  { id: 'dark', theme: 'dark' },
]

export const LANGS = ['fr', 'en']

/** La signature du pied, sur chaque carte d'application : le nom de la
 *  famille et sa philosophie, en une ligne. C'est elle que la carte laisse
 *  quand on a oublié le reste — elle est donc écrite en toutes lettres, et
 *  pas seulement sous-entendue par le mark en haut à gauche. */
const FR_FAMILY = 'trced. — Une chose, bien faite.'
const EN_FAMILY = 'trced. — One thing, done well.'

/** Les cinq présentations, dans l'ordre où on les poste : la famille d'abord,
 *  puis ses applications dans l'ordre de la page. Le numéro affiché est le
 *  rang dans le jeu : il se calcule au rendu, il ne s'écrit pas ici. */
export const DECKS = {
  fr: {
    footer: FR_FAMILY,
    cards: [
      {
        slug: 'trced',
        section: 'la famille',
        note: 'quatre applications',
        name: 'trced.',
        // La promesse de la famille est sa philosophie, mot pour mot celle
        // de la page : c'est la première chose qu'on lit sous le nom.
        promise: 'Une chose, bien faite.',
        body: "Quatre aujourd'hui : habit., journal., race., urge. Chacune fait une seule chose, et la fait bien. Gratuites, sans compte, sans publicité ni traceur, et hors ligne : les données restent sur l'appareil.",
        refuses: 'sans compte, sans traceur, hors ligne',
        url: 'trced.vercel.app',
        footer: 'une famille de micro-applications',
        story: {
          note: null,
          refuses: null,
          url: null,
          body: 'Quatre applications : habit., journal., race., urge. Chacune fait une seule chose, gratuitement, sans compte et hors ligne.',
        },
      },
      {
        slug: 'habit',
        section: 'application',
        note: 'v0.1.1',
        name: 'habit.',
        promise: 'une semaine, une grille',
        body: "Un tracker d'habitudes : sept colonnes, une par jour. On coche, on ne compte pas. Aucune série à tenir, aucun coach — la grille montre la semaine, et rien d'autre.",
        refuses: 'sans compte, sans série, sans coach',
        url: 'habit-eight-blue.vercel.app',
        footer: FR_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: "un tracker d'habitudes, sans série ni score",
          body: "Sept colonnes, une par jour. On coche ce qu'on a fait — un jour non coché n'est pas un échec.",
        },
      },
      {
        slug: 'journal',
        section: 'application',
        note: 'v0.1.0',
        name: 'journal.',
        promise: 'une année, un jour à la fois',
        body: "Un journal quotidien : une page par jour, trois cent soixante-cinq fois. Pas de rappel, pas de note d'humeur, pas d'analyse — on écrit, ou on n'écrit pas.",
        refuses: 'sans compte, sans rappel, sans analyse',
        url: 'journal-seven-fawn.vercel.app',
        footer: FR_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'un journal quotidien, sans rappel ni analyse',
          body: "Une page par jour, et rien d'autre à remplir. Aucune humeur à noter : on écrit, ou on n'écrit pas.",
        },
      },
      {
        slug: 'race',
        section: 'application',
        note: 'v0.1.2',
        name: 'race.',
        promise: 'toutes vos courses, une ligne chacune',
        // « Courses » se lit dans les deux sens en français : le carnet dit
        // lui-même qu'il s'agit de course à pied, sinon la carte parle d'une
        // liste de commissions.
        body: "Un carnet de courses à pied : chaque course tient sur une ligne, la date, la distance, le temps. Le carnet reste sur l'appareil et s'exporte en un fichier, lisible sans lui.",
        refuses: 'sans compte, sans serveur, sans traceur',
        url: 'race-ochre.vercel.app',
        footer: FR_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'un carnet de courses à pied',
          body: "Chaque course tient sur une ligne : la date, la distance, le temps. Tout reste sur l'appareil.",
        },
      },
      {
        slug: 'urge',
        section: 'application',
        note: 'v0.1.0',
        name: 'urge.',
        promise: 'une envie, trente jours, une question',
        body: "Un frein aux achats impulsifs : on note l'envie au lieu d'y céder. Trente jours plus tard, une seule question — est-ce qu'on la veut toujours ? La réponse fait le reste.",
        refuses: "sans compte, sans liste d'envies, sans traceur",
        url: 'urge-omega.vercel.app',
        footer: FR_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'un frein aux achats impulsifs',
          body: "On note l'envie au lieu d'y céder. Trente jours plus tard, une question : on la veut toujours ?",
        },
      },
    ],
  },

  en: {
    footer: EN_FAMILY,
    cards: [
      {
        slug: 'trced',
        section: 'the family',
        note: 'four apps',
        name: 'trced.',
        promise: 'One thing, done well.',
        body: 'Four so far: habit., journal., race., urge. Each one does a single thing, and does it well. Free, no account, no ads, no trackers, and offline: data stays on the device.',
        refuses: 'no account, no trackers, offline',
        url: 'trced.vercel.app',
        footer: 'a family of micro-apps',
        story: {
          note: null,
          refuses: null,
          url: null,
          body: 'Four apps: habit., journal., race., urge. Each does a single thing — free, no account, offline.',
        },
      },
      {
        slug: 'habit',
        section: 'app',
        note: 'v0.1.1',
        name: 'habit.',
        promise: 'one week, one grid',
        body: 'A habit tracker: seven columns, one per day. You tick, you do not count. No streak to keep, no coach — the grid shows the week, and nothing else.',
        refuses: 'no account, no streak, no coach',
        url: 'habit-eight-blue.vercel.app',
        footer: EN_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'a habit tracker, with no streak and no score',
          body: 'Seven columns, one per day. You tick what you did — a day left unticked is not a failure.',
        },
      },
      {
        slug: 'journal',
        section: 'app',
        note: 'v0.1.0',
        name: 'journal.',
        promise: 'one year, one day at a time',
        body: 'A daily journal: one page a day, three hundred and sixty-five times. No reminder, no mood score, no analysis — you write, or you do not.',
        refuses: 'no account, no reminder, no analysis',
        url: 'journal-seven-fawn.vercel.app',
        footer: EN_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'a daily journal, with no reminder and no analysis',
          body: 'One page a day, and nothing else to fill in. No mood to score: you write, or you do not.',
        },
      },
      {
        slug: 'race',
        section: 'app',
        note: 'v0.1.2',
        name: 'race.',
        promise: 'all your races, one line each',
        body: 'A running logbook: every race fits on one line, the date, the distance, the time. The logbook stays on the device and exports to one file, readable without it.',
        refuses: 'no account, no server, no tracking',
        url: 'race-ochre.vercel.app',
        footer: EN_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'a running logbook',
          body: 'Every race fits on one line: the date, the distance, the time. It all stays on the device.',
        },
      },
      {
        slug: 'urge',
        section: 'app',
        note: 'v0.1.0',
        name: 'urge.',
        promise: 'one urge, thirty days, one question',
        body: 'A brake on impulse buying: you write the urge down instead of giving in. Thirty days later, a single question — do you still want it? The answer does the rest.',
        refuses: 'no account, no wishlist, no tracking',
        url: 'urge-omega.vercel.app',
        footer: EN_FAMILY,
        story: {
          note: null,
          refuses: null,
          url: null,
          promise: 'a brake on impulse buying',
          body: 'You write the urge down instead of giving in. Thirty days later, one question: do you still want it?',
        },
      },
    ],
  },
}
