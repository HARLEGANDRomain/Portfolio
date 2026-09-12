# Modèle de Rapport d'Audit UX/UI

> **Composant / Élément audité** : `[Nom de l'élément / chemin du fichier]`  
> **Date de l'audit** : `[Date]`  
> **Inspecteur** : Antigravity UX/UI Auditor  

---

## 1. Synthèse Exécutive & Score Global

### **Score Global d'Usabilité : [Score]/100**

| Pilier d'évaluation | Score | Statut |
| :--- | :---: | :--- |
| **1. Ergonomie & Heuristiques de Nielsen** | `../25` | 🟢 Excellent / 🟡 À parfaire / 🔴 Critique |
| **2. Hiérarchie Visuelle, Espacements & Tokens** | `../25` | 🟢 Excellent / 🟡 À parfaire / 🔴 Critique |
| **3. États d'Interaction & Feedback** | `../25` | 🟢 Excellent / 🟡 À parfaire / 🔴 Critique |
| **4. Accessibilité WCAG 2.2 AA** | `../25` | 🟢 Conforme / 🟡 Partiellement conforme / 🔴 Non conforme |

---

## 2. Relevé Détaillé des Anomalies

### 🔴 Anomalies Critiques (Bloquantes pour l'utilisateur)
*(Accessibilité nulle, rupture de flux, bouton inopérant sans feedback)*
1. **[Titre du problème]**
   - **Localisation** : `[Ligne de code ou sélecteur CSS]`
   - **Impact utilisateur** : *Expliquer en quoi cela bloque ou déroute l'utilisateur.*
   - **Critère non respecté** : *Ex: WCAG 2.4.7 (Focus Visible) ou Nielsen #1 (Visibilité de l'état).*

---

### 🟠 Anomalies Majeures (Friction ergonomique ou esthétique forte)
*(Contraste insuffisant, cibles tactiles trop petites sur mobile, absence d'état hover/active)*
1. **[Titre du problème]**
   - **Localisation** : `[Ligne de code ou sélecteur CSS]`
   - **Impact utilisateur** : *Expliquer la dégradation de l'expérience.*

---

### 🟡 Anomalies Mineures & Finitions Polies
*(Micro-décalage d'alignement, courbe d'animation trop sèche, espacement hors grille 8pt)*
1. **[Titre du problème]**
   - **Localisation** : `[Ligne de code ou sélecteur CSS]`
   - **Suggestion** : *Recommandation d'ajustement.*

---

## 3. Plan de Correction & Code Avant / Après

### ❌ Implémentation Actuelle (Extrait)
```jsx
// [Code source actuel présentant les anomalies]
```

### ✅ Implémentation Corrigée Recommandée
```jsx
// [Code source corrigé intégrant les fixations de design, a11y et interactions]
```

---

## 4. "Quick Wins" (Gains immédiats < 15 minutes)
- [ ] 1. *Action rapide 1*
- [ ] 2. *Action rapide 2*
