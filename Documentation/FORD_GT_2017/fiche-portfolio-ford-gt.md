# Fiche portfolio — Ford GT 2017, histoire d'une héritière

> Brouillon. Les passages entre [crochets] sont à confirmer ou à compléter par toi : je n'ai pas de trace de ces informations dans le projet.

## En une phrase
Un site narratif en scroll qui raconte l'histoire de la Ford GT 2017, de la GT40 du Mans 1966 à la fin de production en 2022, autour d'un unique modèle 3D qui se repositionne d'un chapitre à l'autre.

## Fiche rapide
- **Type** : projet personnel, conception UX/UI + intégration front
- **Durée** : 4-5 jour
- **Rôle** : conception de la direction artistique et des 12 écrans (Figma), rédaction de la spec, design tokens, direction du récit, tests et itérations
- **Outils** : Figma, Blender, Vite, three.js, GSAP, GitHub Pages
- **Cibles** : desktop, laptop, mobile
- **Lien** : [\[URL du site\]](https://harlegandromain.github.io/FORD_GT_2017/) · [\[dépôt GitHub\]](https://github.com/HARLEGANDRomain/FORD_GT_2017)

## Contexte et intention
Je voulais un projet qui montre ce que je fais le mieux : un parcours pensé comme une histoire, avec une interface qui s'efface devant le sujet. Public visé : des passionnés qui veulent comprendre la voiture, son nom, son héritage de course, pas seulement admirer un modèle 3D.

## Le problème de design
Comment raconter 50 ans d'histoire en une seule page sans noyer le visiteur, tout en gardant le modèle 3D au centre ?
Trois contraintes que je me suis données :
1. Un seul modèle 3D, jamais remplacé, qui change de cadrage selon le chapitre.
2. Le texte doit rester du vrai texte (lisible, accessible), y compris quand il passe derrière la voiture.
3. Aucune carte, aucun bouton superflu : la typographie et le cadrage font le travail.

## Démarche

**1. Récit et structure.** Séquence de 12 écrans : introduction (phares seuls dans le noir), révélation, héritage GT40, nouvelle ère 2015, rareté de la production, puissance, retour au Mans, éditions spéciales, puis une galerie interactive sous trois angles (avant, arrière, détail roue). Chaque écran a un objectif utilisateur écrit avant d'être dessiné.

**2. Design dans Figma.** Format de référence 1280×1080, système typographique à deux familles (Iosevka Charon Bold pour les affiches et chiffres, Inter pour la lecture), palette volontairement courte (bleu principal, bleu profond pour les grands éléments décoratifs, blancs à opacités fixes, noir cinéma pour l'intro). Styles de texte et de couleur nommés « GT », exportés en JSON pour alimenter le code.

**3. Spécification.** Un document de spec décrit chaque écran : état, objectif, éléments visibles, boîtes de texte exactes, règles de ce qu'il ne faut pas ajouter. Il contient aussi une proposition de trajectoire de caméra (azimut, élévation, distance, pivot par écran) et quatre familles de motion du texte, avec une règle : le texte n'apparaît qu'après l'arrêt de la caméra, pour ne jamais avoir deux points de focus à la fois.

**4. Intégration.** Architecture « sandwich de calques » : fond, texte derrière la voiture, canvas WebGL transparent, texte devant. Positionnement par ancrage (gauche, centre, droite) plutôt que par letterbox, pour que le site s'adapte aux écrans larges sans casser les compositions. Un outil de calage caméra avec superposition de la maquette Figma a servi à caler chaque écran.

**5. Itération.** Relecture du récit en me mettant à la place d'un fan de GT40.

## Décisions de design marquantes
- **Intro sans interface** : seuls les phares sortent du noir. Elle sert aussi d'écran d'attente pendant le chargement du modèle.
- **Débords volontaires** : sur certains écrans la voiture sort du cadre (profil agrandi, roue arrière). Le cadrage raconte l'échelle plutôt que de montrer la voiture entière.
- **Chiffres comme éléments graphiques** : 647, 50, 2015 en très grand, superposés à la voiture, avec un compteur animé.
- **Galerie** : une exploration libre (miniatures, repères) après un récit guidé. Changement de registre assumé.

## Difficultés rencontrées
- **Poids du modèle** : de 8 Mo et 614 meshes à environ 1,4 Mo et 16 meshes après optimisation.
- **Rendu des vitres** : le matériau d'origine apparaissait faux dans un canvas transparent, remplacé par un matériau classique.
- **Fidélité Figma → navigateur** : écarts d'interlignage et de chasse typographique, réglés avec une superposition de la maquette.
- **Cadrage 3D** : faire correspondre la perspective de chaque maquette demande un calage écran par écran.
- **Responsive** : Pour le responsive, on est parti sur une adaptation sur la hauteur et largeur, avec des ajustements pour chaque écran pour que le texte et la voiture restent bien positionnés.

## Résultats
- Site fonctionnel sur mobile, laptop et desktop, avec animations fluides et récit validé qui raconte l'histoire de la FORD GT et de sont ancetre la GT40.

## Ce que j'ai appris
- Écrire une spec précise avant de coder évite des allers-retours : chaque écran avait un objectif clair.
- Un design system léger (tokens couleurs et typographie) rend l'intégration plus fidèle.
- Le contenu fait partie du design : un fan relit le texte avant de regarder l'image.
- Limites à assumer : je n'ai pas testé le site sur tous les supports et je n'ai pas fait de test utilisateur formel. 

## Pistes d'amélioration
- Silhouette de la GT40 à l'écran d'héritage, section sources, détail des éditions spéciales.
- Test utilisateur avec des passionnés, savoir si les utilisateurs ajouterais des éléments en plus ou si des vu leur plairais (exemple vue interieur)
- Ajoute d'une étape de timeline avec les différents modèles de GT40 -> GT (ici limitation des modèles disponible sur sketchfab)

## Visuels à prévoir pour le portfolio
Les 12 écrans Figma côte à côte, une vidéo du scroll, un avant/après maquette contre site, une capture de l'outil de calage, une capture mobile.
