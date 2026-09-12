---
name: ux-ui-audit
description: >-
  Audits existing UI elements, components, sections, or screens against professional UX/UI, accessibility (WCAG 2.2 AA), visual hierarchy, and interaction design standards. Use whenever the user asks to review, audit, critique, evaluate, or improve the UX, UI, design, usability, or accessibility of an existing element, component, or webpage.
---

# Protocole d'Audit UX/UI & Accessibilité pour Éléments Existants

Ce skill guide l'agent pour réaliser un audit ergonomique, visuel et technique approfondi sur n'importe quel élément d'interface existant (bouton, formulaire, navbar, carte, modale, section de page complète).

---

## Fiches de Référence Disponibles

Avant d'évaluer l'élément, consulte les fiches méthodologiques associées selon les besoins de l'inspection :
- [10 Heuristiques de Nielsen pour micro-composants](./references/nielsen-heuristics.md)
- [Hiérarchie visuelle, grille 8pt & lois de Gestalt](./references/visual-hierarchy-tokens.md)
- [Checklist d'accessibilité WCAG 2.2 AA](./references/accessibility-wcag.md)
- [Matrice des 7 états interactifs & micro-interactions](./references/interaction-states.md)
- [Template de rapport d'audit](./resources/audit-report-template.md)

---

## Workflow d'Audit en 5 Étapes

### Étape 1 : Cartographie et Contexte de l'Élément
1. **Identifier le code source** : Localiser le fichier JSX, HTML ou CSS correspondant.
2. **Définir l'intention fonctionnelle** : Quel est l'objectif premier de l'élément pour l'utilisateur ? (ex: action de conversion, navigation, saisie d'information critique, confirmation).
3. **Repérer le framework de style** : Vanilla CSS, Tailwind CSS, styled-components, etc.

---

### Étape 2 : Inspection Multi-Dimensionnelle

Examine l'élément selon les **4 piliers fondamentaux** :

#### Pilier 1 : Ergonomie & Heuristiques Cognitives (sur 25 pts)
*Référence : [nielsen-heuristics.md](./references/nielsen-heuristics.md)*
- L'affordance est-elle évidente (sait-on immédiatement si c'est cliquable) ?
- Y a-t-il prévention des erreurs (confirmation avant destruction, masques de saisie) ?
- La charge mentale est-elle minimisée (loi de Hick, information essentielle en premier) ?
- Le retour d'état (feedback) est-il immédiat (< 100ms) et compréhensible ?

#### Pilier 2 : Hiérarchie Visuelle & Tokens (sur 25 pts)
*Référence : [visual-hierarchy-tokens.md](./references/visual-hierarchy-tokens.md)*
- Respecte-t-il une grille d'espacement cohérente (règle des 8px / multiples de 4px) ?
- La typographie est-elle calibrée (tailles, graisses, hauteurs de ligne `line-height >= 1.4`) ?
- Les lois de Gestalt sont-elles respectées (proximité, alignement, région commune) ?
- La gestion des profondeurs et bordures en Dark/Light mode est-elle soignée ?

#### Pilier 3 : Matrice des États d'Interaction (sur 25 pts)
*Référence : [interaction-states.md](./references/interaction-states.md)*
- Les 7 états interactifs sont-ils tous prévus ?
  *(Default, Hover, Active/Pressed, Focus-visible, Disabled, Loading/Async, Error/Success)*
- Les micro-interactions sont-elles fluides (100-200ms avec easing naturel) ?
- Les curseurs de souris sont-ils adéquats (`pointer`, `not-allowed`, `wait`) ?

#### Pilier 4 : Accessibilité WCAG 2.2 AA (sur 25 pts)
*Référence : [accessibility-wcag.md](./references/accessibility-wcag.md)*
- **Ratios de contraste** : 4.5:1 minimum pour le texte normal, 3:1 pour les composants et textes larges.
- **Cible tactile (Touch Target)** : Au moins 44x44px sur mobile (ou 24x24px avec espacement adéquat).
- **Navigation au clavier** : Présence d'un indicateur de focus distinct (`:focus-visible`), pas de piège au clavier.
- **Sémantique & ARIA** : Balises natives (`<button>`, `<a>`, `<input>`), `aria-label` sur les icônes seules, `aria-expanded` pour les menus extensibles.

---

### Étape 3 : Calcul du Score & Hiérarchisation des Anomalies

Attribue une note sur 100 (somme des 4 piliers sur 25) et classe les anomalies trouvées selon leur sévérité :
- 🔴 **Bloquant (Critical)** : Empêche un utilisateur d'accomplir sa tâche, ou bloque l'accès aux personnes handicapées/utilisateurs clavier.
- 🟠 **Majeur (Major)** : Crée une forte friction, de la confusion, ou viole un standard d'ergonomie/contraste.
- 🟡 **Mineur (Minor)** : Défaut cosmétique, micro-défaut d'alignement ou animation perfectible.
- 🔵 **Suggestion (Enhancement)** : Optimisation pour porter l'expérience au niveau "World-Class".

---

### Étape 4 : Rédaction du Rapport

Utilise le modèle défini dans [audit-report-template.md](./resources/audit-report-template.md). Sois toujours :
- **Précis et factuel** : Citer les lignes de code exactes et les valeurs mesurées (ex: "contraste de 2.6:1 mesuré entre #718096 et #1A202C").
- **Explicatif** : Préciser le "Pourquoi" (l'impact sur l'expérience humaine).

---

### Étape 5 : Solution & Code Clé en Main

Fournis systématiquement :
1. Le code réécrit (CSS, Tailwind ou JSX) corrigeant l'ensemble des anomalies identifiées.
2. La liste des "Quick Wins" applicables en moins de 15 minutes.
