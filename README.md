# trced.

Une chose, bien faite.

Site vitrine de la philosophie de la famille « . » : ce qu'elle est, ce qu'elle refuse, et où en sont ses applications. Une page, deux langues.

## Ce que le navigateur reçoit

Deux fichiers HTML complets, une feuille de style, et **1,4 Ko de JavaScript qui ne sert qu'au réglage du thème**. Le contenu, lui, est écrit dans les fichiers au moment du build : rien n'est rendu côté navigateur, ce qui vaut aussi pour les moteurs de recherche et les lecteurs sans script. Coupez le JavaScript, la page entière reste lisible. Seul le sélecteur de thème disparaît, et il est rendu caché pour cette raison.

| Adresse | Langue |
| ------- | ------ |
| `/`     | fr     |
| `/en/`  | en     |

La langue est dans l'URL, pas dans un réglage : chaque version se partage telle quelle, et le site n'a rien à retenir d'une visite à l'autre. Les deux pages se déclarent l'une l'autre par `hreflang`, le français tenant lieu de `x-default`.

## Commandes

```bash
npm install
npm run dev        # serveur de développement
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run build      # typecheck puis écriture de dist/
npm run preview    # sert dist/
npm run icons      # regénère favicon et icônes depuis le glyphe « t. »
npm run social     # regénère les cartes sociales : 5 × clair/sombre × 2 formats × 2 langues
```

## Structure

```
index.html          squelette fr — deux marqueurs, remplis au build
en/index.html       squelette en
src/
  main.ts           le seul script livré : il allume le réglage du thème
  content/          le contenu, et lui seul
    fr.ts           référence
    en.ts           miroir typé de fr.ts
    types.ts        forme d'une page
  page/
    render.ts       contenu → HTML, fonctions pures
    theme.ts        auto / clair / sombre, mémorisé localement
    links.ts        nom, adresses des dépôts, chemins des langues
    origin.ts       domaine du site, connu au build
  styles/
    tokens.css      design system « . » 1.1 — source unique de valeurs
    base.css        le document avant toute mise en page
    site.css        la page
public/
  favicon.svg       le mark « t. », forgé
  icon-*.png        icônes déclarées par le manifeste
  og.png            image de partage, 1200×630, le nom entier
  manifest.webmanifest
  social/           les cartes des réseaux, par langue et par format
scripts/
  make-icons.mjs    autonome : tracé figé, rastériseur, encodeur PNG
  make-social.mjs   écrit les cartes, puis les photographie
  social/
    deck.mjs        les cinq présentations, fr et en
    render.mjs      carte → document, fonctions pures
    card.css        la carte, une seule forme, deux formats, deux fonds
    deck.test.mjs   parité entre langues, et fidélité à src/content/
vite.config.ts      le plugin qui écrit le contenu dans les squelettes
```

### Le mark

`favicon.svg` et les icônes viennent de la forge de la famille (compétence `trced-logo`) : l'initiale du projet et le point, dans la fonte de l'interface, sur la grille de 32. Le point ne se retire ni ne se colore. `npm run icons` les régénère sans dépendance ni fonte : le tracé est figé dans `scripts/make-icons.mjs`. Changer le mark demande de repasser par la forge, pas d'éditer le script.

Le manifeste ne sert qu'à donner une icône correcte à qui ajoute la page à son écran d'accueil : `display: browser`, aucun service worker. Le site est un site.

### Les cartes sociales

Cinq présentations : la famille, puis chacune de ses applications publiées.
Toutes ont la même forme — un nom, la promesse qu'elle affiche elle-même, ce
qu'elle fait, ce qu'elle refuse, et où elle se trouve. C'est la répétition de
cette forme qui fait tenir le jeu ensemble. Seul le pied ne change jamais :
la philosophie de la famille, et son adresse.

La philosophie de la famille est écrite sur chacune, en toutes lettres. Sous
le nom de la famille, elle tient lieu de promesse : c'est la première chose
qu'on lit. Une application affichant la sienne, la philosophie y passe en
signature de pied. Le test la cherche sur les cinq cartes, dans les deux
formats.

Les énumérations s'écrivent à la virgule. Le point médian sépare bien, mais
il se lit mal dans une image réduite au tiers de sa taille dans un fil — et
le test refuse qu'il revienne.

Chacune est écrite sur les deux fonds de la famille — **dix images** — dans
les deux formats demandés par les réseaux, et dans les deux langues du site.
Quarante fichiers.

| Format | Taille    | Pour                                  |
| ------ | --------- | ------------------------------------- |
| `16x9` | 1920×1080 | un fil : X, LinkedIn, Mastodon        |
| `9x16` | 1080×1920 | une story : Instagram, et ses cousines |

```
public/social/<langue>/<format>/<rang>-<carte>-<fond>.png
```

Le rang est celui de la présentation dans le jeu : les fichiers se rangent
donc dans l'ordre où ils se postent, les deux fonds d'une même carte côte à
côte. Les images étant dans `public/`, elles partent avec le site : on les
récupère depuis un téléphone au moment de poster, sans cloner le dépôt.

Le fond n'est pas une couleur écrite dans la carte : c'est `data-theme` sur le
document, comme sur le site, et `tokens.css` fait le reste. Une carte ne
connaît pas ses propres teintes.

En portrait, l'interface d'Instagram recouvre environ 250 px en haut comme en
bas ; rien d'important n'y descend, et le test le vérifie.

Les deux formats ne disent pas la même chose. Chaque carte porte une version
courte dans son champ `story`, qui ne remplace que ce qu'elle nomme — un
champ mis à `null` disparaît.

Court ne veut pas dire flou. Une story ne raccourcit pas l'explication : elle
raccourcit le reste. Elle laisse tomber le numéro de version et l'énumération
des refus — on les lit avant même de savoir de quoi on parle — ainsi que
l'adresse de l'application, qui ne se clique pas dans une image et se pose en
lien à côté. Elle remplace la baseline par ce qu'est la chose, en clair. Une baseline dit ce
qu'est l'application sur sa propre page, à côté d'une capture d'écran ; seule
sur un fond uni, elle ne dit plus rien. « une semaine, une grille » ne
présente pas `habit.` à qui ne la connaît pas ; « un tracker d'habitudes,
sans série ni score » si. Reste ensuite une phrase sur le mécanisme réel, et
l'adresse. Le test refuse une story sans cette phrase.

Les adresses des applications sont celles de `src/page/links.ts`, et le
domaine du site est la seule ligne à changer le jour où il change :
`SITE`, en tête de `deck.mjs`. Le test compare les deux, une adresse
inventée sur une carte échoue.

`npm run social` regénère tout. Une carte est d'abord un document HTML
autonome, composé avec `tokens.css` et la fonte de la famille — les cartes
passent par le design system, elles ne sont pas redessinées à côté. Un
navigateur sans interface les photographie ensuite, à la taille exacte du
média : c'est le seul outil que le script ne porte pas lui-même, et il se
renseigne avec `CHROME_PATH` s'il n'est pas là où on l'attend.

```bash
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run social
```

Le texte est dans `scripts/social/deck.mjs`, et lui seul. Les promesses et
les versions y sont reprises mot pour mot de `src/content/` : une carte ne
reformule pas ce que la vitrine a déjà écrit, et `deck.test.mjs` refuse toute
dérive — entre les deux langues, entre les cartes et la page, et entre les
deux formats. Les documents intermédiaires restent dans `.social/` : on peut
y ouvrir une carte au navigateur pour la relire avant de la photographier.

### Modifier le contenu

Tout est dans `src/content/`. `fr.ts` fait référence, `en.ts` en est le miroir : un champ manquant ou en trop échoue à la compilation, et les tests refusent une liste plus courte d'un côté que de l'autre. Rien à toucher ailleurs : le HTML se régénère.

### Modifier l'apparence

`src/styles/tokens.css` d'abord. Une valeur en dur dans une règle est un défaut de conformité : le design system est partagé avec les applications de la famille, il ne se contourne pas au cas par cas.

## Déploiement

Sortie statique dans `dist/` : n'importe quel hébergement de fichiers convient. Vercel et Netlify détectent Vite sans configuration.

Les adresses canoniques, les `hreflang` et l'image de partage ont besoin du domaine, connu seulement au build. Il est lu dans cet ordre :

1. `SITE_ORIGIN` — à renseigner dès qu'un domaine est arrêté ;
2. `URL` — fourni par Netlify ;
3. `VERCEL_PROJECT_PRODUCTION_URL` — fourni par Vercel.

Sans aucun des trois, la page se construit quand même : elle omet ces adresses plutôt que d'en inventer.

```bash
SITE_ORIGIN=https://trced.dev npm run build
```

## Accessibilité

- Repères de page : bandeau, contenu, pied, et un raccourci vers le contenu en premier élément focalisable.
- Les numéros en marge sont du décor et sortent de l'arbre d'accessibilité : la liste ordonnée porte déjà cette information.
- Le texte qui informe tient le contraste AA sur les deux thèmes. La nuance la plus claire du design system ne sert qu'au décor.
- Le thème suit le système par défaut, et se force à clair ou sombre. Le choix est le seul état retenu (`trced-theme` en stockage local) ; un script en-tête l'applique avant le premier rendu, sans clignotement.

## Mise en page

Une colonne centrée jusqu'à 1120 px. Au-delà, trois colonnes dont les deux latérales sont de même largeur : c'est ce qui laisse le document au centre exact de la fenêtre pendant que l'identité occupe la marge gauche. Les filets vont d'un bord à l'autre : ce sont eux qui tiennent la largeur, pas le texte, qui garde sa mesure de lecture (`--measure-text`).

## Licence

AGPL-3.0-or-later, comme les applications de la famille. Voir [LICENSE](LICENSE).
