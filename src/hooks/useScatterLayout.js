import { useMemo } from 'react';
import { SCATTER_PROJECTS, scatterPool } from '../data/scatterImages';
import { computeTargets, fullFieldZone, generateTile, zoneGeometry } from '../utils/scatterLayout';
import { useViewportSize } from './useViewportSize';

/**
 * Réglages validés dans le labo (src/lab/ScatterLab.jsx, http://localhost:5173/Portfolio/lab.html).
 *  SEED    : graine de la disposition (change l'éparpillement ; essayer 1, 2, 3… dans le labo)
 *  OVERLAP : chevauchement maximal dans l'amas
 *  PUSH    : écartement minimal des images hors amas, en part de la largeur d'écran (0,1 = elles s'écartent
 *            un peu ; 0,5 = elles quittent l'écran)
 */
const SEED = 1;
const OVERLAP = 0.16;
const PUSH = 0.01;
const PAN = { x: 0, y: 0 }; // le plan n'est pas navigable : seule la parallaxe le fait bouger

/**
 * Prépare le champ d'images éparpillées pour <ScatterField>.
 * @param {string|null} clusterSlug slug du projet dont l'amas doit se former, null = repos
 * @param {'in'|'out'|null} zoom transition vers l'étude de cas du projet (zoom sur l'image principale)
 * @returns {{ items, targets, layoutKey }}
 */
export const useScatterLayout = (clusterSlug, zoom = null) => {
  const { w, h } = useViewportSize();
  const pool = useMemo(scatterPool, []);

  // Le plan est tuilé sur TOUT l'écran (la vague le recouvre presque entièrement pendant le splash),
  // mais l'amas se forme au centre de la zone sombre de repos.
  const { tile, zone, fieldZone } = useMemo(() => {
    const zone = zoneGeometry(w, h);
    const fieldZone = fullFieldZone(w, h);
    const cellW = Math.min(Math.max(w * 0.151, 240), 400); // ≈ 290 px en 1920
    const tile = generateTile({
      zoneW: fieldZone.width, zoneH: fieldZone.height, pool, seed: SEED,
      cellW, cellH: cellW * 0.66, gap: cellW * 0.09,
    });
    return { tile, zone, fieldZone };
  }, [w, h, pool]);

  const items = useMemo(() => tile.slots.map((s) => ({ id: s.id, src: s.src })), [tile]);

  const { targets } = useMemo(
    () => computeTargets({
      tile, zone, fieldZone, pan: PAN, seed: SEED, overlap: OVERLAP, push: PUSH * w,
      clusterSrcs: clusterSlug ? SCATTER_PROJECTS[clusterSlug]?.cluster ?? null : null,
      slug: clusterSlug, zoom: clusterSlug ? zoom : null,
    }),
    [tile, zone, fieldZone, clusterSlug, zoom, w]
  );

  return { items, targets, layoutKey: `${w}x${h}:${SEED}` };
};

export default useScatterLayout;
