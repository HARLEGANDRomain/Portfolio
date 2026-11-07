import React from 'react';
import { useTranslation } from 'react-i18next';
import OverlayPage from './ui/OverlayPage';

const Strong = ({ children }) => <strong>{children}</strong>;

/** Rend un texte de traduction contenant des passages entre **…** en gras. */
const Rich = ({ text }) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <Strong key={i}>{part.slice(2, -2)}</Strong> : <React.Fragment key={i}>{part}</React.Fragment>
  );

const MentionsLegales = ({ onBack }) => {
  const { t } = useTranslation();
  const host = t('legal.hostLines', { returnObjects: true });
  const privacy = t('legal.privacyParagraphs', { returnObjects: true });

  return (
    <OverlayPage onBack={onBack} className="pb-32">
      <div className="w-full flex-shrink-0 relative z-10 pt-32 px-8 md:px-16 flex flex-col justify-center items-center">
        <div className="max-w-4xl w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4">{t('legal.label')}</p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-12">{t('legal.title')}</h1>

          <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
            <section>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">{t('legal.publisherTitle')}</h2>
              <p>{t('legal.publisher')}</p>
              <p>
                {t('legal.contact')}{' '}
                <a href="mailto:rharlegand@gmail.com" className="text-indigo-600 hover:underline">rharlegand@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">{t('legal.hostTitle')}</h2>
              {Array.isArray(host) && host.map((line) => <p key={line}>{line}</p>)}
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">{t('legal.ipTitle')}</h2>
              <p>{t('legal.ip')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">{t('legal.privacyTitle')}</h2>
              {Array.isArray(privacy) && privacy.map((para, i) => (
                <p key={i} className={i < privacy.length - 1 ? 'mb-3' : ''}><Rich text={para} /></p>
              ))}
            </section>
          </div>
        </div>
      </div>
    </OverlayPage>
  );
};

export default MentionsLegales;
