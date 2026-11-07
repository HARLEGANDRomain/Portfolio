import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const WORD = 'PORTFOLIO';

/**
 * Écran d'accueil animé, affiché une fois par session.
 * Visuellement identique au splash statique de index.html (mêmes classes .lcp-*).
 * Se ferme au clic n'importe où, ou au clavier (Entrée, Espace, Échap).
 */
const Splash = ({ visible, onExplore, reducedMotion }) => {
  const { t } = useTranslation();
  const [typed, setTyped] = useState(reducedMotion ? WORD : '');
  const buttonRef = useRef(null);

  // Effet machine à écrire
  useEffect(() => {
    if (reducedMotion) { setTyped(WORD); return undefined; }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(WORD.slice(0, i));
      if (i >= WORD.length) clearInterval(id);
    }, 120);
    return () => clearInterval(id);
  }, [reducedMotion]);

  // Accessibilité clavier
  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true });
    const onKey = (e) => {
      if (['Enter', ' ', 'Escape'].includes(e.key)) {
        e.preventDefault();
        onExplore();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExplore]);

  return (
    <div className="fixed inset-0 z-splash pointer-events-none">
      {/* Clic n'importe où = Explorer */}
      <div className="absolute inset-0 pointer-events-auto" onClick={onExplore} aria-hidden="true" />

      <div
        className="splash-text absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div className="lcp-content pointer-events-auto">
          <p className="lcp-title" aria-label={WORD}>
            <span aria-hidden="true">{typed}</span>
            <span className="lcp-cursor" aria-hidden="true">_</span>
          </p>
          <p className="lcp-name">HARLEGAND Romain</p>
          <p className="lcp-desc">{t('common.roles')}</p>
          <button ref={buttonRef} type="button" onClick={onExplore} className="lcp-btn group">
            {t('splash.explore')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Splash;
