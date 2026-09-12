---
name: ui-interaction-conversion
description: >-
  Guides the creation, redesign, and enhancement of user interfaces across diverse aesthetic archetypes (Maximalism/Neo-Brutalism, Tech Minimalism, Neo-Skeuomorphism, Editorial Luxury, Cyberpunk HUD). Focuses on high visual impact, tactile micro-interactions, 60fps animations, and conversion rate optimization (CRO).
---

# Guide de Conception UI : Esthétiques Multi-Styles, Interactions & Conversion

Ce skill équipe l'agent pour créer des interfaces web qui dépassent le statut de simple maquette pour devenir de véritables expériences mémorables, hautement interactives et optimisées pour la conversion.

---

## Fiches de Référence Disponibles

- [Les 5 Archétypes Esthétiques (Maximalisme, Minimalisme, Skeuomorphisme, etc.)](./references/aesthetic-archetypes.md)
- [Psychologie Visuelle & Patterns de Conversion (CRO)](./references/conversion-patterns.md)
- [Recettes d'Animations & Micro-Interactions 60 FPS](./references/animation-recipes.md)
- [Bibliothèque de Composants Prêts à l'Emploi](./resources/conversion-components.md)

---

## Protocole de Conception en 4 Étapes

### Étape 1 : Sélection de l'Archétype Esthétique Adapté
Ne jamais appliquer aveuglément un minimalisme générique. Détermine d'abord l'identité visuelle idéale :

1. **Maximalisme / Néo-Brutalisme** : Pour les créateurs, studios audacieux, projets ludiques ou Gen-Z.
   - *Marqueurs* : Bordures noires 2-3px, ombres portées dures (`4px 4px 0px`), couleurs vives saturées, boutons physiques à sensation de clic mécanique.
2. **Minimalisme Tech & Précision** : Pour les outils pros, SaaS, plateformes cloud et développeurs.
   - *Marqueurs* : Niveaux de gris sombres profonds, micro-bordures luminescentes, typographies millimétrées (Inter/Geist), micro-dégradés.
3. **Néo-Skeuomorphisme / Claymorphism** : Pour les apps grand public bienveillantes, santé, éducation.
   - *Marqueurs* : Formes rebondies ("pillowy"), ombres intérieures (`inset`), teintes pastel rassurantes.
4. **Éditorial & Luxe Chaleureux** : Pour les portfolios d'art/design, mode, architecture, hôtellerie.
   - *Marqueurs* : Typographies à empattements (Serif), palettes terreuses et naturelles, asymétries poétiques, textures subtiles.
5. **Cyberpunk & Tech HUD** : Pour le gaming, Web3, cybersécurité, IA et dashboards tactiques.
   - *Marqueurs* : Cadrans fluorescents, grilles techniques, polices monospace, découpes polygonales (`clip-path`).

---

### Étape 2 : L'Orchestration Visuelle (The Hook)
- **Le Point Focal Unique** : Dans les 3 premières secondes, l'œil de l'utilisateur doit être irrésistiblement attiré par un point d'ancrage fort (titre percutant, visuel dynamique ou animation d'onde fluide).
- **Gestion du Contraste (Effet Von Restorff)** : L'élément le plus important (souvent le CTA principal ou la carte vedette) doit posséder le plus fort contraste chromatique de l'écran.

---

### Étape 3 : L'Enchantement Interactif (The Delight)
Applique systématiquement des micro-interactions de premier ordre :
- **Transitions physiques** : Utiliser des courbes d'amorti naturel comme `cubic-bezier(0.16, 1, 0.3, 1)` plutôt que de simples `ease-in-out`.
- **Réaction au pointeur** : Intégrer un effet de *Spotlight* (lueur radiale suiveuse) ou de *3D Tilt* sur les cartes clés.
- **Apparition chorégraphiée (Staggering)** : Faire apparaître les éléments d'une grille avec un décalage de 50 à 80ms.
- **Animations continues** : Si des flux continus sont utilisés (vagues SVG, rubans défilants de logos), s'assurer qu'ils tournent à 60 FPS sur GPU via `transform` et respectent `prefers-reduced-motion`.

---

### Étape 4 : L'Action & Réduction de Friction (The Conversion)
- **Micro-copy orientée bénéfice** : Préférer des verbes d'action concrets ("Démarrer gratuitement en 2 min", "Explorer mes projets") aux libellés passifs.
- **Réassurance immédiate** : Placer sous les actions principales des micro-preuves (badges de confiance, étoiles, mentions sans risque).
- **Adaptation Mobile** : Prévoir une barre d'action flottante en bas de l'écran si le scroll éloigne le bouton d'action principal.

---

## Directives de Code pour l'Agent

1. **Pas de placeholders génériques** : Toujours fournir du texte et des visuels crédibles et contextualisés.
2. **Performance GPU stricte** : Animer exclusivement `transform` et `opacity`. Ne jamais animer `width`, `height` ou `margin`.
3. **Accessibilité préservée** : Toujours inclure la gestion des contrastes et de `prefers-reduced-motion` même dans les interfaces les plus spectaculaires ou maximalistes.
