import ReactGA from "react-ga4";

const MEASUREMENT_ID = "G-XS8TTJGWXQ";

/**
 * Initializes Google Analytics 4
 */
export const initGA = () => {
  ReactGA.initialize(MEASUREMENT_ID);
  console.log("GA4 Initialized");
};

/**
 * Tracks a page view or a section change
 * @param {string} path - The path or section name (e.g., '/projects')
 * @param {string} title - The title of the page/section
 */
export const trackPageView = (path, title) => {
  ReactGA.send({ hitType: "pageview", page: path, title: title });
};

/**
 * Tracks a custom event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 */
export const trackEvent = (category, action, label) => {
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
