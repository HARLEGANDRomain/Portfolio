import { getGwidoContentBlocks } from './gwidoData';
import { getEomContentBlocks } from './eomData';

/**
 * Liste des projets affichés sur l'accueil et dans les études de cas.
 *
 * Pour ajouter un projet :
 *  1. créer src/data/<projet>Data.js (blocs de contenu, cf. CaseStudy.jsx)
 *  2. ajouter les textes dans src/locales/fr.json et en.json
 *  3. ajouter une entrée ici (slug unique)
 *  4. ajouter la route dans src/routes.js : { key: 'project:<slug>', path: '/projets/<slug>/', title: … }
 *  5. déposer les médias dans public/<projet>/
 *
 * Les classes de couleur des vagues doivent être écrites en entier (Tailwind les détecte statiquement).
 */
export const getProjects = (t) => [
  {
    slug: 'gwido',
    title: 'Gwido',
    category: t('gwido.category'),
    description: t('gwido.description'),
    // Résumé de l'accueil (type, mission, problème, solution)
    type: t('gwido.home.type'),
    mission: t('gwido.home.mission'),
    problem: t('gwido.home.problem'),
    solution: t('gwido.home.solution'),
    studentProject: true,
    context: t('gwido.context'),
    date: '2024 - 2025',
    timeline: t('gwido.timeline'),
    teamSize: t('gwido.teamSize'),
    rolesList: ['Game Designer', 'Lead Game Programmer', 'UX/UI Designer'],
    image: '/gwido/images/Image_Menu_Sans_Logo.webp',
    sceneColor: 'bg-indigo-950',
    waveColors: ['bg-gwido-wave-1/60', 'bg-gwido-wave-2/80'],
    links: [
      { type: 'pdf', url: '/gwido/Gwido_Game_Document.pdf', labelKey: 'gwido.documentation_btn' },
    ],
    contentBlocks: getGwidoContentBlocks(t),
  },
  {
    slug: 'echoes-of-memories',
    title: 'Echoes Of Memories',
    category: t('eom.category'),
    description: t('eom.description'),
    // Résumé de l'accueil (type, mission, problème, solution)
    type: t('eom.home.type'),
    mission: t('eom.home.mission'),
    problem: t('eom.home.problem'),
    solution: t('eom.home.solution'),
    studentProject: true,
    context: t('eom.context'),
    date: '2023 - 2024',
    timeline: t('eom.timeline'),
    teamSize: t('eom.teamSize'),
    rolesList: ['Lead Game Designer', 'Game Programmer'],
    image: '/eom/images/Menu.png',
    sceneColor: 'bg-slate-900',
    waveColors: ['bg-eom-wave-1/60', 'bg-eom-wave-2/80'],
    links: [
      { type: 'itchio', url: 'https://harlegand-romain.itch.io/echoes-of-memories', labelKey: 'eom.itchio_btn' },
    ],
    contentBlocks: getEomContentBlocks(t),
  },
];

/** Images des bandeaux défilants (intro / contact) */
export const MARQUEE_ROWS = [
  { direction: 'rtl', images: ['/gwido/images/Gwido001.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido003.webp', '/eom/images/Menu.png', '/gwido/images/Gwido004.webp', '/eom/images/Screen_Start.png', '/gwido/images/Gwido005.webp', '/gwido/images/Gwido006.webp'] },
  { direction: 'ltr', images: ['/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Start.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_cube_Time_Stop.png', '/gwido/images/Gwido001.webp', '/gwido/images/Gwido007.webp', '/gwido/images/Gwido008.webp'] },
  { direction: 'rtl', images: ['/gwido/images/Gwido004.webp', '/eom/images/Menu.png', '/gwido/images/Gwido002.webp', '/eom/images/Screen_Start.png', '/gwido/images/Image_Menu_Sans_Logo.webp', '/eom/images/Screen_Repulsion_des_amas.png', '/gwido/images/Gwido009.webp'] },
];
