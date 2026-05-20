import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

const customStyles = [
    ".bg-dots { background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px); background-size: 24px 24px; background-color: #ffffff; }",
    ".bg-dots-tracker { --dot-radius: 80px; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(#64748b 1.5px, transparent 1.5px); background-size: 24px 24px; mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); -webkit-mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); }"
].join("\n");

const MentionsLegales = ({ onBack }) => {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans relative flex flex-col overflow-x-hidden pb-32">
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Fixed Background dots matching landing page DA */}
      <div className="fixed inset-0 pointer-events-none z-[0]">
         <div className="absolute inset-0 bg-dots">
             <div className="bg-dots-tracker"></div>
         </div>
      </div>
      
      {/* Floating Back Button */}
      <div className="fixed top-6 left-6 md:left-12 z-50">
        <button 
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.1)] px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('identityPage.back') || 'Retour'}
        </button>
      </div>

      {/* Top Section */}
      <div className="w-full flex-shrink-0 relative z-10 pt-32 px-8 md:px-16 flex flex-col justify-center items-center">
        <div className="max-w-4xl w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">
            Informations Légales
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#0f172a] mb-12">
            Mentions Légales
          </h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f172a] mb-4">1. Éditeur du site</h2>
                <p>Créateur et Éditeur : HARLEGAND Romain</p>
                <p>Contact : <a href="mailto:rharlegand@gmail.com" className="text-indigo-600 hover:underline">rharlegand@gmail.com</a></p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f172a] mb-4">2. Hébergement</h2>
                <p>Le site est hébergé par GitHub Pages.</p>
                <p>GitHub Inc.</p>
                <p>88 Colin P Kelly Jr St</p>
                <p>San Francisco, CA 94107</p>
                <p>États-Unis</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f172a] mb-4">3. Propriété Intellectuelle</h2>
                <p>L'ensemble du contenu de ce site (textes, images, vidéos, animations, code source, etc.) est la propriété exclusive de HARLEGAND Romain, sauf mention contraire explicite. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de HARLEGAND Romain.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f172a] mb-4">4. Collecte de données et Cookies</h2>
                <p>Ce site utilise <strong>Google Analytics</strong> pour suivre le trafic et analyser les pages visitées afin d'améliorer l'expérience utilisateur. Les données collectées sont anonymisées et ne permettent pas d'identifier personnellement les visiteurs.</p>
                <p>En naviguant sur ce site, vous acceptez l'utilisation de ces cookies à des fins de mesure d'audience.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentionsLegales;
