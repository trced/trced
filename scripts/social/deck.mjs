/**
 * Le contenu des cartes sociales, dans les deux langues.
 *
 * Ce fichier ne connaît ni HTML ni pixels : il ne porte que du texte, comme
 * `src/content/`. Le français fait référence, l'anglais en est le miroir —
 * `deck.test.mjs` refuse une carte de plus d'un côté que de l'autre.
 *
 * Les promesses des applications sont celles qu'elles affichent elles-mêmes,
 * reprises mot pour mot de `src/content/` : une carte ne reformule pas ce que
 * la vitrine a déjà écrit. Le même test s'en assure.
 */

export const BRAND = 'trced.'

/** Le domaine tel qu'on le lit sur une carte : sans protocole, il se retape.
 *  C'est l'adresse que le dépôt déclare aujourd'hui. Le jour où un domaine
 *  propre est arrêté, cette ligne est la seule à changer. */
export const SITE = 'trced.vercel.app'

/** Les deux formats demandés par les réseaux : le paysage pour un fil, le
 *  portrait pour un écran tenu à la verticale.
 *
 *  `safe` retient la bande que l'interface d'Instagram ne recouvre pas en
 *  story : rien d'important ne descend ni ne monte au-delà. En paysage, la
 *  marge est celle du confort de lecture, pas d'une interface. */
export const RATIOS = [
  { id: '16x9', width: 1920, height: 1080, scale: 1, padX: 140, padTop: 96, padBottom: 96 },
  // `brief` : la carte passe à sa version courte. Une story se lit debout, le
  // pouce déjà prêt à passer à la suivante — elle n'a pas le temps d'un
  // paragraphe. Ce qu'elle garde est dans le champ `story` de chaque carte.
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

export const LANGS = ['fr', 'en']

const FR_FAMILY = 'une des applications de la famille trced.'
const EN_FAMILY = 'one of the apps in the trced. family'

/** La même chose, à la mesure d'une story : la colonne est deux fois plus
 *  étroite, et le pied n'y tient qu'à une ligne. */
const FR_FAMILY_BRIEF = 'la famille trced.'
const EN_FAMILY_BRIEF = 'the trced. family'

/** Une carte par écran, dans l'ordre où on les poste. Le numéro affiché est
 *  le rang dans le jeu : il se calcule au rendu, il ne s'écrit pas ici. */
export const DECKS = {
  fr: {
    footer: 'sans compte · sans traceur · hors ligne',
    cards: [
      {
        slug: 'cover',
        kind: 'cover',
        tone: 'ink',
        tagline: 'Une chose, bien faite.',
        note: 'une famille de micro-applications',
        footer: 'quatre applications publiées',
        story: { footer: 'quatre applications' },
      },
      {
        slug: 'famille',
        kind: 'statement',
        tone: 'paper',
        section: 'la famille',
        note: 'quatre publiées',
        lead: 'une famille de micro-applications.',
        body: [
          'Chacune fait une seule chose, et la fait bien. Gratuites, sans compte, sans publicité ni traceur.',
          "Elles fonctionnent hors ligne : les données restent sur l'appareil, et s'exportent quand on veut.",
          "Un seul design system, une seule main : conception, code et mise en production.",
        ],
        story: {
          body: ['Chacune fait une seule chose.', 'Sans compte. Sans traceur. Hors ligne.'],
        },
      },
      {
        slug: 'principes',
        kind: 'rows',
        leadKind: 'number',
        tone: 'paper',
        section: 'principes',
        note: 'cinq',
        rows: [
          { lead: '01', text: "Une chose à la fois. Ce qui n'est pas essentiel n'est pas construit." },
          { lead: '02', text: 'Aucun compte. On ouvre, on utilise.' },
          { lead: '03', text: 'Aucun traceur, aucune publicité, aucune collecte.' },
          { lead: '04', text: 'Hors ligne par défaut. Données locales, exportables, réimportables.' },
          { lead: '05', text: 'Un seul design system pour toute la famille.' },
        ],
        story: {
          rows: [
            { lead: '01', text: 'Une chose à la fois.' },
            { lead: '02', text: 'Aucun compte.' },
            { lead: '03', text: 'Aucun traceur.' },
            { lead: '04', text: 'Hors ligne par défaut.' },
            { lead: '05', text: 'Un seul design system.' },
          ],
        },
      },
      {
        slug: 'applications',
        kind: 'rows',
        leadKind: 'name',
        tone: 'paper',
        section: 'applications',
        note: 'quatre publiées',
        rows: [
          { lead: 'habit.', text: 'une semaine, une grille', meta: 'v0.1.1' },
          { lead: 'journal.', text: 'une année, un jour à la fois', meta: 'v0.1.0' },
          { lead: 'race.', text: 'toutes vos courses, une ligne chacune', meta: 'v0.1.2' },
          { lead: 'urge.', text: 'une envie, trente jours, une question', meta: 'v0.1.0' },
          { lead: '…', text: "d'autres suivront, une à la fois", meta: '' },
        ],
        // La version n'est pas ce qu'on retient d'une story : le nom et la
        // promesse suffisent, et la ligne tient sur deux lignes au lieu de trois.
        story: {
          rows: [
            { lead: 'habit.', text: 'une semaine, une grille' },
            { lead: 'journal.', text: 'une année, un jour à la fois' },
            { lead: 'race.', text: 'toutes vos courses, une ligne chacune' },
            { lead: 'urge.', text: 'une envie, trente jours, une question' },
            { lead: '…', text: "d'autres suivront" },
          ],
        },
      },
      {
        slug: 'habit',
        kind: 'app',
        tone: 'paper',
        section: 'application',
        note: 'v0.1.1 · en ligne',
        name: 'habit.',
        promise: 'une semaine, une grille',
        body: "Sept colonnes, une par jour. On coche, on ne compte pas. Aucune série à tenir, aucun coach : la grille montre la semaine, et rien d'autre.",
        refuses: 'sans compte · sans série · sans coach',
        url: 'habit-eight-blue.vercel.app',
        footer: FR_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.1', body: null, footer: FR_FAMILY_BRIEF },
      },
      {
        slug: 'journal',
        kind: 'app',
        tone: 'paper',
        section: 'application',
        note: 'v0.1.0 · en ligne',
        name: 'journal.',
        promise: 'une année, un jour à la fois',
        body: "Une page par jour, trois cent soixante-cinq fois. Pas de rappel, pas de note d'humeur, pas d'analyse : on écrit, ou on n'écrit pas.",
        refuses: 'sans compte · sans rappel · sans analyse',
        url: 'journal-seven-fawn.vercel.app',
        footer: FR_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.0', body: null, footer: FR_FAMILY_BRIEF },
      },
      {
        slug: 'race',
        kind: 'app',
        tone: 'paper',
        section: 'application',
        note: 'v0.1.2 · en ligne',
        name: 'race.',
        promise: 'toutes vos courses, une ligne chacune',
        body: "Chaque course tient sur une ligne : la date, la distance, le temps. Le carnet reste sur l'appareil et s'exporte en un fichier, lisible sans lui.",
        refuses: 'sans compte · sans serveur · sans traceur',
        url: 'race-ochre.vercel.app',
        footer: FR_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.2', body: null, footer: FR_FAMILY_BRIEF },
      },
      {
        slug: 'urge',
        kind: 'app',
        tone: 'paper',
        section: 'application',
        note: 'v0.1.0 · en ligne',
        name: 'urge.',
        promise: 'une envie, trente jours, une question',
        body: "Une envie d'achat, notée. Trente jours plus tard, une seule question : est-ce que tu la veux toujours ? La réponse fait le reste.",
        refuses: "sans compte · sans liste d'envies · sans traceur",
        url: 'urge-omega.vercel.app',
        footer: FR_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.0', body: null, footer: FR_FAMILY_BRIEF },
      },
      {
        slug: 'fin',
        kind: 'outro',
        tone: 'ink',
        tagline: 'Une chose, bien faite.',
        rows: [
          { lead: 'la famille', text: 'habit. journal. race. urge.' },
          { lead: 'le code', text: 'github.com/trced' },
        ],
        story: { rows: [{ lead: 'la famille', text: 'habit. journal. race. urge.' }] },
      },
    ],
  },

  en: {
    footer: 'no account · no trackers · offline',
    cards: [
      {
        slug: 'cover',
        kind: 'cover',
        tone: 'ink',
        tagline: 'One thing, done well.',
        note: 'a family of micro-apps',
        footer: 'four apps shipped',
        story: { footer: 'four apps' },
      },
      {
        slug: 'famille',
        kind: 'statement',
        tone: 'paper',
        section: 'the family',
        note: 'four shipped',
        lead: 'a family of micro-apps.',
        body: [
          'Each one does a single thing, and does it well. Free, no account, no ads, no trackers.',
          'They work offline: data stays on the device, and exports whenever you want.',
          'One design system, one pair of hands: design, code and shipping.',
        ],
        story: {
          body: ['Each one does a single thing.', 'No account. No trackers. Offline.'],
        },
      },
      {
        slug: 'principes',
        kind: 'rows',
        leadKind: 'number',
        tone: 'paper',
        section: 'principles',
        note: 'five',
        rows: [
          { lead: '01', text: "One thing at a time. What isn't essential isn't built." },
          { lead: '02', text: 'No account. Open it and use it.' },
          { lead: '03', text: 'No trackers, no ads, no data collection.' },
          { lead: '04', text: 'Offline by default. Local data, exportable and re-importable.' },
          { lead: '05', text: 'One design system across the whole family.' },
        ],
        story: {
          rows: [
            { lead: '01', text: 'One thing at a time.' },
            { lead: '02', text: 'No account.' },
            { lead: '03', text: 'No trackers.' },
            { lead: '04', text: 'Offline by default.' },
            { lead: '05', text: 'One design system.' },
          ],
        },
      },
      {
        slug: 'applications',
        kind: 'rows',
        leadKind: 'name',
        tone: 'paper',
        section: 'apps',
        note: 'four shipped',
        rows: [
          { lead: 'habit.', text: 'one week, one grid', meta: 'v0.1.1' },
          { lead: 'journal.', text: 'one year, one day at a time', meta: 'v0.1.0' },
          { lead: 'race.', text: 'all your races, one line each', meta: 'v0.1.2' },
          { lead: 'urge.', text: 'one urge, thirty days, one question', meta: 'v0.1.0' },
          { lead: '…', text: 'more will follow, one at a time', meta: '' },
        ],
        story: {
          rows: [
            { lead: 'habit.', text: 'one week, one grid' },
            { lead: 'journal.', text: 'one year, one day at a time' },
            { lead: 'race.', text: 'all your races, one line each' },
            { lead: 'urge.', text: 'one urge, thirty days, one question' },
            { lead: '…', text: 'more will follow' },
          ],
        },
      },
      {
        slug: 'habit',
        kind: 'app',
        tone: 'paper',
        section: 'app',
        note: 'v0.1.1 · live',
        name: 'habit.',
        promise: 'one week, one grid',
        body: 'Seven columns, one per day. You tick, you do not count. No streak to keep, no coach: the grid shows the week, and nothing else.',
        refuses: 'no account · no streak · no coach',
        url: 'habit-eight-blue.vercel.app',
        footer: EN_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.1', body: null, footer: EN_FAMILY_BRIEF },
      },
      {
        slug: 'journal',
        kind: 'app',
        tone: 'paper',
        section: 'app',
        note: 'v0.1.0 · live',
        name: 'journal.',
        promise: 'one year, one day at a time',
        body: 'One page a day, three hundred and sixty-five times. No reminder, no mood score, no analysis: you write, or you do not.',
        refuses: 'no account · no reminder · no analysis',
        url: 'journal-seven-fawn.vercel.app',
        footer: EN_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.0', body: null, footer: EN_FAMILY_BRIEF },
      },
      {
        slug: 'race',
        kind: 'app',
        tone: 'paper',
        section: 'app',
        note: 'v0.1.2 · live',
        name: 'race.',
        promise: 'all your races, one line each',
        body: 'Every race fits on one line: the date, the distance, the time. The logbook stays on the device and exports to one file, readable without it.',
        refuses: 'no account · no server · no tracking',
        url: 'race-ochre.vercel.app',
        footer: EN_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.2', body: null, footer: EN_FAMILY_BRIEF },
      },
      {
        slug: 'urge',
        kind: 'app',
        tone: 'paper',
        section: 'app',
        note: 'v0.1.0 · live',
        name: 'urge.',
        promise: 'one urge, thirty days, one question',
        body: 'One urge to buy, written down. Thirty days later, a single question: do you still want it? The answer does the rest.',
        refuses: 'no account · no wishlist · no tracking',
        url: 'urge-omega.vercel.app',
        footer: EN_FAMILY,
        // Une story donne l'adresse et se tait : le paragraphe
        // explique, et personne ne lit une explication debout.
        story: { note: 'v0.1.0', body: null, footer: EN_FAMILY_BRIEF },
      },
      {
        slug: 'fin',
        kind: 'outro',
        tone: 'ink',
        tagline: 'One thing, done well.',
        rows: [
          { lead: 'the family', text: 'habit. journal. race. urge.' },
          { lead: 'the code', text: 'github.com/trced' },
        ],
        story: { rows: [{ lead: 'the family', text: 'habit. journal. race. urge.' }] },
      },
    ],
  },
}
