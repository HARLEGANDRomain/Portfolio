/**
 * Echoes Of Memories — Case Study content blocks
 * Structuré selon la documentation officielle (Documentation EOM.txt)
 * Internationalisé via i18next — les textes sont chargés via la fonction t()
 */
export const getEomContentBlocks = (t) => [

  // ── 00 · Galerie in-game ──────────────────────────────────────────────────
  {
    type: 'carousel',
    label: t('eom.carousel00_label'),
    title: 'Echoes Of Memories',
    interval: 4000,
    items: [
      { type: 'image', src: '/eom/images/Screen_Repulsion_des_amas.png', caption: t('eom.carousel00_cap1') },
      { type: 'image', src: '/eom/images/Screen_Start.png',              caption: t('eom.carousel00_cap2') },
      { type: 'image', src: '/eom/images/Screen_cube_Time_Stop.png',     caption: t('eom.carousel00_cap3') },
      { type: 'image', src: '/eom/images/Menu.png',                      caption: t('eom.carousel00_cap4') },
    ],
  },

  // ── Cartes résumé ────────────────────────────────────────────────────────
  {
    type: 'summary-card-pair',
    summaryLabel: t('caseStudy.summary'),
    systemsLabel: t('caseStudy.systemsDeveloped'),
    cards: [
      {
        number: '01',
        label: t('eom.card1_label'),
        title: t('eom.card1_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [
          t('eom.card1_char1'),
          t('eom.card1_char2'),
          t('eom.card1_char3'),
        ],
        problems: [
          t('eom.card1_prob1'),
          t('eom.card1_prob2'),
        ],
        solutions: [
          t('eom.card1_sol1'),
          t('eom.card1_sol2'),
        ],
        images: ['/eom/images/MecaniqueSonore.png'],
      },
      {
        number: '02',
        label: t('eom.card2_label'),
        title: t('eom.card2_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [
          t('eom.card2_char1'),
          t('eom.card2_char2'),
          t('eom.card2_char3'),
        ],
        problems: [
          t('eom.card2_prob1'),
          t('eom.card2_prob2'),
        ],
        solutions: [
          t('eom.card2_sol1'),
          t('eom.card2_sol2'),
        ],
        images: ['/eom/images/Mecanique_explosion.png'],
      },
    ],
  },

  // ════════════════════════════════════════════════════════════════
  //  SECTION 01 — LE JOUET, PAS LE JEU
  // ════════════════════════════════════════════════════════════════
  {
    type: 'section-divider',
    number: '01',
    label: t('eom.sec01_label'),
    title: t('eom.sec01_title'),
    description: t('eom.sec01_desc'),
  },

  // ── Paragraphe 1 : concept jouet libre + mécanique sonore ───────────────
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/eom/images/Screen_Start.png' },
    label: t('eom.split01_label'),
    title: t('eom.split01_title'),
    description: t('eom.split01_desc'),
    items: [
      t('eom.split01_item1'),
      t('eom.split01_item2'),
      t('eom.split01_item3'),
    ],
  },

  // ── Paragraphe 2 : Time Stop / Rewind ───────────────────────────────────
  {
    type: 'section-divider',
    number: '02',
    label: t('eom.sec02_label'),
    title: t('eom.sec02_title'),
    description: t('eom.sec02_desc'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: '/eom/images/Screen_cube_Time_Stop.png' },
    label: t('eom.split02_label'),
    title: t('eom.split02_title'),
    description: t('eom.split02_desc'),
    items: [
      t('eom.split02_item1'),
      t('eom.split02_item2'),
      t('eom.split02_item3'),
    ],
    note: t('eom.split02_note'),
  },

  // ── Paragraphe 3 : Trou noir ─────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '03',
    label: t('eom.sec03_label'),
    title: t('eom.sec03_title'),
    description: t('eom.sec03_desc'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: '/eom/images/Mecanique_explosion.png' },
    label: t('eom.split03_label'),
    title: t('eom.split03_title'),
    description: t('eom.split03_desc'),
    items: [
      t('eom.split03_item1'),
      t('eom.split03_item2'),
      t('eom.split03_item3'),
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'image', src: '/eom/images/MecaniqueSonore.png',           caption: t('eom.grid03_cap1') },
      { type: 'image', src: '/eom/images/Screen_Repulsion_des_amas.png', caption: t('eom.grid03_cap2') },
    ],
  },

  // ── Vidéo de gameplay ────────────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '04',
    label: t('eom.sec04_label'),
    title: t('eom.sec04_title'),
    description: t('eom.sec04_desc'),
  },
  {
    type: 'media-grid',
    layout: '1-full',
    items: [
      { type: 'video', src: '/eom/videos/Gameplay_Echoes_of_Memories.mp4', caption: t('eom.grid04_cap1') },
    ],
  },
];
