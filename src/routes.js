/**
 * Routes du portfolio — source unique utilisée par :
 *  - l'app (useOverlayRouter) pour lire / écrire l'URL
 *  - vite.config.js pour générer une page HTML statique par route au build
 *    (GitHub Pages renvoie alors un vrai 200 sur /projets/gwido/, etc.)
 *
 * Pas de JSX ici : ce fichier est importé par Node au build.
 *
 * Une "overlay key" décrit la page affichée par-dessus l'accueil :
 *   null                 → accueil
 *   'project:<slug>'     → étude de cas
 *   'identity'           → page Identité
 *   'legal'              → mentions légales
 */

export const SITE_NAME = 'HARLEGAND Romain';

export const ROUTES = [
  { key: null, path: '/', title: 'Portfolio - HARLEGAND Romain | UX/UI Designer & Technical Game Designer' },
  { key: 'project:gwido', path: '/projets/gwido/', title: 'Gwido — Étude de cas | HARLEGAND Romain' },
  { key: 'project:echoes-of-memories', path: '/projets/echoes-of-memories/', title: 'Echoes Of Memories — Étude de cas | HARLEGAND Romain' },
  { key: 'identity', path: '/identite/', title: 'Identité | HARLEGAND Romain' },
  { key: 'legal', path: '/mentions-legales/', title: 'Mentions légales | HARLEGAND Romain' },
];

const normalize = (p) => {
  const trimmed = p.replace(/\/+$/, '');
  return trimmed === '' ? '/' : `${trimmed}/`;
};

/** Chemin relatif au base (ex. '/projets/gwido/') → overlay key (ou null si accueil / inconnu). */
export const keyFromPath = (pathname, base = '/') => {
  let rel = pathname;
  const baseNoSlash = base.replace(/\/$/, '');
  if (baseNoSlash && rel.startsWith(baseNoSlash)) rel = rel.slice(baseNoSlash.length);
  const path = normalize(rel || '/');
  const route = ROUTES.find((r) => r.path === path);
  return route ? route.key : null;
};

/** Overlay key → chemin complet avec le base (ex. '/Portfolio/identite/'). */
export const pathFromKey = (key, base = '/') => {
  const route = ROUTES.find((r) => r.key === key) ?? ROUTES[0];
  return `${base.replace(/\/$/, '')}${route.path}`;
};

export const isKnownPath = (pathname, base = '/') => {
  let rel = pathname;
  const baseNoSlash = base.replace(/\/$/, '');
  if (baseNoSlash && rel.startsWith(baseNoSlash)) rel = rel.slice(baseNoSlash.length);
  return ROUTES.some((r) => r.path === normalize(rel || '/'));
};

export const projectKey = (slug) => `project:${slug}`;
export const slugFromKey = (key) => (key?.startsWith('project:') ? key.slice('project:'.length) : null);
