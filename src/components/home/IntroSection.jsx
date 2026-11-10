import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const IntroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="intro" className="min-h-screen flex flex-col justify-center px-8 md:px-16 pb-24">
      <div className="max-w-xl">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-8 leading-tight whitespace-pre-line">
          {t('intro.headline')}
          {/* Chaque question tient sur une ligne (retours à la ligne dans la traduction) : taille réduite et fluide selon la largeur ; même graisse que la 1re phrase ; l'espacement des lettres est redéclaré (tracking-tighter = -0.05em de SA taille), sinon le h2 transmet -2.4px fixes, trop serrés à cette taille */}
          <span className="block mt-3 leading-snug tracking-tighter text-[clamp(1.2rem,5.1vw,2.25rem)] md:text-[clamp(1.25rem,2.5vw,2.25rem)] text-transparent bg-clip-text bg-gradient-to-b from-indigo-500 to-emerald-500">{t('intro.headlineAccent')}</span>
        </h2>
        <p className="text-lg text-slate-600 mb-12 leading-relaxed font-medium text-pretty">{t('intro.description')}</p>
        <button
          type="button"
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest border-b-2 border-slate-900 pb-1 hover:text-indigo-600 hover:border-indigo-600 transition-colors group"
        >
          {t('intro.cta')} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
};

export default IntroSection;
