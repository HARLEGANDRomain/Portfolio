import React, { useEffect } from 'react';
import BackButton from './BackButton';

/**
 * OverlayPage — Layout commun aux pages de type overlay (Identity, Mentions Légales, etc.)
 * Gère :
 * - Le reset automatique du scroll en haut de page à l'ouverture
 * - Le fond de points standardisé (bg-dots + bg-dots-tracker)
 * - Le bouton flottant "Retour" (BackButton) en position sticky/fixe
 * - La structure sémantique et responsive
 */
export const OverlayPage = ({
  onBack,
  backLabel,
  showBackButton = true,
  children,
  className = '',
  contentClassName = '',
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={`min-h-screen w-full bg-white text-slate-900 font-sans relative flex flex-col overflow-x-hidden ${className}`}>
      {/* Fixed Background dots matching landing page DA */}
      <div className="fixed inset-0 pointer-events-none z-[0]">
        <div className="absolute inset-0 bg-dots">
          <div className="bg-dots-tracker" />
        </div>
      </div>

      {/* Floating Back Button */}
      {showBackButton && onBack && (
        <div className="fixed top-6 left-6 md:left-12 z-50">
          <BackButton onClick={onBack} label={backLabel} />
        </div>
      )}

      {/* Main Content Area */}
      <main className={`relative z-10 w-full flex-grow flex flex-col ${contentClassName}`}>
        {children}
      </main>
    </div>
  );
};

export default OverlayPage;
