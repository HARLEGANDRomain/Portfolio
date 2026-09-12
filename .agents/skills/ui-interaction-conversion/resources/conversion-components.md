# Ressources : Composants Haute Conversion Multi-Styles

Cette bibliothèque fournit des composants prêts à l'emploi en React et Tailwind CSS, déclinés selon les archétypes esthétiques.

---

## 1. Bouton CTA Néo-Brutaliste / Maximaliste
*Effet d'enfoncement physique mécanique, bordure 2px, ombre décalée et flèche animée.*

```jsx
export function NeoBrutalistCTA({ label = "Démarrer Maintenant", href = "#", badge = "Gratuit" }) {
  return (
    <div className="relative inline-block group">
      {badge && (
        <span className="absolute -top-3 -right-2 z-10 bg-pink-500 text-white text-xs font-black px-2 py-0.5 rounded border border-black rotate-6 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <a
        href={href}
        className="inline-flex items-center gap-3 px-7 py-3.5 bg-[#FFDE59] text-black font-extrabold text-base uppercase tracking-wider border-2 border-black rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-100 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)]"
      >
        <span>{label}</span>
        <svg 
          className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  );
}
```

---

## 2. Carte Bento Tech & Spotlight (Style Haute Précision)
*Arrière-plan sombre avec effet de halo lumineux sous la souris et bordure micro-dégradée.*

```jsx
import React, { useRef, useState } from 'react';

export function TechBentoCard({ title, subtitle, stat, icon: Icon }) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e15] p-6 transition-colors duration-300 hover:border-white/20"
    >
      {/* Spotlight Halo */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${pos.x}px ${pos.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-indigo-400 uppercase tracking-widest">{subtitle}</span>
          {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-indigo-300 transition-colors" />}
        </div>
        
        <div>
          <p className="text-3xl font-extrabold text-white tracking-tight">{stat}</p>
          <h4 className="text-sm text-gray-300 font-medium mt-1">{title}</h4>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Ruban de Preuve Sociale Infini (Infinite Logo Marquee)
*Défilement CSS pur 60 FPS sans saccades.*

```jsx
export function InfiniteLogoMarquee({ items = [] }) {
  return (
    <div className="relative w-full overflow-hidden py-8 mask-gradient">
      {/* Gradient fade on edges */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0a0e] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0a0e] to-transparent z-10" />

      <div className="flex w-max animate-marquee space-x-12">
        {[...items, ...items].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3 text-gray-400 font-semibold text-sm hover:text-white transition-colors duration-200"
          >
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* À insérer dans votre CSS ou configuration Tailwind */
/*
@keyframes marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 25s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
*/
```

---

## 4. Carte Éditoriale & Luxe (Storytelling)
*Typographie Serif raffinée, palette chaude et ouverture animée.*

```jsx
export function EditorialCard({ title, category, year, imageSrc, href = "#" }) {
  return (
    <a href={href} className="group block relative overflow-hidden bg-[#1A1715] p-5 rounded-lg text-[#F7F4EE]">
      <div className="relative aspect-[4/3] overflow-hidden rounded mb-4 bg-stone-900">
        <img
          src={imageSrc}
          alt={title}
          className="w-full h-full object-cover grayscale transition-all duration-700 ease-out group-hover:grayscale-0 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      <div className="flex items-baseline justify-between border-b border-stone-700/60 pb-3">
        <span className="text-xs uppercase tracking-[0.2em] text-stone-400 font-sans">{category}</span>
        <span className="text-xs font-serif italic text-stone-500">{year}</span>
      </div>

      <div className="pt-3 flex items-center justify-between">
        <h3 className="text-xl font-serif tracking-normal group-hover:italic transition-all">
          {title}
        </h3>
        <span className="text-sm font-sans opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Explorer →
        </span>
      </div>
    </a>
  );
}
```
