
import React, { useState, useEffect } from 'react';
import { Memory } from '../types';
import { ACTIVITY_COLORS, TRANSLATIONS } from '../constants';

interface MemoryModalProps {
  memory: Memory;
  onClose: () => void;
  onDelete: (id: string) => void;
  onEdit: (memory: Memory) => void;
  isPlaybackMode?: boolean;
  lang: 'en' | 'zh';
}

const MemoryModal: React.FC<MemoryModalProps> = ({ memory, onClose, onDelete, onEdit, isPlaybackMode = false, lang }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    if (isPlaybackMode) setShowDetails(false);
  }, [memory, isPlaybackMode]);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(lang === 'zh' ? '确定要擦除这段记忆档案吗？' : 'TERMINATE THIS DATA STREAM?')) {
      setIsDeleting(true);
      onDelete(memory.id);
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(memory);
  };

  return (
    <div className={`fixed z-50 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${isPlaybackMode ? 'bottom-20 md:bottom-28 right-4 md:right-12 w-[90vw] md:w-[30vw] min-w-[320px]' : 'inset-0 flex items-center justify-center p-4 md:p-20'}`}>
      {!isPlaybackMode && <div className="absolute inset-0 bg-black/95 animate-in fade-in duration-500" onClick={onClose}></div>}
      
      <div 
        className={`glass-panel overflow-y-auto md:overflow-hidden shadow-[0_0_100px_rgba(0,255,255,0.1)] relative z-10 transition-all duration-700 border-cyan-500/30 ${isPlaybackMode ? 'h-[40vh] md:h-[50vh] w-full' : 'w-full max-w-7xl max-h-[90vh] flex flex-col md:flex-row no-scrollbar'}`}
        style={{ clipPath: (isPlaybackMode || window.innerWidth < 768) ? 'polygon(0 0, 95% 0, 100% 5%, 100% 100%, 5% 100%, 0 95%)' : 'none' }}
      >
        
        <div className={`relative transition-all duration-1000 bg-zinc-950 flex items-center justify-center overflow-hidden shrink-0 ${isPlaybackMode ? 'h-full' : 'h-[50vh] md:h-full'} ${(!isPlaybackMode && showDetails) ? 'md:w-3/5' : 'w-full'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-pink-500/5 mix-blend-overlay z-10 pointer-events-none"></div>
          
          <img 
            src={memory.images[activeImageIndex]} 
            alt={memory.title} 
            className="w-full h-full object-cover transition-transform duration-[3000ms]"
            onClick={() => !isPlaybackMode && setShowDetails(!showDetails)}
          />
          
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjMiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9ImN5YW4iLz48L3N2Zz4=')]"></div>

          <div className={`absolute bottom-0 left-0 right-0 p-6 md:p-16 bg-gradient-to-t from-black via-black/60 to-transparent transition-opacity duration-700 ${(showDetails && !isPlaybackMode) ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-end justify-between gap-4 md:gap-10">
              <div className="flex-1">
                <div className="flex items-center gap-3 md:gap-5 mb-3 md:mb-6">
                   <div className="px-2 md:px-4 py-0.5 md:py-1 bg-black border border-current text-[7px] md:text-[9px] font-cyber uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,0,0,1)]" style={{ color: ACTIVITY_COLORS[memory.activityType] }}>
                     {memory.activityType}
                   </div>
                   <p className="text-[10px] md:text-[12px] font-cyber text-white/40 uppercase tracking-[0.3em] md:tracking-[0.5em]">{memory.date.replace(/-/g, '.')}</p>
                </div>
                <h2 className={`${isPlaybackMode ? 'text-2xl md:text-4xl' : 'text-3xl md:text-7xl'} font-black text-white italic tracking-tighter leading-[0.8] uppercase font-cyber neo-text-gradient`}>{memory.title}</h2>
                <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-8 text-[9px] md:text-[11px] font-cyber text-cyan-400/80 uppercase tracking-[0.2em] md:tracking-[0.4em]">
                   <i className="fa-solid fa-satellite-dish animate-pulse"></i>
                   {memory.location.name}
                </div>
              </div>
              
              {!isPlaybackMode && (
                <button 
                  onClick={() => setShowDetails(true)}
                  className="w-12 h-12 md:w-20 md:h-20 bg-cyan-400 text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_40px_rgba(0,255,255,0.4)] group"
                  style={{ clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)' }}
                >
                  <i className="fa-solid fa-expand text-xl md:text-2xl group-hover:rotate-90 transition-transform"></i>
                </button>
              )}
            </div>
          </div>

          {memory.images.length > 1 && (
            <div className="absolute top-6 md:top-12 left-6 md:left-12 flex flex-col gap-2 md:gap-4">
              {memory.images.map((_, i) => (
                <button 
                  key={i} 
                  onClick={(e) => { e.stopPropagation(); setActiveImageIndex(i); }}
                  className={`w-1 transition-all duration-700 ${i === activeImageIndex ? 'bg-cyan-400 h-10 md:h-16 shadow-[0_0_10px_cyan]' : 'bg-white/10 h-3 md:h-4 hover:bg-white/30'}`}
                />
              ))}
            </div>
          )}
        </div>

        {showDetails && !isPlaybackMode && (
          <div className="md:w-2/5 flex flex-col bg-black p-8 md:p-16 relative animate-in slide-in-from-right-32 duration-700 border-t md:border-t-0 md:border-l border-cyan-500/20">
            <div className="flex justify-between items-center mb-10 md:mb-16 shrink-0">
               <h4 className="text-[7px] md:text-[9px] font-cyber uppercase tracking-[0.4em] md:tracking-[0.6em] text-pink-500">MANIFEST_V2</h4>
               <button onClick={() => setShowDetails(false)} className="w-10 h-10 flex items-center justify-center transition-all group border border-white/5 hover:border-cyan-500/50">
                 <i className="fa-solid fa-code-merge text-zinc-600 group-hover:text-cyan-400"></i>
               </button>
            </div>

            <div className="flex-1 space-y-10 md:space-y-16 font-cyber">
              <div className="space-y-6 md:space-y-8">
                <h3 className="text-3xl md:text-5xl font-black italic tracking-tight leading-[0.9] uppercase text-white neo-text-gradient">{memory.title}</h3>
                <div className="grid grid-cols-1 gap-4 md:gap-5">
                  <div className="p-3 md:p-4 bg-white/5 border-l-2 border-pink-500">
                    <p className="text-[7px] md:text-[8px] text-pink-500 mb-1 uppercase tracking-widest">{t.timestamp}</p>
                    <p className="text-[10px] md:text-[12px] text-zinc-300">{memory.date}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-white/5 border-l-2 border-cyan-400">
                    <p className="text-[7px] md:text-[8px] text-cyan-400 mb-1 uppercase tracking-widest">{t.coordinates}</p>
                    <p className="text-[10px] md:text-[12px] text-zinc-300">{memory.location.name}</p>
                  </div>
                </div>
              </div>

              <div className="relative pt-6 md:pt-10">
                <div className="absolute top-0 left-0 w-8 h-[1px] bg-pink-500"></div>
                <p className="text-zinc-400 leading-relaxed text-sm md:text-lg font-medium italic relative z-10 tracking-tight lowercase font-['Space_Grotesk']">
                  {memory.description}
                </p>
              </div>
            </div>

            <div className="mt-12 md:mt-16 pt-8 md:pt-12 border-t border-white/5 flex items-center justify-between shrink-0">
              <button 
                onClick={handleDeleteClick}
                disabled={isDeleting}
                className={`text-[8px] md:text-[10px] font-cyber uppercase tracking-widest transition-all flex items-center gap-2 md:gap-4 ${isDeleting ? 'text-zinc-800' : 'text-zinc-600 hover:text-red-500'}`}
              >
                <i className={`fa-solid ${isDeleting ? 'fa-dna animate-spin' : 'fa-skull-crossbones'}`}></i>
                {isDeleting ? 'PURGING' : t.wipe}
              </button>
              
              <button 
                onClick={handleEditClick}
                className="px-6 md:px-8 py-3 md:py-4 bg-cyan-400 text-black text-[8px] md:text-[10px] font-cyber font-black tracking-[0.2em] hover:bg-white transition-all flex items-center gap-2 md:gap-4 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 75%, 85% 100%, 0 100%)' }}
              >
                <i className="fa-solid fa-wrench"></i>
                {t.recode_btn}
              </button>
            </div>
          </div>
        )}

        {!isPlaybackMode && (
          <button 
            onClick={onClose}
            className="absolute top-6 md:top-10 right-6 md:right-10 w-10 h-10 md:w-12 md:h-12 bg-black/80 border border-white/10 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all z-50 text-zinc-500"
            style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 80%, 80% 100%, 0 100%, 0 20%)' }}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default MemoryModal;
