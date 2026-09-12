# Référence : Psychologie Visuelle & Patterns de Conversion (CRO)

Une interface esthétique n'a de valeur que si elle guide l'utilisateur vers son objectif de façon fluide, rassurante et irrésistible.

---

## 1. Schémas de Balayage Visuel & Points d'Accroche

L'utilisateur ne lit pas une page web mot à mot : il la scanne en quête d'indices visuels pertinents en moins de 3 secondes.

### 1. Le Schéma en Z (Landing pages simples & Hero sections)
- **Top-Gauche** : Logo ou identité (accroche mémorielle).
- **Top-Droite** : Action secondaire ou CTA d'accès rapide ("Connexion" ou "Essai").
- **Centre** : Titre fort (Proposition de valeur unique) + visuel percutant.
- **Bas-Droite** : Le Call to Action (CTA) principal.

### 2. L'Effet Von Restorff (Effet d'Isolation)
- Lorsque plusieurs éléments similaires sont présentés (ex: grille de tarifs), l'élément qui diffère visuellement est celui dont on se souvient et que l'on sélectionne à 80%.
- *Application* : Mettre en avant la carte recommandée avec une bordure colorée vibrante, un badge "Populaire", ou une légère surélévation (`scale-105`).

---

## 3. Ingénierie des Call-to-Action (CTA) Haute Conversion

Le bouton d'action est le carrefour de la conversion.

### Règles d'Or :
1. **Verbe orienté bénéfice plutôt qu'action rébarbative** :
   - ❌ *"Envoyer"* ➔ ✅ *"Recevoir mon devis en 2 min"*
   - ❌ *"Acheter"* ➔ ✅ *"Démarrer mon projet maintenant"*
   - ❌ *"Inscription"* ➔ ✅ *"Créer mon compte gratuit"*
2. **Hiérarchie Duale (Primaire vs Secondaire)** :
   - Le CTA primaire doit avoir le plus fort contraste chromatique de toute la vue.
   - Le CTA secondaire doit être transparent ou avec contour discret ("Voir la démo", "En savoir plus").
3. **Indices Directionnels (Directional Cues)** :
   - Une petite flèche animée vers la droite (`→`) qui se déplace de `+4px` au survol augmente le taux de clic de 15 à 25%.
   - Dans les images de visages, le regard de la personne doit être tourné vers le CTA, pas vers le vide.

---

## 4. Éléments de Réassurance & Preuve Sociale

Le doute et l'anxiété sont les premiers tueurs de conversion.

### 1. Ruban de Logos Infini (Infinite Marquee)
- Place les logos de clients ou technologies réputées juste sous la Hero Section.
- Défilement continu à vitesse modérée (animation CSS fluide avec `translate3d`).

### 2. Cartes de Témoignages Vivantes
- **Éléments indispensables** : Photo réelle en médaillon, nom complet, fonction/entreprise, 5 étoiles dorées, citation courte et impactante.
- Au survol : Légère élévation pour donner de l'importance au témoignage inspecté.

### 3. Micro-garanties sous le CTA
- Placer immédiatement sous le bouton principal des mentions désarmant le risque :
  - *🔒 "Sans engagement ni carte bancaire"*
  - *⚡ "Réponse garantie sous 24h"*
  - *⭐ "Noté 4.9/5 par plus de 300 créateurs"*

---

## 5. Réduction de la Friction & Expérience Mobile

### Barre Flottante Collante (Sticky Bottom Bar sur Mobile)
- Sur smartphone, après avoir dépassé la Hero section au scroll, le bouton CTA primaire disparaît souvent de l'écran.
- *Solution* : Faire apparaître une barre discrète fixée au bas de l'écran (`fixed bottom-0 left-0 right-0 p-4 backdrop-blur-md`) contenant le CTA principal prêt à être touché par le pouce.
