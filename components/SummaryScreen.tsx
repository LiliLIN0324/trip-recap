
import React, { useState, useEffect } from 'react';
import { Memory } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateYearlyNarrative } from '../services/gemini';

interface SummaryScreenProps {
  memories: Memory[];
  lang: 'en' | 'zh';
  onClose: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ memories, lang, onClose }) => {
  const [narrative, setNarrative] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const t = TRANSLATIONS[lang];

  const cityCount = new Set(memories.map(m => m.location.name)).size;
  const activityCounts = memories.reduce((acc, curr) => {
    acc[curr.activityType] = (acc[curr.activityType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topActivity = Object.entries(activityCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || '---';

  const fetchNarrative = async () => {
    setLoading(true);
    const text = await generateYearlyNarrative(memories, lang);
    setNarrative(text);
    setLoading(false);
  };

  useEffect(() => {
    fetchNarrative();
  }, [lang]);

  return (
    <div className="fixed inset-0 z-[110] bg-black animate-in fade-in duration-1000 flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05)_0%,transparent_50%)] pointer-events-none"></div>
      
      {/* 滚动容器 */}
      <div className="flex-1 overflow-y-auto px-4 py-12 md:px-16 md:py-20 flex flex-col items-center no-scrollbar relative z-10">
        <div className="max-w-4xl w-full flex flex-col gap-10 md:gap-14">
          
          {/* Header */}
          <header className="text-center space-y-3">
            <div className="inline-block px-3 py-1 bg-white/5 border border-cyan-400/20 text-[7px] md:text-[10px] font-cyber tracking-[0.3em] text-cyan-400 uppercase">
              ARCHIVE_COMPLETE // 2025
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-7xl font-black italic neo-text-gradient font-cyber leading-none uppercase tracking-tighter">
              {t.summaryTitle}
            </h2>
            <p className="text-zinc-500 font-cyber text-[8px] md:text-xs tracking-[0.2em] uppercase">{t.summarySubtitle}</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 shrink-0">
            <div className="text-center p-3 md:p-6 border border-white/5 bg-white/5 flex flex-col justify-center min-h-[80px] md:min-h-[100px]" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)' }}>
              <p className="text-[6px] md:text-[9px] text-pink-500 font-cyber font-black tracking-widest uppercase mb-1 md:mb-2">{t.totalMemories}</p>
              <p className="text-xl md:text-4xl font-black italic font-cyber text-white">[{memories.length}]</p>
            </div>
            <div className="text-center p-3 md:p-6 border border-white/5 bg-white/5 flex flex-col justify-center min-h-[80px] md:min-h-[100px]" style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 100%, 0 100%, 0 20%)' }}>
              <p className="text-[6px] md:text-[9px] text-cyan-400 font-cyber font-black tracking-widest uppercase mb-1 md:mb-2">{t.countries}</p>
              <p className="text-xl md:text-4xl font-black italic font-cyber text-white">[{cityCount}]</p>
            </div>
            <div className="text-center p-3 md:p-6 border border-white/5 bg-white/5 flex flex-col justify-center min-h-[80px] md:min-h-[100px] col-span-2 md:col-span-1" style={{ clipPath: 'polygon(0 0, 90% 0, 100% 20%, 100% 100%, 0 100%)' }}>
              <p className="text-[6px] md:text-[9px] text-yellow-500 font-cyber font-black tracking-widest uppercase mb-1 md:mb-2">{t.topType}</p>
              <p className="text-lg md:text-4xl font-black italic font-cyber text-white uppercase">[{topActivity.substring(0, 4)}]</p>
            </div>
          </div>

          {/* AI Narrative Section */}
          <div className="glass-panel p-5 md:p-10 relative overflow-hidden group">
            <div className="absolute top-2 left-3 text-[5px] md:text-[6px] text-cyan-400/30 font-cyber uppercase tracking-widest">AI_ANALYSIS_V4</div>
            <div className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-2 md:gap-4">
                 <i className="fa-solid fa-quote-left text-pink-500 text-lg md:text-2xl"></i>
                 <div className="h-px flex-1 bg-gradient-to-r from-pink-500/30 to-transparent"></div>
              </div>
              
              {loading ? (
                <div className="flex flex-col items-center justify-center py-4 gap-3">
                  <i className="fa-solid fa-spinner animate-spin text-cyan-400 text-xl"></i>
                  <p className="text-[6px] md:text-[8px] font-cyber text-zinc-500 tracking-widest uppercase">SYNT_NARRATIVE...</p> {/* Removed animate-pulse */}
                </div>
              ) : (
                <p className="text-sm md:text-2xl italic font-medium text-zinc-300 leading-relaxed font-['Space_Grotesk'] tracking-wide">
                  {narrative}
                </p>
              )}
              
              <div className="flex items-center gap-2 md:gap-4 justify-end">
                 <div className="h-px flex-1 bg-gradient-to-l from-pink-500/30 to-transparent"></div>
                 <i className="fa-solid fa-quote-right text-pink-500 text-lg md:text-2xl"></i>
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="flex justify-center pb-12">
            <button 
              onClick={onClose}
              className="px-8 md:px-12 py-3 md:py-4 bg-cyan-400 text-black font-cyber font-black text-[9px] md:text-sm tracking-[0.3em] uppercase hover:bg-white transition-all shadow-[0_0_40px_rgba(0,255,255,0.2)]"
              style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
            >
              {t.backToGlobe}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
