# Référence : Hiérarchie Visuelle, Design Tokens & Lois de Gestalt

Ce guide détaille les règles techniques et perceptuelles pour évaluer la composition visuelle d'un élément d'interface.

---

## 1. Grille d'Espacement & Rythme (8pt Grid System)
Tout espacement (`padding`, `margin`, `gap`) doit dériver d'une échelle prédictible, idéalement basée sur des multiples de 4px ou 8px :

| Token | Valeur | Usage recommandé |
| :--- | :--- | :--- |
| `2xs` | `2px` / `0.125rem` | Bords fins, micro-décalages d'icônes |
| `xs`  | `4px` / `0.25rem`  | Espacement entre icône et label inline, badge padding |
| `sm`  | `8px` / `0.5rem`   | Padding interne de petits boutons/inputs, gap de listes serrées |
| `md`  | `12px` / `0.75rem` | Padding standard d'inputs, padding vertical de cartes denses |
| `lg`  | `16px` / `1rem`    | Padding standard de cartes, gap standard entre sections de formulaire |
| `xl`  | `24px` / `1.5rem`  | Séparation entre blocs distincts dans un container |
| `2xl` | `32px` / `2rem`    | Marges de sections majeures |
| `3xl` | `48px` / `3rem`    | Séparation de sections sur desktop |

### Anti-patterns à traquer :
- ❌ Valeurs arbitraires non harmonisées (ex: `margin: 13px`, `padding-left: 19px`).
- ❌ Manque de "respiration" (padding insuffisant donnant un effet étouffé aux textes).
- ❌ Padding asymétrique involontaire (ex: padding horizontal inférieur au padding vertical dans un bouton).

---

## 2. Typographie & Lisibilité
La typographie structure la priorité de lecture avant toute chose.

### Échelle Modulaire & Rôles
1. **Titres (H1/H2)** : `font-weight: 700` ou `800`, `line-height: 1.15` à `1.25`, tracking serré (`letter-spacing: -0.02em`).
2. **Sous-titres / H3** : `font-weight: 600`, `line-height: 1.3`.
3. **Corps de texte (Body)** : `14px` à `16px`, `font-weight: 400` ou `500`, `line-height: 1.5` à `1.6` pour une lecture confortable.
4. **Micro-copies / Captions / Badges** : `11px` à `13px`, `font-weight: 500` à `600`, `line-height: 1.4`.

### Anti-patterns à traquer :
- ❌ Lignes de texte trop longues (> 75-80 caractères par ligne sur grand écran).
- ❌ Hauteur de ligne (`line-height`) trop serrée (< 1.4 sur du texte courant) provoquant le chevauchement visuel.
- ❌ Multiplication de polices différentes (limiter à 1 ou 2 polices maximum : une police de titrage expressive et une police d'interface neutre comme Inter, Roboto, Outfit).

---

## 3. Lois de Gestalt Appliquées aux Composants

### Loi de Proximité
- Les éléments liés fonctionnellement doivent être plus proches entre eux que des éléments voisins non liés.
- *Règle d'or du formulaire* : L'espace entre un label et son champ doit être inférieur à l'espace entre ce champ et le label suivant.

### Loi de Région Commune (Common Region)
- L'utilisation d'une carte, d'un fond teinté ou d'une bordure subtile regroupe visuellement les éléments pour l'œil humain sans surcharge cognitive.

### Loi de Similarité
- Tous les éléments ayant la même fonction (liens externes, boutons de suppression, statuts) doivent partager la même signature visuelle (forme, couleur, typographie).

---

## 4. Profondeur, Élévation & Contours

L'élévation guide le regard pour distinguer le plan d'arrière-plan, les surfaces interactives et les calques flottants :

- **Niveau 0 (Base)** : Fond de page (`bg-slate-900` ou `bg-gray-50`).
- **Niveau 1 (Surfaces)** : Cartes, panneaux (`bg-slate-800` avec bordure fine `border border-white/10` ou ombre douce `shadow-sm`).
- **Niveau 2 (Interactif au survol)** : Légère translation verticale (`translate-y-[-2px]`) ou surélévation d'ombre (`shadow-md`).
- **Niveau 3 (Overlay / Popover)** : Menus déroulants, tooltips (`shadow-xl`, bordure marquée).
- **Niveau 4 (Modales & Toasts)** : Arrière-plan flouté (`backdrop-blur-md bg-black/50`), ombre profonde (`shadow-2xl`).

### Anti-patterns à traquer :
- ❌ Ombres noires brutes opaques (ex: `box-shadow: 0 4px 10px rgba(0,0,0,0.8)`). Préférer des ombres douces et multi-couches avec faible opacité.
- ❌ Manque de délimitation dans les thèmes sombres (dans le dark mode, ajouter une fine bordure semi-transparente `border border-white/10` pour délimiter les cartes).
