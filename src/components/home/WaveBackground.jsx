import React from 'react';
import MediaLoader from '../ui/MediaLoader';
import ImageMarquee from './ImageMarquee';
import TopoPattern from './TopoPattern';
import { assetUrl } from '../../utils/assetUrl';

const LAYER_FALLBACK = ['bg-slate-600/50', 'bg-slate-800/60'];

/**
 * Zone fixe de droite (en bas sur mobile) découpée par la vague.
 * 3 clipPath SVG animés par useWaveEngine : 2 couches de fond colorées + la couche principale sombre
 * qui affiche un visuel différent selon la section (intro, projet survolé, contact).
 *
 * Pas de backdrop-blur sur les couches : le clip-path change 60×/s et le flou n'est pas composité par le GPU.
 */
const WaveBackground = ({ engine, splashPhase, activeSection, activeProject, projects }) => {
  const animating = splashPhase !== 'done';
  const clipStyle = (id) => ({ clipPath: `url(#${id})`, willChange: animating ? 'clip-path' : 'auto' });
  const project = projects[activeProject];
  const layerColors = activeSection === 'projects' && project ? project.waveColors : LAYER_FALLBACK;

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

      {/* Couches de fond (couleur du projet survolé) */}
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out z-0 ${layerColors[1]}`} style={clipStyle('wave-right-bg2')} />
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out z-10 ${layerColors[0]}`} style={clipStyle('wave-right-bg1')} />

      {/* Couche principale */}
      {/* pointer-events-auto : la zone sombre bloque les clics vers le contenu masqué dessous */}
      <div className="w-full h-full overflow-hidden relative bg-slate-950 z-20 pointer-events-auto" style={clipStyle('wave-right')}>

        {/* Intro */}
        <Scene visible={activeSection === 'intro'}>
          <TopoPattern id="topo-intro" variant="lines" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent pointer-events-none z-10" />
          <ImageMarquee eager />
          {/* Assombrit les images pendant le splash */}
          <div
            className="absolute inset-0 z-[15] pointer-events-none bg-slate-950/80"
            style={{
              opacity: splashPhase === 'active' ? 1 : 0,
              transition: splashPhase === 'active' ? 'none' : 'opacity 1000ms cubic-bezier(0.16, 1, 0.32, 1)',
            }}
          />
        </Scene>

        {/* Projets */}
        {projects.map((p, index) => (
          <Scene key={p.slug} visible={activeSection === 'projects' && activeProject === index} raised>
            <div className={`absolute inset-0 ${p.sceneColor}`} />
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <div className="parallax-dots absolute inset-0 bg-dots opacity-20 mix-blend-overlay" />
              <div className="parallax-scene relative w-full h-full z-10">
                <MediaLoader
                  src={assetUrl(p.image)}
                  alt=""
                  className="w-full h-full mix-blend-lighten object-cover"
                  style={{ maskImage: 'linear-gradient(to left, black 60%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to left, black 60%, transparent 100%)' }}
                />
              </div>
            </div>
          </Scene>
        ))}

        {/* Contact */}
        <Scene visible={activeSection === 'contact'}>
          <TopoPattern id="topo-contact" variant="circles" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent pointer-events-none z-10" />
          <ImageMarquee />
        </Scene>
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
