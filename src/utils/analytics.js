/**
 * Utilitaires Analytics - Adapté pour Cloudflare Web Analytics (sans cookies)
 * Cloudflare Web Analytics mesure l'audience de façon anonyme et automatique via sa balise.
 */

export const initGA = () => {
  // Inactif : Remplacé par Cloudflare Web Analytics
};

/**
 * Met à jour le titre du document lors d'un changement de section / projet (pour l'historique et les analytics)
 * @param {string} path - Le chemin ou nom de section
 * @param {string} title - Le titre de la vue
 */
export const trackPageView = (path, title) => {
  if (title && typeof document !== 'undefined') {
    // Si souhaité, met à jour le titre de l'onglet
    // document.title = title;
  }
};

/**
 * Fonction conservée pour éviter tout effet de bord sur le code existant
 */
export const trackEvent = (category, action, label) => {
  // Pas d'événement personnalisé requis avec Cloudflare Web Analytics standard
};

