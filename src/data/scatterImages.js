/**
 * Images du fond « éparpillé » (zone de droite de l'accueil).
 *
 *  - pool    : toutes les images qui peuplent le plan (désaturées au repos).
 *  - cluster : le sous-ensemble qui se rassemble quand le projet est sélectionné.
 *              La 1re image est l'image principale (au centre, plus grande).
 *  - seed    : graine PROPRE AU PROJET qui décide de la forme de son nuage (orientation, sens d'enroulement,
 *              tailles). Deux projets avec la même graine et le même nombre d'images auraient le même nuage :
 *              donner une graine différente à chacun. Gwido = 1 (disposition d'origine, ne pas changer).
 *              Pour en choisir une : essayer 2, 3, 4… et regarder l'accueil, ou le labo (lab.html).
 *
 * Les listes ci-dessous nomment les images ORIGINALES (celles des études de cas). Le site charge des
 * MINIATURES WebP générées dans public/scatter/ par `npm run build:scatter` (scripts/build-scatter-thumbs.mjs)
 * — pensez à relancer cette commande après avoir ajouté une image, puis à committer public/scatter/.
 *
 * Pour ajouter un schéma ou une capture : l'ajouter au pool, et dans `cluster` si elle doit faire partie de
 * l'amas. Format attendu ≈ 16:9 (les images sont recadrées en object-cover).
 */
const RAW = {
  gwido: {
    seed: 1,
    pool: [
      '/gwido/images/Image_Menu_Sans_Logo.webp',
      '/gwido/images/Gwido001.webp',
      '/gwido/images/Gwido002.webp',
      '/gwido/images/Gwido003.webp',
      '/gwido/images/Gwido004.webp',
      '/gwido/images/Gwido005.webp',
      '/gwido/images/Gwido006.webp',
      '/gwido/images/Gwido007.webp',
      '/gwido/images/Gwido008.webp',
      '/gwido/images/Gwido009.webp',
    ],
    cluster: [
      '/gwido/images/Image_Menu_Sans_Logo.webp',
      '/gwido/images/Gwido001.webp',
      '/gwido/images/Gwido002.webp',
      '/gwido/images/Gwido004.webp',
      '/gwido/images/Gwido005.webp',
      '/gwido/images/Gwido007.webp',
      '/gwido/images/Gwido009.webp',
    ],
  },
  'echoes-of-memories': {
    seed: 6,
    pool: [
      '/eom/images/Menu.png',
      '/eom/images/Screen_cube_Time_Stop.png',
      '/eom/images/Screen_Repulsion_des_amas.png',
      '/eom/images/Screen_Start.png',
      '/eom/images/Start.png',
    ],
    cluster: [
      '/eom/images/Menu.png',
      '/eom/images/Screen_cube_Time_Stop.png',
      '/eom/images/Screen_Repulsion_des_amas.png',
      '/eom/images/Screen_Start.png',
      '/eom/images/Start.png',
    ],
  },
  'ford-gt-2017': {
    seed: 9,
    pool: [
      '/fordgt/images/final/02-modele.webp',
      '/fordgt/images/final/03-presentation.webp',
      '/fordgt/images/final/04-histoire.webp',
      '/fordgt/images/final/05-nouvelle-ere.webp',
      '/fordgt/images/final/06-fabrication.webp',
      '/fordgt/images/final/07-performances.webp',
      '/fordgt/images/final/08-le-mans.webp',
      '/fordgt/images/final/09-derniere-edition.webp',
      '/fordgt/images/final/10-galerie-avant.webp',
      '/fordgt/images/final/11-galerie-profil.webp',
      '/fordgt/images/final/12-galerie-arriere.webp',
      '/fordgt/images/final/13-galerie-detail-roue.webp',
    ],
    cluster: [
      '/fordgt/images/final/02-modele.webp',
      '/fordgt/images/final/05-nouvelle-ere.webp',
      '/fordgt/images/final/04-histoire.webp',
      '/fordgt/images/final/07-performances.webp',
      '/fordgt/images/final/08-le-mans.webp',
      '/fordgt/images/final/10-galerie-avant.webp',
      '/fordgt/images/final/09-derniere-edition.webp',
    ],
  },
};

/** '/gwido/images/Gwido001.webp' → '/scatter/gwido/Gwido001.webp' (toujours en .webp) */
export const thumbOf = (src) =>
  '/scatter' + src.replace(/^\/(gwido|eom|fordgt)\/images\//, '/$1/').replace(/\.(png|jpe?g|webp)$/i, '.webp');

const mapThumbs = (list) => list.map(thumbOf);

export const SCATTER_PROJECTS = Object.fromEntries(
  Object.entries(RAW).map(([slug, p]) => [slug, { pool: mapThumbs(p.pool), cluster: mapThumbs(p.cluster), seed: p.seed ?? 1 }])
);

/** Toutes les images du plan, avec le projet auquel elles appartiennent. */
export const scatterPool = () =>
  Object.entries(SCATTER_PROJECTS).flatMap(([slug, p]) => p.pool.map((src) => ({ src, slug })));

/** Paires { from, to } (chemins relatifs à public/) : utilisé par scripts/build-scatter-thumbs.mjs */
export const scatterSourceFiles = () =>
  [...new Set(Object.values(RAW).flatMap((p) => p.pool))].map((from) => ({ from, to: thumbOf(from) }));
