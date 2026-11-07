# Portfolio — Contexte & Analyse

> Fichier de contexte à donner en début de discussion pour travailler sur le portfolio.
> Analyse réalisée le 7 novembre 2026 à partir du dépôt local `Documents/GitHub/Portfolio`.
> À mettre à jour quand la structure ou le positionnement change.

---

## 1. Identité du projet

| | |
|---|---|
| **Propriétaire** | HARLEGAND Romain |
| **URL** | https://harlegandromain.github.io/Portfolio/ |
| **Repo** | github.com/HARLEGANDRomain/Portfolio (branche `main`) |
| **Objectif (projet Claude)** | Un portfolio qui mêle UX/UI design et game design |
| **Positionnement affiché aujourd'hui** | « Technical Game Designer · UX/UI Designer » (splash, header, `<title>`, OG, `intro.subtitle`) |
| **Positionnement réel (nov. 2026)** | Alternant UX/UI, réorientation complète vers l'UX/UI ; le game design devient un atout secondaire |
| **Langues** | FR / EN (i18next, détection navigateur, fallback EN) |

**Écart principal à garder en tête :** le site se présente encore comme un portfolio de Technical Game Designer qui fait aussi de l'UX. Les 2 projets publiés sont des jeux. Il n'y a encore aucune étude de cas UX/UI publiée.

---

## 2. Stack technique

- **React 18 + Vite 5**, `base: '/Portfolio/'`
- **Tailwind CSS 3** (config étendue : couleurs projet/outils, `text-label`, easings `spring`, ombres nommées, z-index centralisés)
- **Design tokens** : `src/design-system/tokens.json` (doc) + `tokens.sd.json` (source) → **Style Dictionary** (`npm run build:tokens`) → `build/css/tokens.css`, `build/js/tokens.js`, `build/json/tokens.json`. `tokens.css` est importé dans `index.css`.
- **i18n** : `i18next` + `react-i18next` + language detector ; textes dans `src/locales/fr.json` / `en.json`
- **Icônes** : `lucide-react` ; logos d'outils chargés depuis des CDN externes (simpleicons, jsdelivr/devicon)
- **Images** : `vite-plugin-image-optimizer` (PNG/JPG q80, WebP lossless) + `sharp`
- **Analytics** : Cloudflare Web Analytics (sans cookie) dans `index.html` ; `src/utils/analytics.js` ne contient plus que des fonctions vides
- **Déploiement** : GitHub Actions (`.github/workflows/deploy.yml`) → build Node 20 → GitHub Pages à chaque push sur `main`
- **SEO** : meta description/keywords, canonical, Open Graph + Twitter card (`/Image/og-image.png`), `robots.txt`, `sitemap.xml` (1 URL, lastmod 2026-05-13), vérification Google Search Console
- **LCP** : un splash statique en HTML/CSS dans `index.html` (copie du splash React), remplacé au montage de React
- **Fichiers .bat Windows** : `install.bat`, `start.bat`, `start-dev.bat`, `optimize_videos.bat`

**Dépendances installées mais inutilisées dans l'app en production :** `three`, `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `@react-spring/three`, `react-ga4`. Elles servent seulement aux anciens prototypes dans `src/prototypes/`.

---

## 3. Arborescence utile

```
src/
  main.jsx                 → monte <App/>, importe i18n
  App.jsx                  → écoute mousemove → variables CSS --mouse-client/page-x/y ; rend <GwidoPortfolio/>
  index.css                → tokens.css + Tailwind + reset + motifs de points (.bg-dots, .bg-dots-tracker)
  components/
    GwidoPortfolio.jsx     → LA page d'accueil (~1 140 lignes) : splash, vague, nav, sections, overlays
    CaseStudy.jsx          → moteur générique d'étude de cas (blocs de contenu)
    Identity.jsx           → page « Identité » (qui suis-je, diplôme, outils)
    MentionsLegales.jsx    → mentions légales (FR uniquement)
    ui/BackButton.jsx      → bouton pill « Retour »
    ui/MediaLoader.jsx     → image/vidéo avec spinner + fondu, lazy/eager
    ui/OverlayPage.jsx     → layout des pages overlay (fond à points + bouton retour)
  data/
    gwidoData.js           → blocs de l'étude de cas Gwido
    eomData.js             → blocs de l'étude de cas Echoes Of Memories
  design-system/           → tokens + build Style Dictionary
  locales/fr.json, en.json
  prototypes/              → Portfolio.jsx (grille d'hexagones 3D three.js), CRTPortfolio.jsx (écrans CRT en R3F) — abandonnés
  utils/analytics.js       → stubs

public/
  gwido/ (images PNG + WebP, vidéos, videos/optimised, Gwido_Game_Document.pdf 14,5 Mo)
  eom/ (images, vidéo gameplay 34,7 Mo)
  Image/ (favicons, og-image, captures Gwido, refs DA du portfolio)
  BPCE -Stage/Widget Resto/ (5 maquettes de widget, non utilisées dans le site)

Documentation/             → sources de contenu (non déployées)
  Projet Gwido/, Projet Echoes Of Memories/   → textes source des 2 études de cas
  GwidoOriginalConcept/    → doc « GwidoDreamType » (proto multijoueur tower defense × hack & slash)
  SpeedController/         → doc « Space Arena » (proto multijoueur 6DOF, Unity 6 HDRP, NGO)
  Wing Extension/          → doc « Wing Extension 2.0 » (proto action 3D, ailes détachables)
  ds-audit-portfolio-skill-draft.md
  Ref&Other/               → réf. de layout « organic multi wave »

.agents/skills/
  design-system-portfolio-audit/   → skill d'audit DS (rapport, tokens, roadmap)
  ui-interaction-conversion/       → skill UI (archétypes esthétiques, micro-interactions, CRO)
```

---

## 4. Expérience utilisateur actuelle (parcours)

### 4.1 Splash
- Plein écran sombre : « PORTFOLIO_ » tapé lettre par lettre + curseur clignotant, « HARLEGAND Romain », « Technical Game Designer · UX/UI Designer », bouton « Explorer → ».
- Un clic n'importe où (ou sur le bouton) lance la transition : le texte disparaît en fondu, les 3 couches de vague glissent vers la droite à des vitesses décalées, puis le contenu de gauche apparaît (600 ms), et le splash est terminé à 1 400 ms.
- Texte du splash codé en dur (non traduit).

### 4.2 Page d'accueil — mise en page en deux zones
- **Gauche (70 %, blanc, fond à points)** : contenu qui défile. Un halo de points plus foncés suit la souris (`bg-dots-tracker` + masque radial sur les variables CSS de la souris).
- **Droite (fixe, sombre)** : « la vague ». 3 `clipPath` SVG (main, bg1, bg2) recalculés à chaque frame (`requestAnimationFrame`, sinusoïdes, lerp échelonné). Sur mobile (<768 px), la vague passe en bas de l'écran.
- Le visuel de droite change selon la section active :
  - **Intro / Contact** : 3 bandeaux d'images défilants (marquee) de captures Gwido/EoM sur un motif topographique SVG (`feTurbulence` + `feDisplacementMap`).
  - **Projets** : image clé du projet survolé avec parallaxe souris ; les couleurs des vagues de fond prennent la palette du projet (Gwido bleu ardoise, EoM pêche/lavande).
- **Header** : nom + sous-titre + nav (Identité, Projets, Contact, FR/EN). Après 80 px de scroll, une **nav pill flottante** centrée apparaît.

### 4.3 Sections
1. **Intro** — « Je conçois *des mondes et des expériences qui captent, guident et marquent les esprits.* » + 2 paragraphes génériques + CTA « Explorer les projets ».
2. **Projets** — liste numérotée 01/02/03 :
   - 01 **Gwido** (Exploration-Aventure, 2024-2025)
   - 02 **Echoes Of Memories** (Sandbox musical, 2023-2024)
   - 03 **???** « Bientôt » (placeholder)
   - Les éléments apparaissent au scroll (IntersectionObserver). Au survol, le projet devient actif : barre verticale, description + bouton « Explorer l'étude de cas » se déplient, les autres passent à 30 % d'opacité. Sur Gwido, un buste de Gwido pivote et sort sur le côté (easter egg).
   - Libellé latéral vertical : « Projets sélectionnés • 2025-2026 ».
3. **Contact** — « Connectons-nous », « Je recherche actuellement de nouvelles opportunités… », bouton mailto `rharlegand@gmail.com`, LinkedIn, GitHub. Lien « Mentions Légales » en bas.

### 4.4 Overlays (pas de routeur)
Étude de cas, Identité et Mentions légales sont des **overlays montés par l'état React** (`activeCaseStudy`, `showIdentity`, `showMentions`), chargés en lazy (`React.lazy`) et préchargés au survol. Transition : la vague recouvre l'écran (-60), l'overlay est monté à 550 ms, puis la vague sort à droite (+70). Le retour fait l'inverse.

### 4.5 Étude de cas (`CaseStudy.jsx`)
- Nav fixe « ← Retour aux projets | Titre ».
- Hero : badge catégorie, grand titre, description, contexte, chronologie, taille d'équipe, rôles (pills), liens (PDF du Game Doc / itch.io) ; à droite, une image dans une « bulle » animée (border-radius qui se déforme).
- Corps généré par un **tableau de blocs** (dans `src/data/*.js`) :

| Type de bloc | Rôle |
|---|---|
| `carousel` | Galerie auto (4 s), flèches, pause, points |
| `summary-card-pair` | 2 cartes « Système développé » : Caractéristiques / Problèmes / Solutions + images |
| `section-divider` | Grand numéro + label + titre + description |
| `split` | Texte + média, `layout: 'media-right'` ou gauche |
| `media-grid` | Grille `1-full`, `2col`, `3col`, `1+2`, `2+2` |
| `text-block` | Titre + texte + puces + note |
| option `busteConfig` | Ajoute le buste de Gwido animé à l'entrée du bloc dans l'écran |

- Tous les médias s'ouvrent dans une **lightbox** (Échap pour fermer).
- Footer : « Fini d'explorer ? Voir tous les projets ».

**Pour ajouter un projet :** créer `src/data/<projet>Data.js` (fonction `get…ContentBlocks(t)`), ajouter les clés dans `fr.json`/`en.json`, ajouter une entrée au tableau `projects` dans `GwidoPortfolio.jsx` (titre, catégorie, rôles, couleurs de vague, image, liens, `contentBlocks`), déposer les médias dans `public/<projet>/`.

### 4.6 Identité
- « Qui suis-je » : parcours (bac STL microbiologie → jeux vidéo, Warframe → game design → UX/UI), deux facettes : prototyper des mécaniques en moteur / design d'expériences à plus grande échelle.
- Diplôme : Bachelor Game Design, ICAN, Designer Numérique RNCP niveau 6 (étiquette « Diplôme obtenu » codée en dur en FR).
- Outils (bloc sombre sous une vague animée) : Figma, Illustrator, Photoshop, Unity, Blender, Git.
- Pas encore : alternance en cours, M1 UX, méthodes UX (recherche, entretiens, tests), compétences soft.

---

## 5. Direction artistique

- **Base** : blanc + gris slate, texte `slate-900`, accent **indigo** (`#6366f1` / `#4f46e5`), dégradé indigo → emerald sur l'accroche.
- **Typo** : Inter (Google Fonts), titres en **font-black, MAJUSCULES, tracking serré** ; labels en `10px` bold uppercase très espacés.
- **Motifs** : grille de points + halo qui suit la souris ; vagues organiques ; lignes topographiques ; bulle animée.
- **Mouvement** : beaucoup d'animations (vagues en continu, marquees de 80 s, parallaxe, bulle, carrousels, buste). `prefers-reduced-motion` n'est respecté **que pour les vagues**.
- **Palettes par projet** dans les tokens et Tailwind (`gwido-wave-*`, `eom-wave-*`).
- Réfs DA dans `public/Image/Direction Artistique du portfolio/` et `Documentation/Ref&Other/`.

---

## 6. Contenu disponible non exploité

| Matériel | Où | Intérêt |
|---|---|---|
| **Widget Resto — stage BPCE** | `public/BPCE -Stage/Widget Resto/` (5 webp) | **Premier vrai cas UX/UI.** Widget « Mon déjeuner » : états Fermé / Faible / Moyenne / Forte affluence (couleur + vague de remplissage), horaires, solde (36,25 €), menu déroulant, sélecteur « Les ateliers ». Déjà dans `public/`, donc **déjà déployé** mais jamais affiché. Petite coquille sur la maquette : « Fermer » au lieu de « Fermé ». |
| **Gwido — états de caméra** | déjà dans l'étude de cas Gwido | Premier travail UX identifié : à présenter sous l'angle UX (problème de visibilité → solution), pas seulement technique |
| GwidoDreamType | `Documentation/GwidoOriginalConcept/` | Proto multijoueur (ECS hybride, flow field, NGO). Doc très complète mais très game/tech |
| Space Arena (SpeedController) | `Documentation/SpeedController/` | Proto multijoueur 6DOF « speed is life ». Champs `[PLACEHOLDER]` à remplir |
| Wing Extension 2.0 | `Documentation/Wing Extension/` | Proto action 3D. Champs `[TO FILL]` (équipe, durée, vidéo) |
| Projet fil rouge UX Research Decathlon (M1) | hors repo | Candidat sérieux pour une étude de cas UX (brief, hypothèses, plan de recherche, guide d'entretien) |
| Projet UX « client fictif » | à créer | Décidé : Claude joue un client fictif (brief, démarche, revues), à indiquer comme tel, sans métriques de test inventées |

Les 3 docs de prototypes ont été générées par un système multi-agents (« Manager's Note », « Recruiter Feedback ») : il faut les réécrire avec sa propre voix avant de les publier.

---

## 7. Diagnostic

### 7.1 Ce qui marche
- **Identité visuelle forte et cohérente** (vague, points, typo massive) ; la transition par la vague entre les pages est un vrai signe de reconnaissance.
- **Moteur d'étude de cas data-driven** propre et réutilisable : ajouter un projet ne demande pas de toucher au rendu.
- **Structure Problème → Solution** déjà présente (cartes résumé) : elle se transpose directement à l'UX.
- Bonne hygiène web : lazy loading, préchargement au survol, splash statique pour le LCP, WebP, analytics sans cookie, mentions légales RGPD, i18n FR/EN.
- Début de design system formalisé (tokens + Style Dictionary + Tailwind étendu + composants `ui/`).

### 7.2 Positionnement et contenu (priorité haute)
1. **Le positionnement affiché ne correspond plus à la réalité.** « Technical Game Designer » apparaît en premier partout. Un recruteur UX voit un portfolio de game designer. → Passer à « UX/UI Designer » (avec un éventuel « background game design »), dans `index.html` (title, meta, OG, splash statique), le splash React, `intro.subtitle`, `intro.description`.
2. **Zéro étude de cas UX/UI.** Le widget BPCE et le projet Decathlon sont les candidats évidents. Il faut montrer la **démarche** (contexte, utilisateurs, contraintes, itérations, décisions, limites), pas seulement les écrans.
3. **Textes d'intro génériques** (« des mondes et des expériences qui captent… », « le meilleur design est celui que l'on ressent ») : ils ne disent ni ce qu'il fait concrètement, ni pour qui.
4. **Informations datées** : « Je recherche actuellement de nouvelles opportunités » (il est en alternance) ; « Projets sélectionnés • 2025-2026 » alors que les projets sont datés 2023-2025 ; Identité sans l'alternance ni le M1.
5. **Placeholder « ??? / Bientôt »** visible : il signale un manque plus qu'il n'intrigue.
6. Les études de cas de jeux sont rédigées comme des docs techniques (FSM, inspector Unity…). Pour une cible UX, il faut mettre en avant le raisonnement centré joueur.

### 7.3 UX / accessibilité du site
- **Pas d'URL par page** : impossible de partager le lien direct d'une étude de cas, le bouton Retour du navigateur quitte le site, et une seule URL est indexée. Pour un portfolio UX, c'est un point qu'un recruteur peut relever.
- **Splash obligatoire** : un clic de plus avant de voir le contenu, à chaque visite.
- **Accès aux études de cas en 2 temps** : survoler/cliquer la ligne, puis cliquer « Explorer l'étude de cas ». Sur mobile : un tap pour déplier, un autre pour ouvrir.
- **Clavier** : les lignes de projet sont des `div` avec `onClick` (pas de focus, pas d'Entrée) ; le splash se ferme via une `div` cliquable ; la lightbox ne garde pas le focus à l'intérieur.
- **Mouvement réduit** respecté uniquement pour les vagues (marquees, bulle, carrousel automatique, parallaxe, buste continuent).
- **Contraste** : nombreux textes en `slate-400` sur blanc en 10-13 px (labels, notes) → probablement sous AA.
- **i18n incomplète** : splash, « Diplôme obtenu », lien et page Mentions légales, `aria-label` en anglais seulement ; `<html lang="fr">` ne change pas avec la langue.
- Les logos d'outils dépendent de CDN externes.

### 7.4 Code et dette technique
- `GwidoPortfolio.jsx` fait ~1 140 lignes et porte tout : splash, moteur de vague, nav, sections, données projets, overlays. Le nom est hérité d'une époque où il ne contenait que Gwido.
- **6 handlers de transition quasi identiques** (open/back × étude de cas, identité, mentions) → à factoriser en un hook `useWaveTransition`.
- **Re-render à chaque mouvement de souris** : `setMousePos` sur `mousemove` re-rend tout le composant de 1 140 lignes (alors qu'`App.jsx` expose déjà la position dans des variables CSS). Le curseur clignotant tourne aussi en continu après le splash.
- Code dupliqué : `fixPath` (2 fichiers), bandeaux marquee (intro et contact), textes du splash (HTML statique + React), styles injectés via `dangerouslySetInnerHTML`.
- Design system à moitié adopté : `bg-[#4f8499]/60` au lieu de `bg-gwido-wave-1/60`, `text-[10px] … tracking-widest` au lieu de `text-label`, ombres et styles inline dans le splash et `CaseStudy`.
- Branches mortes : `sceneType` `data` et `mobile` (aucun projet ne les utilise), `contributions: []`, `trackPageView`/`trackEvent` vides.
- **Fichiers obsolètes** : `src/prototypes/`, `GUIDE_UTILISATION.md` et `INTERACTION_ZONES_GUIDE.md` (décrivent l'ancienne grille d'hexagones 3D), `ExempleCodePortfolio.txt`, README de 4 lignes, 6 dépendances 3D/GA inutiles.
- **Poids de `public/`** (tout est déployé) : PNG originaux **et** WebP en double (`gwido/images`, `gwido/Image_Optimisation_Webp`, `Image/Gwido`) ; `gwido/videos/optimised/` a exactement les mêmes tailles que les originaux (donc pas réellement optimisées) ; un `.mkv` de 9,8 Mo non utilisé ; vidéo EoM de 34,7 Mo ; PDF de 14,5 Mo ; `og-image.png` de 847 Ko. Captures EoM en PNG non converties.

---

## 8. Pistes priorisées

**P1 — Repositionner (rapide, fort impact)**
- Titre / meta / OG / splash / intro → « UX/UI Designer » d'abord, game design en atout.
- Réécrire intro et contact (alternance en cours, ce qu'il apporte concrètement).
- Mettre à jour Identité : alternance, M1 UX, méthodes UX ; corriger la plage de dates du libellé projets.
- Remplacer « ??? » par un vrai projet ou le retirer.

**P2 — Contenu UX/UI**
- Étude de cas **Widget Resto (BPCE)** avec les médias déjà présents.
- Étude de cas **UX Research Decathlon**.
- Projet « client fictif » (signalé comme tel).
- Reformuler Gwido sous l'angle UX (caméra = problème de lisibilité pour le joueur).
- Ajouter des blocs adaptés à l'UX dans `CaseStudy` : persona, citation d'utilisateur, frise du processus, avant/après, insights/apprentissages.
- Réordonner : projets UX en premier, jeux ensuite (ou un filtre UX / Game).

**P3 — UX du site**
- URLs par page (hash ou `react-router` avec `HashRouter`, compatible GitHub Pages) pour garder les transitions de vague tout en permettant partage + bouton Retour.
- Rendre le splash passable (ou le montrer seulement à la première visite).
- Accès direct à l'étude de cas depuis la ligne projet ; accessibilité clavier ; `prefers-reduced-motion` partout ; contrastes ; i18n complète.

**P4 — Dette technique**
- Découper `GwidoPortfolio.jsx` (Splash, WaveBackground, Nav, sections, `projects.js`) + hook `useWaveTransition`.
- Parallaxe via variables CSS au lieu d'un state React.
- Supprimer prototypes, guides obsolètes, dépendances inutiles, médias en double ; vraiment compresser les vidéos.
- Généraliser les tokens (classes Tailwind nommées).

---

## 9. Notes pour les futures discussions

- Romain préfère réfléchir en détail dans la conversation avant de passer à l'implémentation, avec des réponses techniques et structurées, et peu de schémas ou de fichiers lourds.
- Présenter honnêtement ses manques : pas d'expérience UX professionnelle avant l'alternance, pas de métriques inventées, projets fictifs signalés comme tels.
- Le dépôt contient deux skills (`.agents/skills/`) : audit de design system et conception UI/interactions. On peut s'en servir comme cadre.
- Ancien fil de travail : un système de navigation et de transition basé sur la vague SVG existante (déjà en place pour les overlays).
