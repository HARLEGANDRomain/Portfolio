import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * BackButton — Bouton pill "Retour" flottant avec micro-interaction hover
 * Utilisé dans Identity, MentionsLegales et autres vues overlay.
 */
export const BackButton = ({
  onClick,
  label,
  className = '',
  ariaLabel,
}) => {
  const { t } = useTranslation();
  const text = label ?? t('identityPage.back') ?? 'Retour';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || (typeof text === 'string' ? text : 'Retour')}
      className={`flex items-center gap-3 text-label font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-nav-pill px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors group cursor-pointer ${className}`}
    >
      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
      <span>{text}</span>
    </button>
  );
};

export default BackButton;
