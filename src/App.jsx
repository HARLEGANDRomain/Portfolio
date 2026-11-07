import React, { useEffect } from 'react';
import Home from './components/home/Home';
import { prefersReducedMotion } from './hooks/useReducedMotion';

/**
 * Expose la position de la souris en variables CSS (une fois par frame max) :
 *  --mouse-client-x/y : halo de points qui suit le curseur
 *  --mouse-nx/ny      : position normalisée [-10, 10] pour la parallaxe
 * Aucun state React : le déplacement de la souris ne provoque aucun re-render.
 */
const useMouseCssVars = () => {
  useEffect(() => {
    const root = document.documentElement.style;
    let frame = 0;
    let last = null;

    const flush = () => {
      frame = 0;
      const { clientX, clientY } = last;
      root.setProperty('--mouse-client-x', `${clientX}px`);
      root.setProperty('--mouse-client-y', `${clientY}px`);
      if (!prefersReducedMotion()) {
        root.setProperty('--mouse-nx', ((clientX / window.innerWidth - 0.5) * 20).toFixed(2));
        root.setProperty('--mouse-ny', ((clientY / window.innerHeight - 0.5) * 20).toFixed(2));
      }
    };

    const onMove = (e) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(flush);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
};

function App() {
  useMouseCssVars();
  return <Home />;
}

export default App;
