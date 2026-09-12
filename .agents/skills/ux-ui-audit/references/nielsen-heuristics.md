# Référence : Les 10 Heuristiques de Nielsen Appliquées aux Éléments UI

Ce guide détaille comment évaluer un élément d'interface ou un composant au regard des **10 Heuristiques d'utilisabilité de Jakob Nielsen**, avec des critères d'inspection concrets pour le web moderne.

---

## 1. Visibilité de l'état du système (Visibility of System Status)
> *L'utilisateur doit toujours savoir ce qui se passe, grâce à un feedback approprié dans un délai raisonnable.*

### Points de contrôle pour un élément :
- [ ] **Indicateurs de chargement** : L'élément affiche-t-il un état de chargement (spinner, skeleton loader, barre de progression) lors d'une action asynchrone ?
- [ ] **Feedback immédiat** : Lors d'un clic ou d'une saisie, l'élément réagit-il sous 100ms (effet de ripple, changement de couleur, micro-animation) ?
- [ ] **Persistance du statut** : Les états de succès, d'avertissement ou d'erreur restent-ils visibles tant que nécessaire sans bloquer l'interaction ?
- [ ] **Position dans le flux** : Si le composant fait partie d'un processus multi-étapes (stepper, pagination), l'étape active et le total restant sont-ils explicites ?

---

## 2. Correspondance entre le système et le monde réel (Match Between System & Real World)
> *L'interface doit parler le langage des utilisateurs, avec des mots, expressions et concepts qui leur sont familiers.*

### Points de contrôle pour un élément :
- [ ] **Terminologie naturelle** : Les libellés évitent-ils le jargon technique (ex: préférer *"Impossible d'enregistrer"* à *"Erreur 500 / Payload invalid"* ) ?
- [ ] **Métaphores visuelles standard** : Les icônes respectent-elles les conventions universelles (loupe = recherche, poubelle = suppression, roue dentée = paramètres, coche = validation) ?
- [ ] **Ordre logique et culturel** : Les listes ou flux suivent-ils un ordre naturel (chronologique, alphabétique, priorité logique, sens de lecture LTR/RTL) ?

---

## 3. Contrôle et liberté de l'utilisateur (User Control & Freedom)
> *Les utilisateurs effectuent souvent des actions par erreur. Ils ont besoin d'une « issue de secours » clairement balisée.*

### Points de contrôle pour un élément :
- [ ] **Annulation (Undo/Cancel)** : Les modales, dialogues, popovers ou formulaires disposent-ils d'un bouton d'annulation clair ou d'une fermeture facile (touche Escape, clic extérieur, bouton fermer explicite) ?
- [ ] **Réversibilité des actions** : Les actions destructives peuvent-elles être annulées (toast "Annuler") ou demandent-elles une confirmation préalable ?
- [ ] **Non-blocage** : L'élément évite-t-il de piéger l'utilisateur dans une boucle ou un état bloquant sans issue ?

---

## 4. Cohérence et standards (Consistency & Standards)
> *Les utilisateurs ne devraient pas avoir à se demander si des mots, des situations ou des actions différentes signifient la même chose.*

### Points de contrôle pour un élément :
- [ ] **Cohérence interne** : Les boutons primaires, secondaires, liens et champs ont-ils la même apparence, taille, border-radius et comportement sur tout le site ?
- [ ] **Cohérence externe** : Les composants respectent-ils les standards de la plateforme (ex: formulaire avec bouton de soumission en bas à droite ou pleine largeur sur mobile, menu burger sur mobile, etc.) ?
- [ ] **Typographie et tonalité** : Les styles de casse (Title Case, Sentence case) et la ponctuation sont-ils unifiés ?

---

## 5. Prévention des erreurs (Error Prevention)
> *Mieux vaut concevoir une interface qui empêche un problème de survenir plutôt que de produire d'excellents messages d'erreur.*

### Points de contrôle pour un élément :
- [ ] **Contraintes intelligentes** : Les champs désactivent-ils ou formatent-ils automatiquement les saisies invalides (masques de saisie pour téléphones/dates, sélecteurs plutôt que champs libres si choix restreint) ?
- [ ] **Boutons destructifs distincts** : Les actions irréversibles (suppression, réinitialisation) sont-elles visuellement isolées et différenciées des actions primaires positives ?
- [ ] **Avertissements préalables** : Des alertes contextuelles s'affichent-elles avant une action à risque (perte de données non sauvegardées) ?

---

## 6. Reconnaissance plutôt que rappel (Recognition Rather Than Recall)
> *Minimiser la charge mnésique de l'utilisateur en rendant les éléments, les actions et les options visibles.*

### Points de contrôle pour un élément :
- [ ] **Affordance claire** : Un élément cliquable ressemble-t-il indiscutablement à un élément cliquable (élévation, contraste, curseur pointeur) ?
- [ ] **Indices visuels (Placeholders & labels)** : Les champs de saisie conservent-ils un label visible en tout temps (floating label ou label supérieur, jamais uniquement un placeholder éphémère) ?
- [ ] **Options visibles** : Les menus et sélecteurs proposent-ils des aperçus clairs plutôt que d'obliger l'utilisateur à deviner les choix disponibles ?

---

## 7. Flexibilité et efficacité d'utilisation (Flexibility & Efficiency of Use)
> *L'interface doit convenir aussi bien aux utilisateurs novices qu'aux utilisateurs experts.*

### Points de contrôle pour un élément :
- [ ] **Raccourcis & accélérateurs** : Les composants complexes supportent-ils les touches de raccourci (Entrée pour valider, Escape pour fermer, Tab / Shift+Tab pour naviguer) ?
- [ ] **Personnalisation / Préférences** : Les tableaux ou listes permettent-ils le tri, le filtrage ou l'ajustement de densité d'affichage ?
- [ ] **Saisie assistée** : Autocomplétion, suggestions récentes ou valeurs par défaut pertinentes.

---

## 8. Esthétique et design épuré (Aesthetic & Minimalist Design)
> *Les dialogues et composants ne doivent pas contenir d'informations non pertinentes ou rarement nécessaires (loi de Hick).*

### Points de contrôle pour un élément :
- [ ] **Ratio Signal/Bruit** : Chaque pixel, icône, bordure ou ombre a-t-il une raison d'être ? Y a-t-il des éléments purement décoratifs qui distraient du message principal ?
- [ ] **Clarté du point focal** : Y a-t-il une seule action principale (Call to Action) évidente par bloc ?
- [ ] **Hiérarchie de l'information** : L'élément utilise-t-il la taille et le contraste pour guider le regard vers l'essentiel en premier ?

---

## 9. Aider les utilisateurs à reconnaître, diagnostiquer et corriger les erreurs (Error Recovery)
> *Les messages d'erreur doivent être exprimés en langage clair, indiquer précisément le problème et suggérer une solution constructive.*

### Points de contrôle pour un élément :
- [ ] **Localisation précise** : L'erreur s'affiche-t-elle à proximité immédiate de l'élément en faute (sous le champ, pas dans une pop-up déconnectée) ?
- [ ] **Formulation constructive** : Le message dit-il quoi faire pour résoudre l'erreur (ex: *"Le mot de passe doit contenir au moins 8 caractères dont un chiffre"* au lieu de *"Saisie invalide"* ) ?
- [ ] **Non-effacement des données valides** : En cas d'erreur de soumission, les champs valides sont-ils conservés ?

---

## 10. Aide et documentation (Help & Documentation)
> *Même s'il est préférable que le système puisse être utilisé sans documentation, une aide contextuelle peut être nécessaire.*

### Points de contrôle pour un élément :
- [ ] **Tooltips & infobulles contextuelles** : Les abréviations, métriques complexes ou options techniques ont-elles une infobulle explicative accessible au survol et au focus ?
- [ ] **Discrétion** : L'aide est-elle accessible sans encombrer la vue par défaut ?
