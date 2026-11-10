import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import RouteLink, { useNavigation } from '../ui/RouteLink';
import { assetUrl } from '../../utils/assetUrl';
import { projectKey } from '../../routes';

const prefetchCaseStudy = () => import('../CaseStudy');

/**
 * Liste des projets.
 *  - Toujours visibles : type, titre, contexte (équipe, période), rôles → lisibles d'un coup d'œil, sans survol.
 *  - Desktop : le survol (ou le focus clavier) active un projet → la vague prend ses couleurs,
 *    la mission / le problème / la solution se déplient. Un clic n'importe où sur la ligne ouvre l'étude de cas.
 *  - Les projets non actifs restent lisibles (pas d'opacité réduite) : seul le projet actif est mis en avant.
 *  - Mobile : le projet au centre de l'écran est actif ; un tap ouvre directement l'étude de cas.
 */
const ProjectsSection = ({ projects, activeProject, onActivate, isMobile }) => {
  const { t } = useTranslation();
  const { navigate } = useNavigation();
  const rowRefs = useRef([]);
  const [visible, setVisible] = useState(() => new Set());
  const [bustShown, setBustShown] = useState(false);

  // Apparition au défilement
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const i = Number(entry.target.dataset.index);
          setVisible((prev) => (prev.has(i) ? prev : new Set(prev).add(i)));
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    rowRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [projects.length]);

  // Mobile : le projet le plus proche du centre de l'écran devient actif
  useEffect(() => {
    if (!isMobile) return undefined;
    const onScroll = () => {
      const center = window.innerHeight / 2;
      let best = null;
      let bestDist = Infinity;
      rowRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.abs(r.top + r.height / 2 - center);
        if (dist < bestDist) { bestDist = dist; best = i; }
      });
      if (best !== null) onActivate(best);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobile, onActivate]);

  return (
    <section id="projects" className="relative min-h-screen flex flex-col justify-center px-8 md:px-16 py-24 border-t border-slate-100">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <span className="vertical-text uppercase tracking-[0.2em] text-[10px] font-bold text-slate-500 whitespace-nowrap">
          {t('projects.sidebar')}
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center relative z-10 max-w-xl">
        <h2 className="sr-only">{t('nav.works')}</h2>
        <ul className="space-y-12 pl-4 lg:pl-16">
          {projects.map((project, index) => {
            const inView = visible.has(index);
            const active = activeProject === index;
            const key = projectKey(project.slug);
            const open = () => { setBustShown(false); navigate(key); };

            return (
              <li
                key={project.slug}
                data-index={index}
                ref={(el) => { rowRefs.current[index] = el; }}
                onMouseEnter={() => {
                  if (isMobile) return;
                  onActivate(index);
                  prefetchCaseStudy();
                  if (index === 0) setBustShown(true);
                }}
                onMouseLeave={() => { if (index === 0) setBustShown(false); }}
                onFocus={() => { onActivate(index); prefetchCaseStudy(); }}
                onClick={(e) => { if (!e.target.closest('a')) open(); }}
                className={`group relative cursor-pointer transform transition-all duration-700 ease-out ${
                  inView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                }`}
              >
                {/* Buste de Gwido (easter egg, desktop) */}
                {index === 0 && !isMobile && (
                  <div
                    aria-hidden="true"
                    className="absolute z-[60] pointer-events-none overflow-hidden pr-6 py-6 top-[3.25rem] left-[-80px] lg:left-[-128px]"
                    style={{
                      transform: bustShown ? 'translateY(-80%) translateX(-32%)' : 'translateY(-50%) translateX(-50%)',
                      opacity: bustShown ? 1 : 0,
                      transition: 'opacity 0.45s ease, transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      filter: 'var(--shadow-gwido-bust)',
                    }}
                  >
                    <img
                      src={assetUrl('/gwido/images/Gwido_Buste.webp')}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block h-[140px] w-auto rotate-[40deg]"
                    />
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className={`absolute -left-8 top-1 w-1 bg-slate-900 transition-all duration-700 ease-out origin-top ${active ? 'h-full opacity-100' : 'h-0 opacity-0'}`}
                />

                <p className={`text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-3 transition-colors duration-500 ${active ? 'text-indigo-600' : 'text-slate-500'}`}>
                  0{index + 1} <span aria-hidden="true">—</span> {project.type}
                </p>
                <h3 className={`text-4xl md:text-5xl font-black uppercase tracking-tighter mb-3 transition-all duration-500 group-hover:translate-x-3 ${active ? 'text-slate-900' : 'text-slate-500'}`}>
                  <RouteLink to={key} onClick={() => setBustShown(false)}>{project.title}</RouteLink>
                </h3>

                <p className="text-xs font-medium text-slate-500 mb-3">
                  {[project.studentProject && t('projects.studentProject'), project.teamSize, project.timeline].filter(Boolean).join(' · ')}
                </p>
                <ul aria-label={t('projects.rolesLabel')} className="flex flex-wrap gap-2 mb-1">
                  {project.rolesList.map((role) => (
                    <li
                      key={role}
                      className={`text-[11px] font-semibold rounded-full px-3 py-1 border transition-colors duration-500 ${
                        active ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600'
                      }`}
                    >
                      {role}
                    </li>
                  ))}
                </ul>

                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${active ? 'max-h-[30rem] opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}`}>
                  <dl className="mt-5 mb-5 space-y-3 border-l-2 border-slate-200 pl-4">
                    {['mission', 'problem', 'solution'].map((field) => (
                      <div key={field}>
                        <dt className="text-label uppercase tracking-widest text-indigo-600 mb-0.5">{t(`projects.${field}`)}</dt>
                        <dd className="text-sm text-slate-600 leading-relaxed">{project[field]}</dd>
                      </div>
                    ))}
                  </dl>
                  <RouteLink
                    to={key}
                    tabIndex={-1}
                    onClick={() => setBustShown(false)}
                    className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-indigo-600 transition-colors"
                  >
                    {t('projects.exploreCaseStudy')} <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                  </RouteLink>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default ProjectsSection;
