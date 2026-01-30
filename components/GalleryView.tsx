
import React from 'react';
import { Memory } from '../types';
import { ACTIVITY_COLORS, TRANSLATIONS } from '../constants';

interface GalleryViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  lang: 'en' | 'zh';
}

const GalleryView: React.FC<GalleryViewProps> = ({ memories, onSelectMemory, lang }) => {
  const t = TRANSLATIONS[lang];
  const sorted = [...memories].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full h-full bg-black flex flex-col justify-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05)_0%,transparent_50%)]"></div>
      
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-center z-20 pointer-events-none">
        <div className="inline-block px-10 py-3 bg-cyan-400/5 border border-cyan-400/20 text-[9px] font-cyber font-black uppercase tracking-[1em] text-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
          LOCAL_DATABASE_ACCESS
        </div>
      </div>

      <div className="w-full overflow-x-auto flex items-center gap-10 md:gap-20 px-[15vw] md:px-[20vw] py-16 no-scrollbar snap-x snap-mandatory">
        {sorted.map((memory) => (
          <div 
            key={memory.id}
            onClick={() => onSelectMemory(memory)}
            className="flex-shrink-0 snap-center relative group cursor-pointer"
          >
            <div 
              className="relative overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] transition-all duration-700 group-hover:scale-[1.05] group-hover:border-pink-500/50"
              style={{ clipPath: 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' }}
            >
              <img 
                src={memory.images[0]} 
                alt={memory.title} 
                className="h-[55vh] md:h-[65vh] w-auto max-w-[85vw] object-contain block bg-zinc-950 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" 
                loading="lazy"
              />
              
              {/* Minimalist Camera HUD style Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex justify-between items-start">
                   <div className="px-3 py-1 bg-black/60 border border-white/20 text-[8px] font-cyber tracking-widest text-cyan-400">
                     MOD::{memory.activityType.toUpperCase()}
                   </div>
                   <div className="text-[10px] font-cyber text-white/50 bg-black/40 px-2">
                     REF://{memory.id.padStart(4, '0')}
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-end justify-between border-b border-white/20 pb-2">
                    <h3 className="text-xl md:text-2xl font-cyber font-black text-white tracking-[0.1em] uppercase italic leading-none">{memory.title}</h3>
                    <span className="text-[12px] font-cyber text-pink-500 font-bold whitespace-nowrap">
                      {new Date(memory.date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[9px] font-medium uppercase tracking-widest text-zinc-400">
<<<<<<< HEAD
                    <i className="fa-solid fa-crosshairs text-cyan-400 animate-pulse"></i>
=======
                    <i className="fa-solid fa-crosshairs text-cyan-400"></i> {/* Removed animate-pulse */}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
                    {memory.location.name}
                  </div>
                </div>
              </div>

              {memory.images.length > 1 && (
                <div className="absolute top-6 right-6 w-10 h-10 bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-[12px] group-hover:bg-cyan-400 group-hover:text-black transition-colors" style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}>
                  <i className="fa-solid fa-clone"></i>
                </div>
              )}
            </div>

            {/* Hover Decorator */}
            <div className="absolute -inset-8 blur-[100px] opacity-0 group-hover:opacity-20 transition-opacity duration-1000 -z-10"
              style={{ backgroundColor: ACTIVITY_COLORS[memory.activityType] }}
            ></div>
          </div>
        ))}
        <div className="flex-shrink-0 w-[50vw]"></div>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-10 opacity-20">
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-white"></div>
        <span className="text-[8px] font-cyber font-black uppercase tracking-[1em] text-white">{t.decodeScroll}</span>
        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-white"></div>
      </div>
    </div>
  );
};

export default GalleryView;
