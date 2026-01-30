
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Memory, ViewMode } from '../types';
import { INITIAL_MEMORIES, ACTIVITY_COLORS, TRANSLATIONS } from '../constants';
import GlobeView, { GlobeRef } from '../GlobeView';
import TimelineView from './TimelineView';
import StatsView from './StatsView';
import GalleryView from './GalleryView';
import MemoryModal from '../MemoryModal';
import MemoryForm from './MemoryForm';
<<<<<<< HEAD
import SummaryScreen from './summaryScreen';

const STORAGE_KEY = 'CHRONOS_ARCHIVE_V1';
=======
import SummaryScreen from './SummaryScreen';

const STORAGE_KEY = 'CHRONOS_ARCHIVE_V1';
const MAX_PLAYBACK_POINTS = 20; // Default to showing only 20 cards
const SHORT_CARD_DWELL_TIME = 3000; // Shortened card dwell time (3 seconds)
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152

const App: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to load archive", e);
        return INITIAL_MEMORIES;
      }
    }
    return INITIAL_MEMORIES;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('globe');
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [focusedMemory, setFocusedMemory] = useState<Memory | null>(null); 
  const [isAdding, setIsAdding] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
<<<<<<< HEAD
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1);
=======
  const [playbackIndex, setPlaybackIndex] = useState<number>(-1); // Keep for progress bar and current point indicator
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [lang, setLang] = useState<'en' | 'zh'>('zh'); 
<<<<<<< HEAD
  
  const t = TRANSLATIONS[lang];
  const globeRef = useRef<GlobeRef>(null);
  const playbackActiveRef = useRef<boolean>(false);
=======
  const [isMuted, setIsMuted] = useState(false); 
  const [showAllPaths, setShowAllPaths] = useState(false); // Initial state set to false
  
  const t = TRANSLATIONS[lang];
  const globeRef = useRef<GlobeRef>(null);
  const playbackActiveRef = useRef<boolean>(false); // Used to allow early exit from playback loop
  const audioRef = useRef<HTMLAudioElement>(null); 
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  }, [memories]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAdding) {
          setIsAdding(false);
          setEditingMemory(null);
        } else if (selectedMemory) {
          setSelectedMemory(null);
        } else if (isPlaying) {
          handleStopPlayback();
        } else if (focusedMemory || showIntro || showSummary) {
          handleResetView();
          setShowIntro(false);
          setShowSummary(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdding, selectedMemory, focusedMemory, showIntro, isPlaying, showSummary]);

<<<<<<< HEAD
=======
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
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
<<<<<<< HEAD

  const handleGlobeFocus = async (memory: Memory) => {
    if (isTransitioning || isPlaying) return;
=======
  const toggleMute = () => setIsMuted(prev => !prev);

  const handleGlobeFocus = async (memory: Memory) => {
    if (isTransitioning || isPlaying) return; // Disable interaction during playback
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    if (viewMode !== 'globe') { setViewMode('globe'); await new Promise(r => setTimeout(r, 100)); }

    setIsTransitioning(true);
    setSelectedMemory(null);
    setFocusedMemory(null);
<<<<<<< HEAD
    
    if (globeRef.current) {
      await globeRef.current.zoomTo(memory.location.lat, memory.location.lng);
    }
    
    setFocusedMemory(memory);
=======
    setShowAllPaths(false); // Hide all paths when focusing on a single memory
    
    if (globeRef.current) {
      await globeRef.current.zoomToMemory(memory.location.lat, memory.location.lng);
    }
    
    setFocusedMemory(memory);
    // Add small delay to allow GlobeView to re-render point and compute coordinates before showing card
    await new Promise(r => setTimeout(r, 50)); 
    if (globeRef.current) globeRef.current.showCurrentPointCard(); // Show card on manual focus
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    setIsTransitioning(false);
  };

  const handleExpandMemory = (memory: Memory) => {
    setSelectedMemory(memory);
  };

  const handleDeleteMemory = (id: string) => {
    setSelectedMemory(null);
    setFocusedMemory(null);
    setMemories(prev => prev.filter(m => m.id !== id));
    if (viewMode === 'globe' && globeRef.current) {
      globeRef.current.resetView();
    }
<<<<<<< HEAD
=======
    setShowAllPaths(true); // After delete, return to exploration mode with all paths visible
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
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
<<<<<<< HEAD
    if (viewMode === 'globe' && globeRef.current) await globeRef.current.resetView();
  };

  const handleStopPlayback = () => {
    playbackActiveRef.current = false;
    setIsPlaying(false);
    setPlaybackIndex(-1);
    setFocusedMemory(null);
    if (globeRef.current) globeRef.current.resetView();
=======
    if (globeRef.current) {
      await globeRef.current.resetView();
      globeRef.current.resetPlaybackState(); // Ensure globe state is clean
    }
    setShowAllPaths(true); // After reset, show all paths in explore mode
  };

  const handleStopPlayback = () => {
    playbackActiveRef.current = false; // Signal loop to stop
    setIsPlaying(false);
    setPlaybackIndex(-1);
    setFocusedMemory(null);
    if (globeRef.current) {
      globeRef.current.resetView();
      globeRef.current.resetPlaybackState(); // Ensure globe state is clean
    }
    setShowAllPaths(true); // After stopping playback, return to exploration mode with all paths visible
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
  };

  const startPlayback = async () => {
    if (isPlaying || memories.length === 0) return;
    setIsPlaying(true);
    playbackActiveRef.current = true;
    setViewMode('globe');
    setShowIntro(false);
    setShowSummary(false);
<<<<<<< HEAD
    setSelectedMemory(null);
    setFocusedMemory(null);
    setPlaybackIndex(-1);
    
    if (globeRef.current) await globeRef.current.resetView();
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < sortedMemories.length; i++) {
      if (!playbackActiveRef.current) break;
      
      const memory = sortedMemories[i];
      setFocusedMemory(null);
      setPlaybackIndex(i);
      
      if (globeRef.current) await globeRef.current.zoomTo(memory.location.lat, memory.location.lng);
      
      if (!playbackActiveRef.current) break;
      setFocusedMemory(memory);
      
      for (let j = 0; j < 35; j++) {
        if (!playbackActiveRef.current) break;
        await new Promise(r => setTimeout(r, 100));
      }
    }
    
=======
    setSelectedMemory(null); // Ensure no modal is open
    setFocusedMemory(null); // Clear any existing focus
    setPlaybackIndex(-1); // Reset playback progress
    setShowAllPaths(false); // Hide all paths during playback

    if (globeRef.current) {
      await globeRef.current.resetView(); // Start from a clean, zoomed-out globe view
      globeRef.current.resetPlaybackState(); // Ensure GlobeView is ready for playback
    }
    await new Promise(r => setTimeout(r, 600)); // Small delay before first zoom

    // Limit playback to MAX_PLAYBACK_POINTS
    const memoriesToPlay = sortedMemories.slice(0, MAX_PLAYBACK_POINTS);
    const totalPlaybackPoints = memoriesToPlay.length;

    for (let i = 0; i < totalPlaybackPoints; i++) {
      if (!playbackActiveRef.current) break; // Check for early exit

      const currentMemory = memoriesToPlay[i];
      const nextMemory = memoriesToPlay[i + 1];

      // 1. Zoom to the current point
      await globeRef.current?.zoomToMemory(currentMemory.location.lat, currentMemory.location.lng);
      
      // 2. Set focused memory and show card
      setFocusedMemory(currentMemory);
      setPlaybackIndex(i); // Update index for progress bar and marker highlight
      // Crucial: A small delay to allow GlobeView to re-render point and compute coordinates
      await new Promise(r => setTimeout(r, 50)); 
      globeRef.current?.showCurrentPointCard();

      // 3. Card dwell time for current point (SHORT_CARD_DWELL_TIME)
      for (let j = 0; j < (SHORT_CARD_DWELL_TIME / 100); j++) { 
        if (!playbackActiveRef.current) break;
        await new Promise(r => setTimeout(r, 100));
      }
      if (!playbackActiveRef.current) break; // Check for early exit

      // 4. Hide current card and animate path to next point (if it exists)
      globeRef.current?.hideCurrentPointCard();
      if (nextMemory) {
        // Pass current point as start, next point as end for path animation
        await globeRef.current?.animatePath(
          currentMemory.location.lng, currentMemory.location.lat, 
          nextMemory.location.lng, nextMemory.location.lat
        );
      } else {
        // Last point, ensure no path anim is left
        globeRef.current?.resetPlaybackState(); 
      }
    }
    
    // Playback finished naturally
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    if (playbackActiveRef.current) {
      setFocusedMemory(null);
      setIsPlaying(false);
      playbackActiveRef.current = false;
      setPlaybackIndex(-1);
<<<<<<< HEAD
      await new Promise(r => setTimeout(r, 500));
      setShowSummary(true);
=======
      if (globeRef.current) {
        globeRef.current.resetView();
        globeRef.current.resetPlaybackState();
      }
      await new Promise(r => setTimeout(r, 500));
      setShowSummary(true); // Show summary screen after playback
      setShowAllPaths(true); // After playback finishes and summary shown, return to exploration mode with all paths visible
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
    }
  };

  return (
    <div className="relative h-screen w-screen flex flex-col bg-[#050505] text-white overflow-hidden">
      
<<<<<<< HEAD
=======
      {/* Background Ambience */}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
      <div 
        className="absolute inset-0 transition-all duration-1000 blur-[180px] opacity-20 pointer-events-none z-0"
        style={{ 
          background: (selectedMemory || focusedMemory) 
            ? `radial-gradient(circle at center, ${ACTIVITY_COLORS[(selectedMemory || focusedMemory)!.activityType]}, transparent)` 
            : 'none' 
        }}
      ></div>

<<<<<<< HEAD
      <nav className={`z-40 flex items-center justify-between px-4 md:px-10 py-3 md:py-5 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 shrink-0 transition-all duration-700 ${isPlaying ? 'translate-y-[-100%] opacity-0' : 'translate-y-0 opacity-100'}`}>
        {/* LOGO AREA - RESTORED ORIGINAL INTERACTION */}
=======
      {/* Background Audio */}
      <audio ref={audioRef} loop src="assets/synth-wave.mp3" />

      <nav className={`z-40 flex items-center justify-between px-4 md:px-10 py-3 md:py-5 bg-black/40 backdrop-blur-xl border-b border-cyan-500/20 shrink-0 transition-all duration-700 ${isPlaying ? 'translate-y-[-100%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
        {/* LOGO AREA - RESTORED ROUTE ICON */}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
        <div className="flex items-center gap-3 md:gap-5 cursor-pointer group" onClick={() => setShowIntro(true)}>
          <div className="relative w-8 h-8 md:w-11 md:h-11">
             <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-md group-hover:opacity-40 transition-opacity"></div>
             <div className="absolute inset-0 border border-cyan-400/40 rotate-45 transition-transform duration-700 group-hover:rotate-[225deg]"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <i className="fa-solid fa-route text-cyan-400 text-xs md:text-lg group-hover:scale-110 transition-transform"></i>
             </div>
          </div>
          <div className="block">
            <h1 className="font-black text-sm md:text-2xl tracking-[0.05em] md:tracking-[0.1em] uppercase italic leading-none neo-text-gradient font-cyber whitespace-nowrap group-hover:glitch-hover transition-all">TRIP RECAP</h1>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button 
<<<<<<< HEAD
=======
            onClick={toggleMute}
            className="flex flex-col items-center justify-center px-3 py-1 bg-white/5 border border-white/10 hover:border-pink-400/50 transition-all group"
            style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
          >
            <i className={`fa-solid ${isMuted ? 'fa-volume-xmark' : 'fa-volume-high'} text-[8px] md:text-[10px] text-pink-400 group-hover:text-white`}></i>
          </button>
          <button 
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
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
<<<<<<< HEAD
            <i className="fa-solid fa-ghost text-[10px] md:text-base animate-pulse"></i>
=======
            <i className="fa-solid fa-ghost text-[10px] md:text-base"></i>
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
            <span className="hidden sm:inline">{t.recap}</span>
          </button>
        </div>
      </nav>

      {isPlaying && (
        <div className="fixed top-6 md:top-10 left-1/2 -translate-x-1/2 z-50 px-4 md:px-10 py-3 md:py-4 glass-panel flex items-center gap-4 md:gap-8 animate-in slide-in-from-top-10 duration-700 min-w-[300px] md:min-w-[500px] justify-between">
          <div className="flex items-center gap-2 md:gap-4 flex-1">
<<<<<<< HEAD
            <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 animate-[ping_1.5s_infinite] rounded-full"></div>
=======
            <div className="w-2 h-2 md:w-3 md:h-3 bg-pink-500 rounded-full"></div>
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
            <span className="text-[8px] md:text-[10px] font-cyber tracking-[0.2em] md:tracking-[0.4em] text-pink-500 whitespace-nowrap">{t.decoding}</span>
            <div className="hidden sm:block flex-1 h-[1px] bg-cyan-500/10 relative overflow-hidden mx-4">
              <div 
                className="h-full bg-cyan-400 shadow-[0_0_10px_cyan] transition-all duration-1000" 
<<<<<<< HEAD
                style={{ width: `${((playbackIndex + 1) / sortedMemories.length) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] md:text-12px font-cyber text-cyan-400 ml-auto whitespace-nowrap">
              {String(playbackIndex + 1).padStart(2, '0')} / {String(sortedMemories.length).padStart(2, '0')}
=======
                style={{ width: `${((playbackIndex + 1) / Math.min(sortedMemories.length, MAX_PLAYBACK_POINTS)) * 100}%` }}
              ></div>
            </div>
            <span className="text-[10px] md:text-12px font-cyber text-cyan-400 ml-auto whitespace-nowrap">
              {String(playbackIndex + 1).padStart(2, '0')} / {String(Math.min(sortedMemories.length, MAX_PLAYBACK_POINTS)).padStart(2, '0')}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
            </span>
          </div>
          
          <button 
            onClick={handleStopPlayback}
            className="ml-4 md:ml-8 px-3 md:px-6 py-1.5 md:py-2 bg-pink-500/20 hover:bg-pink-500/40 text-pink-500 font-cyber text-[8px] md:text-[10px] tracking-widest uppercase transition-all border border-pink-500/30 group flex items-center gap-2"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 70%, 85% 100%, 0 100%)' }}
          >
            <i className="fa-solid fa-circle-xmark group-hover:scale-125 transition-transform"></i>
            <span>{lang === 'zh' ? '退出回放' : 'EXIT ARCHIVE'}</span>
          </button>
        </div>
      )}

<<<<<<< HEAD
      <main className="flex-1 relative z-10 w-full min-h-0">
=======
      <main className="flex-1 relative z-10 w-full min-h-0 bg-transparent">
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
        <div className={`absolute inset-0 transition-opacity duration-1000 ${viewMode === 'globe' ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <GlobeView 
            ref={globeRef}
            memories={memories} 
            focusedMemory={focusedMemory}
            onFocusMemory={handleGlobeFocus}
            onExpandMemory={handleExpandMemory}
            onReset={handleResetView}
<<<<<<< HEAD
            showFootprints={true}
            playbackIndex={playbackIndex}
=======
            showAllPaths={showAllPaths} // Pass new prop
            playbackIndex={playbackIndex} // Pass playback index to control history trail
            lang={lang}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
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

<<<<<<< HEAD
      {/* 聚焦时的 HUD 操作提示 */}
      {focusedMemory && viewMode === 'globe' && !selectedMemory && (
        <div className="absolute bottom-28 md:bottom-32 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-col items-center">
               <div className="w-px h-12 bg-gradient-to-t from-cyan-400 to-transparent mb-2"></div>
               <p className="text-[10px] font-cyber text-cyan-400 tracking-[0.5em] uppercase mb-4 animate-pulse">MEMORY_LOCKED</p>
            </div>
            <button 
              onClick={() => handleExpandMemory(focusedMemory)}
              className="px-10 md:px-16 py-4 md:py-5 bg-cyan-400 text-black font-cyber font-black tracking-[0.3em] uppercase shadow-[0_0_50px_rgba(0,255,255,0.4)] transition-all hover:scale-110 active:scale-95 group relative overflow-hidden"
              style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <i className="fa-solid fa-crosshairs group-hover:rotate-90 transition-transform"></i>
                {lang === 'zh' ? '展开档案库' : 'OPEN ARCHIVE'}
              </span>
              <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 opacity-20"></div>
            </button>
          </div>
        </div>
      )}

      <div className={`fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-4 p-2 md:p-4 glass-panel border border-cyan-500/20 transition-all duration-700 ${isPlaying ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}`}>
=======
      <div className={`fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 md:gap-4 p-2 md:p-4 glass-panel border border-cyan-500/20 transition-all duration-700 ${isPlaying ? 'translate-y-[200%] opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
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
                <div className="absolute -inset-20 border border-cyan-400/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute -inset-12 border border-pink-500/10 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
                <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 border-2 border-cyan-400 flex items-center justify-center bg-black rotate-45 mx-auto">
<<<<<<< HEAD
                   <i className="fa-solid fa-dna text-4xl md:text-6xl text-cyan-400 -rotate-45"></i>
=======
                   <i className="fa-solid fa-route text-4xl md:text-6xl text-cyan-400 -rotate-45"></i>
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase neo-text-gradient font-cyber whitespace-pre-line">
                  {t.connectLife}
                </h2>
                <p className="text-zinc-500 text-xs md:text-sm tracking-[0.4em] font-bold uppercase">
                  {t.protocol}
                </p>
              </div>

              <button 
<<<<<<< HEAD
                onClick={() => setShowIntro(false)}
=======
                onClick={() => { 
                  setShowIntro(false); 
                  // Set showAllPaths to true immediately after dismissing intro
                  setShowAllPaths(true); 
                }}
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
                className="px-12 md:px-20 py-4 md:py-6 bg-cyan-400 text-black font-cyber font-black tracking-[0.5em] uppercase hover:bg-white transition-all shadow-[0_0_50px_rgba(0,255,255,0.3)]"
                style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
              >
                {t.accessCore}
              </button>
           </div>
        </div>
      )}

      {showSummary && (
        <SummaryScreen 
          memories={memories} 
          lang={lang} 
          onClose={() => setShowSummary(false)} 
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

      {selectedMemory && (
        <MemoryModal 
          lang={lang}
          memory={selectedMemory}
          onClose={() => setSelectedMemory(null)}
          onDelete={handleDeleteMemory}
          onEdit={handleEditMemory}
        />
      )}
    </div>
  );
};

<<<<<<< HEAD
export default App;
=======
export default App;
>>>>>>> b96273f375fb08b6bbc3a39121a3307a02eec152
