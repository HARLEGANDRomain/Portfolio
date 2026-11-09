import React, { useEffect, useState } from 'react';
import ScatterField from './ScatterField';
import TopoPattern from './TopoPattern';
import { useNavigation } from '../ui/RouteLink';
import { useScatterLayout } from '../../hooks/useScatterLayout';
import { projectKey } from '../../routes';

const LAYER_FALLBACK = ['bg-slate-600/50', 'bg-slate-800/60'];
const HOVER_INTENT_MS = 120; // délai avant de réagir au survol d'un projet (une souris qui traverse la liste ne déclenche rien)

/**
 * Zone fixe de droite (en bas sur mobile) découpée par la vague.
 * 3 clipPath SVG animés par useWaveEngine : 2 couches de fond colorées + la couche principale sombre.
 *
 * Dans la couche principale :
 *  - des scènes de fond (motif topographique ; le même en intro et en section projets, quel que soit le projet actif) ;
 *  - un <ScatterField> permanent : images éparpillées et désaturées au repos (splash, intro, contact),
 *    qui se rassemblent en amas au centre quand un projet est actif (les autres images s'éloignent).
 *    Une image de l'amas renvoie vers l'étude de cas.
 *
 * Mobile : la vague au repos est hors écran, le champ n'y est visible que pendant le splash et les
 * transitions : il reste donc au repos (pas d'amas), sans parallaxe ni respiration.
 *
 * Pas de backdrop-blur sur les couches : le clip-path change 60×/s et le flou n'est pas composité par le GPU.
 */
const WaveBackground = ({ engine, splashPhase, activeSection, activeProject, projects, isMobile, reducedMotion, paused }) => {
  const { navigate } = useNavigation();
  const animating = splashPhase !== 'done';
  const clipStyle = (id) => ({ clipPath: `url(#${id})`, willChange: animating ? 'clip-path' : 'auto' });
  const project = projects[activeProject];
  const layerColors = activeSection === 'projects' && project ? project.waveColors : LAYER_FALLBACK;

  // Projet dont l'amas doit être formé (null = repos), confirmé après un court délai
  const wantedSlug = !isMobile && activeSection === 'projects' ? project?.slug ?? null : null;
  const [clusterSlug, setClusterSlug] = useState(wantedSlug);
  useEffect(() => {
    if (wantedSlug === clusterSlug) return undefined;
    if (reducedMotion) { setClusterSlug(wantedSlug); return undefined; }
    const id = setTimeout(() => setClusterSlug(wantedSlug), HOVER_INTENT_MS);
    return () => clearTimeout(id);
  }, [wantedSlug, clusterSlug, reducedMotion]);

  const scatter = useScatterLayout(clusterSlug);

  return (
    <div
      className="fixed top-0 right-0 h-screen w-full pointer-events-none z-wave"
      aria-hidden="true"
      style={{
        // drop-shadow seulement une fois le splash terminé : sinon chaque frame de la transition est très coûteuse
        filter: animating ? 'none' : 'var(--shadow-wave-drop)',
        transition: animating ? 'none' : 'filter 600ms ease-out',
        willChange: animating ? 'clip-path' : 'auto',
      }}
    >
      <svg className="absolute w-0 h-0">
        <defs>
          {[
            ['wave-right', 'main'],
            ['wave-right-bg1', 'bg1'],
            ['wave-right-bg2', 'bg2'],
          ].map(([id, layer]) => (
            <clipPath key={id} id={id} clipPathUnits="objectBoundingBox">
              <path ref={engine.pathRefs[layer]} d={engine.initialPath(layer)} />
            </clipPath>
          ))}
        </defs>
      </svg>

      {/* Couches de fond (couleur du projet actif) */}
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out z-0 ${layerColors[1]}`} style={clipStyle('wave-right-bg2')} />
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out z-10 ${layerColors[0]}`} style={clipStyle('wave-right-bg1')} />

      {/* Couche principale */}
      {/* pointer-events-auto : la zone sombre bloque les clics vers le contenu masqué dessous */}
      <div className="w-full h-full overflow-hidden relative bg-slate-950 z-20 pointer-events-auto" style={clipStyle('wave-right')}>

        {/* Scènes de fond : le fond ne change PAS quand un projet est actif (même motif qu'au repos) */}
        <Scene visible={activeSection !== 'contact'}>
          <TopoPattern id="topo-intro" variant="lines" />
        </Scene>

        <Scene visible={activeSection === 'contact'}>
          <TopoPattern id="topo-contact" variant="circles" />
        </Scene>

        {/* Images éparpillées / amas du projet actif */}
        <ScatterField
          className="z-30"
          items={scatter.items}
          targets={scatter.targets}
          layoutKey={scatter.layoutKey}
          reducedMotion={reducedMotion}
          parallax={isMobile ? 0 : 28}
          breathing={!isMobile}
          paused={paused}
          onItemClick={() => { if (clusterSlug) navigate(projectKey(clusterSlug)); }}
        />

        {/* Adoucit le bord gauche (côté vague) */}
        <div className="absolute inset-0 z-[35] pointer-events-none bg-gradient-to-r from-slate-950 via-transparent to-transparent" />

        {/* Assombrit les images pendant le splash */}
        <div
          className="absolute inset-0 z-40 pointer-events-none bg-slate-950/80"
          style={{
            opacity: splashPhase === 'active' ? 1 : 0,
            transition: splashPhase === 'active' ? 'none' : 'opacity 1000ms cubic-bezier(0.16, 1, 0.32, 1)',
          }}
        />
      </div>
    </div>
  );
};

const Scene = ({ visible, raised = false, children }) => (
  <div
    className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out ${
      visible ? `opacity-100 ${raised ? 'z-20' : 'z-10'}` : 'opacity-0 z-0'
    }`}
  >
    <div className="absolute inset-0 bg-slate-950" />
    {children}
  </div>
);

export default WaveBackground;
