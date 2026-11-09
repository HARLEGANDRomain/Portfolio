import React, { useEffect, useMemo, useState } from 'react';
import ScatterField from '../components/home/ScatterField';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { generateWavePath } from '../utils/wavePath';
import { SCATTER_PROJECTS, scatterPool } from '../data/scatterImages';
import { computeTargets, generateTile, maxClusterCoverage, zoneGeometry } from '../utils/scatterLayout';

/**
 * LABO — étape 3 : transitions (ressorts interruptibles) + parallaxe souris + respiration de l'amas.
 *
 *  - Survoler un projet à gauche : l'amas se forme ; passer d'un projet à l'autre fait voyager les images.
 *  - Le survol n'est pris en compte qu'après 120 ms (une souris qui traverse la liste ne déclenche rien).
 *  - URL : ?state=gwido|echoes-of-memories&seed=3&debug=1&parallax=0&breath=0 (pour des mesures déterministes)
 */

const STATES = [
  { key: null, label: 'Repos' },
  { key: 'gwido', label: 'Gwido' },
  { key: 'echoes-of-memories', label: 'Echoes Of Memories' },
];

const params = new URLSearchParams(window.location.search);
const PAN_ZERO = { x: 0, y: 0 };

const useViewport = () => {
  const [size, setSize] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return size;
};

const ScatterLab = () => {
  const viewport = useViewport();
  const [seed, setSeed] = useState(() => Number(params.get('seed')) || 1);
  const [hovered, setHovered] = useState(() => params.get('state') || null);
  const [selected, setSelected] = useState(hovered); // survol confirmé après 120 ms
  const [slow, setSlow] = useState(1);
  const [parallax, setParallax] = useState(() => (params.get('parallax') != null ? Number(params.get('parallax')) : 28));
  const [breathing, setBreathing] = useState(() => params.get('breath') !== '0');
  const reducedMotion = useReducedMotion();
  const [overlap, setOverlap] = useState(0.16);
  const [debug, setDebug] = useState(params.get('debug') === '1');
  const [push, setPush] = useState(0.5); // écartement des images hors amas, en part de la largeur d'écran
  const pan = PAN_ZERO;

  const zone = useMemo(() => zoneGeometry(viewport.w, viewport.h), [viewport]);
  const pool = useMemo(scatterPool, []);
  const tile = useMemo(
    () => {
      // La taille des cellules suit la largeur d'écran (≈ 290 px en 1920), bornée
      const cellW = Math.min(Math.max(viewport.w * 0.151, 240), 400);
      return generateTile({ zoneW: zone.width, zoneH: zone.height, pool, seed, cellW, cellH: cellW * 0.79, gap: cellW * 0.11 });
    },
    [zone.width, zone.height, pool, seed, viewport.w]
  );

  useEffect(() => {
    if (hovered === selected) return undefined;
    const id = setTimeout(() => setSelected(hovered), 120);
    return () => clearTimeout(id);
  }, [hovered, selected]);

  const clusterSrcs = selected ? SCATTER_PROJECTS[selected].cluster : null;
  const { targets, cluster } = useMemo(
    () => computeTargets({ tile, zone, pan, clusterSrcs, seed, overlap, push: push * viewport.w }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tile, zone, selected, seed, overlap, push, viewport.w]
  );
  const items = useMemo(() => tile.slots.map((s) => ({ id: s.id, src: s.src })), [tile]);
  const layoutKey = `${viewport.w}x${viewport.h}:${seed}`;

  const wavePath = useMemo(() => generateWavePath(0, 0, 'main', false), []);

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      {/* ── Colonne de gauche : simulation de la liste de projets + réglages ── */}
      <aside className="relative z-10 w-[45vw] min-h-screen bg-dots px-12 py-16 flex flex-col gap-12">
        <header>
          <p className="text-label uppercase tracking-widest text-slate-500 mb-2">Labo · étape 3 / 4 · parallaxe + respiration</p>
          <h1 className="text-4xl font-black uppercase tracking-tighter">Fond éparpillé</h1>
        </header>

        <ul className="space-y-6" onMouseLeave={() => {}}>
          {STATES.map((s) => (
            <li key={s.label}>
              <button
                type="button"
                onMouseEnter={() => setHovered(s.key)}
                onFocus={() => setHovered(s.key)}
                onClick={() => { setHovered(s.key); setSelected(s.key); }}
                className={`text-3xl font-black uppercase tracking-tighter transition-opacity ${
                  selected === s.key ? 'opacity-100' : 'opacity-30 hover:opacity-70'
                }`}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="space-y-4 text-sm max-w-xs">
          <label className="flex items-center justify-between gap-4">
            <span>Graine</span>
            <span className="flex items-center gap-2">
              <button type="button" className="px-2 border rounded" onClick={() => setSeed((s) => Math.max(1, s - 1))}>−</button>
              <span className="w-8 text-center tabular-nums">{seed}</span>
              <button type="button" className="px-2 border rounded" onClick={() => setSeed((s) => s + 1)}>+</button>
            </span>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Chevauchement max de l'amas</span>
            <input type="range" min="0" max="0.35" step="0.01" value={overlap} onChange={(e) => setOverlap(Number(e.target.value))} />
            <span className="w-10 tabular-nums">{Math.round(overlap * 100)} %</span>
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Parallaxe (px, max 28)</span>
            <input type="range" min="0" max="28" step="1" value={parallax} onChange={(e) => setParallax(Number(e.target.value))} />
            <span className="w-10 tabular-nums">{parallax}</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={breathing} onChange={(e) => setBreathing(e.target.checked)} />
            Respiration de l'amas
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={slow > 1} onChange={(e) => setSlow(e.target.checked ? 4 : 1)} />
            Ralenti ×4 (pour juger les transitions)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={debug} onChange={(e) => setDebug(e.target.checked)} />
            Afficher les repères (tuile, centre, exemplaires choisis)
          </label>
          <label className="flex items-center justify-between gap-4">
            <span>Écartement des images hors amas</span>
            <input type="range" min="0" max="0.5" step="0.01" value={push} onChange={(e) => setPush(Number(e.target.value))} />
            <span className="w-10 tabular-nums">{Math.round(push * 100)} %</span>
          </label>
          <p className="text-slate-500">
            {selected && cluster.size > 0 && <>Recouvrement max d'une image de l'amas : {Math.round(maxClusterCoverage(cluster) * 100)} %<br /></>}
            {tile.slots.length} emplacements · tuile {Math.round(tile.W)}×{Math.round(tile.H)} px · {pool.length} images
          </p>
        </div>
      </aside>

      {/* ── Zone de droite découpée par la vague ── */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <clipPath id="lab-wave" clipPathUnits="objectBoundingBox">
            <path d={wavePath} />
          </clipPath>
        </defs>
      </svg>
      <div
        className="fixed inset-0 bg-slate-950 overflow-hidden select-none"
        style={{ clipPath: 'url(#lab-wave)' }}
      >
        <ScatterField
          items={items}
          targets={targets}
          layoutKey={layoutKey}
          reducedMotion={reducedMotion}
          timeScale={1 / slow}
          parallax={parallax}
          breathing={breathing}
        />

        {debug && (
          <>
            <div
              className="absolute w-4 h-4 -ml-2 -mt-2 border-2 border-rose-500 rounded-full pointer-events-none"
              style={{ left: zone.center.x, top: zone.center.y }}
            />
            <div
              className="absolute border border-dashed border-amber-400/60 pointer-events-none"
              style={{
                left: zone.left - (tile.W - zone.width) / 2,
                top: -(tile.H - zone.height) / 2,
                width: tile.W,
                height: tile.H,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ScatterLab;
