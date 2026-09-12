# Référence : Recettes d'Animations & Micro-Interactions 60 FPS

Ce guide rassemble les formules mathématiques, courbes de bézier et implémentations techniques pour créer des animations fluides, organiques et hautement interactives.

---

## 1. Principes Physiques & Courbes de Bézier

Les animations linéaires (`linear`) ou génériques (`ease-in-out`) paraissent souvent artificielles ou lentes. Les interfaces de premier ordre utilisent des amortis physiques :

### Courbes Recommandées :
- **Amorti Naturel Haut de Gamme (Spring Dampening)** :
  ```css
  /* Transition organique sans rebond excessif */
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  ```
- **Pop Énergique & Ludique (Subtle Overshoot)** :
  ```css
  /* Rebond léger en fin de course pour badges et boutons pop */
  transition-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
  ```
- **Sortie Rapide / Disparition** :
  ```css
  /* Démarrage mesuré et accélération pour fermer */
  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  ```

---

## 2. Recette 1 : Effet 3D Tilt au Pointeur

Cet effet donne du relief physique à une carte en calculant l'inclinaison selon la position exacte de la souris.

### Implémentation React :
```jsx
import React, { useRef, useState } from 'react';

export function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const [transform, setTransform] = useState('');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calcul de l'angle (-8deg à +8deg)
    const rotateX = ((y / rect.height) - 0.5) * -16;
    const rotateY = ((x / rect.width) - 0.5) * 16;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform,
        transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden rounded-2xl ${className}`}
    >
      {children}
    </div>
  );
}
```

---

## 3. Recette 2 : Spotlight / Lueur Radiale Suiveuse

Met en valeur une carte au survol en dessinant un halo de lumière sous le pointeur.

```jsx
export function SpotlightCard({ children, className = '' }) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 p-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.15), transparent 80%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
```

---

## 4. Recette 3 : Apparition Échelonnée (Staggered Reveal)

Lorsque plusieurs cartes s'affichent, les faire apparaître les unes après les autres avec un délai progressif de 50ms à 80ms crée une chorégraphie fluide.

```css
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Application des délais */
.stagger-item:nth-child(1) { animation-delay: 0.05s; }
.stagger-item:nth-child(2) { animation-delay: 0.12s; }
.stagger-item:nth-child(3) { animation-delay: 0.19s; }
.stagger-item:nth-child(4) { animation-delay: 0.26s; }
```

---

## 5. Recette 4 : Ondes & Dynamique Lerp (Vagues Organiques)

Pour les effets de vagues continues ou transitions d'écrans (comme dans votre portfolio) :
- Utiliser `requestAnimationFrame` avec détection de visibilité (`document.hidden`).
- Appliquer un lissage par interpolation linéaire (**Lerp**) :
  `valeurCourante += (valeurCible - valeurCourante) * vitesseLerp;`
- Échelonner les vitesses des différentes couches (`0.045`, `0.030`, `0.018`) pour donner de la profondeur de parallaxe liquide.
- Toujours vérifier `window.matchMedia('(prefers-reduced-motion: reduce)').matches` pour figer le tracé si l'utilisateur l'exige.
