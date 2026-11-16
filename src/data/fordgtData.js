/**
 * Ford GT 2017 — Case Study content blocks
 * Source : Documentation/FORD_GT_2017/fiche-portfolio-ford-gt.md
 * IMPORTANT : Romain n'a écrit aucun code sur ce projet (tout le code a été écrit et intégré par Claude).
 * Les textes (rôles, bloc « Transparence ») doivent toujours le dire clairement.
 * Les textes sont chargés via t() (clé « fordgt.* »).
 * Règle de mise en page : chaque bloc de texte est accompagné d'une image (bloc `split`).
 */
const F = '/fordgt/images';
const SITE_URL = 'https://harlegandromain.github.io/FORD_GT_2017/';

export const getFordGtContentBlocks = (t) => [

  // ── Démo interactive : le vrai site dans un cadre ─────────────────────────
  {
    type: 'embed',
    url: SITE_URL,
    poster: `${F}/final/02-modele.webp`,
    label: t('fordgt.embed_label'),
    title: t('fordgt.embed_title'),
    description: t('fordgt.embed_desc'),
    launchLabel: t('fordgt.embed_launch'),
    openLabel: t('fordgt.embed_open'),
    desktopLabel: t('fordgt.embed_desktop'),
    mobileLabel: t('fordgt.embed_mobile'),
    switchLabel: t('fordgt.embed_switch'),
    hint: t('fordgt.embed_hint'),
    frameTitle: t('fordgt.embed_frame_title'),
  },

  // ── Résumé (même format que Gwido et Echoes Of Memories) ─────────────────
  {
    type: 'summary-card-pair',
    summaryLabel: t('caseStudy.summary'),
    systemsLabel: t('fordgt.cards_title'),
    cards: [
      {
        number: '01',
        label: t('fordgt.card1_label'),
        title: t('fordgt.card1_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [t('fordgt.card1_char1'), t('fordgt.card1_char2'), t('fordgt.card1_char3')],
        problems: [t('fordgt.card1_prob1'), t('fordgt.card1_prob2'), t('fordgt.card1_prob3')],
        solutions: [t('fordgt.card1_sol1'), t('fordgt.card1_sol2'), t('fordgt.card1_sol3')],
        images: [`${F}/final/04-histoire.webp`],
      },
      {
        number: '02',
        label: t('fordgt.card2_label'),
        title: t('fordgt.card2_title'),
        characteristicsLabel: t('caseStudy.characteristics'),
        problemsLabel: t('caseStudy.problems'),
        solutionsLabel: t('caseStudy.solutions'),
        characteristics: [t('fordgt.card2_char1'), t('fordgt.card2_char2'), t('fordgt.card2_char3')],
        problems: [t('fordgt.card2_prob1'), t('fordgt.card2_prob2'), t('fordgt.card2_prob3')],
        solutions: [t('fordgt.card2_sol1'), t('fordgt.card2_sol2'), t('fordgt.card2_sol3')],
        images: [`${F}/maquettes/02-landing-modele.webp`],
      },
    ],
  },

  // ── Transparence : ce qui est de moi / de Claude ──────────────────────────
  {
    type: 'text-block',
    label: t('fordgt.transp_label'),
    title: t('fordgt.transp_title'),
    text: t('fordgt.transp_text'),
    items: [t('fordgt.transp_item1'), t('fordgt.transp_item2'), t('fordgt.transp_item3')],
    note: t('fordgt.transp_note'),
  },

  // ── 01 · Contexte & intention ─────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '01',
    label: t('fordgt.sec01_label'),
    title: t('fordgt.sec01_title'),
    description: t('fordgt.sec01_desc'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/final/04-histoire.webp` },
    label: t('fordgt.problem_label'),
    title: t('fordgt.problem_title'),
    description: t('fordgt.problem_text'),
    items: [t('fordgt.problem_item1'), t('fordgt.problem_item2'), t('fordgt.problem_item3')],
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/final/15-sources-et-credits.webp` },
    label: t('fordgt.aud_label'),
    title: t('fordgt.aud_title'),
    description: t('fordgt.aud_desc'),
    items: [t('fordgt.aud_item1'), t('fordgt.aud_item2'), t('fordgt.aud_item3'), t('fordgt.aud_item4')],
  },

  // ── 02 · Démarche ─────────────────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '02',
    label: t('fordgt.sec02_label'),
    title: t('fordgt.sec02_title'),
    description: t('fordgt.sec02_desc'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/maquettes/03-landing-2017.webp` },
    label: t('fordgt.step1_label'),
    title: t('fordgt.step1_title'),
    description: t('fordgt.step1_desc'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/maquettes/02-landing-modele.webp` },
    label: t('fordgt.step2_label'),
    title: t('fordgt.step2_title'),
    description: t('fordgt.step2_desc'),
    items: [t('fordgt.step2_item1'), t('fordgt.step2_item2'), t('fordgt.step2_item3')],
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/maquettes/09-histoire-continue.webp` },
    label: t('fordgt.step3_label'),
    title: t('fordgt.step3_title'),
    description: t('fordgt.step3_text'),
    items: [t('fordgt.step3_item1')],
    note: t('fordgt.step3_note'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/final/05-nouvelle-ere.webp` },
    label: t('fordgt.step4_label'),
    title: t('fordgt.step4_title'),
    description: t('fordgt.step4_desc'),
    items: [t('fordgt.step4_item1'), t('fordgt.step4_item2')],
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/final/09-derniere-edition.webp` },
    label: t('fordgt.step5_label'),
    title: t('fordgt.step5_title'),
    description: t('fordgt.step5_text'),
  },

  // ── 03 · Maquette → site ──────────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '03',
    label: t('fordgt.sec03_label'),
    title: t('fordgt.sec03_title'),
    description: t('fordgt.sec03_desc'),
  },
  {
    type: 'media-grid',
    layout: '3col',
    label: t('fordgt.screens_label'),
    items: [
      { type: 'image', src: `${F}/maquettes/01-intro.webp`, caption: t('fordgt.s01'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/02-landing-modele.webp`, caption: t('fordgt.s02'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/03-landing-2017.webp`, caption: t('fordgt.s03'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/04-course-en-heritage.webp`, caption: t('fordgt.s04'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/05-nouvelle-ere.webp`, caption: t('fordgt.s05'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/06-rare-par-nature.webp`, caption: t('fordgt.s06'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/07-vision-a-la-route.webp`, caption: t('fordgt.s07'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/08-le-mans-encore.webp`, caption: t('fordgt.s08'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/09-histoire-continue.webp`, caption: t('fordgt.s09'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/10-galerie-avant.webp`, caption: t('fordgt.s10'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/11-galerie-arriere.webp`, caption: t('fordgt.s11'), aspect: 'aspect-[1280/1080]' },
      { type: 'image', src: `${F}/maquettes/12-galerie-detail.webp`, caption: t('fordgt.s12'), aspect: 'aspect-[1280/1080]' },
    ],
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'image', src: `${F}/maquettes/04-course-en-heritage.webp`, caption: t('fordgt.grid03_maq',   { name: t('fordgt.name_heritage') }) },
      { type: 'image', src: `${F}/final/04-histoire.webp`,               caption: t('fordgt.grid03_final', { name: t('fordgt.name_heritage') }) },
      { type: 'image', src: `${F}/maquettes/07-vision-a-la-route.webp`,  caption: t('fordgt.grid03_maq',   { name: t('fordgt.name_vision') }) },
      { type: 'image', src: `${F}/final/07-performances.webp`,           caption: t('fordgt.grid03_final', { name: t('fordgt.name_vision') }) },
      { type: 'image', src: `${F}/maquettes/08-le-mans-encore.webp`,     caption: t('fordgt.grid03_maq',   { name: t('fordgt.name_lemans') }) },
      { type: 'image', src: `${F}/final/08-le-mans.webp`,                caption: t('fordgt.grid03_final', { name: t('fordgt.name_lemans') }) },
    ],
  },
  {
    type: 'media-grid',
    layout: '3col',
    items: [
      { type: 'image', src: `${F}/maquettes-mobile/08.webp`,      caption: t('fordgt.grid03m_cap1'), aspect: 'aspect-[9/19]' },
      { type: 'image', src: `${F}/final-mobile/08-le-mans.webp`,  caption: t('fordgt.grid03m_cap2'), aspect: 'aspect-[9/19]' },
      { type: 'image', src: `${F}/final-mobile/16-menu.webp`,     caption: t('fordgt.grid03m_cap3'), aspect: 'aspect-[9/19]' },
    ],
  },

  // ── 04 · Décisions & difficultés ──────────────────────────────────────────
  {
    type: 'section-divider',
    number: '04',
    label: t('fordgt.sec04_label'),
    title: t('fordgt.sec04_title'),
    description: t('fordgt.sec04_desc'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/final/01-intro-phares.webp` },
    label: t('fordgt.dec1_label'),
    title: t('fordgt.dec1_title'),
    description: t('fordgt.dec1_desc'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/final/06-fabrication.webp` },
    label: t('fordgt.dec2_label'),
    title: t('fordgt.dec2_title'),
    description: t('fordgt.dec2_desc'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/final/03-presentation.webp` },
    label: t('fordgt.dec3_label'),
    title: t('fordgt.dec3_title'),
    description: t('fordgt.dec3_desc'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/final/10-galerie-avant.webp` },
    label: t('fordgt.dec4_label'),
    title: t('fordgt.dec4_title'),
    description: t('fordgt.dec4_desc'),
  },
  {
    type: 'media-grid',
    layout: '2col',
    items: [
      { type: 'image', src: `${F}/final/11-galerie-profil.webp`,       caption: t('fordgt.gal_cap2') },
      { type: 'image', src: `${F}/final/13-galerie-detail-roue.webp`,  caption: t('fordgt.gal_cap3') },
    ],
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/final/12-galerie-arriere.webp` },
    label: t('fordgt.diff_label'),
    title: t('fordgt.diff_title'),
    description: t('fordgt.diff_desc'),
    items: [t('fordgt.diff_item1'), t('fordgt.diff_item2'), t('fordgt.diff_item3'), t('fordgt.diff_item4'), t('fordgt.diff_item5')],
  },

  // ── 05 · Bilan ────────────────────────────────────────────────────────────
  {
    type: 'section-divider',
    number: '05',
    label: t('fordgt.sec05_label'),
    title: t('fordgt.sec05_title'),
    description: t('fordgt.sec05_desc'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/final/14-fin.webp` },
    label: t('fordgt.res_label'),
    title: t('fordgt.res_title'),
    description: t('fordgt.res_text'),
  },
  {
    type: 'split',
    layout: 'media-right',
    media: { type: 'image', src: `${F}/maquettes/05-nouvelle-ere.webp` },
    label: t('fordgt.learn_label'),
    title: t('fordgt.learn_title'),
    description: t('fordgt.learn_desc'),
    items: [t('fordgt.learn_item1'), t('fordgt.learn_item2'), t('fordgt.learn_item3'), t('fordgt.learn_item4')],
    note: t('fordgt.learn_note'),
  },
  {
    type: 'split',
    layout: 'media-left',
    media: { type: 'image', src: `${F}/maquettes/10-galerie-avant.webp` },
    label: t('fordgt.next_label'),
    title: t('fordgt.next_title'),
    description: t('fordgt.next_desc'),
    items: [t('fordgt.next_item1'), t('fordgt.next_item2'), t('fordgt.next_item3')],
  },
];
