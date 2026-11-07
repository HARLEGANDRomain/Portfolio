import React, { createContext, useContext } from 'react';
import { pathFromKey } from '../../routes';

/** Fournit navigate(key) aux liens internes (cf. useOverlayRouter). */
export const NavigationContext = createContext({ navigate: () => {}, prefetch: {} });
export const useNavigation = () => useContext(NavigationContext);

/**
 * Lien interne : un vrai <a href> (clic molette / Ctrl+clic → nouvel onglet, partage, clavier)
 * dont le clic simple déclenche la transition par la vague au lieu d'un rechargement.
 */
const RouteLink = ({ to, onClick, onMouseEnter, children, ...rest }) => {
  const { navigate } = useNavigation();

  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={pathFromKey(to, import.meta.env.BASE_URL)} onClick={handleClick} onMouseEnter={onMouseEnter} {...rest}>
      {children}
    </a>
  );
};

export default RouteLink;
