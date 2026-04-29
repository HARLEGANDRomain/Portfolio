import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';

const customStyles = [
    ".bg-dots { background-image: radial-gradient(#e2e8f0 1.5px, transparent 1.5px); background-size: 24px 24px; background-color: #ffffff; }",
    ".bg-dots-tracker { --dot-radius: 80px; position: absolute; inset: 0; pointer-events: none; z-index: 0; background-image: radial-gradient(#64748b 1.5px, transparent 1.5px); background-size: 24px 24px; mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); -webkit-mask-image: radial-gradient(circle var(--dot-radius) at var(--mouse-client-x, -200px) var(--mouse-client-y, -200px), black 0%, transparent 100%); }"
].join("\n");

const Identity = ({ onBack }) => {
  const { t } = useTranslation();
  const wavePathTopRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let animationFrameId;
    const renderWave = (time) => {
      const segments = 60;
      let dTop = '';
      for (let i = 0; i <= segments; i++) {
        const x = i / segments;
        // Subtle wave matching the landing page style
        const baseAngle = 0.1 - (x * 0.05); 
        const waveOffset = 0.02 * Math.sin(x * Math.PI * 4 - time * 0.001);
        const yTop = baseAngle + waveOffset;
        
        if (i === 0) { dTop += `M ${x},${yTop} `; } 
        else { dTop += `L ${x},${yTop} `; }
      }
      dTop += "L 1,1 L 0,1 Z";
      
      if (wavePathTopRef.current) {
        wavePathTopRef.current.setAttribute('d', dTop);
      }
      animationFrameId = requestAnimationFrame(renderWave);
    };
    animationFrameId = requestAnimationFrame(renderWave);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white text-slate-900 font-sans relative flex flex-col overflow-x-hidden">
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
          {t('identityPage.back')}
        </button>
      </div>

      {/* Top Section */}
      <div className="w-full flex-shrink-0 relative z-10 pt-32 pb-40 md:pb-52 px-8 md:px-16 flex flex-col justify-center items-center min-h-[75vh]">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          
          <div className="col-span-1 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-500 mb-4">
              {t('nav.identity')}
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#0f172a] mb-8">
              {t('identityPage.whoAmI')}
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-3xl font-medium whitespace-pre-line">
              {t('identityPage.whoAmIDesc')}
            </p>
          </div>

          <div className="col-span-1 md:border-l-2 md:border-slate-200 md:pl-8 flex flex-col justify-start">
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-[#0f172a] mb-6">
              {t('identityPage.diplomas')}
            </h2>
            <div className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all hover:-translate-y-1">
                <p className="font-bold text-[10px] uppercase tracking-widest text-indigo-600 mb-2">Diplôme obtenu</p>
                <p className="text-xl font-black text-[#0f172a] mb-2 leading-tight">{t('identityPage.diplomaName')}</p>
                <p className="text-sm font-bold text-slate-700 mb-3">{t('identityPage.diplomaSchool')}</p>
                <p className="text-xs text-slate-500 font-medium bg-slate-100 inline-block px-3 py-1.5 rounded-md border border-slate-200">{t('identityPage.diplomaSub')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section with Wave */}
      {/* mt-[-15vh] pulls it up to overlap the top section, creating the split effect */}
      <div 
        className="w-full flex-grow relative z-20 bg-transparent mt-[-15vh] md:mt-[-25vh] min-h-[60vh] flex flex-col" 
        style={{ filter: "drop-shadow(0px -10px 40px rgba(0,0,0,0.3))" }}
      >
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <clipPath id="wave-top" clipPathUnits="objectBoundingBox">
              <path ref={wavePathTopRef} d="" fill="black" />
            </clipPath>
          </defs>
        </svg>

        <div className="w-full flex-grow relative bg-slate-950 pt-32 pb-32 px-8 md:px-16" style={{ clipPath: "url(#wave-top)" }}>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-indigo-950/20 pointer-events-none z-0"></div>
            
            <div className="relative z-10 max-w-6xl mx-auto">
              <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-12 text-center">
                {t('identityPage.techStack')}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                
                {/* Figma */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.simpleicons.org/figma/a855f7" alt="Figma" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.figma')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-purple-500/50 transition-colors">{t('identityPage.figmaDesc')}</p>
                </div>

                {/* Illustrator */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF9A00]/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-plain.svg" alt="Illustrator" className="w-full h-full object-contain filter brightness-[1.5] contrast-125" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.illustrator')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-[#FF9A00]/50 transition-colors">{t('identityPage.illustratorDesc')}</p>
                </div>

                {/* Photoshop */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#31A8FF]/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-plain.svg" alt="Photoshop" className="w-full h-full object-contain filter brightness-[1.5] contrast-125" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.photoshop')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-[#31A8FF]/50 transition-colors">{t('identityPage.photoshopDesc')}</p>
                </div>

                {/* Unity */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-slate-300/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.simpleicons.org/unity/white" alt="Unity" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.unity')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-slate-300/50 transition-colors">{t('identityPage.unityDesc')}</p>
                </div>

                {/* Blender */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F5792A]/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.simpleicons.org/blender" alt="Blender" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.blender')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-[#F5792A]/50 transition-colors">{t('identityPage.blenderDesc')}</p>
                </div>

                {/* Git */}
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#F05032]/50 p-5 rounded-2xl transition-all duration-300 group hover:-translate-y-1 flex flex-col">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform p-2.5 shrink-0">
                      <img src="https://cdn.simpleicons.org/git" alt="Git" className="w-full h-full object-contain" />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tighter text-white">{t('identityPage.git')}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-2 border-l-2 border-white/10 group-hover:border-[#F05032]/50 transition-colors">{t('identityPage.gitDesc')}</p>
                </div>

              </div>
            </div>
        </div>
      </div>

    </div>
  );
};

export default Identity;
