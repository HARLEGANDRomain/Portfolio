import React from 'react';

/**
 * Motif de courbes de niveau (lignes déformées par un bruit fractal).
 * @param {'lines'|'circles'} variant lignes parallèles (intro) ou cercles concentriques (contact)
 * @param {string} id identifiant unique du filtre SVG
 */
const TopoPattern = ({ variant = 'lines', id }) => (
  <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden" aria-hidden="true">
    <div className="absolute inset-[-20%] animate-topo flex items-center justify-center">
      <svg className="w-full h-full text-indigo-400/40" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id={id} x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" result="noise" seed={variant === 'circles' ? 5 : 0} />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" xChannelSelector="R" yChannelSelector="G" />
            <feGaussianBlur stdDeviation="0.5" />
          </filter>
        </defs>
        <g filter={`url(#${id})`} fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
          {variant === 'circles'
            ? [...Array(120)].map((_, i) => <circle key={i} cx="1000" cy="0" r={i * 18 + 20} />)
            : [...Array(120)].map((_, i) => <line key={i} x1="-200" y1={i * 15 - 400} x2="1200" y2={i * 15 - 400} />)}
        </g>
      </svg>
    </div>
  </div>
);

export default TopoPattern;
