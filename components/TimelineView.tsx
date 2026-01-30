
import React from 'react';
import { Memory } from '../types';
import { ACTIVITY_COLORS, TRANSLATIONS } from '../constants';

interface TimelineViewProps {
  memories: Memory[];
  onSelectMemory: (memory: Memory) => void;
  lang: 'en' | 'zh';
}

const TimelineView: React.FC<TimelineViewProps> = ({ memories, onSelectMemory, lang }) => {
  const t = TRANSLATIONS[lang];
  const sortedMemories = [...memories].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="w-full h-full p-6 sm:p-10 overflow-y-auto relative z-10 font-cyber">
      <div className="max-w-4xl mx-auto py-12">
        <header className="mb-20 text-center">
          <div className="inline-block px-4 py-1.5 bg-cyan-400/5 border border-cyan-400/20 text-[10px] font-black uppercase tracking-[0.4em] mb-4 text-cyan-400">
            2025 TRIP RECAP
          </div>
          <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter italic uppercase neo-text-gradient">{t.memoryStream}</h2>
          <p className="text-zinc-500 text-[10px] tracking-[0.2em] uppercase font-bold max-w-md mx-auto">Sequential_Data_Reconstruction_In_Progress</p>
        </header>

        <div className="relative border-l border-cyan-400/10 ml-6 sm:ml-12 pl-10 sm:pl-16 space-y-16 pb-20">
          {sortedMemories.map((memory) => (
            <div 
              key={memory.id} 
              className="relative group cursor-pointer"
              onClick={() => onSelectMemory(memory)}
            >
              {/* Timeline marker */}
              <div 
                className="absolute -left-[54px] sm:-left-[77px] top-0 w-3 h-3 rounded-full ring-4 ring-black"
                style={{ backgroundColor: ACTIVITY_COLORS[memory.activityType] }}
              >
<<<<<<< HEAD
                <div 
                  className="absolute inset-0 rounded-full animate-ping opacity-30"
                  style={{ backgroundColor: ACTIVITY_COLORS[memory.activityType] }}
                ></div>
=======
                {/* Removed animate-ping opacity-30 */}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
              </div>

              <div className="glass-panel overflow-hidden border-white/5 hover:border-cyan-400/30 transition-all duration-700 hover:translate-x-2"
                 style={{ clipPath: 'polygon(0 0, 95% 0, 100% 10%, 100% 100%, 5% 100%, 0 90%)' }}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-48 md:h-auto relative overflow-hidden">
                    <img src={memory.images[0]} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110" alt="" />
                  </div>
                  <div className="p-8 md:w-3/5 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[9px] font-black text-pink-500 uppercase tracking-[0.2em]">
                        {new Date(memory.date).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <div className="px-2 py-0.5 border border-current text-[7px] tracking-widest font-black uppercase" style={{ color: ACTIVITY_COLORS[memory.activityType] }}>
                        {memory.activityType}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black italic mb-3 group-hover:text-cyan-400 transition-colors tracking-tight uppercase">{memory.title}</h3>
                    <p className="text-zinc-500 text-[10px] flex items-center gap-2 mb-6 font-bold uppercase tracking-widest">
                      <i className="fa-solid fa-location-dot text-pink-500"></i>
                      {memory.location.name}
                    </p>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 italic font-['Space_Grotesk']">
                      {memory.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;
