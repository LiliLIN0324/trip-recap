
import React, { useState, useRef } from 'react';
import { geocodeLocation, analyzeMemoryImage } from '../services/gemini';
import { Memory, ActivityType } from '../types';
import { ACTIVITY_COLORS, TRANSLATIONS } from '../constants';

interface MemoryFormProps {
  initialData?: Memory | null;
  onSave: (memory: Memory) => void;
  onCancel: () => void;
  lang: 'en' | 'zh';
}

const MemoryForm: React.FC<MemoryFormProps> = ({ initialData, onSave, onCancel, lang }) => {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [previews, setPreviews] = useState<string[]>(initialData?.images || []);
  const [title, setTitle] = useState(initialData?.title || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState(initialData?.location.name || '');
  const [activityType, setActivityType] = useState<ActivityType>(initialData?.activityType || 'Travel');
  const [description, setDescription] = useState(initialData?.description || '');
  
  const t = TRANSLATIONS[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files) as File[];
    const readers = fileList.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    const base64Images = await Promise.all(readers);
    setPreviews(prev => [...prev, ...base64Images]);
    
    if (e.target) e.target.value = '';
  };

  const handleAiMagic = async () => {
    if (previews.length === 0) return;
    setAnalyzing(true);
    try {
      const result = await analyzeMemoryImage(previews[0]);
      if (result) {
        setTitle(result.title);
        setLocationName(result.locationName);
        if (result.date) setDate(result.date);
        if (result.activityType) setActivityType(result.activityType as ActivityType);
        setDescription(result.description);
      } else {
        alert(lang === 'zh' ? "AI 暂时无法识别这张图片，请尝试手动输入。" : "AI cannot recognize this image at the moment.");
      }
    } catch (err) {
      console.error("AI 分析失败", err);
      alert(lang === 'zh' ? "AI 识别过程中遇到了一点小麻烦，请稍后重试。" : "AI identification encountered a problem.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName || previews.length === 0) {
      alert(lang === 'zh' ? "请填写关键信息并上传图片" : "Please fill in key info and upload images.");
      return;
    }

    setLoading(true);
    try {
      const geo = await geocodeLocation(locationName);
      const memoryData: Memory = {
        id: initialData?.id || Date.now().toString(),
        title,
        description,
        images: previews,
        date,
        activityType,
        location: {
          lat: geo.lat,
          lng: geo.lng,
          name: geo.formattedName || locationName,
        }
      };
      onSave(memoryData);
    } catch (err) {
      console.error(err);
      alert(lang === 'zh' ? "位置解析失败，请尝试更具体的地点名称。" : "Location resolution failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-500 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl p-6 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-cyan-500/20 shadow-2xl animate-in zoom-in-95 duration-500 my-auto">
        <div className="flex justify-between items-center mb-6 md:mb-10">
          <div>
            <h2 className="text-xl md:text-3xl font-black italic tracking-tighter neo-text-gradient uppercase font-cyber">
              {initialData ? t.recode_btn : 'New Archive'}
            </h2>
            <p className="text-[8px] md:text-[10px] text-zinc-500 font-bold tracking-widest mt-1 uppercase">
              {initialData ? 'PROTOCOL_UPDATE' : 'PROTOCOL_INITIATED'}
            </p>
          </div>
          <button onClick={onCancel} className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors">
            <i className="fa-solid fa-xmark text-xl text-zinc-500"></i>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-10 font-cyber">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-4 md:space-y-6">
              <label className="block text-[8px] md:text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-black">{t.gallery}</label>
              
              <div className="relative group aspect-square border border-dashed border-cyan-500/20 rounded-xl bg-black flex flex-col items-center justify-center overflow-hidden">
                {previews.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 p-3 w-full h-full overflow-y-auto pb-32 no-scrollbar">
                      {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/5">
                          <img src={src} className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setPreviews(prev => prev.filter((_, idx) => idx !== i))}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 flex items-center justify-center text-[10px] text-white hover:bg-pink-600"
                          >
                            <i className="fa-solid fa-times"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 z-20">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white font-black text-[8px] md:text-[10px] tracking-widest flex items-center justify-center gap-2 transition-all border border-white/10"
                      >
                        <i className="fa-solid fa-plus"></i> {t.add_files}
                      </button>
                      
                      <button
                        type="button"
                        onClick={handleAiMagic}
                        disabled={analyzing}
                        className="py-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-black text-[8px] md:text-[10px] tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 transition-all border border-cyan-500/30"
                      >
                        {analyzing ? (
                          <><i className="fa-solid fa-spinner animate-spin"></i> {t.analyzing}</>
                        ) : (
                          <><i className="fa-solid fa-wand-magic-sparkles"></i> {t.analyze}</>
                        )}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-center p-6" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-16 h-16 rounded-full bg-cyan-500/5 flex items-center justify-center mb-4 border border-cyan-500/10">
                      <i className="fa-solid fa-camera text-2xl text-cyan-500/40"></i>
                    </div>
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mb-1">{t.upload_moment}</p>
                    <p className="text-[7px] text-zinc-700">Protocol supports Image formats</p>
                  </div>
                )}
                
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className={previews.length > 0 ? "hidden" : "absolute inset-0 opacity-0 cursor-pointer"} 
                />
              </div>
            </div>

            <div className="space-y-4 md:space-y-6">
              <div>
                <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-2 font-black">{t.coordinates}</label>
                <input 
                  type="text"
                  value={locationName}
                  onChange={e => setLocationName(e.target.value)}
                  placeholder="..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-medium text-white"
                />
              </div>

              <div>
                <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-2 font-black">{t.identifier}</label>
                <input 
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all font-bold text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-2 font-black">{t.timestamp}</label>
                  <input 
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all text-white"
                  />
                </div>
                <div>
                  <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-2 font-black">{t.modality}</label>
                  <select 
                    value={activityType}
                    onChange={e => setActivityType(e.target.value as ActivityType)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all appearance-none text-white"
                  >
                    {Object.keys(ACTIVITY_COLORS).map(type => (
                      <option key={type} value={type} className="bg-zinc-900">{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-zinc-500 mb-2 font-black">{t.description}</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={window.innerWidth < 768 ? 3 : 4}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-cyan-500/50 transition-all resize-none text-white no-scrollbar"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              type="button"
              onClick={onCancel}
              className="order-2 sm:order-1 flex-1 py-3 md:py-4 rounded-xl bg-white/5 hover:bg-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 text-zinc-500 hover:text-white"
            >
              {t.abort}
            </button>
            <button 
              type="submit"
              disabled={loading || analyzing}
              className="order-1 sm:order-2 flex-[2] py-3 md:py-4 rounded-xl bg-cyan-400 text-black text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50"
            >
              {loading ? (
                <><i className="fa-solid fa-spinner animate-spin"></i> ...</>
              ) : (
                <><i className="fa-solid fa-cloud-arrow-up"></i> {initialData ? t.recode : t.commit}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemoryForm;
