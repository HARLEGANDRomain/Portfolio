import React from 'react';
import { useTranslation } from 'react-i18next';
import RouteLink from '../ui/RouteLink';

const prefetchIdentity = () => import('../Identity');

const scrollToId = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

/** Liens de navigation partagés par le header et la pilule flottante. */
const NavLinks = ({ activeSection, underline }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith('fr') ? 'fr' : 'en';
  // Variante header : tous les éléments ont une bordure basse de 2 px (transparente si inactifs), sinon l'élément
  // actif serait 2 px plus haut que les autres et sa ligne de base serait décalée
  const activeCls = underline ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-indigo-600';
  const idleCls = underline ? 'text-slate-600 border-b-2 border-transparent' : 'text-slate-500';
  const sectionCls = (id) => `hover:text-indigo-600 transition-colors ${activeSection === id ? activeCls : idleCls}`;

  return (
    <>
      <RouteLink to="identity" onMouseEnter={prefetchIdentity} onFocus={prefetchIdentity} className={`${idleCls} normal-case whitespace-nowrap hover:text-indigo-600 transition-colors`}>
        {t('nav.identity')}
      </RouteLink>
      <button type="button" onClick={() => scrollToId('projects')} className={sectionCls('projects')}>{t('nav.works')}</button>
      <button type="button" onClick={() => scrollToId('contact')} className={sectionCls('contact')}>{t('nav.contact')}</button>
      <span className="text-slate-300" aria-hidden="true">|</span>
      <button
        type="button"
        onClick={() => i18n.changeLanguage(lang === 'fr' ? 'en' : 'fr')}
        className={`flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors ${underline ? 'border-b-2 border-transparent' : ''}`}
        aria-label={t('nav.switchLanguage')}
      >
        <span className={lang === 'fr' ? 'text-indigo-600' : ''}>FR</span>
        <span className="text-slate-300" aria-hidden="true">/</span>
        <span className={lang === 'en' ? 'text-indigo-600' : ''}>EN</span>
      </button>
    </>
  );
};

/**
 * Pilule de navigation flottante : apparaît après 80 px de défilement.
 * Rendue hors de <main> pour passer au-dessus de la vague.
 */
export const FloatingNav = ({ activeSection, visible }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 flex justify-center transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8 pointer-events-none invisible'
      }`}
    >
      <nav aria-label={t('nav.label')} className="flex items-center gap-6 text-label uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-nav-pill px-8 py-4 rounded-full border border-slate-200">
        <NavLinks activeSection={activeSection} />
      </nav>
    </div>
  );
};

/** Header en haut de la colonne de gauche (dans <main>, sous les pages overlay). */
export const SiteHeader = ({ activeSection }) => {
  const { t } = useTranslation();

  return (
      <header className="absolute top-0 left-0 w-full md:w-[70%] px-8 md:px-16 py-8 md:py-16 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-8 z-header">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter whitespace-nowrap leading-none mb-4">
            <a href={import.meta.env.BASE_URL} onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              HARLEGAND Romain
            </a>
          </h1>
          <p className="font-semibold text-slate-500 uppercase tracking-[0.2em] text-[10px]">
            {t('intro.subtitle')}
          </p>
          {/* Situation actuelle (alternance + formation). Sur desktop la rangée a une largeur nulle et déborde à droite
              pour tenir sur une ligne sans élargir la colonne du nom, donc sans pousser le menu */}
          <ul aria-label={t('intro.statusLabel')} className="mt-4 flex flex-wrap items-center gap-2 sm:w-0 sm:flex-nowrap sm:whitespace-nowrap [&>li]:shrink-0">
            <li className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-emerald-700 pr-1">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {t('intro.inProgress')}
            </li>
            {t('intro.status', { returnObjects: true }).map((item) => (
              <li key={item} className="text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label={t('nav.label')} className="mt-8 sm:mt-0 flex items-baseline gap-6 md:gap-8 text-label md:text-xs uppercase tracking-widest">
          <NavLinks activeSection={activeSection} underline />
        </nav>
      </header>
  );
};
