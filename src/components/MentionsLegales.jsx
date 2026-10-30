import React from 'react';
import OverlayPage from './ui/OverlayPage';

const MentionsLegales = ({ onBack }) => {
  return (
    <OverlayPage onBack={onBack} className="pb-32">
      {/* Top Section */}
      <div className="w-full flex-shrink-0 relative z-10 pt-32 px-8 md:px-16 flex flex-col justify-center items-center">
        <div className="max-w-4xl w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">
            Informations Légales
          </p>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900 mb-12">
            Mentions Légales
          </h1>
          
          <div className="space-y-8 text-slate-600 leading-relaxed font-medium">
            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">1. Éditeur du site</h2>
                <p>Créateur et Éditeur : HARLEGAND Romain</p>
                <p>Contact : <a href="mailto:rharlegand@gmail.com" className="text-indigo-600 hover:underline">rharlegand@gmail.com</a></p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">2. Hébergement</h2>
                <p>Le site est hébergé par GitHub Pages.</p>
                <p>GitHub Inc.</p>
                <p>88 Colin P Kelly Jr St</p>
                <p>San Francisco, CA 94107</p>
                <p>États-Unis</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">3. Propriété Intellectuelle</h2>
                <p>L'ensemble du contenu de ce site (textes, images, vidéos, animations, code source, etc.) est la propriété exclusive de HARLEGAND Romain, sauf mention contraire explicite. Toute reproduction, distribution, modification, adaptation, retransmission ou publication, même partielle, de ces différents éléments est strictement interdite sans l'accord exprès par écrit de HARLEGAND Romain.</p>
            </section>

            <section>
                <h2 className="text-2xl font-bold uppercase tracking-tighter text-slate-900 mb-4">4. Données personnelles et Cookies</h2>
                <p className="mb-3">Ce site respecte votre vie privée et <strong>ne dépose aucun cookie</strong> publicitaire, de pistage ou de profilage sur votre appareil.</p>
                <p className="mb-3">Pour mesurer l'audience et la consultation des projets (pages vues, pays, type d'appareil), ce site utilise <strong>Cloudflare Web Analytics</strong>.</p>
                <p>Conformément aux directives de la CNIL et au RGPD, cette solution de mesure d'audience est strictement anonyme, fonctionne <strong>sans aucun cookie</strong> et ne collecte aucune donnée personnelle identifiable. Par conséquent, l'affichage d'un bandeau de consentement n'est pas nécessaire.</p>
            </section>
          </div>
        </div>
      </div>
    </OverlayPage>
  );
};

export default MentionsLegales;

