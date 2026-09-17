---
name: design-system-portfolio-audit
description: Auditer un portfolio React pour extraire et formaliser les fondations d'un design système. Utilise ce skill pour : identifier tous les tokens (couleurs, typo, spacing, shadows, etc.), analyser la structure et la réutilisabilité des composants, détecter les patterns et incohérences, et générer un rapport structuré + tokens.json + feuille de route priorisée. Déclenche quand l'utilisateur veut auditer son code existant pour créer un design system, analyser sa cohérence visuelle, ou formaliser ses composants.
---

# Design System Portfolio Audit Skill

## Objectif
Auditer un portefeuille React existant pour extraire les fondations d'un design système. Produit un rapport complet + fichiers JSON prêts à utiliser + recommandations.

---

## Workflow d'audit

### Phase 1 : Préparation et collecte
1. Demande les fichiers sources du portfolio (ou charge depuis uploads)
2. Identifie la structure du projet (Tailwind ? CSS modules ? CSS-in-JS ?)
3. Localise les fichiers clés : composants, styles, configuration

### Phase 2 : Extraction des tokens
**Cherche et liste :**
- **Couleurs** : variables CSS, Tailwind config, hardcoded colors (bg-*, text-*, border-*, etc.)
- **Typographie** : font-family, font-sizes (scales), font-weights, line-heights
- **Spacing** : unités (px, rem, %), échelle utilisée (8px ? 4px ? Tailwind defaults ?)
- **Shadows** : drop-shadows, box-shadows appliquées
- **Border radius** : valeurs utilisées (px, %)
- **Breakpoints** : responsive design (mobile/tablet/desktop)
- **Z-index** : stacking order patterns
- **Animations/transitions** : durations, easing

**Format de sortie pour cette phase :**
```json
{
  "colors": {
    "primary": ["#value1", "contexts: buttons, headers"],
    "secondary": ["#value2", "contexts: ..."],
    ...
  },
  "typography": {
    "fontFamilies": ["Poppins", "MonoFont", ...],
    "fontSizes": ["12px", "14px", "16px", ...],
    "fontWeights": [400, 500, 700, ...],
    "lineHeights": [1.2, 1.5, 1.8, ...]
  },
  "spacing": {
    "scale": ["4px", "8px", "12px", "16px", "24px", ...],
    "method": "Tailwind / custom CSS / mixed"
  },
  ...
}
```

### Phase 3 : Analyse des composants
**Pour chaque composant, documente :**
- Nom et chemin du fichier
- Responsabilité (button, card, header, etc.)
- Props actuelles (et leurs types)
- Variants/états (disabled, hover, active, loading, etc.)
- Dépendances (tokens qu'il utilise, autres composants)
- Réutilisabilité (score 1-5 : isolé vs réutilisé partout)
- Complexité : simple / moyen / complexe

**Produit un tableau :**
```
| Composant | Type | Props | Variants | Réutilisable | Dépendances |
|-----------|------|-------|----------|--------------|-------------|
| Button    | UI   | size, variant, disabled | ... | 5/5 | colors, spacing, typo |
| ...       |      |       |          |              |              |
```

### Phase 4 : Détection des patterns et incohérences
**Cherche :**
- Couleurs hardcoded vs tokens (% d'utilisation)
- Spacing inconsistent (ex: un composant utilise 12px, un autre 10px pour la même chose)
- Typos : plusieurs font-families sans raison, size jumps (12 → 18 → 24 au lieu d'une scale régulière)
- Z-index magic numbers (1000, 9999, etc.)
- Duplication de composants similaires (deux "Card" légèrement différentes)
- Manque de states (hover, disabled, focus, etc.)

**Rapport de santé du système existant :**
```
- Cohérence couleurs : 75% (25% hardcoded)
- Cohérence typo : 80%
- Cohérence spacing : 60%
- Réutilisabilité moyenne : 3.5/5
- Recommandations prioritaires : ...
```

### Phase 5 : Génération des outputs

#### Output 1 : Rapport structuré (Markdown)
```
# Audit Design System Portfolio

## Résumé exécutif
- État général : x% cohérent
- Points forts : ...
- Points faibles : ...

## Tokens identifiés
### Couleurs
### Typographie
### Spacing
... (etc)

## Composants (tableau)

## Incohérences détectées
- [Pattern 1]
- [Pattern 2]

## Feuille de route (priorisée)
### Priorité 1 : [Étape]
Effort : X heures estimé
Valeur : Y (établir tokens de base)

### Priorité 2 : [Étape]
...
```

#### Output 2 : tokens.json (prêt à utiliser)
```json
{
  "version": "1.0.0",
  "colors": {
    "primary": {
      "50": "#...",
      "100": "#...",
      ...
      "900": "#..."
    },
    "semantic": {
      "success": "#...",
      "error": "#..."
    }
  },
  "typography": {
    "fontFamilies": {
      "body": "Poppins, sans-serif",
      "mono": "Monaco, monospace"
    },
    "fontSizes": {
      "xs": "12px",
      "sm": "14px",
      "base": "16px",
      "lg": "18px",
      "xl": "20px",
      "2xl": "24px"
    },
    "fontWeights": {
      "light": 300,
      "regular": 400,
      "semibold": 600,
      "bold": 700
    },
    "lineHeights": {
      "tight": 1.2,
      "normal": 1.5,
      "relaxed": 1.8
    }
  },
  "spacing": {
    "0": "0px",
    "1": "4px",
    "2": "8px",
    "3": "12px",
    "4": "16px",
    "5": "20px",
    "6": "24px",
    "8": "32px",
    "10": "40px"
  },
  "shadows": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.1)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)"
  },
  "borderRadius": {
    "none": "0",
    "sm": "2px",
    "base": "4px",
    "md": "6px",
    "lg": "8px",
    "xl": "12px",
    "full": "9999px"
  },
  "breakpoints": {
    "sm": "640px",
    "md": "768px",
    "lg": "1024px",
    "xl": "1280px"
  }
}
```

#### Output 3 : Feuille de route (avec priorité, effort, valeur)
```markdown
# Feuille de route Design System

## Priorité 1 : Formaliser les tokens de base
**Effort :** 4-6 heures
**Valeur :** Établit la fondation, 70% du travail systématique
- Créer tokens.json centralisé
- Mapper Tailwind config avec les tokens
- Valider cohérence dans le code existant

**Prochaines étapes :**
- Refactor les composants pour utiliser tokens au lieu de hardcoded values
- Tests de cohérence visuelle

---

## Priorité 2 : Refactoriser les composants existants
**Effort :** 8-12 heures
**Valeur :** Élimine la duplication, améliore réutilisabilité
- Consolider les composants similaires
- Ajouter les variants/states manquants
- Documenter props

---

## Priorité 3 : Créer la page Design System dans le portfolio
**Effort :** 6-8 heures
**Valeur :** Showcase + documentation
- Afficher les tokens (couleurs, typo, spacing en live)
- Gallery de composants
- Lier vers Figma (snapshots html.to.design)

---

## Priorité 4 : Exporter vers Figma
**Effort :** 4-5 heures (manuel avec html.to.design)
**Valeur :** Figma comme snapshot / référence
- Exporter composants via html.to.design
- Organiser en librairie Figma
- Documenter pour futures itérations
```

---

## Instructions pratiques pour Claude

### Avant de commencer
1. **Demande les fichiers sources** au utilisateur (portfolio repo, ou fichiers spécifiques)
   - Structure : Je peux lire depuis `/mnt/user-data/uploads/` ou directement si l'utilisateur donne les chemins
   - Fichiers clés : `src/` (composants, pages), `tailwind.config.js`, `vite.config.js`, fichiers CSS

2. **Charger et analyser** :
   - Parcours les composants (React files)
   - Extrait les styles (Tailwind classes, CSS imports, inline styles)
   - Identifie les dépendances (fichiers de config)

3. **Construire la base de données de tokens** :
   - Parse `tailwind.config.js` si Tailwind
   - Scanne les fichiers CSS/SCSS pour valeurs hardcoded
   - Liste les variables CSS si utilisées
   - Compile tout dans une structure uniforme

4. **Analyser les composants** :
   - Fichier par fichier
   - Props et types
   - Variants/états présents
   - Utilisation réelle dans le projet
   - Dépendances sur les tokens

5. **Générer les outputs** :
   - Rapport Markdown bien structuré
   - `tokens.json` (formaté, prêt à copier)
   - Feuille de route (priorisée par effort/valeur)

---

## Cas d'usage typiques

- **Utilisateur** : "Je veux créer un design system à partir de mon portfolio existant"
  - **Action** : Audit complet, tous les outputs

- **Utilisateur** : "Audit juste mes composants, comment sont-ils structurés ?"
  - **Action** : Focus phase 3-4, tableau de composants + incohérences

- **Utilisateur** : "J'ai un Tailwind config, peux-tu l'extraire en tokens.json ?"
  - **Action** : Focus phase 2 + phase 5.2

---

## Notes techniques

- **Tailwind** : Si le projet utilise Tailwind, la plupart des tokens sont dans `tailwind.config.js` (theme.extend ou theme)
- **CSS variables** : Cherche `--var-*` dans les fichiers CSS/SCSS
- **Hardcoded** : Regex pour `#[0-9a-f]{3,6}`, `rgb()`, `hsl()`, valeurs px/rem directes
- **Réutilisabilité** : grep/search pour voir combien de fois chaque composant est importé
- **Complexité** : lignes de code + nombre de props + nombre de conditions
