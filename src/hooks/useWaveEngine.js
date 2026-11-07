import { useCallback, useEffect, useRef } from 'react';
import { generateWavePath } from '../utils/wavePath';

/** Positions de la vague (en vw) */
export const WAVE = {
  SPLASH: -50, // couvre ~93 % de l'écran pendant le splash
  REST: 0,     // position normale : la vague occupe la droite
  COVER: -60,  // recouvre tout l'écran pendant une transition de page
  EXIT: 70,    // sortie complète à droite (page overlay visible)
};

const LAYERS = ['main', 'bg1', 'bg2'];
// Vitesse de lerp par couche : normale / pendant une transition de page
const SPEED = {
  main: [0.045, 0.09],
  bg1:  [0.030, 0.07],
  bg2:  [0.018, 0.05],
};

/**
 * Moteur d'animation des 3 couches de vague.
 * Les chemins SVG sont écrits directement dans le DOM (pas de re-render React à 60 fps).
 *
 * @param {object}  opts
 * @param {number}  opts.initialOffset position de départ
 * @param {boolean} opts.running       la boucle tourne (false pendant le splash figé)
 * @param {boolean} opts.isMobile
 * @param {boolean} opts.reducedMotion sans animation : les positions sont appliquées instantanément
 */
export const useWaveEngine = ({ initialOffset, running, isMobile, reducedMotion }) => {
  const pathRefs = { main: useRef(null), bg1: useRef(null), bg2: useRef(null) };
  const offsets = useRef({ main: initialOffset, bg1: initialOffset, bg2: initialOffset });
  const target = useRef(initialOffset);
  const fast = useRef(false); // transition de page en cours → lerp plus rapide
  const staticMode = !running || reducedMotion;
  const staticModeRef = useRef(staticMode);
  staticModeRef.current = staticMode;

  const draw = useCallback((time) => {
    for (const layer of LAYERS) {
      const el = pathRefs[layer].current;
      if (el) el.setAttribute('d', generateWavePath(offsets.current[layer], time, layer, isMobile));
    }
    // pathRefs est stable (useRef) — seul isMobile change le tracé
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  /** Place immédiatement toutes les couches à `value`. */
  const snap = useCallback((value) => {
    offsets.current = { main: value, bg1: value, bg2: value };
    target.current = value;
    if (staticModeRef.current) draw(0);
  }, [draw]);

  /** Fait glisser les couches vers `value` (instantané si animations réduites). */
  const moveTo = useCallback((value) => {
    target.current = value;
    if (staticModeRef.current) snap(value);
  }, [snap]);

  const setFast = useCallback((value) => { fast.current = value; }, []);

  useEffect(() => {
    if (staticMode) {
      // Position figée : on aligne les couches sur la cible et on dessine une fois
      if (reducedMotion) {
        const v = target.current;
        offsets.current = { main: v, bg1: v, bg2: v };
      }
      draw(0);
      return undefined;
    }

    let frame;
    const tick = (time) => {
      if (!document.hidden) {
        const speedIndex = fast.current ? 1 : 0;
        for (const layer of LAYERS) {
          offsets.current[layer] += (target.current - offsets.current[layer]) * SPEED[layer][speedIndex];
        }
        draw(time);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [staticMode, reducedMotion, draw]);

  return { pathRefs, snap, moveTo, setFast, initialPath: (layer) => generateWavePath(initialOffset, 0, layer, isMobile) };
};

export default useWaveEngine;
