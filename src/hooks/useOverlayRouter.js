import { useCallback, useEffect, useRef, useState } from 'react';
import { keyFromPath, pathFromKey, isKnownPath } from '../routes';
import { WAVE } from './useWaveEngine';

const BASE = import.meta.env.BASE_URL;

// Durées de la transition par la vague (ms)
const T = {
  COVER: 550,     // ouverture : temps pour que la vague recouvre l'écran
  REVEAL: 1050,   // ouverture : la vague est sortie à droite
  UNCOVER: 600,   // fermeture : la vague recouvre la page overlay
  SETTLE: 1300,   // fermeture : la vague est revenue à sa place
};

export const readInitialKey = () => {
  if (typeof window === 'undefined') return null;
  if (!isKnownPath(window.location.pathname, BASE)) {
    // URL inconnue (servie par 404.html) → on revient proprement à l'accueil
    window.history.replaceState(null, '', BASE);
    return null;
  }
  return keyFromPath(window.location.pathname, BASE);
};

/**
 * Synchronise l'URL et la page overlay affichée (étude de cas, Identité, Mentions légales),
 * avec la transition par la vague. Remplace les 6 handlers open/back dupliqués.
 *
 *  - navigate(key)  : pousse l'URL (History API → suivi par Cloudflare Web Analytics) puis anime
 *  - goHome()       : retour à l'accueil (history.back() si on vient de l'accueil, pour garder l'historique propre)
 *  - bouton Retour / Suivant du navigateur : géré via popstate
 *
 * Les changements d'URL rapides sont mis en file : une transition se termine avant la suivante.
 */
export const useOverlayRouter = ({ initialKey, engine, enabled }) => {
  const [routeKey, setRouteKey] = useState(initialKey);   // ce que demande l'URL
  const [displayed, setDisplayed] = useState(initialKey); // ce qui est monté à l'écran
  const [busy, setBusy] = useState(false);
  const phase = useRef(initialKey ? 'active' : 'none');   // 'none' | 'entering' | 'active' | 'exiting'
  const timers = useRef([]);

  const later = (fn, ms) => { timers.current.push(setTimeout(fn, ms)); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // Bouton Retour / Suivant du navigateur
  useEffect(() => {
    const onPop = () => setRouteKey(keyFromPath(window.location.pathname, BASE));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((key) => {
    if (key === keyFromPath(window.location.pathname, BASE)) return;
    window.history.pushState({ portfolio: true, from: keyFromPath(window.location.pathname, BASE) }, '', pathFromKey(key, BASE));
    setRouteKey(key);
  }, []);

  const goHome = useCallback(() => {
    const state = window.history.state;
    if (state?.portfolio && state.from === null) window.history.back();
    else navigate(null);
  }, [navigate]);

  // Lance la transition quand l'URL demandée diffère de la page affichée
  useEffect(() => {
    if (!enabled || busy || routeKey === displayed) return;
    setBusy(true);
    engine.setFast(true);

    if (displayed === null) {
      // Accueil → page : la vague recouvre, on monte la page, la vague sort à droite
      phase.current = 'entering';
      engine.moveTo(WAVE.COVER);
      later(() => { setDisplayed(routeKey); engine.moveTo(WAVE.EXIT); }, T.COVER);
      later(() => { engine.snap(WAVE.EXIT); phase.current = 'active'; engine.setFast(false); setBusy(false); }, T.REVEAL);
    } else {
      // Page → accueil (ou page → autre page) : la vague revient de la droite et recouvre
      phase.current = 'exiting';
      engine.snap(WAVE.EXIT);
      requestAnimationFrame(() => engine.moveTo(WAVE.COVER));
      later(() => {
        setDisplayed(routeKey);
        engine.moveTo(routeKey === null ? WAVE.REST : WAVE.EXIT);
      }, T.UNCOVER);
      later(() => {
        if (routeKey !== null) engine.snap(WAVE.EXIT);
        phase.current = routeKey === null ? 'none' : 'active';
        engine.setFast(false);
        setBusy(false);
      }, T.SETTLE);
    }
    // engine est stable ; later utilise un ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, busy, routeKey, displayed]);

  return { routeKey, displayed, busy, navigate, goHome, phase };
};

export default useOverlayRouter;
