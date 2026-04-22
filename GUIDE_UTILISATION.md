# 🎉 Portfolio 3D - Serveur Lancé !

## ✅ Statut : Serveur Actif

Le serveur de développement Vite est **opérationnel** et accessible à l'adresse :

**🌐 http://localhost:5173**

---

## 🚀 Comment Tester Votre Portfolio

1. **Ouvrez votre navigateur** (Chrome, Firefox, Edge, etc.)
2. **Naviguez vers** : http://localhost:5173
3. **Interagissez avec la grille** :
   - Survolez les hexagones pour voir l'effet hover (cyan + élévation)
   - Cliquez sur un hexagone pour activer le mode focus
   - Les objets 3D apparaîtront sur la tuile sélectionnée
   - La caméra zoomera automatiquement
   - Un panneau d'information apparaîtra en bas à droite

---

## 🎮 Interactions Disponibles

| Action | Résultat |
|--------|----------|
| **Survol** (hover) | Hexagone devient cyan et s'élève légèrement |
| **Clic** | Active le projet : objets 3D apparaissent, caméra zoome, panneau d'info s'affiche |
| **Clic sur zone vide** | Désactive le projet et revient à la vue d'ensemble |
| **Bouton "Fermer"** | Ferme le panneau et désactive le projet |

---

## 🎨 Ce Que Vous Devriez Voir

### Vue Principale
- Grille de 24×24 hexagones blancs
- Fond gris foncé avec effet de brouillard
- Titre "PORTFOLIO" en haut à gauche
- Information "Grille 24x24" sous le titre

### En Interaction
- **Hover** : Hexagone cyan brillant
- **Active** : Hexagone rouge avec objets 3D animés dessus
- **Autres tuiles** : Grises (dimmed)
- **Panneau** : Carte blanche en bas à droite avec info du projet

---

## 🛠️ Commandes du Serveur

Le serveur tourne actuellement en mode développement avec **hot reload** activé :
- Toute modification dans le code sera **immédiatement visible** dans le navigateur
- Pas besoin de recharger manuellement la page

### Arrêter le Serveur
- Appuyez sur **Ctrl+C** dans le terminal où le serveur tourne

### Redémarrer le Serveur
- Utilisez le fichier `start-dev.bat`
- Ou tapez : `cmd /c npm run dev`

---

## 📝 Fichiers à Personnaliser

### 1. Modifier les Projets
Fichier : [`src/components/Portfolio.jsx`](file:///c:/Users/rharl/Documents/Personnal/Testroom/TestPortfolio/src/components/Portfolio.jsx#L28-L40)

```javascript
const PROJECT_OBJECTS = {
  0: [
    { type: 'box', position: [0, 0.5, 0], size: [1, 1, 1], color: 0xff0000 }
  ],
  // Ajoutez vos projets ici...
};
```

### 2. Ajuster la Taille de la Grille
Fichier : [`src/components/Portfolio.jsx`](file:///c:/Users/rharl/Documents/Personnal/Testroom/TestPortfolio/src/components/Portfolio.jsx#L5-L6)

```javascript
const GRID_COLS = 24;  // Réduire pour de meilleures performances
const GRID_ROWS = 24;  // Ex: 12x12 pour tester
```

### 3. Changer les Couleurs
Fichier : [`src/components/Portfolio.jsx`](file:///c:/Users/rharl/Documents/Personnal/Testroom/TestPortfolio/src/components/Portfolio.jsx#L19-L25)

```javascript
const COLORS = {
  active: 0xff6b6b,    // Couleur quand sélectionné
  hover: 0x4ecdc4,     // Couleur au survol
  base: 0xffffff,      // Couleur par défaut
  dimmed: 0x333333,    // Couleur des autres tuiles
  background: 0x1e272e // Couleur de fond
};
```

---

## 🐛 En Cas de Problème

### La page ne charge pas
- Vérifiez que le serveur tourne (voir le terminal)
- Vérifiez l'URL : doit être exactement `http://localhost:5173`
- Essayez de recharger la page (F5)

### Erreurs dans la console
- Ouvrez les outils de développement (F12)
- Consultez l'onglet Console pour voir les erreurs
- Vérifiez l'onglet Network pour voir si Three.js se charge

### Performance lente
- Réduisez la taille de la grille (ex: 12×12)
- Fermez les autres applications gourmandes
- Vérifiez dans F12 > Performance

---

## 📚 Documentation Complète

Pour plus d'informations, consultez :

- **[Setup Guide](file:///C:/Users/rharl/.gemini/antigravity/brain/dd5af5b0-c0de-4d08-a99f-4d51d1d839cc/setup_guide.md)** - Guide d'installation complet
- **[Project Overview](file:///C:/Users/rharl/.gemini/antigravity/brain/dd5af5b0-c0de-4d08-a99f-4d51d1d839cc/PROJECT_OVERVIEW.md)** - Documentation technique détaillée
- **[Walkthrough](file:///C:/Users/rharl/.gemini/antigravity/brain/dd5af5b0-c0de-4d08-a99f-4d51d1d839cc/walkthrough.md)** - Récapitulatif de la mise en place

---

## 🎯 Prochaines Étapes

1. ✅ **Testez le portfolio** dans votre navigateur
2. 🎨 **Personnalisez** les couleurs, la grille, et les projets
3. 📦 **Ajoutez vos projets** avec des descriptions réelles
4. 🚀 **Déployez** sur Vercel, Netlify ou GitHub Pages quand vous êtes prêt

---

## 💡 Astuces

- Les modifications de code sont **instantanément visibles** (hot reload)
- Utilisez **Ctrl+Shift+I** (ou F12) pour les outils développeur
- La scène 3D peut être lourde : commencez avec une grille plus petite pour tester
- Vous pouvez ajouter autant de projets que vous voulez dans `PROJECT_OBJECTS`

---

**Bon développement ! 🎉**