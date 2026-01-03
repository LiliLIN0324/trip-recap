
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Memory, ViewMode } from './types';
import { INITIAL_MEMORIES, ACTIVITY_COLORS, TRANSLATIONS } from './constants';
import GlobeView, { GlobeRef } from './components/GlobeView';
import TimelineView from './components/TimelineView';
import StatsView from './components/StatsView';
import GalleryView from './components/GalleryView';
import MemoryModal from './components/MemoryModal';
import MemoryForm from './components/MemoryForm';

const App: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(INITIAL_MEMORIES);
  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [focusedMemory, setFocusedMemory] = useState<Memory | null>(null); 
  const [isAdding, setIsAdding] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  
  const t = TRANSLATIONS[lang];
  const globeRef = useRef<GlobeRef>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAdding) {
          setIsAdding(false);
          setEditingMemory(null);
        } else if (selectedMemory) {
          setSelectedMemory(null);
        } else if (focusedMemory || showIntro) {
          handleResetView();
          setShowIntro(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdding, selectedMemory, focusedMemory, showIntro]);

  const sortedMemories = useMemo(() => 
    [...memories].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return a.id.localeCompare(b.id);
    }),
  [memories]);

  const stats = useMemo(() => ({
    total: memories.length,
    cities: new Set(memories.map(m => m.location.name)).size
  }), [memories]);

  const toggleLang = () => setLang(prev => prev === 'en' ? 'zh' : 'en');

  const handleGlobeFocus = async (memory: Memory) => {
    if (isTransitioning || isPlaying) return;
    if (viewMode !== 'globe') { setViewMode('globe'); await new Promise(r => setTimeout(r, 100)); }

    setIsTransitioning(true);
    setSelectedMemory(null);
    setFocusedMemory(null);
    
    if (globeRef.current) {
      await globeRef.current.zoomTo(memory.location.lat, memory.location.lng);
    }
    
    setFocusedMemory(memory);
    setIsTransitioning(false);
  };

  const handleExpandMemory = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = (id: string) => {
    setSelectedMemory(null);
    setFocusedMemory(null);
    setMemories(prev => prev.filter(m => m.id !== id));
    if (viewMode === 'globe' && globeRef.current) globeRef.current.resetView();
  };

  const handleEditMemory = (memory: Memory) => {
    setEditingMemory(memory);
    setSelectedMemory(null);
    setIsAdding(true);
  };

  const handleSaveMemory = (memoryData: Memory) => {
    setMemories(prev => {
      const index = prev.findIndex(m => m.id === memoryData.id);
      if (index !== -1) {
        const newMemories = [...prev];
        newMemories[index] = memoryData;
        return newMemories;
      }
      return [...prev, memoryData];
    });
    setIsAdding(false);
    setEditingMemory(null);
    if (viewMode !== 'globe') setViewMode('globe');
    setTimeout(() => handleGlobeFocus(memoryData), 600);
  };

  const handleResetView = async () => {
    if (isPlaying) return; 
    setSelectedMemory(null);
    setFocusedMemory(null);
    setPlaybackIndex(-1);
    if (viewMode === 'globe' && globeRef.current) await globeRef.current.resetView();
  };

  const startPlayback = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setViewMode('globe');
    setShowIntro(false);
    setSelectedMemory(null);
    setFocusedMemory(null);
    setPlaybackIndex(-1);
    
    if (globeRef.current) await globeRef.current.resetView();
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < sortedMemories.length; i++) {
      const memory = sortedMemories[i];
      setFocusedMemory(null);
      setPlaybackIndex(i);
      if (globeRef.current) await globeRef.current.zoomTo(memory.location.lat, memory.location.lng);
      setFocusedMemory(memory);
      await new Promise(r => setTimeout(r, 4000)); 
    }
    
    setFocusedMemory(null);
    setIsPlaying(false);
    setPlaybackIndex(-1);
    await new Promise(r => setTimeout(r, 500));
    setViewMode('gallery'); 
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      
      <div 
        className="absolute inset-0 transition-all duration-1000 blur-[180px] opacity-20 pointer-events-none z-0"
        style={{ 
          background: (selectedMemory || focusedMemory) 
            ? `radial-gradient(circle at center, ${ACTIVITY_COLORS[(selectedMemory || focusedMemory)!.activityType]}, transparent)` 
            : 'none' 
        }}
      ></div>

      <nav className={`z-40 flex items-center justify-between px-4 md:px-10 py-3 md:py-5 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 shrink-0 transition-all duration-700 ${isPlaying ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        <div className="flex items-center gap-3 md:gap-5 cursor-pointer group" onClick={() => setShowIntro(true)}>
          <div className="relative w-8 h-8 md:w-11 md:h-11">
             <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
             <div className="absolute inset-0 border border-cyan-400/40 rotate-45 transition-transform duration-700 group-hover:rotate-[225deg]"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-route text-cyan-400 text-xs md:text-lg group-hover:scale-110 transition-transform"></i>
             </div>
          </div>
          <div className="block">
            <h1 className="font-black text-sm md:text-2xl tracking-[0.05em] md:tracking-[0.1em] uppercase italic leading-none neo-text-gradient font-cyber whitespace-nowrap">TRIP RECAP</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={toggleLang}
            className="flex flex-col items-center justify-center px-3 py-1 bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-all group"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            <span className="text-[8px] md:text-[10px] font-cyber text-cyan-400 group-hover:text-white">{t.lang}</span>
          </button>

          <div className="hidden sm:flex items-center gap-6">
            <div className="flex flex-col items-end">
              <p className="text-[6px] md:text-[8px] text-pink-500 font-black uppercase tracking-[0.2em] mb-0.5">{t.capacity}</p>
              <p className="text-sm md:text-lg font-cyber italic text-white/90">[{stats.total}]</p>
            </div>
            <div className="flex flex-col items-end">
              <p className="text-[6px] md:text-[8px] text-pink-500 font-black uppercase tracking-[0.2em] mb-0.5">{t.nodes}</p>
              <p className="text-sm md:text-lg font-cyber italic text-white/90">[{stats.cities}]</p>
            </div>
          </div>

          <button 
            onClick={startPlayback}
            className="px-3 md:px-8 py-2 md:py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 font-cyber text-[8px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all border border-cyan-500/30 flex items-center gap-2 md:gap-3 group relative overflow-hidden"
            style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%)' }}
          >
            <i className="fa-solid fa-ghost text-[10px] md:text-base animate-pulse"></i>
            <span className="hidden sm:inline">{t.recap}</span>
          </button>
        </div>
      </nav>

      {isPlaying && (
        <div className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 px-6 md:px-10 py-3 md:py-4 glass-panel flex items-center gap-4 md:gap-8 animate-in slide-in-from-top-10 duration-700">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 animate-[ping_1.5s_infinite] rounded-full"></div>
            <span className="text-[8px] md:text-[10px] font-cyber tracking-[0.2em] md:tracking-[0.4em] text-pink-500">{t.decoding}</span>
          </div>
          <div className="w-32 md:w-60 h-[1px] bg-cyan-500/10 relative overflow-hidden">
            <div 
              className="h-full bg-cyan-400 shadow-[0_0_10px_cyan]" 
              style={{ width: `${((playbackIndex + 1) / sortedMemories.length) * 100}%` }}
            ></div>
          </div>
          <span className="text-[10px] md:text-12px font-cyber text-cyan-400">
            {String(playbackIndex + 1).padStart(2, '0')} / {String(sortedMemories.length).padStart(2, '0')}
          </span>
        </div>
      )}

      <main className="flex-1 relative z-10 w-full min-h-0">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'globe' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <GlobeView 
            ref={globeRef}
            memories={memories} 
            focusedMemory={focusedMemory}
            onFocusMemory={handleGlobeFocus}
            onExpandMemory={handleExpandMemory}
            onReset={handleResetView}
            showFootprints={true}
            playbackIndex={playbackIndex}
          />
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'timeline' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {viewMode === 'timeline' && <TimelineView lang={lang} memories={memories} onSelectMemory={handleGlobeFocus} />}
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'gallery' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {viewMode === 'gallery' && <GalleryView lang={lang} memories={memories} onSelectMemory={handleGlobeFocus} />}
        </div>
        <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'stats' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {viewMode === 'stats' && <StatsView lang={lang} memories={memories} />}
        </div>
      </main>

      <div className={`fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-4 p-2 md:p-4 glass-panel border border-cyan-500/20 transition-all duration-700 ${isPlaying ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        {[
          { id: 'globe', icon: 'fa-earth-asia', label: t.map },
          { id: 'timeline', icon: 'fa-clock-rotate-left', label: t.history },
          { id: 'gallery', icon: 'fa-images', label: t.gallery },
          { id: 'stats', icon: 'fa-chart-simple', label: t.stats }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => { setViewMode(item.id as ViewMode); handleResetView(); }}
            className={`flex flex-col items-center justify-center w-12 h-12 md:w-16 md:h-16 transition-all duration-300 relative group ${viewMode === item.id ? 'text-cyan-400' : 'text-zinc-600 hover:text-pink-400'}`}
          >
            {viewMode === item.id && (
              <div className="absolute inset-0 bg-cyan-400/5 border border-cyan-400/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] -z-10" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}></div>
            )}
            <i className={`fa-solid ${item.icon} text-sm md:text-lg mb-0.5 md:mb-1 group-hover:scale-125 transition-transform`}></i>
            <span className="text-[7px] md:text-[9px] font-bold tracking-tight">{item.label}</span>
          </button>
        ))}
        <div className="w-px h-8 md:h-12 bg-white/5 mx-1"></div>
        <button 
          onClick={() => { setEditingMemory(null); setIsAdding(true); }}
          className="w-12 h-12 md:w-16 md:h-16 bg-pink-500/10 text-pink-500 hover:bg-pink-500/20 border border-pink-500/30 flex items-center justify-center transition-all group"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 80%, 80% 100%, 0 100%)' }}
        >
          <i className="fa-solid fa-plus-circle text-base md:text-xl group-hover:rotate-90 transition-transform"></i>
        </button>
      </div>

      {showIntro && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505] animate-in fade-in duration-1000 p-6">
           <div className="max-w-2xl w-full p-6 md:p-12 space-y-12 md:space-y-20 text-center">
              <div className="relative inline-block">
                {/* Orbital Decorators */}
                <div className="absolute -inset-20 border border-cyan-400/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-12 border border-pink-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                
                {/* Main Logo Nexus */}
                <div className="relative p-12 md:p-20 bg-black/40 backdrop-blur-3xl border border-cyan-500/30 shadow-[0_0_80px_rgba(0,255,255,0.15)] group overflow-visible" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}>
                   <div className="absolute inset-0 neo-gradient opacity-0 group-hover:opacity-10 transition-opacity"></div>
                   <div className="relative z-10 flex items-center justify-center">
                     <i className="fa-solid fa-route text-6xl md:text-9xl text-cyan-400 group-hover:text-pink-500 transition-colors duration-1000 animate-pulse"></i>
                   </div>
                </div>
              </div>
              <div>
                <h2 className="text-4xl md:text-7xl font-black italic tracking-[-0.05em] mb-4 md:mb-8 neo-text-gradient font-cyber uppercase leading-tight whitespace-pre-wrap">{t.connectLife}</h2>
                <p className="text-cyan-500/40 uppercase tracking-[0.5em] md:tracking-[1em] text-[7px] md:text-[9px] font-black">{t.protocol}</p>
              </div>
              <div className="flex flex-col gap-4 md:gap-6 max-w-sm mx-auto">
                <button 
                  onClick={() => setShowIntro(false)} 
                  className="w-full py-4 md:py-6 bg-cyan-400 text-black font-cyber font-black tracking-[0.4em] text-[9px] md:text-[11px] shadow-[0_0_30px_rgba(0,255,255,0.3)] transition-all active:scale-95 uppercase"
                  style={{ clipPath: 'polygon(0 0, 92% 0, 100% 25%, 100% 100%, 8% 100%, 0 75%)' }}
                >
                  {t.accessCore}
                </button>
              </div>
           </div>
        </div>
      )}

      {selectedMemory && (
        <MemoryModal 
          lang={lang}
          memory={selectedMemory} 
          onClose={() => setSelectedMemory(null)} 
          onDelete={handleDeleteMemory} 
          onEdit={handleEditMemory}
        />
      )}
      
      {isAdding && (
        <MemoryForm 
          lang={lang}
          initialData={editingMemory}
          onSave={handleSaveMemory} 
          onCancel={() => { setIsAdding(false); setEditingMemory(null); }} 
        />
      )}
    </div>
  );
};

export default App;
