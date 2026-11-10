import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download } from 'lucide-react';
import OverlayPage from './ui/OverlayPage';
import { assetUrl } from '../utils/assetUrl';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Outils — logos servis localement (public/icons/tools/) : plus de dépendance à un CDN externe.
 * Les classes de survol utilisent les couleurs `tool-*` du thème Tailwind.
 */
const TOOLS = [
  { id: 'figma',       hover: 'hover:border-tool-figma/50',       accent: 'group-hover:border-tool-figma/50' },
  { id: 'illustrator', hover: 'hover:border-tool-illustrator/50', accent: 'group-hover:border-tool-illustrator/50', boost: true },
  { id: 'photoshop',   hover: 'hover:border-tool-photoshop/50',   accent: 'group-hover:border-tool-photoshop/50', boost: true },
  { id: 'unity',       hover: 'hover:border-slate-300/50',        accent: 'group-hover:border-slate-300/50' },
  { id: 'blender',     hover: 'hover:border-tool-blender/50',     accent: 'group-hover:border-tool-blender/50' },
  { id: 'git',         hover: 'hover:border-tool-git/50',         accent: 'group-hover:border-tool-git/50' },
];

/** CV (public/cv/) : à remplacer en gardant le même nom de fichier. */
const CV_URL = assetUrl('/cv/HARLEGAND_Romain_CV.pdf');

/** Formations, de la plus récente à la plus ancienne. */
const EDUCATION = [
  { key: 'mastere', inProgress: true },
  { key: 'bachelor', inProgress: false },
];

const wavePath = (time) => {
  const segments = 60;
  let d = '';
  for (let i = 0; i <= segments; i++) {
    const x = i / segments;
    const y = 0.1 - x * 0.05 + 0.02 * Math.sin(x * Math.PI * 4 - time * 0.001);
    d += `${i === 0 ? 'M' : 'L'} ${x},${y} `;
  }
  return `${d}L 1,1 L 0,1 Z`;
};

const Identity = ({ onBack }) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const wavePathRef = useRef(null);

  // Vague du bloc « Outils » (figée si animations réduites)
  useEffect(() => {
    if (reducedMotion) {
      wavePathRef.current?.setAttribute('d', wavePath(0));
      return undefined;
    }
    let frame;
    const render = (time) => {
      wavePathRef.current?.setAttribute('d', wavePath(time));
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frame);
  }, [reducedMotion]);

  return (
    <OverlayPage onBack={onBack}>
      {/* Présentation + formation */}
      {/* Le bloc « Outils » remonte de 15vh (mobile) / 25vh (desktop) + 24 px sur cette section : l'espace du bas suit donc la hauteur
          d'écran (vh) et pas une valeur fixe, sinon la vague recouvre les boutons CV sur les grands écrans */}
      <div className="w-full flex-shrink-0 relative z-10 pt-32 pb-[calc(15vh+7rem)] md:pb-[calc(25vh+8rem)] px-8 md:px-16 flex flex-col justify-center items-center min-h-[75vh]">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">

          <div className="col-span-1 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">{t('nav.identity')}</p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-8">
              {t('identityPage.whoAmI')}
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-3xl font-medium whitespace-pre-line">
              {t('identityPage.whoAmIDesc')}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={CV_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t('identityPage.cvOpenLabel')}
                className="inline-flex items-center gap-3 bg-indigo-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors"
              >
                <FileText className="w-4 h-4" aria-hidden="true" /> {t('identityPage.cvOpen')}
              </a>
              <a
                href={CV_URL}
                download="HARLEGAND_Romain_CV.pdf"
                aria-label={t('identityPage.cvDownloadLabel')}
                className="inline-flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-6 py-4 text-xs font-bold uppercase tracking-widest hover:text-slate-900 hover:border-slate-400 transition-colors"
              >
                <Download className="w-4 h-4" aria-hidden="true" /> {t('identityPage.cvDownload')}
              </a>
            </div>
          </div>

          <div className="col-span-1 md:border-l-2 md:border-slate-200 md:pl-8 flex flex-col justify-start">
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-6">
              {t('identityPage.education')}
            </h2>
            <ul className="space-y-6">
              {EDUCATION.map(({ key, inProgress }) => (
                <li key={key} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-1">
                  <p className={`text-label uppercase tracking-widest mb-2 ${inProgress ? 'text-emerald-700' : 'text-indigo-600'}`}>
                    {t(inProgress ? 'identityPage.inProgress' : 'identityPage.obtained')}
                  </p>
                  <p className="text-xl font-black text-slate-900 mb-2 leading-tight">{t(`identityPage.${key}.name`)}</p>
                  <p className="text-sm font-bold text-slate-700 mb-3">{t(`identityPage.${key}.school`)}</p>
                  <p className="text-xs text-slate-500 font-medium bg-slate-100 inline-block px-3 py-1.5 rounded-md border border-slate-200">
                    {t(`identityPage.${key}.sub`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Outils — bloc sombre sous une vague, remonté sur la section du dessus */}
      <div className="w-full flex-grow relative z-20 bg-transparent pointer-events-none mt-[calc(-15vh-24px)] md:mt-[calc(-25vh-24px)] min-h-[60vh] flex flex-col" style={{ filter: 'drop-shadow(0px -10px 40px rgba(0,0,0,0.3))' }}>
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <clipPath id="wave-top" clipPathUnits="objectBoundingBox">
              <path ref={wavePathRef} d={wavePath(0)} />
            </clipPath>
          </defs>
        </svg>

        <div className="w-full flex-grow relative bg-slate-950 pt-32 pb-32 px-8 md:px-16 pointer-events-auto" style={{ clipPath: 'url(#wave-top)' }}>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-indigo-950/20 pointer-events-none z-0" />

          <div className="relative z-10 max-w-6xl mx-auto">
            <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-12 text-center">
              {t('identityPage.techStack')}
            </h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {TOOLS.map((tool) => (
                <li key={tool.id} className={`bg-white/5 hover:bg-white/10 border border-white/10 ${tool.hover} p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col`}>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img
                        src={assetUrl(`/icons/tools/${tool.id}.svg`)}
                        alt=""
                        className={`w-full h-full object-contain ${tool.boost ? 'brightness-[1.5] contrast-125' : ''}`}
                      />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t(`identityPage.${tool.id}`)}</h3>
                  </div>
                  <p className={`text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 ${tool.accent} transition-colors`}>
                    {t(`identityPage.${tool.id}Desc`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </OverlayPage>
  );
};

export default Identity;
