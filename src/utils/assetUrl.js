/**
 * Préfixe un chemin de /public avec le base Vite ('/Portfolio/').
 * '/gwido/images/x.webp' → '/Portfolio/gwido/images/x.webp'
 * Les URLs absolues (http…) et les chemins déjà préfixés sont renvoyés tels quels.
 */
export const assetUrl = (path) => {
  if (!path) return path;
  const base = import.meta.env.BASE_URL;
  if (path.startsWith(base) || /^https?:\/\//.test(path)) return path;
  if (path.startsWith('/')) return (base + path.slice(1)).replace(/\/+/g, '/');
  return path;
};

export default assetUrl;
