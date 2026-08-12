# trced.

Une chose, bien faite.

Site vitrine de la philosophie de la famille « . » : ce qu'elle est, ce
qu'elle refuse, et où en sont ses applications. Une page, deux langues.

## Ce que le navigateur reçoit

Deux fichiers HTML complets et une feuille de style. **Aucun JavaScript** :
la page affiche du texte, elle n'a rien à exécuter pour ça. Le contenu est
écrit dans les fichiers au moment du build, ce qui vaut aussi pour les
moteurs de recherche et les lecteurs sans script.

| Adresse | Langue |
| ------- | ------ |
| `/`     | fr     |
| `/en/`  | en     |

La langue est dans l'URL, pas dans un réglage : chaque version se partage
telle quelle, et le site n'a rien à retenir d'une visite à l'autre. Les
deux pages se déclarent l'une l'autre par `hreflang`, le français tenant
lieu de `x-default`.

## Commandes

```bash
npm install
npm run dev        # serveur de développement
npm test           # vitest
npm run typecheck  # tsc --noEmit
npm run build      # typecheck puis écriture de dist/
npm run preview    # sert dist/
npm run icons      # regénère favicon et icônes depuis le glyphe « t. »
```

## Structure

```
index.html          squelette fr — deux marqueurs, remplis au build
en/index.html       squelette en
src/
  content/          le contenu, et lui seul
    fr.ts           référence
    en.ts           miroir typé de fr.ts
    types.ts        forme d'une page
  page/
    render.ts       contenu → HTML, fonctions pures
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
scripts/
  make-icons.mjs    autonome : tracé figé, rastériseur, encodeur PNG
vite.config.ts      le plugin qui écrit le contenu dans les squelettes
```

### Le mark

`favicon.svg` et les icônes viennent de la forge de la famille
(compétence `trced-logo`) : l'initiale du projet et le point, dans la fonte
de l'interface, sur la grille de 32. Le point ne se retire ni ne se colore.
`npm run icons` les régénère sans dépendance ni fonte — le tracé est figé
dans `scripts/make-icons.mjs`. Changer le mark demande de repasser par la
forge, pas d'éditer le script.

Le manifeste ne sert qu'à donner une icône correcte à qui ajoute la page à
son écran d'accueil : `display: browser`, aucun service worker. Le site est
un site.

### Modifier le contenu

Tout est dans `src/content/`. `fr.ts` fait référence, `en.ts` en est le
miroir : un champ manquant ou en trop échoue à la compilation, et les
tests refusent une liste plus courte d'un côté que de l'autre. Rien à
toucher ailleurs — le HTML se régénère.

### Modifier l'apparence

`src/styles/tokens.css` d'abord. Une valeur en dur dans une règle est un
défaut de conformité : le design system est partagé avec les applications
de la famille, il ne se contourne pas au cas par cas.

## Déploiement

Sortie statique dans `dist/` : n'importe quel hébergement de fichiers
convient. Vercel et Netlify détectent Vite sans configuration.

Les adresses canoniques, les `hreflang` et l'image de partage ont besoin
du domaine, connu seulement au build. Il est lu dans cet ordre :

1. `SITE_ORIGIN` — à renseigner dès qu'un domaine est arrêté ;
2. `URL` — fourni par Netlify ;
3. `VERCEL_PROJECT_PRODUCTION_URL` — fourni par Vercel.

Sans aucun des trois, la page se construit quand même : elle omet ces
adresses plutôt que d'en inventer.

```bash
SITE_ORIGIN=https://trced.dev npm run build
```

## Accessibilité

- Repères de page : bandeau, contenu, pied — et un raccourci vers le
  contenu en premier élément focalisable.
- Les numéros en marge sont du décor et sortent de l'arbre
  d'accessibilité : la liste ordonnée porte déjà cette information.
- Le texte qui informe tient le contraste AA sur les deux thèmes. La
  nuance la plus claire du design system ne sert qu'au décor.
- Le thème suit le système. Il n'y a pas de réglage, donc rien à mémoriser.

## Licence

AGPL-3.0-or-later, comme les applications de la famille. Voir
[LICENSE](LICENSE).
