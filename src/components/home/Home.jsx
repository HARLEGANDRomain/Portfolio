import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../../styles/home.css';

import Splash from './Splash';
import { FloatingNav, SiteHeader } from './SiteNav';
import WaveBackground from './WaveBackground';
import IntroSection from './IntroSection';
import ProjectsSection from './ProjectsSection';
import ContactSection from './ContactSection';
import { NavigationContext } from '../ui/RouteLink';

import { getProjects } from '../../data/projects';
import { slugFromKey } from '../../routes';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useWaveEngine, WAVE } from '../../hooks/useWaveEngine';
import { useOverlayRouter, readInitialKey } from '../../hooks/useOverlayRouter';

const CaseStudy = lazy(() => import('../CaseStudy'));
const Identity = lazy(() => import('../Identity'));
const MentionsLegales = lazy(() => import('../MentionsLegales'));

const SPLASH_SEEN = 'portfolio:splashSeen';
const SECTIONS = ['intro', 'projects', 'contact'];

const splashAlreadySeen = () => {
  try { return sessionStorage.getItem(SPLASH_SEEN) === '1'; } catch { return false; }
};

/**
 * Page d'accueil : orchestre le splash, la vague, les sections et les pages overlay.
 * La logique est répartie dans :
 *  - useWaveEngine     → animation des 3 couches de vague
 *  - useOverlayRouter  → URL ↔ page overlay + transitions
 *  - components/home/* → rendu de chaque zone
 */
const Home = () => {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const reducedMotion = useReducedMotion();
  const projects = useMemo(() => getProjects(t), [t]);

  // ── État initial selon l'URL ──
  const [initialKey] = useState(readInitialKey);
  const [splashPhase, setSplashPhase] = useState(() =>
    initialKey !== null || splashAlreadySeen() ? 'done' : 'active'
  ); // 'active' | 'transitioning' | 'done'
  const [initialOffset] = useState(() => {
    if (initialKey !== null) return WAVE.EXIT;
    return splashPhase === 'done' ? WAVE.REST : WAVE.SPLASH;
  });

  const engine = useWaveEngine({ initialOffset, running: splashPhase !== 'active', isMobile, reducedMotion });
  const router = useOverlayRouter({ initialKey, engine, enabled: splashPhase === 'done' });

  // ── Splash ──
  const handleExplore = useCallback(() => {
    setSplashPhase((phase) => (phase === 'active' ? 'transitioning' : phase));
  }, []);

  useEffect(() => {
    if (splashPhase !== 'transitioning') return undefined;
    try { sessionStorage.setItem(SPLASH_SEEN, '1'); } catch { /* navigation privée */ }
    engine.moveTo(WAVE.REST);
    const id = setTimeout(() => setSplashPhase('done'), reducedMotion ? 0 : 1400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [splashPhase]);

  // ── Section active + pilule de navigation ──
  const [activeSection, setActiveSection] = useState('intro');
  const [activeProject, setActiveProject] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 80);
      const middle = window.innerHeight / 2;
      for (const id of SECTIONS) {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        if (rect && rect.top <= middle && rect.bottom >= middle) setActiveSection(id);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Titre de l'onglet selon la page ──
  useEffect(() => {
    const slug = slugFromKey(router.routeKey);
    const project = projects.find((p) => p.slug === slug);
    const page = project
      ? `${project.title} — ${t('meta.caseStudy')}`
      : router.routeKey === 'identity' ? t('nav.identity')
      : router.routeKey === 'legal' ? t('footer.legal')
      : null;
    document.title = page ? `${page} | HARLEGAND Romain` : t('meta.homeTitle');
  }, [router.routeKey, projects, t, i18n.language]);

  // ── Accessibilité : l'accueil est inerte sous une page overlay, focus déplacé puis restauré ──
  const homeRef = useRef(null);
  const overlayRef = useRef(null);
  const returnFocus = useRef(null);
  const { displayed } = router;

  useEffect(() => {
    if (homeRef.current) homeRef.current.inert = displayed !== null;
    if (displayed !== null) {
      overlayRef.current?.focus({ preventScroll: true });
    } else if (returnFocus.current) {
      returnFocus.current.focus({ preventScroll: true });
      returnFocus.current = null;
    }
  }, [displayed]);

  const navigation = useMemo(() => ({
    navigate: (key) => {
      if (splashPhase !== 'done' || router.busy) return;
      if (router.displayed === null) returnFocus.current = document.activeElement;
      router.navigate(key);
    },
    goHome: router.goHome,
  }), [splashPhase, router]);

  const displayedProject = projects.find((p) => p.slug === slugFromKey(displayed));

  return (
    <NavigationContext.Provider value={navigation}>
      <div className="min-h-screen text-slate-900 font-sans relative flex bg-white">
        <div ref={homeRef} className="contents">
          <FloatingNav activeSection={activeSection} visible={isScrolled && displayed === null} />

          <WaveBackground
            engine={engine}
            splashPhase={splashPhase}
            activeSection={activeSection}
            activeProject={activeProject}
            projects={projects}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
            paused={displayed !== null}
          />

          <main className="relative z-10 w-full md:w-[70%] bg-white/95 backdrop-blur-2xl pb-[45vh] md:pb-32 isolate">
            {/* Fond à points (fixe dans la colonne de gauche) */}
            <div className="absolute inset-0 pointer-events-none z-[-1]" aria-hidden="true">
              <div className="sticky top-0 w-full h-screen bg-dots">
                <div className="bg-dots-tracker" />
              </div>
            </div>

            <SiteHeader activeSection={activeSection} />

            {/* Sur mobile le header est empilé (nom, sous-titre, nav) : plus d'espace avant le contenu */}
            <div className="relative z-10 pt-52 sm:pt-32">
              <IntroSection />
              <ProjectsSection
                projects={projects}
                activeProject={activeProject}
                onActivate={setActiveProject}
                isMobile={isMobile}
              />
              <ContactSection />
            </div>
          </main>
        </div>

        {splashPhase !== 'done' && (
          <Splash visible={splashPhase === 'active'} onExplore={handleExplore} reducedMotion={reducedMotion} />
        )}

        {/* Pages overlay — montées sous la vague pendant la transition */}
        {displayed !== null && (
          <div ref={overlayRef} tabIndex={-1} className="fixed inset-0 z-overlay overflow-y-auto overlay-scroll outline-none">
            <Suspense fallback={null}>
              {displayedProject && <CaseStudy project={displayedProject} onBack={router.goHome} />}
              {displayed === 'identity' && <Identity onBack={router.goHome} />}
              {displayed === 'legal' && <MentionsLegales onBack={router.goHome} />}
            </Suspense>
          </div>
        )}
      </div>
    </NavigationContext.Provider>
  );
};

export default Home;
