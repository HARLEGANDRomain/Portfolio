import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Linkedin, Github } from 'lucide-react';
import RouteLink from '../ui/RouteLink';

const prefetchLegal = () => import('../MentionsLegales');

const ContactSection = () => {
  const { t } = useTranslation();

  return (
    <section id="contact" className="relative min-h-[80vh] flex flex-col justify-center px-8 md:px-16 py-24 border-t border-slate-100">
      <div className="max-w-xl">
        <h2 className="text-label uppercase tracking-widest text-indigo-600 mb-4">{t('contact.label')}</h2>
        <p className="text-slate-600 text-lg mb-12">{t('contact.text')}</p>

        <div className="flex flex-col sm:flex-row gap-6">
          <a href="mailto:rharlegand@gmail.com" className="flex justify-center items-center gap-3 bg-indigo-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-colors w-full sm:w-auto">
            <Mail className="w-4 h-4" aria-hidden="true" /> {t('contact.cta')}
          </a>
          <div className="flex gap-4 w-full sm:w-auto justify-center">
            <a href="https://www.linkedin.com/in/romain-harlegand/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex justify-center items-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 px-6 py-4 transition-colors">
              <Linkedin className="w-5 h-5" aria-hidden="true" />
            </a>
            <a href="https://github.com/HARLEGANDRomain" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex justify-center items-center bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-400 px-6 py-4 transition-colors">
              <Github className="w-5 h-5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 left-8 md:left-16 z-50">
        <RouteLink
          to="legal"
          onMouseEnter={prefetchLegal}
          onFocus={prefetchLegal}
          className="text-label uppercase tracking-widest text-slate-500 hover:text-indigo-600 transition-colors"
        >
          {t('footer.legal')}
        </RouteLink>
      </footer>
    </section>
  );
};

export default ContactSection;
