import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';

const IntroSection = () => {
  const { t } = useTranslation();

  return (
    <section id="intro" className="min-h-screen flex flex-col justify-center px-8 md:px-16 pb-24">
      <div className="max-w-xl">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 mb-8 leading-tight">
          {t('intro.headline')}{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-emerald-500">{t('intro.headlineAccent')}</span>
        </h2>
        <p className="text-lg text-slate-600 mb-6 leading-relaxed font-medium">{t('intro.description')}</p>
        <p className="text-slate-500 mb-12 leading-relaxed">{t('intro.description2')}</p>
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
