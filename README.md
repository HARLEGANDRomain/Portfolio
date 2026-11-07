# Portfolio — HARLEGAND Romain

UX/UI Designer · Technical Game Designer
https://harlegandromain.github.io/Portfolio/

Projets présentés :

- **Gwido** — jeu d'exploration / aventure (Unity)
- **Echoes Of Memories** — sandbox musical (Unity)

## Lancer le projet

```bash
npm install
npm run dev        # http://localhost:5173/Portfolio/
npm run build      # build de production dans dist/
npm run preview    # prévisualise le build
npm run build:tokens   # régénère les design tokens (Style Dictionary)
```

Sous Windows : `install.bat` puis `start.bat`.

Le déploiement sur GitHub Pages est automatique à chaque push sur `main` (`.github/workflows/deploy.yml`).

## Stack

React 18 · Vite 5 · Tailwind CSS 3 · i18next (FR / EN) · Style Dictionary · Cloudflare Web Analytics (sans cookie)

## Pages et URLs

| URL | Page |
|---|---|
| `/Portfolio/` | Accueil (splash une fois par session, puis intro / projets / contact) |
| `/Portfolio/projets/gwido/` | Étude de cas Gwido |
| `/Portfolio/projets/echoes-of-memories/` | Étude de cas Echoes Of Memories |
| `/Portfolio/identite/` | Identité |
| `/Portfolio/mentions-legales/` | Mentions légales |

Les pages s'ouvrent par-dessus l'accueil avec la transition de la vague, mais chacune a sa vraie URL
(History API) : lien partageable, bouton Retour du navigateur, suivi par page dans Cloudflare Web Analytics.
Au build, `vite.config.js` génère un `index.html` par route (bon `<title>`, canonical, Open Graph) et un `404.html`.

## Structure

```
src/
  routes.js                 routes du site (lues par l'app et par vite.config.js)
  App.jsx                   position de la souris → variables CSS (halo, parallaxe)
  components/
    home/                   accueil : Home (orchestration), Splash, WaveBackground, SiteNav,
                            IntroSection, ProjectsSection, ContactSection, ImageMarquee, TopoPattern
    CaseStudy.jsx           moteur d'étude de cas (blocs de contenu)
    Identity.jsx            page Identité
    MentionsLegales.jsx     mentions légales
    ui/                     BackButton, MediaLoader, OverlayPage, RouteLink
  hooks/
    useWaveEngine.js        animation des 3 couches de vague
    useOverlayRouter.js     URL ↔ page affichée + transitions
    useIsMobile.js, useReducedMotion.js
  data/
    projects.js             liste des projets
    gwidoData.js, eomData.js  blocs des études de cas
  locales/fr.json, en.json  textes
  design-system/            tokens (source + build Style Dictionary)
  styles/                   home.css, case-study.css
  utils/                    assetUrl.js, wavePath.js
public/                     médias servis tels quels (optimisés au build)
Documentation/              sources de contenu, non déployées
```

## Ajouter un projet

1. Créer `src/data/<projet>Data.js` (blocs : `carousel`, `summary-card-pair`, `section-divider`, `split`, `media-grid`, `text-block`).
2. Ajouter les textes dans `src/locales/fr.json` et `en.json`.
3. Ajouter le projet dans `src/data/projects.js`.
4. Ajouter sa route dans `src/routes.js`.
5. Déposer les médias dans `public/<projet>/` et ajouter l'URL dans `public/sitemap.xml`.

## Accessibilité

- Navigation complète au clavier (liens réels, focus visible, focus déplacé dans les pages ouvertes puis restauré).
- `prefers-reduced-motion` respecté partout (vague figée, défilements et carrousels arrêtés).
- `<html lang>` suit la langue choisie ; le choix FR / EN est conservé.
