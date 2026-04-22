# Guide : Limiter les Interactions des Hexagones

Ce guide vous montre comment rendre certains hexagones interactifs et d'autres non.

---

## 🎯 Méthode 1 : Par Plage d'ID (Simple)

**Rendre interactifs uniquement les hexagones de ID 0 à 100**

### Étape 1 : Ajouter une fonction de vérification

Ajoutez cette fonction après la ligne 25 (après COLORS) :

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const isInteractive = (id) => {
  // Seulement les IDs de 0 à 100 sont interactifs
  return id >= 0 && id <= 100;
};
```

### Étape 2 : Modifier la détection du hover

Ligne 212-214, remplacez :

```javascript
if (intersects.length > 0) {
    hoveredId = intersects[0].object.userData.id;
    document.body.style.cursor = 'pointer';
}
```

Par :

```javascript
if (intersects.length > 0) {
    const id = intersects[0].object.userData.id;
    if (isInteractive(id)) {
        hoveredId = id;
        document.body.style.cursor = 'pointer';
    } else {
        hoveredId = null;
        document.body.style.cursor = 'default';
    }
}
```

---

## 🎯 Méthode 2 : Par Zone Rectangulaire

**Définir une zone interactive rectangulaire (ex: colonnes 5-15, rangées 5-15)**

### Fonction de vérification (remplace la Méthode 1)

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const INTERACTIVE_ZONE = {
  colMin: 5,
  colMax: 15,
  rowMin: 5,
  rowMax: 15
};

const isInteractive = (id, row, col) => {
  return col >= INTERACTIVE_ZONE.colMin && 
         col <= INTERACTIVE_ZONE.colMax &&
         row >= INTERACTIVE_ZONE.rowMin && 
         row <= INTERACTIVE_ZONE.rowMax;
};
```

### Stocker row et col dans userData

Ligne 160, remplacez :

```javascript
tileMesh.userData = { id: idCounter, originalPos: new THREE.Vector3(x, 0, z) };
```

Par :

```javascript
tileMesh.userData = { 
    id: idCounter, 
    row: row, 
    col: col,
    originalPos: new THREE.Vector3(x, 0, z) 
};
```

### Modifier la détection du hover

Ligne 212-214, remplacez par :

```javascript
if (intersects.length > 0) {
    const tile = intersects[0].object;
    const id = tile.userData.id;
    const row = tile.userData.row;
    const col = tile.userData.col;
    
    if (isInteractive(id, row, col)) {
        hoveredId = id;
        document.body.style.cursor = 'pointer';
    } else {
        hoveredId = null;
        document.body.style.cursor = 'default';
    }
}
```

---

## 🎯 Méthode 3 : Par Distance depuis le Centre

**Rendre interactifs uniquement les hexagones dans un rayon X du centre**

### Fonction de vérification

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const INTERACTIVE_RADIUS = 6; // Rayon en nombre de tuiles

const isInteractive = (row, col) => {
  const centerRow = Math.floor(GRID_ROWS / 2);
  const centerCol = Math.floor(GRID_COLS / 2);
  
  const distanceRow = Math.abs(row - centerRow);
  const distanceCol = Math.abs(col - centerCol);
  const distance = Math.sqrt(distanceRow * distanceRow + distanceCol * distanceCol);
  
  return distance <= INTERACTIVE_RADIUS;
};
```

Utilisez la même modification de userData et de détection que la Méthode 2.

---

## 🎯 Méthode 4 : Zones Personnalisées Multiples

**Définir plusieurs zones interactives différentes**

### Fonction de vérification

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const INTERACTIVE_ZONES = [
  { colMin: 0, colMax: 5, rowMin: 0, rowMax: 5 },      // Zone 1: coin haut-gauche
  { colMin: 10, colMax: 15, rowMin: 10, rowMax: 15 },  // Zone 2: centre
  { colMin: 18, colMax: 23, rowMin: 18, rowMax: 23 }   // Zone 3: coin bas-droit
];

const isInteractive = (row, col) => {
  return INTERACTIVE_ZONES.some(zone => 
    col >= zone.colMin && col <= zone.colMax &&
    row >= zone.rowMin && row <= zone.rowMax
  );
};
```

---

## 🎯 Méthode 5 : Par Liste d'IDs Spécifiques

**Rendre interactifs uniquement certains IDs précis**

### Fonction de vérification

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const INTERACTIVE_IDS = [0, 1, 2, 10, 11, 12, 50, 51, 100, 200, 250];

const isInteractive = (id) => {
  return INTERACTIVE_IDS.includes(id);
};
```

---

## 🎨 Bonus : Différencier Visuellement les Zones

Pour mieux voir quelles zones sont interactives, vous pouvez changer leur couleur de base.

### Ajouter après la ligne 160 (après userData)

```javascript
// Colorer différemment les tuiles non-interactives
if (!isInteractive(idCounter, row, col)) {
    material.color.setHex(0x222222); // Gris très foncé pour non-interactif
    material.opacity = 0.5;
    material.transparent = true;
}
```

---

## 📝 Exemple Complet : Zone Rectangulaire

Voici un exemple complet avec la Méthode 2 (zone rectangulaire) :

### 1. Après la ligne 25, ajoutez :

```javascript
// --- CONFIGURATION DES ZONES INTERACTIVES ---
const INTERACTIVE_ZONE = {
  colMin: 5,
  colMax: 18,
  rowMin: 5,
  rowMax: 18
};

const isInteractive = (row, col) => {
  return col >= INTERACTIVE_ZONE.colMin && 
         col <= INTERACTIVE_ZONE.colMax &&
         row >= INTERACTIVE_ZONE.rowMin && 
         row <= INTERACTIVE_ZONE.rowMax;
};
```

### 2. Ligne 160, modifiez userData :

```javascript
tileMesh.userData = { 
    id: idCounter, 
    row: row, 
    col: col,
    isInteractive: isInteractive(row, col), // Stocke si interactif
    originalPos: new THREE.Vector3(x, 0, z) 
};
```

### 3. Ligne 165, ajoutez la différenciation visuelle :

```javascript
// Colorer différemment les tuiles non-interactives
if (!tileMesh.userData.isInteractive) {
    material.color.setHex(0x444444); // Gris foncé
    material.metalness = 0.3;
}
```

### 4. Lignes 212-218, modifiez la détection :

```javascript
if (intersects.length > 0) {
    const tile = intersects[0].object;
    
    if (tile.userData.isInteractive) {
        hoveredId = tile.userData.id;
        document.body.style.cursor = 'pointer';
    } else {
        hoveredId = null;
        document.body.style.cursor = 'default';
    }
} else {
    hoveredId = null;
    document.body.style.cursor = 'default';
}
```

---

## 🎯 Quelle Méthode Choisir ?

| Méthode | Quand l'utiliser | Complexité |
|---------|------------------|------------|
| **Méthode 1** (Par ID) | Vous connaissez les IDs exacts | ⭐ Simple |
| **Méthode 2** (Zone rectangulaire) | Zone centrale ou coins | ⭐⭐ Moyenne |
| **Méthode 3** (Distance) | Zone circulaire autour du centre | ⭐⭐ Moyenne |
| **Méthode 4** (Zones multiples) | Plusieurs zones distinctes | ⭐⭐⭐ Avancée |
| **Méthode 5** (IDs spécifiques) | Liste précise de projets | ⭐ Simple |

---

## 💡 Astuce

Pour débugger et voir les IDs/coordonnées des tuiles, ajoutez ceci dans le onClick (ligne 184) :

```javascript
const onClick = () => {
    if (hoveredId !== null) {
        const tile = tiles.find(t => t.userData.id === hoveredId);
        console.log('Tile clicked:', {
            id: tile.userData.id,
            row: tile.userData.row,
            col: tile.userData.col,
            isInteractive: tile.userData.isInteractive
        });
        
        const newId = (activeIdRef.current === hoveredId) ? null : hoveredId;
        activeIdRef.current = newId;
        setActiveId(newId);
    } else {
        activeIdRef.current = null;
        setActiveId(null);
    }
};
```

Cela affichera dans la console (F12) les informations de chaque tuile cliquée.
