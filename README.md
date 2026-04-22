# Installation et Lancement du Portfolio

## ⚠️ Problème d'Exécution PowerShell

Votre système Windows a une politique d'exécution qui bloque les scripts PowerShell. Vous devez d'abord autoriser l'exécution de scripts.

### Solution 1: Modifier la Politique d'Exécution (Recommandé)

Ouvrez PowerShell **en tant qu'administrateur** et exécutez:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Confirmez avec `O` (Oui).

### Solution 2: Utiliser CMD au lieu de PowerShell

Vous pouvez utiliser l'invite de commande classique (CMD) au lieu de PowerShell pour toutes les commandes npm.

---

## 📦 Étapes d'Installation

Une fois la politique d'exécution configurée, suivez ces étapes:

### 1. Installer les dépendances

```bash
npm install
```

Cette commande va installer:
- React et React-DOM
- Three.js
- Vite et tous les outils de build
- TailwindCSS et ses dépendances

### 2. Lancer le serveur de développement

```bash
npm run dev
```

Le projet sera accessible à: **http://localhost:5173**

---

## 🎯 Que Faire Ensuite

1. **Ouvrez votre navigateur** à l'adresse http://localhost:5173
2. **Interagissez avec la grille**: survolez et cliquez sur les hexagones
3. **Modifiez le code**: les changements se reflètent instantanément (hot reload)

---

## 📝 Fichiers Importants

- `src/components/Portfolio.jsx` - Le composant principal avec toute la logique 3D
- `src/App.jsx` - Point d'entrée de l'application
- `package.json` - Configuration et dépendances du projet

---

## 🔍 Consulter la Documentation

- [setup_guide.md](file:///C:/Users/rharl/.gemini/antigravity/brain/dd5af5b0-c0de-4d08-a99f-4d51d1d839cc/setup_guide.md) - Guide de setup complet
- [PROJECT_OVERVIEW.md](file:///C:/Users/rharl/.gemini/antigravity/brain/dd5af5b0-c0de-4d08-a99f-4d51d1d839cc/PROJECT_OVERVIEW.md) - Documentation technique détaillée
