import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, ArrowRight, Camera, Target, Calendar, User, Code2, Layout, Smartphone, Mail, Linkedin, Github } from 'lucide-react';
import CaseStudy from './CaseStudy';
import Identity from './Identity';
import MentionsLegales from './MentionsLegales';
import { getGwidoContentBlocks } from '../data/gwidoData';
import { getEomContentBlocks } from '../data/eomData';
import { trackPageView } from '../utils/analytics';

const ImageLoader = ({ src, alt, className = '', style = {}, eagerLoad = false }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative ${className}`} style={style}>
      {!loaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 z-0">
           <div className="w-6 h-6 border-2 border-indigo-200/30 border-t-indigo-500 rounded-full animate-spin"></div>
         </div>
      )}
      <img 
        src={src} 
        alt={alt} 
        loading={eagerLoad ? 'eager' : 'lazy'}
        decoding={eagerLoad ? 'sync' : 'async'}
        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out relative z-10 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={style}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};
const GwidoPortfolio = () => {
  const { t, i18n } = useTranslation();
  const [activeSection, setActiveSection] = useState('intro');
  const [activeProject, setActiveProject] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [showIdentity, setShowIdentity] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const wavePathRightRef = useRef(null);
  const wavePathRightBg1Ref = useRef(null);
  const wavePathRightBg2Ref = useRef(null);
  const waveContainerRef = useRef(null); // tracks actual container width for coord math
  const gwidoProjectRef = useRef(null);
  // ── Gwido bust: toggled by hovering the Gwido project row ──
  const [gwidoBustHovered, setGwidoBustHovered] = useState(false);
  // ── Gwido bust: tracks the Gwido row's vertical position so it scrolls with it ──
  const [gwidoBustTop, setGwidoBustTop] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ── Splash screen state ──
  const [isSplash, setIsSplash] = useState(true);
  // splashPhase: 'active' | 'transitioning' | 'done'
  const [splashPhase, setSplashPhase] = useState('active');
  // splashTextVisible: controls opacity of splash text
  const [splashTextVisible, setSplashTextVisible] = useState(true);
  // normalContentVisible: controls opacity of normal left content
  const [normalContentVisible, setNormalContentVisible] = useState(false);
  // — Page transition for case studies / identity —
  // ref so rAF can read phase without stale closure
  const caseStudyPhaseRef = useRef('none');
  const projectRefs = useRef([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [typedPortfolio, setTypedPortfolio] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Splash offset refs per wave layer (in vw, subtracted from base split)
  // Splash: negative offset pushes wave LEFT to cover ~93% of screen
  // Normal: 0. Main wave is fastest, bg waves staggered.
  const SPLASH_OFFSET = -50; // vw — main wave covers ~10vw left edge at top
  const splashOffsetRef   = useRef(SPLASH_OFFSET); // main wave
  const splashTargetRef   = useRef(SPLASH_OFFSET);
  const splashOffsetBg1Ref = useRef(SPLASH_OFFSET); // bg1 — slightly delayed
  const splashOffsetBg2Ref = useRef(SPLASH_OFFSET); // bg2 — most delayed

  const fixPath = (path) => {
    if (!path) return path;
    const base = import.meta.env.BASE_URL;
    if (path.startsWith(base)) return path;
    if (path.startsWith('/') && !path.startsWith('http')) {
      return (base + path.slice(1)).replace(/\/+/g, '/');
    }
    return path;
  };

  const currentLang = i18n.language?.startsWith('fr') ? 'fr' : 'en';
  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'fr' ? 'en' : 'fr');
  };

  // Mouse parallax tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Splash screen text typewriter effect
  useEffect(() => {
    if (!isSplash) return;
    const text = "PORTFOLIO";
    let i = 0;
    const typingInterval = setInterval(() => {
      setTypedPortfolio(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(typingInterval);
      }
    }, 120); // Typing speed

    return () => clearInterval(typingInterval);
  }, [isSplash]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Intersection Observer for project fade-in
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleProjects(prev => {
            if (!prev.includes(entry.target.dataset.index)) {
               return [...prev, entry.target.dataset.index];
            }
            return prev;
          });
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    projectRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Splash transition handler
  const handleSplashExplore = () => {
    if (splashPhase !== 'active') return;
    setSplashPhase('transitioning');

    // 1. Fade out splash text (300ms)
    setSplashTextVisible(false);

    // 2. Start lerping all wave layers toward normal (each at different speed)
    splashTargetRef.current = 0; // signal waves to move

    // 3. After 600ms, fade in normal left content
    setTimeout(() => {
      setNormalContentVisible(true);
    }, 600);

    // 4. After 1400ms, mark splash done
    setTimeout(() => {
      setIsSplash(false);
      setSplashPhase('done');
    }, 1400);
  };

  // Wave rendering
  useEffect(() => {
    let animationFrameId;
    const renderWave = (time) => {
      // ── Lerp each wave layer toward its target at staggered speeds ──
      // Lerp speed: faster during page transitions
      const isPageTrans = caseStudyPhaseRef.current === 'entering' || caseStudyPhaseRef.current === 'exiting';
      const lM = isPageTrans ? 0.09 : 0.045;
      const lB1 = isPageTrans ? 0.07 : 0.030;
      const lB2 = isPageTrans ? 0.05 : 0.018;
      const targetOff = splashTargetRef.current;
      splashOffsetRef.current    += (targetOff - splashOffsetRef.current)    * lM;
      splashOffsetBg1Ref.current += (targetOff - splashOffsetBg1Ref.current) * lB1;
      splashOffsetBg2Ref.current += (targetOff - splashOffsetBg2Ref.current) * lB2;

      const offMain = splashOffsetRef.current;
      const offBg1  = splashOffsetBg1Ref.current;
      const offBg2  = splashOffsetBg2Ref.current;

      // Coordinate normalization: always use full-screen vw math.
      // Container is now w-full (100vw), so containerLeft=0, containerW=100.
      // But clipPath fills from the wave edge to the RIGHT (L 1,1 L 1,0 Z),
      // so we still normalize into [0,1] relative to the 100vw container.
      const containerW   = 100;
      const containerLeft = 0;

      // Fewer segments during transition = less CPU per frame, imperceptible visually
      const isMobile = window.innerWidth < 768;
      const segments = splashPhase === 'done' ? (isMobile ? 36 : 60) : 48;
      let dRight = '';
      let dRightBg1 = '';
      let dRightBg2 = '';

      for (let i = 0; i <= segments; i++) {
        if (!isMobile) {
          const y = i / segments;
          const baseX_vw = 60 - (15 * y);
          const amplitude_vw = 2;
          const frequence = Math.PI * 4;

          // Main wave
          const screenX_vw = baseX_vw + offMain;
          const waveOffset_vw = amplitude_vw * Math.sin(y * frequence - time * 0.0005);
          const xRight = ((screenX_vw + waveOffset_vw) - containerLeft) / containerW;

          // Background wave 1
          const rotatedXBg1 = (baseX_vw + offBg1) - 3 - (y * -3);
          const waveOffsetBg1 = amplitude_vw * 1.1 * Math.sin(y * frequence * 0.8 - time * 0.0003 + 0.5);
          const xRightBg1 = ((rotatedXBg1 + waveOffsetBg1) - containerLeft) / containerW;

          // Background wave 2
          const rotatedXBg2 = (baseX_vw + offBg2) - 3 - (y * -8);
          const waveOffsetBg2 = amplitude_vw * 1.3 * Math.sin(y * frequence * 0.7 - time * 0.0002 + 1.2);
          const xRightBg2 = ((rotatedXBg2 + waveOffsetBg2) - containerLeft) / containerW;

          if (i === 0) {
            dRight    += 'M ' + xRight    + ',' + y + ' ';
            dRightBg1 += 'M ' + xRightBg1 + ',' + y + ' ';
            dRightBg2 += 'M ' + xRightBg2 + ',' + y + ' ';
          } else {
            dRight    += 'L ' + xRight    + ',' + y + ' ';
            dRightBg1 += 'L ' + xRightBg1 + ',' + y + ' ';
            dRightBg2 += 'L ' + xRightBg2 + ',' + y + ' ';
          }
        } else {
          // Mobile: Horizontal wave (top to bottom split)
          const x = i / segments;
          // On cache complètement la vague sur la landing page mobile (110vh = en dessous de l'écran)
          const baseY_vh = 110 + (10 * x); 
          const amplitude_vh = 2;
          const frequence = Math.PI * 3;

          // Multiplicateur augmenté (2.5) pour que la vague parcoure plus de distance
          // et couvre bien tout l'écran même en partant de plus bas
          const screenY_vh = baseY_vh + (offMain * 2.5);
          const waveOffset_vh = amplitude_vh * Math.sin(x * frequence - time * 0.0005);
          const yBottom = ((screenY_vh + waveOffset_vh) - containerLeft) / containerW;

          const rotatedYBg1 = (baseY_vh + offBg1 * 2.5) - 3 - (x * -3);
          const waveOffsetBg1 = amplitude_vh * 1.1 * Math.sin(x * frequence * 0.8 - time * 0.0003 + 0.5);
          const yBottomBg1 = ((rotatedYBg1 + waveOffsetBg1) - containerLeft) / containerW;

          const rotatedYBg2 = (baseY_vh + offBg2 * 2.5) - 3 - (x * -8);
          const waveOffsetBg2 = amplitude_vh * 1.3 * Math.sin(x * frequence * 0.7 - time * 0.0002 + 1.2);
          const yBottomBg2 = ((rotatedYBg2 + waveOffsetBg2) - containerLeft) / containerW;

          if (i === 0) {
            dRight    += 'M ' + x + ',' + yBottom + ' ';
            dRightBg1 += 'M ' + x + ',' + yBottomBg1 + ' ';
            dRightBg2 += 'M ' + x + ',' + yBottomBg2 + ' ';
          } else {
            dRight    += 'L ' + x + ',' + yBottom + ' ';
            dRightBg1 += 'L ' + x + ',' + yBottomBg1 + ' ';
            dRightBg2 += 'L ' + x + ',' + yBottomBg2 + ' ';
          }
        }
      }
      
      if (!isMobile) {
        dRight    += 'L 1,1 L 1,0 Z';
        dRightBg1 += 'L 1,1 L 1,0 Z';
        dRightBg2 += 'L 1,1 L 1,0 Z';
      } else {
        dRight    += 'L 1,1 L 0,1 Z';
        dRightBg1 += 'L 1,1 L 0,1 Z';
        dRightBg2 += 'L 1,1 L 0,1 Z';
      }

      if (wavePathRightRef.current)    wavePathRightRef.current.setAttribute('d', dRight);
      if (wavePathRightBg1Ref.current) wavePathRightBg1Ref.current.setAttribute('d', dRightBg1);
      if (wavePathRightBg2Ref.current) wavePathRightBg2Ref.current.setAttribute('d', dRightBg2);

      animationFrameId = requestAnimationFrame(renderWave);
    };
    animationFrameId = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Scroll logic for Top Nav & Active Sections
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);

      // Determine active section manually to prevent fast-scroll bugs
      const sections = ['intro', 'projects', 'contact'];
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // A section is active if the middle of the screen is within its bounds
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(id);
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // (Gwido bust position is fixed vertically via CSS — no scroll tracking needed)

  // Gwido bust: track the Gwido project row's Y so the bust scrolls with it
  // (position:fixed lets it reach the browser left edge; top mirrors the row)
  useEffect(() => {
    const updateBustPos = () => {
      if (gwidoProjectRef.current) {
        const rect = gwidoProjectRef.current.getBoundingClientRect();
        // Offset tweaks how high above the row centre the bust sits ─ adjust here
        setGwidoBustTop(rect.top + rect.height / 2);
      }
    };
    window.addEventListener('scroll', updateBustPos, { passive: true });
    updateBustPos(); // sync on mount
    return () => window.removeEventListener('scroll', updateBustPos);
  }, []);

  // Tracking: Page Views & Section Changes
  useEffect(() => {
    if (activeCaseStudy !== null) {
      const project = projects[activeCaseStudy];
      trackPageView(`/projects/${project.title.toLowerCase().replace(/\s+/g, '-')}`, `Project: ${project.title}`);
    } else {
      trackPageView(`/${activeSection}`, `Section: ${activeSection}`);
    }
  }, [activeSection, activeCaseStudy]);

  const projects = [
    {
      id: 0,
      title: 'Gwido',
      category: t('gwido.category'),
      role: 'Game designer | Lead Game Programmer | UX/UI Designer',
      color: 'bg-indigo-950',
      waveColors: ['bg-[#4f8499]/60', 'bg-[#4e889d]/80'],
      description: t('gwido.description'),
      sceneType: 'gaming',
      date: '2024 - 2025',
      context: t('gwido.context'),
      contributions: [],
      image: '/Image/Gwido/Image_Menu_Sans_Logo.webp',
      platform: t('gwido.platform'),
      duration: t('gwido.duration'),
      genre: t('gwido.genre'),
      timeline: t('gwido.timeline'),
      teamSize: t('gwido.teamSize'),
      rolesList: ['Game Designer', 'Lead Game Programmer', 'UX/UI Designer'],
      links: [
        { type: 'pdf', url: '/gwido/Gwido_Game_Document.pdf', labelKey: 'gwido.documentation_btn' }
      ],

      contentBlocks: getGwidoContentBlocks(t),
    },
    {
      id: 1,
      title: 'Echoes Of Memories',
      category: t('eom.category'),
      role: 'Lead Game Designer | Game Programmer',
      color: 'bg-slate-900',
      waveColors: ['bg-[#fdcdb7]/60', 'bg-[#af99c7]/80'],
      description: t('eom.description'),
      sceneType: 'gaming',
      date: '2023 - 2024',
      context: t('eom.context'),
      contributions: [],
      image: '/eom/images/Menu.png',
      platform: t('eom.platform'),
      genre: t('eom.genre'),
      timeline: t('eom.timeline'),
      teamSize: t('eom.teamSize'),
      rolesList: ['Lead Game Designer', 'Game Programmer'],
      links: [
        { type: 'itchio', url: 'https://harlegand-romain.itch.io/echoes-of-memories', labelKey: 'eom.itchio_btn' }
      ],

      contentBlocks: getEomContentBlocks(t),
    },
    {
      id: 2,
      title: t('projects.nextProject'),
      category: t('projects.nextProjectCategory'),
      role: '',
      color: 'bg-slate-800',
      waveColors: ['bg-slate-400/40', 'bg-slate-700/50'],
      description: t('projects.nextProjectDescription'),
      sceneType: 'incoming',
      date: '\u2014',
      context: '',
      contributions: [],
      image: '',
      rolesList: [],
      contentBlocks: [],
      incoming: true,
    },
  ];

  const customStyles = [
    ".bg-dots { background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px); background-size: 24px 24px; background-color: #ffffff; }",
    ".bg-dots-tracker { --dot-radius: 80px; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(#64748b 1.5px, transparent 1.5px); background-size: 24px 24px; mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); -webkit-mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); }",
    ".bg-dots-dark { background-image: radial-gradient(rgba(255,255,255,0.1) 1.5px, transparent 1.5px); background-size: 24px 24px; }",
    ".vertical-text { writing-mode: vertical-rl; transform: rotate(180deg); }",
    "@keyframes pulse-glow { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }",
    "@keyframes subtle-zoom { 0% { transform: scale(1); } 100% { transform: scale(1.1); } }",
    ".animate-pulse-glow { animation: pulse-glow 4s ease-in-out infinite; }",
    ".animate-subtle-zoom { animation: subtle-zoom 20s ease-in-out alternate infinite; }",
    "@keyframes marquee-ltr { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }",
    "@keyframes marquee-rtl { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }",
    ".marquee-ltr { animation: marquee-ltr 80s linear infinite; display: flex; width: max-content; }",
    ".marquee-rtl { animation: marquee-rtl 80s linear infinite; display: flex; width: max-content; }",
    ".marquee-ltr-fast { animation: marquee-ltr 80s linear infinite; display: flex; width: max-content; }",
    "@keyframes wave-move { 0% { transform: translateX(-25%) translateY(2%); } 50% { transform: translateX(0%) translateY(-2%); } 100% { transform: translateX(-25%) translateY(2%); } }",
    ".animate-wave { animation: wave-move 20s ease-in-out infinite; }",
    "@keyframes topo-float { 0% { transform: scale(1) translate(0, 0); } 50% { transform: scale(1.05) translate(-2%, 2%); } 100% { transform: scale(1) translate(0, 0); } }",
    ".animate-topo { animation: topo-float 30s ease-in-out infinite; }"
  ].join("\n");

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if(el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open case study with wave transition
  const handleOpenCaseStudy = (index) => {
    if (isSplash || caseStudyPhaseRef.current !== 'none') return;
    caseStudyPhaseRef.current = 'entering';
    // Phase 1: wave covers screen
    splashTargetRef.current = -60;
    setTimeout(() => {
      // Wave covers screen — mount overlay (starts at opacity:1, hidden by wave)
      setActiveCaseStudy(index);
      // Phase 2: wave exits right
      splashTargetRef.current = 70;
    }, 550);
    setTimeout(() => {
      splashOffsetRef.current    = 70;
      splashOffsetBg1Ref.current = 70;
      splashOffsetBg2Ref.current = 70;
      caseStudyPhaseRef.current = 'cs_active';
    }, 1050);
  };

  // Back from case study with wave transition
  const handleCaseStudyBack = () => {
    if (caseStudyPhaseRef.current !== 'cs_active') return;
    caseStudyPhaseRef.current = 'exiting';
    // Wave enters from right and wipes over the case study naturally
    splashOffsetRef.current    = 70;
    splashOffsetBg1Ref.current = 70;
    splashOffsetBg2Ref.current = 70;
    splashTargetRef.current    = 70;
    requestAnimationFrame(() => { splashTargetRef.current = -60; });
    setTimeout(() => {
      setActiveCaseStudy(null);
      splashTargetRef.current = 0;
    }, 600);
    setTimeout(() => { caseStudyPhaseRef.current = 'none'; }, 1300);
  };

  // Open Identity page with wave transition
  const handleOpenIdentity = () => {
    if (isSplash || caseStudyPhaseRef.current !== 'none') return;
    caseStudyPhaseRef.current = 'entering';
    splashTargetRef.current = -60;
    setTimeout(() => {
      setShowIdentity(true);
      splashTargetRef.current = 70;
    }, 550);
    setTimeout(() => {
      splashOffsetRef.current    = 70;
      splashOffsetBg1Ref.current = 70;
      splashOffsetBg2Ref.current = 70;
      caseStudyPhaseRef.current = 'cs_active';
    }, 1050);
  };

  // Back from Identity with wave transition
  const handleIdentityBack = () => {
    if (caseStudyPhaseRef.current !== 'cs_active') return;
    caseStudyPhaseRef.current = 'exiting';
    splashOffsetRef.current    = 70;
    splashOffsetBg1Ref.current = 70;
    splashOffsetBg2Ref.current = 70;
    splashTargetRef.current    = 70;
    requestAnimationFrame(() => { splashTargetRef.current = -60; });
    setTimeout(() => {
      setShowIdentity(false);
      splashTargetRef.current = 0;
    }, 600);
    setTimeout(() => { caseStudyPhaseRef.current = 'none'; }, 1300);
  };

  const handleOpenMentions = () => {
    if (isSplash || caseStudyPhaseRef.current !== 'none') return;
    caseStudyPhaseRef.current = 'entering';
    splashTargetRef.current = -60;
    setTimeout(() => {
      setShowMentions(true);
      splashTargetRef.current = 70;
    }, 550);
    setTimeout(() => {
      splashOffsetRef.current    = 70;
      splashOffsetBg1Ref.current = 70;
      splashOffsetBg2Ref.current = 70;
      caseStudyPhaseRef.current = 'cs_active';
    }, 1050);
  };

  const handleMentionsBack = () => {
    if (caseStudyPhaseRef.current !== 'cs_active') return;
    caseStudyPhaseRef.current = 'exiting';
    splashOffsetRef.current    = 70;
    splashOffsetBg1Ref.current = 70;
    splashOffsetBg2Ref.current = 70;
    splashTargetRef.current    = 70;
    requestAnimationFrame(() => { splashTargetRef.current = -60; });
    setTimeout(() => {
      setShowMentions(false);
      splashTargetRef.current = 0;
    }, 600);
    setTimeout(() => { caseStudyPhaseRef.current = 'none'; }, 1300);
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans relative flex bg-white">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* --- FLOATING PILL NAV (root level, outside main, above wave) --- */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center transition-all duration-500 ${isScrolled ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-8 pointer-events-none'}`}>
          <nav className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-8 py-4 rounded-full border border-slate-200">
              <button onClick={handleOpenIdentity} className="text-slate-500 hover:text-indigo-600 transition-colors">{t('nav.identity')}</button>
              <button onClick={() => scrollTo('projects')} className={`hover:text-indigo-600 transition-colors ${activeSection === 'projects' ? 'text-indigo-600' : 'text-slate-500'}`}>{t('nav.works')}</button>
              <button onClick={() => scrollTo('contact')} className={`hover:text-indigo-600 transition-colors ${activeSection === 'contact' ? 'text-indigo-600' : 'text-slate-500'}`}>{t('nav.contact')}</button>
              <span className="text-slate-200">|</span>
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
                aria-label="Toggle language"
              >
                <span className={currentLang === 'fr' ? 'text-indigo-600' : ''}>FR</span>
                <span className="text-slate-300">/</span>
                <span className={currentLang === 'en' ? 'text-indigo-600' : ''}>EN</span>
              </button>
          </nav>
      </div>

      {/* --- RIGHT SIDE FIXED VISUALS (The "Wave") --- */}
      <div
        ref={waveContainerRef}
        className="fixed top-0 right-0 h-screen w-full pointer-events-none z-20"
        style={{
          // drop-shadow removed during splash/transition — it prevents GPU layer promotion
          // on a full-screen clipped element, making every rAF frame very expensive.
          // Restored (with a fade) once the transition is fully done.
          filter: splashPhase === 'done' ? 'drop-shadow(-20px 0px 40px rgba(0,0,0,0.3))' : 'none',
          transition: splashPhase === 'done' ? 'filter 600ms ease-out' : 'none',
          willChange: splashPhase !== 'done' ? 'clip-path' : 'auto',
        }}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath id="wave-right" clipPathUnits="objectBoundingBox">
              <path ref={wavePathRightRef} d="" fill="black" />
            </clipPath>
            <clipPath id="wave-right-bg1" clipPathUnits="objectBoundingBox">
              <path ref={wavePathRightBg1Ref} d="" fill="black" />
            </clipPath>
            <clipPath id="wave-right-bg2" clipPathUnits="objectBoundingBox">
              <path ref={wavePathRightBg2Ref} d="" fill="black" />
            </clipPath>
          </defs>
        </svg>

        {/* Background Wave 2 (Deepest) — no backdrop-blur: clip-path changes 60fps, blur is non-compositable */}
        <div 
           className={`absolute top-0 right-0 w-full h-full pointer-events-none transition-colors duration-1000 ease-in-out z-0 
             ${activeSection === 'projects' ? projects[activeProject].waveColors[1] : 'bg-slate-800/60'}`} 
           style={{ clipPath: 'url(#wave-right-bg2)', willChange: splashPhase !== 'done' ? 'clip-path' : 'auto' }}
        ></div>

        {/* Background Wave 1 — no backdrop-blur for same reason */}
        <div 
           className={`absolute top-0 right-0 w-full h-full pointer-events-none transition-colors duration-1000 ease-in-out z-10 
             ${activeSection === 'projects' ? projects[activeProject].waveColors[0] : 'bg-slate-600/50'}`} 
           style={{ clipPath: 'url(#wave-right-bg1)', willChange: splashPhase !== 'done' ? 'clip-path' : 'auto' }}
        ></div>

        <div className="w-full h-full overflow-hidden relative pointer-events-auto bg-slate-950 z-20"
          style={{ clipPath: 'url(#wave-right)', willChange: splashPhase !== 'done' ? 'clip-path' : 'auto' }}
        >
            
            {/* 1. Intro Visual — Marquee image strips */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === 'intro' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="absolute inset-0 bg-slate-950 overflow-hidden flex flex-col justify-center gap-6 py-4">
                  {/* Topographic Map Pattern — always visible */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                    <div className="absolute inset-[-20%] animate-topo flex items-center justify-center">
                      <svg className="w-full h-full text-indigo-400/40" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                        <defs>
                          <filter id="topo-intro" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" result="noise" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" xChannelSelector="R" yChannelSelector="G" />
                            <feGaussianBlur stdDeviation="0.5" />
                          </filter>
                        </defs>
                        <g filter="url(#topo-intro)" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
                          {[...Array(120)].map((_, i) => (
                            <line key={i} x1="-200" y1={i * 15 - 400} x2="1200" y2={i * 15 - 400} />
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent pointer-events-none z-10" />

                  {/* Marquee rows — always in DOM, clipped by wave during splash, revealed on transition */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '24px',
                      padding: '16px 0',
                      zIndex: 5,
                    }}
                  >
                  {[
                    { cls: 'marquee-rtl', images: ['/gwido/images/Gwido001.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido003.webp', '/eom/images/Menu.png', '/gwido/images/Gwido004.webp', '/eom/images/Screen_Start.png', '/gwido/images/Gwido005.webp', '/gwido/images/Gwido006.webp'] },
                    { cls: 'marquee-ltr', images: ['/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Start.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido001.webp', '/gwido/images/Gwido007.webp', '/gwido/images/Gwido008.webp'] },
                    { cls: 'marquee-rtl', images: ['/gwido/images/Gwido004.webp', '/eom/images/Menu.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_Start.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Gwido009.webp'] },
                  ].map((row, ri) => (
                    <div key={ri} className="overflow-hidden flex-shrink-0">
                      <div className={row.cls}>
                        {[...row.images, ...row.images].map((src, i) => (
                          <div key={i} className="flex-shrink-0 w-72 h-[160px] mx-2 rounded-xl overflow-hidden opacity-80">
                            {/* eager loading: images are ready before transition fires */}
                            <ImageLoader src={fixPath(src)} alt="" className="w-full h-full" eagerLoad />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  </div>

                  {/* Splash dimmer — darkens the marquee during splash, fades out on transition */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 15,
                      pointerEvents: 'none',
                      backgroundColor: 'rgba(2, 6, 23, 0.78)',
                      opacity: splashPhase === 'active' ? 1 : 0,
                      transition: splashPhase === 'active'
                        ? 'none'
                        : 'opacity 1000ms cubic-bezier(0.16, 1, 0.32, 1)',
                    }}
                  />
                </div>
            </div>

            {/* 2. Project Visuals */}
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === 'projects' && activeProject === index ? 'opacity-100 z-20' : 'opacity-0 z-0'}`}
              >
                <div className={`absolute inset-0 transition-colors duration-1000 ${project.color}`}></div>

                {project.sceneType === 'gaming' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-transparent overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-dots pointer-events-none opacity-20 z-0 mix-blend-overlay"
                      style={{ transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)` }}
                    ></div>
                    <div 
                      className="relative w-full h-full z-10 transition-transform duration-700 ease-out"
                      style={{ transform: `translate(${mousePos.x * -1}px, ${mousePos.y * -1}px) scale(1.05)` }}
                    >
                      <ImageLoader 
                        src={fixPath(project.image)} 
                        alt={project.title} 
                        className="w-full h-full mix-blend-lighten"
                        style={{ maskImage: "linear-gradient(to left, black 60%, transparent 100%)", WebkitMaskImage: "linear-gradient(to left, black 60%, transparent 100%)" }}
                      />
                    </div>
                  </div>
                )}

                {project.sceneType === 'data' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                    <div 
                      className="absolute inset-0 opacity-20" 
                      style={{ 
                        backgroundImage: "linear-gradient(#0891b2 1px, transparent 1px), linear-gradient(90deg, #0891b2 1px, transparent 1px)", 
                        backgroundSize: "40px 40px", 
                        transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
                      }}
                    ></div>
                    
                    <div 
                      className="relative z-10 w-[700px] h-[450px] bg-slate-900/40 backdrop-blur-xl border border-cyan-500/30 rounded-2xl overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.15)] ml-40 transition-all duration-1000" 
                      style={{ 
                        transform: `translate(${mousePos.x}px, ${mousePos.y}px) ${activeSection === 'projects' && activeProject === index ? 'scale(1)' : 'scale(0.95)'}`,
                        perspective: '1000px'
                      }}
                    >
                        <ImageLoader 
                          src={fixPath(project.image)} 
                          alt={project.title}
                          className="w-full h-full transition-transform duration-700 group-hover:scale-105"
                          style={{ opacity: 0.9 }}
                        />
                        
                        {/* Overlay tech effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_4px,3px_100%] pointer-events-none"></div>
                        
                        {/* Technical Corners */}
                        <div className="absolute top-4 left-4 w-10 h-10 border-t-2 border-l-2 border-cyan-400/50 rounded-tl-lg"></div>
                        <div className="absolute top-4 right-4 w-10 h-10 border-t-2 border-r-2 border-cyan-400/50 rounded-tr-lg"></div>
                        <div className="absolute bottom-4 left-4 w-10 h-10 border-b-2 border-l-2 border-cyan-400/50 rounded-bl-lg"></div>
                        <div className="absolute bottom-4 right-4 w-10 h-10 border-b-2 border-r-2 border-cyan-400/50 rounded-br-lg"></div>
                    </div>
                  </div>
                )}

                {project.sceneType === 'mobile' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-emerald-950">
                    <div className="absolute w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-glow top-10 left-10"></div>
                    <div className="absolute w-[400px] h-[400px] bg-teal-600/20 rounded-full blur-[100px] animate-pulse-glow bottom-10 right-10" style={{ animationDelay: "-2s" }}></div>

                    <div 
                      className="relative z-10 w-[280px] h-[580px] bg-slate-900 border-[8px] border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden ml-40 transition-transform duration-1000" 
                      style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px) ${activeSection === 'projects' && activeProject === index ? 'translateY(0)' : 'translateY(100px)'}` }}
                    >
                        <div className="w-full h-full bg-emerald-900/20 p-6 flex flex-col">
                          <div className="w-full h-40 bg-emerald-500/20 rounded-2xl mb-6 animate-pulse-glow"></div>
                          <div className="space-y-4">
                            <div className="w-3/4 h-6 bg-emerald-500/20 rounded-md"></div>
                            <div className="w-1/2 h-4 bg-emerald-500/10 rounded-md"></div>
                          </div>
                          
                          <div className="mt-auto self-center mb-8 w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(16,185,129,0.3)] animate-pulse-glow" style={{ animationDuration: "3s" }}>
                            <ArrowUpRight className="text-white w-6 h-6" />
                          </div>
                        </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* 3. Contact Visual — Marquee image strips */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${activeSection === 'contact' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <div className="absolute inset-0 bg-slate-950 overflow-hidden flex flex-col justify-center gap-6 py-4">
                  {/* Authentic Topographic Map Pattern */}
                  <div className="absolute inset-0 opacity-40 pointer-events-none overflow-hidden">
                    <div className="absolute inset-[-20%] animate-topo flex items-center justify-center">
                      <svg className="w-full h-full text-indigo-400/40" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
                        <defs>
                          <filter id="topo-contact" x="-50%" y="-50%" width="200%" height="200%" colorInterpolationFilters="sRGB">
                            <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="2" result="noise" seed="5" />
                            <feDisplacementMap in="SourceGraphic" in2="noise" scale="100" xChannelSelector="R" yChannelSelector="G" />
                            <feGaussianBlur stdDeviation="0.5" />
                          </filter>
                        </defs>
                        <g filter="url(#topo-contact)" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.6">
                          {/* Sommet excentré (Cercles concentriques en haut à droite) */}
                          {[...Array(120)].map((_, i) => (
                            <circle key={i} cx="1000" cy="0" r={i * 18 + 20} />
                          ))}
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-transparent pointer-events-none z-10" />
                  {[
                    { cls: 'marquee-rtl',      images: ['/gwido/images/Gwido001.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido003.webp', '/eom/images/Menu.png', '/gwido/images/Gwido004.webp', '/eom/images/Screen_Start.png', '/gwido/images/Gwido005.webp', '/gwido/images/Gwido006.webp'] },
                    { cls: 'marquee-ltr',      images: ['/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Start.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido001.webp', '/gwido/images/Gwido007.webp', '/gwido/images/Gwido008.webp'] },
                    { cls: 'marquee-rtl',      images: ['/gwido/images/Gwido004.webp', '/eom/images/Menu.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_Start.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Gwido009.webp'] },
                  ].map((row, ri) => (
                    <div key={ri} className="overflow-hidden flex-shrink-0">
                      <div className={row.cls}>
                        {[...row.images, ...row.images].map((src, i) => (
                          <div key={i} className="flex-shrink-0 w-72 h-[160px] mx-2 rounded-xl overflow-hidden opacity-80">
                            <img src={fixPath(src)} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
            </div>

        </div>
      </div>

      {/* ── SPLASH OVERLAY — centered inside the dark wave ── */}
      {isSplash && (
        <div
          className="fixed inset-0 z-25 pointer-events-none"
          style={{ zIndex: 25 }}
          aria-hidden={!isSplash}
        >
          {/* Full-screen clickable overlay — triggers transition */}
          <div
            className="absolute inset-0 pointer-events-auto"
            onClick={handleSplashExplore}
          />

          {/* Splash text — centered on screen, in the dark wave zone */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transition: splashTextVisible ? 'opacity 0ms' : 'opacity 300ms cubic-bezier(0.16, 1, 0.32, 1)',
              opacity: splashTextVisible ? 1 : 0,
            }}
          >
            <div
              className="text-center pointer-events-auto"
              style={{ userSelect: 'none' }}
            >
              <h1
                style={{
                  fontSize: 'clamp(4rem, 10vw, 9rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  color: '#f8fafc',
                  lineHeight: 0.9,
                  marginBottom: '28px',
                  textShadow: '0 4px 60px rgba(99,102,241,0.4)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {typedPortfolio}
                <span style={{ opacity: showCursor ? 1 : 0, marginLeft: '8px', color: '#6366f1' }}>_</span>
              </h1>
              <p
                style={{
                  fontSize: 'clamp(0.85rem, 1.4vw, 1.1rem)',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(226,232,240,0.9)',
                  marginBottom: '6px',
                }}
              >
                HARLEGAND Romain
              </p>
              <p
                style={{
                  fontSize: 'clamp(0.7rem, 1vw, 0.85rem)',
                  fontWeight: 400,
                  color: 'rgba(148,163,184,0.8)',
                  letterSpacing: '0.05em',
                  marginBottom: '48px',
                }}
              >
                Technical Game Designer &nbsp;·&nbsp; UX/UI Designer
              </p>
              <button
                onClick={handleSplashExplore}
                className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest pb-1 group"
                style={{
                  color: '#e2e8f0',
                  borderBottom: '1.5px solid rgba(226,232,240,0.5)',
                  pointerEvents: 'auto',
                  transition: 'color 200ms, border-color 200ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.color='#a5b4fc'; e.currentTarget.style.borderColor='#a5b4fc'; }}
                onMouseLeave={e => { e.currentTarget.style.color='#e2e8f0'; e.currentTarget.style.borderColor='rgba(226,232,240,0.5)'; }}
              >
                Explorer <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SCROLLING CONTENT (Left Side) --- */}
      <main
        className="relative z-10 w-full md:w-[70%] bg-white/95 backdrop-blur-2xl pb-[45vh] md:pb-32 mix-blend-normal isolate"
      >
        
        {/* Fixed background dots within the left wrapper */}
        <div className="absolute inset-0 pointer-events-none z-[-1]">
             <div className="sticky top-0 w-full h-screen bg-dots">
                 <div className="bg-dots-tracker"></div>
             </div>
        </div>

        {/* --- STATIC HEADER (Name + Initial Nav) --- */}
        <div>
        <header className="absolute top-0 left-0 w-full md:w-[70%] px-8 md:px-16 py-8 md:py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 z-40">
            <div>
                <h1 
                    className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tighter cursor-pointer whitespace-nowrap leading-none mb-4" 
                    onClick={() => window.scrollTo({top: 0, behavior:'smooth'})}
                >
                    HARLEGAND Romain
                </h1>
                <p className="font-semibold text-slate-500 uppercase tracking-[0.2em] text-[10px]">
                    {t('intro.subtitle')}
                </p>
            </div>
            
            {/* Initial Nav links visible at top */}
            <nav className="mt-8 sm:mt-0 flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest opacity-100">
                <button onClick={handleOpenIdentity} className="text-slate-600 hover:text-indigo-600 transition-colors">{t('nav.identity')}</button>
                <button onClick={() => scrollTo('projects')} className={`hover:text-indigo-600 transition-colors ${activeSection === 'projects' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600'}`}>{t('nav.works')}</button>
                <button onClick={() => scrollTo('contact')} className={`hover:text-indigo-600 transition-colors ${activeSection === 'contact' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-600'}`}>{t('nav.contact')}</button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors"
                  aria-label="Toggle language"
                >
                  <span className={currentLang === 'fr' ? 'text-indigo-600' : ''}>FR</span>
                  <span className="text-slate-300">/</span>
                  <span className={currentLang === 'en' ? 'text-indigo-600' : ''}>EN</span>
                </button>
            </nav>
        </header>

        {/* Floating pill nav has been moved to root level (above this main) */}

        {/* Content sections below */}
        <div className="relative z-10 pt-32">
            
            {/* INTRO SECTION */}
            <section id="intro" data-section="intro" className="section-observer min-h-screen flex flex-col justify-center px-8 md:px-16 pb-24">
                <div className="max-w-xl">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-[#0f172a] mb-8 leading-tight">
                        {t('intro.headline')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">{t('intro.headlineAccent')}</span>
                    </h2>
                    <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">
                        {t('intro.description')}
                    </p>
                    <p className="text-slate-500 mb-12 leading-relaxed">
                        {t('intro.description2')}
                    </p>
                    <button onClick={() => scrollTo('projects')} className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-colors group">
                        {t('intro.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* PROJECTS SECTION */}
            <section id="projects" data-section="projects" className="section-observer min-h-screen flex flex-col justify-center px-8 md:px-16 py-24 border-t border-slate-100">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block sticky-label">
                    <span className="vertical-text uppercase tracking-[0.2em] text-[10px] font-bold text-slate-400 whitespace-nowrap">
                        {t('projects.sidebar')}
                    </span>
                </div>
                
                <div className="flex-1 flex flex-col justify-center relative z-10 max-w-xl">
                  <div className="space-y-12 pl-4 lg:pl-16">
                    {projects.map((project, index) => {
                      const inView = visibleProjects.includes(String(index));
                      return (
                      <div 
                        key={project.id}
                        data-index={index}
                        ref={el => {
                          if (index === 0) gwidoProjectRef.current = el;
                          projectRefs.current[index] = el;
                        }}
                        onMouseEnter={() => {
                          if (!project.incoming) {
                            setActiveProject(index);
                            // ── Show bust only when hovering the Gwido (index 0) row ──
                            if (index === 0) setGwidoBustHovered(true);
                          }
                        }}
                        onMouseLeave={() => {
                          // ── Hide bust when leaving the Gwido row ──
                          if (index === 0) setGwidoBustHovered(false);
                        }}
                        onClick={() => {
                          if (!project.incoming) {
                            setActiveProject(index);
                            if (index === 0 && !isMobile) setGwidoBustHovered(true);
                          }
                        }}
                        className={`group transition-all relative transform duration-700 ease-out ${
                          inView ? 'translate-y-0' : 'translate-y-12 opacity-0'
                        } ${
                          !inView ? '' : project.incoming 
                            ? 'opacity-40 cursor-default select-none' 
                            : 'cursor-pointer ' + (activeProject === index ? 'opacity-100 scale-100' : 'opacity-30 scale-95 hover:opacity-70')
                        }`}
                      >
                        <div className={"absolute -left-8 top-1 w-1 bg-slate-900 transition-all duration-700 ease-out origin-top " + (!project.incoming && activeProject === index ? "h-full opacity-100" : "h-0 opacity-0")}></div>
                        
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-3">
                          0{index + 1} <span>—</span> {project.category.split('|')[0].trim()}
                          {project.incoming && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full border border-slate-300 text-[9px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50">
                              {t('projects.comingSoon')}
                            </span>
                          )}
                        </p>
                        <h2 className={"text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4 transition-transform duration-500 " + 
                          (project.incoming ? "text-slate-300" : "text-[#0f172a] group-hover:translate-x-3")}>
                          {project.incoming ? '???' : project.title}
                        </h2>
                        
                        {!project.incoming && (
                        <div className={"overflow-hidden transition-all duration-700 ease-in-out " + (activeProject === index ? "max-h-40 opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-4")}>
                          <p className="text-slate-600 mb-5 text-sm leading-relaxed border-l-2 border-slate-200 pl-4">
                            {project.description}
                          </p>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setGwidoBustHovered(false);
                              handleOpenCaseStudy(index);
                            }} 
                            className="flex items-center text-xs font-bold uppercase tracking-widest text-[#0f172a] hover:text-blue-600 transition-colors"
                          >
                            {t('projects.exploreCaseStudy')} <ArrowRight className="w-4 h-4 ml-2" />
                          </button>
                        </div>
                        )}
                      </div>
                    )})}
                  </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" data-section="contact" className="section-observer min-h-[80vh] flex flex-col justify-center px-8 md:px-16 py-24 border-t border-slate-100">
                <div className="max-w-xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 mb-4">
                        {t('contact.label')}
                    </p>

                    <p className="text-slate-600 text-lg mb-12">
                        {t('contact.text')}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <a href="mailto:rharlegand@gmail.com" className="flex justify-center items-center gap-3 bg-indigo-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors w-full sm:w-auto">
                            <Mail className="w-4 h-4" /> {t('contact.cta')}
                        </a>
                        <div className="flex gap-4 w-full sm:w-auto justify-center">
                            <a href="https://www.linkedin.com/in/romain-harlegand/" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center bg-white border border-slate-200 text-slate-600 hover:text-[#0f172a] hover:border-slate-400 px-6 py-4 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a href="https://github.com/HARLEGANDRomain" target="_blank" rel="noopener noreferrer" className="flex justify-center items-center bg-white border border-slate-200 text-slate-600 hover:text-[#0f172a] hover:border-slate-400 px-6 py-4 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Footer Link */}
                <div className="absolute bottom-8 left-8 md:left-16 z-50">
                    <button 
                        onClick={handleOpenMentions} 
                        className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors"
                    >
                        Mentions Légales
                    </button>
                </div>
            </section>

        </div>
        {/* End content fade wrapper */}
        </div>
      </main>

      {/* ════════════════════════════════════════════════════
          Gwido Bust — peeks from the LEFT edge on hover
          Trigger  : onMouseEnter/Leave on the Gwido project row
          ════════════════════════════════════════════════════ */}
      {!isMobile && (() => {
        const bustActive = gwidoBustHovered;
        return (
          // Outer wrapper: clips the right/far side of the rotated image
          // so we never see a hard horizontal cut — only the left edge peeks in
          <div
            style={{
              position: 'fixed',
              left: 0,
              // ── Follows the Gwido title while scrolling (updated via scroll listener) ──
              top: gwidoBustTop,
              zIndex: 60,
              pointerEvents: 'none',
              // clip anything that slides too far right (avoids cut-edge artefact)
              overflow: 'hidden',
              // enough padding so the rotated image isn't cropped on top/bottom
              paddingRight: '24px',
              paddingTop: '24px',
              paddingBottom: '24px',
              // ──────────────────────────────────────────────────────────────────
              // FINAL PEEK POSITION: change translateX(-8%) below to control
              // how far the bust slides in when hovered.
              //   0%   = fully visible (right edge at left:0)
              //  -8%   = slight peek (default)
              //  -30%  = only a sliver visible
              // ──────────────────────────────────────────────────────────────────
              transform: bustActive
                ? 'translateY(-80%) translateX(-32%)' // ← FINAL peek position
                : 'translateY(-50%) translateX(-50%)',
              opacity: bustActive ? 1 : 0,
              transition: 'opacity 0.45s ease, transform 0.75s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: 'drop-shadow(6px 0 28px rgba(99,102,241,0.5))',
            }}
          >
            <img
              src={fixPath('/gwido/images/Gwido_Buste.webp')}
              alt=""
              loading="lazy"
              decoding="async"
              style={{
                // ── Image size ──
                height: '140px',
                width: 'auto',
                display: 'block',
                // ── Rotation: 312° so the bust leans toward the screen ──
                transform: 'rotate(40deg)',
                transformOrigin: 'center center',
              }}
            />
          </div>
        );
      })()}

      {/* ── Case Study overlay — mounts under wave cover at t=550ms, always opacity:1 ── */}
      {activeCaseStudy !== null && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 15, overflowY: 'auto' }}
        >
          <CaseStudy project={projects[activeCaseStudy]} onBack={handleCaseStudyBack} />
        </div>
      )}

      {/* ── Identity overlay ── */}
      {showIdentity && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 15, overflowY: 'auto' }}
        >
          <Identity onBack={handleIdentityBack} />
        </div>
      )}

      {/* ── Mentions Légales overlay ── */}
      {showMentions && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 15, overflowY: 'auto' }}
        >
          <MentionsLegales onBack={handleMentionsBack} />
        </div>
      )}

    </div>
  );
};

export default GwidoPortfolio;
