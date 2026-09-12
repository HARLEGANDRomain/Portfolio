# Référence : Matrice des États d'Interaction & Micro-Animations

Pour qu'un élément interactif paraisse vivant, robuste et professionnel, il doit posséder des réponses visuelles distinctes et prédictibles selon son état.

---

## 1. La Matrice des 7 États Indispensables

Chaque élément interactif (bouton, lien, input, carte cliquable) doit être vérifié sur cette matrice :

| État | Déclencheur | Comportement visuel attendu | Cursor |
| :--- | :--- | :--- | :--- |
| **1. Default (Idle)** | Au repos | Apparence standard, affordance claire d'interactivité. | `cursor-pointer` ou `cursor-default` |
| **2. Hover** | Pointeur sur l'élément | Changement subtil de luminosité (5-10%), légère élévation (`translate-y-[-1px]`) ou éclaircissement. | `cursor-pointer` |
| **3. Focus / Focus-Visible** | Tabulation clavier | Anneau de focus net (`ring-2 ring-offset-2 ring-blue-500`), ne pas dépendre uniquement de la couleur. | Clavier |
| **4. Active (Pressed)** | Clic maintenu | Effet d'enfoncement mécanique (`scale-[0.98]` ou assombrissement), donne l'impression d'un interrupteur physique. | `cursor-pointer` |
| **5. Disabled** | Désactivé par règle métier | Opacité réduite (ex: 50%), contraste suffisant pour lecture, pas d'effets au survol. Attribut `aria-disabled="true"`. | `cursor-not-allowed` |
| **6. Loading / Async** | Requête en cours | Spinner interne, skeleton loader ou remplacement du libellé par "En cours...". Désactivation des clics multiples. | `cursor-wait` |
| **7. Error / Feedback** | Validation / Résultat | Bordure rouge/verte, icône de statut (alerte/coche), message d'aide contextuel sous l'élément. | Dépend du mode de correction |

---

## 2. Micro-Interactions & Transitions Fluides

### Durées & Courbes d'accélération (Easings) :
- **Micro-réactions (Hover, Active, Toggle)** : **100ms à 150ms**, transition rapide pour ne pas donner une impression de lenteur. Courbe `ease-out`.
- **Transitions de structure (Modales, Tiroirs, Menus)** : **200ms à 300ms**, courbe `cubic-bezier(0.16, 1, 0.3, 1)` pour un amorti naturel.
- **Animations complexes (> 400ms)** : À proscrire sur les micro-éléments ; elles ralentissent la perception de vitesse de l'interface.

### Pièges Fréquents (Anti-patterns) :
- ❌ **Hover collant sur mobile** : Sur smartphone, l'état `:hover` reste souvent actif après le tap. Utiliser la media query `@media (hover: hover)` :
  ```css
  @media (hover: hover) {
    .btn:hover { background-color: var(--color-hover); }
  }
  ```
- ❌ **Transition sur `all` non ciblée** : `transition: all 0.3s` peut animer par erreur des propriétés coûteuses comme la largeur ou la hauteur, provoquant des saccades (jank). Préférer `transition: background-color 0.15s ease, transform 0.15s ease`.
- ❌ **Double clic incontrôlé** : Un bouton qui ne passe pas en état "Loading" dès le premier clic permet à l'utilisateur de soumettre deux fois la requête.
