# Référence : Accessibilité Numérique (WCAG 2.2 Niveau AA)

Ce guide fournit la grille technique d'audit de l'accessibilité pour tout composant ou élément d'interface web.

---

## 1. Ratios de Contraste des Couleurs (WCAG 1.4.3 & 1.4.11)

### Règles Essentielles :
- **Texte normal (< 18pt ou < 14pt gras)** : Contraste minimum de **4.5:1** contre son arrière-plan (AA).
- **Texte large (≥ 18pt ou ≥ 14pt gras)** : Contraste minimum de **3.0:1** (AA).
- **Composants d'interface & icônes interactives** : Contraste minimum de **3.0:1** pour les bordures d'inputs, icônes d'action et indicateurs d'état.
- **Texte désactivé (`disabled`)** : Exempté de ratio strict, mais doit rester perceptible pour éviter la confusion.

### Anti-patterns à traquer :
- ❌ Texte gris clair sur fond blanc (ex: `#9CA3AF` sur `#FFFFFF` = ~2.8:1 ➔ ÉCHEC).
- ❌ Icônes d'action grises sans texte d'accompagnement et avec contraste < 3:1.
- ❌ Dégradés d'arrière-plan où une partie du texte passe sous le seuil de 4.5:1.

---

## 2. Taille des Cibles Tactiles & Pointeurs (WCAG 2.2 - 2.5.8)

### Règles Essentielles :
- **Mobile & Écrans tactiles** : Toute cible cliquable ou touchable doit faire au minimum **44 × 44 pixels** (Apple HIG / WCAG AAA) ou au minimum **24 × 24 pixels** avec un espacement périphérique suffisant pour éviter les clics accidentels (WCAG 2.2 AA).
- **Zone de clic étendue** : Si l'icône visuelle est petite (ex: 16px ou 20px), utiliser du padding pour étendre la zone interactive :
  ```css
  /* Exemple en CSS */
  .icon-button {
    width: 20px;
    height: 20px;
    padding: 12px; /* Zone totale = 44px */
    box-sizing: content-box;
  }
  ```

---

## 3. Navigation au Clavier & Indicateurs de Focus (WCAG 2.4.7 & 2.4.11)

### Règles Essentielles :
- **Focus visible** : Ne JAMAIS supprimer le contour de focus sans alternative explicite :
  ```css
  /* ❌ INTERDIT */
  button:focus { outline: none; }

  /* ✅ CONFORME */
  button:focus-visible {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }
  ```
- **Ordre logique de tabulation (`tabindex`)** :
  - Éviter `tabindex > 0`.
  - N'utiliser `tabindex="0"` que pour rendre un conteneur personnalisé focusable.
  - Utiliser `tabindex="-1"` pour les éléments masqués ou gérés par script.
- **Trap de Focus (Focus Lock)** : Les modales ouvertes doivent capturer la tabulation clavier et la restituer à l'élément déclencheur lors de la fermeture.

---

## 4. Sémantique HTML & Attributs ARIA (WCAG 1.3.1 & 4.1.2)

### Règle d'or : « Pas d'ARIA vaut mieux qu'un mauvais ARIA »
Utiliser en priorité les balises sémantiques natives HTML5 :

| Cas d'usage | ❌ À Éviter | ✅ Préférer |
| :--- | :--- | :--- |
| Bouton d'action | `<div onClick={...}>Valider</div>` | `<button type="button" onClick={...}>Valider</button>` |
| Lien de navigation | `<button onClick={() => navigate('/about')}>` | `<a href="/about">À propos</a>` |
| Icône seule | `<button><svg>...</svg></button>` | `<button aria-label="Fermer le menu"><svg aria-hidden="true">...</svg></button>` |
| Accordéon / Dropdown | `<div>Contenu</div>` | `<button aria-expanded="false" aria-controls="menu-id">...` |

---

## 5. Préférences Utilisateur & Mouvements (WCAG 2.3.3)

### Animation & Respect du Confort Visuel :
- Tout composant animé (fade, slide, rotation 3D, effet de particule) doit respecter la préférence système de l'utilisateur :
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
- En Tailwind CSS : utiliser la classe `motion-reduce:transition-none` ou `motion-reduce:animate-none`.
