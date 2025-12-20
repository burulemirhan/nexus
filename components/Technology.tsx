import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import DataFlowAnimation from './DataFlowAnimation';

const BASE_URL = import.meta.env.BASE_URL || '/';

const Technology: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ai' | 'hardware'>('hardware');

  const technologies = useMemo(() => [
    {
      id: 'oasis',
      name: t('tech.oasis.name'),
      subtitle: t('tech.oasis.subtitle'),
      description: t('tech.oasis.description'),
      accent: '#06b6d4', // Cyan
      details: t('tech.oasis.details')
    },
    {
      id: 'aether',
      name: t('tech.aether.name'),
      subtitle: t('tech.aether.subtitle'),
      description: t('tech.aether.description'),
      accent: '#f59e0b', // Amber
      details: t('tech.aether.details')
    },
    {
      id: 'terra',
      name: t('tech.terra.name'),
      subtitle: t('tech.terra.subtitle'),
      description: t('tech.terra.description'),
      accent: '#10b981', // Emerald
      details: t('tech.terra.details')
    }
  ], [t]);

  const aiModules = useMemo(() => [
    t('tech.ai.module1'),
    t('tech.ai.module2'),
    t('tech.ai.module3'),
    t('tech.ai.module4'),
  ], [t]);

  return (
    <section id="technology" className="flex flex-col justify-center py-12 md:py-16 relative bg-nexus-dark overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-nexus-dark to-black" />
      
      <div className="w-full px-6 md:px-12 relative z-10 flex flex-col h-full max-w-[90rem] mx-auto justify-center">
         
         {/* Header Row: Title Left, Tabs Right */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-6 md:mb-8">
            <h2 className="font-tesla font-bold text-2xl md:text-5xl text-white uppercase tracking-tight break-words mb-4 md:mb-0" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
               {t('tech.title')}
            </h2>

            <div className="flex items-center gap-6 md:gap-16 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide -mx-6 md:mx-0 px-6 md:px-0">
               <button 
                 onClick={() => setActiveTab('hardware')}
                 className={`relative font-tesla font-bold text-2xl md:text-3xl uppercase tracking-normal transition-all duration-300 pb-3 md:pb-4 whitespace-nowrap outline-none touch-manipulation ${
                   activeTab === 'hardware' ? 'text-white' : 'text-white/30 active:text-white/60'
                 }`}
                 style={{ fontFamily: 'Barlow', minHeight: '44px', fontSize: 'clamp(1.5rem, 3vw, 2rem)', display: 'flex', alignItems: 'center' }}
               >
                 {t('tech.hardware.tab')}
                 {activeTab === 'hardware' && (
                   <span 
                     className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 bg-emerald-500"
                     style={{ boxShadow: '0 0 15px #10b981' }} 
                   />
                 )}
               </button>
               <button 
                 onClick={() => setActiveTab('ai')}
                 className={`relative font-tesla font-bold text-2xl md:text-3xl uppercase tracking-normal transition-all duration-300 pb-3 md:pb-4 whitespace-nowrap outline-none touch-manipulation ${
                   activeTab === 'ai' ? 'text-white' : 'text-white/30 active:text-white/60'
                 }`}
                 style={{ fontFamily: 'Barlow', minHeight: '44px', fontSize: 'clamp(1.5rem, 3vw, 2rem)', display: 'flex', alignItems: 'center' }}
               >
                 {t('tech.ai.tab')}
                 {activeTab === 'ai' && (
                   <span 
                     className="absolute bottom-0 left-0 w-full h-[2px] transition-all duration-300 bg-emerald-500"
                     style={{ boxShadow: '0 0 15px #10b981' }} 
                   />
                 )}
               </button>
            </div>
         </div>

         {/* Content Area */}
         {activeTab === 'ai' ? (
           <div className="flex flex-col lg:flex-row gap-8 md:gap-12 items-start lg:items-center">
             {/* Left Column: Text and Modules */}
             <div className="w-full lg:w-1/2 flex flex-col space-y-6">
               <div className="space-y-3">
                 <h1 className="font-tesla font-bold text-2xl md:text-4xl lg:text-5xl text-white leading-tight tracking-normal break-words" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 4vw, 3rem)', maxWidth: '100%', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                   {t('tech.ai.title')}
                 </h1>
                 <div className="h-[1px] w-16 bg-white/10" />
               </div>

               <div className="space-y-4">
                 <p className="text-white/60 text-sm md:text-base uppercase tracking-widest font-bold" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                   Modules:
                 </p>
                 <div className="space-y-3">
                   {aiModules.map((module, index) => (
                     <div 
                       key={index}
                       className="flex items-center gap-4 py-2 border-l-2 border-white/20 pl-4 hover:border-emerald-400/70 transition-colors"
                     >
                       <span className="text-white/90 text-base md:text-lg font-light" style={{ fontFamily: 'Barlow', fontSize: '18px' }}>
                         {module}
                       </span>
                     </div>
                   ))}
                 </div>
               </div>
             </div>

             {/* Right Column: Animation */}
             <div className="w-full lg:w-1/2 relative aspect-square md:h-[500px] flex items-center justify-center bg-transparent rounded-sm overflow-hidden">
               <div className="absolute inset-0">
                 <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-white/20 z-20" />
                 <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/20 z-20" />
                 <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/20 z-20" />
                 <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-white/20 z-20" />
               </div>
               <DataFlowAnimation className="w-full h-full" />
             </div>
           </div>
         ) : (
           /* Hardware Tab: Grid of three components */
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
             {technologies.map((tech) => (
               <div
                 key={tech.id}
                 className="group relative overflow-hidden flex flex-col bg-black/40 border border-white/10 hover:border-white/20 transition-all duration-300 rounded-sm"
               >
                 {/* Image */}
                 <div className="relative w-full aspect-video overflow-hidden bg-black/60">
                   <img 
                     src={`${BASE_URL}assets/images/${tech.id}.avif`} 
                     alt={`${tech.name} - ${tech.subtitle}`}
                     loading="lazy"
                     decoding="async"
                     className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                     style={{
                       width: '100%',
                       height: '100%',
                       minWidth: '100%',
                       minHeight: '100%',
                       objectFit: 'cover'
                     }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                 </div>

                 {/* Content */}
                 <div className="flex-1 flex flex-col p-6 space-y-4">
                   <div className="space-y-2">
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full" style={{backgroundColor: tech.accent}}></span>
                       <span className="font-mono font-bold text-[10px] text-white/40 uppercase tracking-[0.2em]" style={{ fontFamily: 'Barlow', fontSize: '12px' }}>
                         {tech.subtitle}
                       </span>
                     </div>
                     <h3 className="font-tesla font-bold text-2xl md:text-3xl text-white tracking-normal" style={{ fontFamily: 'Barlow', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
                       {tech.name}
                     </h3>
                   </div>

                   <div className="h-[1px] w-12 bg-white/10" />

                   <p className="font-tech text-white/70 text-sm md:text-base font-light leading-relaxed flex-1" style={{ fontFamily: 'Barlow', fontSize: '16px' }}>
                     {tech.description}
                   </p>

                   <div className="pt-2">
                     <span 
                       className="inline-block py-2 px-3 border rounded font-mono text-[10px] md:text-xs text-white/80 uppercase tracking-widest" 
                       style={{ 
                         color: tech.accent, 
                         borderColor: `${tech.accent}40`,
                         fontFamily: 'Barlow',
                         fontSize: '12px'
                       }}
                     >
                       {tech.details}
                     </span>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         )}

      </div>
    </section>
  );
};

export default Technology;
