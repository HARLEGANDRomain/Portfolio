/**
 * Gwido — Case Study content blocks
 * Restructuré selon la documentation officielle (paragraphes séparés par _____)
 * Internationalisé via i18next — les textes sont chargés via la fonction t()
 */
export const getGwidoContentBlocks = (t) => [

  // ── 00 · Galerie in-game ──────────────────────────────────────────────────
  // Carousel justifié ici : montrer rapidement l'ambiance en quelques screenshots
  {
    type: 'carousel',
    label: t('gwido.carousel00_label'),
    title: t('gwido.carousel00_title'),
    interval: 4000,
    items: [
      { type: 'image', src: '/gwido/images/Image_Menu_Sans_Logo.png', caption: t('gwido.carousel00_cap1') },
      { type: 'image', src: '/gwido/images/Gwido001.png',             caption: t('gwido.carousel00_cap2') },
      { type: 'image', src: '/gwido/images/Gwido002.png',             caption: t('gwido.carousel00_cap3') },
      { type: 'image', src: '/gwido/images/Gwido003.png',             caption: t('gwido.carousel00_cap4') },
      { type: 'image', src: '/gwido/images/Gwido004.png',             caption: t('gwido.carousel00_cap5') },
    ],
  },

  // ── Cartes résumé (Cam + Ennemi) ────────────────────────────────────────
  {
    type: 'summary-card-pair',
    summaryLabel: t('caseStudy.summary'),
    systemsLabel: t('caseStudy.systemsDeveloped'),
    cards: [
      {
        number: '01',
        label: t('gwido.card1_label'),
        title: t('gwido.card1_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [
          t('gwido.card1_char1'),
          t('gwido.card1_char2'),
          t('gwido.card1_char3'),
        ],
        problems: [
          t('gwido.card1_prob1'),
          t('gwido.card1_prob2'),
        ],
        solutions: [
          t('gwido.card1_sol1'),
          t('gwido.card1_sol2'),
        ],
        images: ['/gwido/images/Cam_Center.png', '/gwido/images/CamMoving.png'],
      },
      {
        number: '02',
        label: t('gwido.card2_label'),
        title: t('gwido.card2_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [
          t('gwido.card2_char1'),
          t('gwido.card2_char2'),
          t('gwido.card2_char3'),
        ],
        problems: [
          t('gwido.card2_prob1'),
          t('gwido.card2_prob2'),
        ],
        solutions: [
          t('gwido.card2_sol1'),
          t('gwido.card2_sol2'),
        ],
        images: ['/gwido/images/Ragesystem.png', '/gwido/images/Patrol_Enemis.png'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  //  SECTION 01 — LA CAMÉRA
  // ════════════════════════════════════════════════════════════════
  {
    type: 'section-divider',
    number: '01',
    label: t('gwido.sec01_label'),
    title: t('gwido.sec01_title'),
    description: t('gwido.sec01_desc'),
  },

  // ── Paragraphe 1 : problème de visibilité + double système ──────────────
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/gwido/images/Cam_Center.png' },
    label: t('gwido.split01_label'),
    title: t('gwido.split01_title'),
    description: t('gwido.split01_desc'),
    items: [
      t('gwido.split01_item1'),
      t('gwido.split01_item2'),
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'image', src: '/gwido/images/Compensation_Behaviour.png', caption: t('gwido.grid01_cap1') },
      { type: 'image', src: '/gwido/images/CamMoving.png',              caption: t('gwido.grid01_cap2') },
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'video', src: '/gwido/videos/CameraDistanceBehaviour.mp4', caption: t('gwido.grid02_cap1') },
      { type: 'video', src: '/gwido/videos/Compensation.mp4',            caption: t('gwido.grid02_cap2') },
    ],
  },

  // ── Paragraphe 2 : contrôleur centralisé + mode visée ──────────────────
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/gwido/images/CameraAimRotation.png' },
    label: t('gwido.split02_label'),
    title: t('gwido.split02_title'),
    description: t('gwido.split02_desc'),
  },
  {
    type: 'media-grid',
    layout: '1-full',
    items: [
      { type: 'video', src: '/gwido/videos/AimBehaviour.mp4', caption: t('gwido.grid03_cap1') },
    ],
  },

  // ── Paragraphe 3 : caméras scriptées ────────────────────────────────────
  {
    type: 'text-block',
    label: t('gwido.text01_label'),
    title: t('gwido.text01_title'),
    text: t('gwido.text01_text'),
    items: [
      t('gwido.text01_item1'),
      t('gwido.text01_item2'),
      t('gwido.text01_item3'),
    ],
    note: t('gwido.text01_note'),
  },
  // 2×2 grid d'images pour voir les 4 types en un coup d'œil
  {
    type: 'media-grid',
    layout: '2+2',
    items: [
      { type: 'image', src: '/gwido/images/CameraTriggerBetween.png',   caption: t('gwido.grid04_cap1') },
      { type: 'image', src: '/gwido/images/CameraBehaviour_Target.png', caption: t('gwido.grid04_cap2') },
      { type: 'image', src: '/gwido/images/CameraRotation_Trigger.png', caption: t('gwido.grid04_cap3') },
      { type: 'image', src: '/gwido/images/CamState.png',               caption: t('gwido.grid04_cap4') },
    ],
  },
  // Carousel justifié ici : 4 vidéos de démonstration différentes, même type de contenu
  {
    type: 'carousel',
    label: t('gwido.carousel02_label'),
    interval: 7000,
    items: [
      { type: 'video', src: '/gwido/videos/FocusBetweenTriggered.mp4',   caption: t('gwido.carousel02_cap1') },
      { type: 'video', src: '/gwido/videos/FocusTargetTriggered.mp4',    caption: t('gwido.carousel02_cap2') },
      { type: 'video', src: '/gwido/videos/CameraRotationTriggered.mp4', caption: t('gwido.carousel02_cap3') },
      { type: 'video', src: '/gwido/videos/CameraDistanceTriggered.mp4', caption: t('gwido.carousel02_cap4') },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  //  SECTION 02 — L'ENNEMI
  // ════════════════════════════════════════════════════════════════
  {
    type: 'section-divider',
    number: '02',
    label: t('gwido.sec02_label'),
    title: t('gwido.sec02_title'),
    description: t('gwido.sec02_desc'),
  },

  // ── Paragraphe 1 : FSM ──────────────────────────────────────────────────
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/gwido/images/State_Machine_lezard.png' },
    label: t('gwido.split03_label'),
    title: t('gwido.split03_title'),
    description: t('gwido.split03_desc'),
    items: [
      t('gwido.split03_item1'),
      t('gwido.split03_item2'),
      t('gwido.split03_item3'),
      t('gwido.split03_item4'),
    ],
  },

  // ── Paragraphe 2 : vision dynamique + rage ──────────────────────────────
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: '/gwido/images/Ragesystem.png' },
    label: t('gwido.split04_label'),
    title: t('gwido.split04_title'),
    description: t('gwido.split04_desc'),
  },
  {
    type: 'media-grid',
    layout: '1-full',
    items: [
      { type: 'video', src: '/gwido/videos/VisionFonctionnementDaucr.mp4', caption: t('gwido.grid05_cap1') },
    ],
  },

  // ── Paragraphe 3 : système d'attaques ───────────────────────────────────
  {
    type: 'text-block',
    label: t('gwido.text02_label'),
    title: t('gwido.text02_title'),
    text: t('gwido.text02_text'),
    items: [
      t('gwido.text02_item1'),
      t('gwido.text02_item2'),
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'image', src: '/gwido/images/DaucrMiniDash.png',  caption: t('gwido.grid06_cap1') },
      { type: 'image', src: '/gwido/images/DaucrGrandDash.png', caption: t('gwido.grid06_cap2') },
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'video', src: '/gwido/videos/AttaqueMeleeDaucr.mp4', caption: t('gwido.grid07_cap1') },
      { type: 'video', src: '/gwido/videos/AttaqueDash.mp4',       caption: t('gwido.grid07_cap2') },
    ],
  },

  // ── Paragraphe 4 : tool de patrouille ───────────────────────────────────
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/gwido/images/Patrol_Enemis.png' },
    label: t('gwido.split05_label'),
    title: t('gwido.split05_title'),
    description: t('gwido.split05_desc'),
    note: t('gwido.split05_note'),
  },
  {
    type: 'media-grid',
    layout: '1-full',
    items: [
      { type: 'video', src: '/gwido/videos/PatrolDaucr.mp4', caption: t('gwido.grid08_cap1') },
    ],
  },
];
