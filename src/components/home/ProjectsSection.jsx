import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import RouteLink, { useNavigation } from '../ui/RouteLink';
import { assetUrl } from '../../utils/assetUrl';
import { projectKey } from '../../routes';

const prefetchCaseStudy = () => import('../CaseStudy');

/**
 * Liste des projets.
 *  - Desktop : le survol (ou le focus clavier) active un projet → la vague prend ses couleurs,
 *    la description se déplie. Un clic n'importe où sur la ligne ouvre l'étude de cas.
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
                  inView ? 'translate-y-0' : 'translate-y-12 opacity-0'
                } ${inView ? (active ? 'opacity-100 scale-100' : 'opacity-30 scale-95 hover:opacity-70') : ''}`}
              >
                {/* Buste de Gwido (easter egg, desktop) */}
                {index === 0 && !isMobile && (
                  <div
                    aria-hidden="true"
                    className="absolute z-[60] pointer-events-none overflow-hidden pr-6 py-6 top-1/2 left-[-80px] lg:left-[-128px]"
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

                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-3">
                  0{index + 1} <span aria-hidden="true">—</span> {project.category.split('|')[0].trim()}
                </p>
                <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-slate-900 transition-transform duration-500 group-hover:translate-x-3">
                  <RouteLink to={key} onClick={() => setBustShown(false)}>{project.title}</RouteLink>
                </h3>

                <div className={`overflow-hidden transition-all duration-700 ease-in-out ${active ? 'max-h-40 opacity-100 translate-y-0' : 'max-h-0 opacity-0 translate-y-4'}`}>
                  <p className="text-slate-600 mb-5 text-sm leading-relaxed border-l-2 border-slate-200 pl-4">{project.description}</p>
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
