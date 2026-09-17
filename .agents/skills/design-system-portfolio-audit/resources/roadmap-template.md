# Feuille de Route : Formalisation & Industrialisation du Design System

---

## 🎯 Priorité 1 : Centraliser et Unifier les Tokens de Base
- **Effort estimé** : `[ex: 4-6h]`
- **Valeur / Impact** : `[Fondation critique, élimination des styles arbitraires]`
- **Actions concrètes** :
  - [ ] Générer et intégrer `tokens.json` ou un fichier de tokens dédié (`src/styles/tokens.js` / CSS variables).
  - [ ] Mapper la configuration Tailwind (`tailwind.config.js` `theme.extend`) sur les tokens extraits.
  - [ ] Remplacer les couleurs et espacements hardcodés les plus fréquents.

---

## 🧩 Priorité 2 : Refactoriser et Standardiser les Composants UI Clés
- **Effort estimé** : `[ex: 8-12h]`
- **Valeur / Impact** : `[Élimination des doublons, composants robustes et composables]`
- **Actions concrètes** :
  - [ ] Homogénéiser les boutons (`Button.jsx`), cartes (`Card.jsx`) et champs d'entrée.
  - [ ] Déclarer explicitement les variants (ex: `primary`, `secondary`, `outline`) et états (`hover`, `focus-visible`, `disabled`).
  - [ ] Typage et documentation des props (PropTypes ou TypeScript JSDoc).

---

## 📖 Priorité 3 : Showcase & Documentation Vivante
- **Effort estimé** : `[ex: 4-8h]`
- **Valeur / Impact** : `[Documentation vivante, visibilité immédiate]`
- **Actions concrètes** :
  - [ ] Intégrer une page ou route cachée `/design-system` exposant le nuancier, la typographie et la galerie de composants.
  - [ ] Lier la documentation avec les maquettes ou prototypes Figma.

---

## 🎨 Priorité 4 : Synchronisation & Export Figma
- **Effort estimé** : `[ex: 3-5h]`
- **Valeur / Impact** : `[Alignement Design ↔ Dev]`
- **Actions concrètes** :
  - [ ] Export des composants réels via `html.to.design` ou plugin Figma Tokens.
  - [ ] Organisation en librairie de composants partagée.
