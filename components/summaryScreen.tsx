import React from 'react';

interface Memory {
  id: number;
  title: string;
  content: string;
  // 如果有更多字段可以加
}

interface SummaryScreenProps {
  memories: Memory[];
  lang: string;
  onClose: () => void;
}

const SummaryScreen: React.FC<SummaryScreenProps> = ({ memories, lang, onClose }) => {
  return (
    <div 
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-90 flex flex-col items-center justify-center p-4"
    >
      <button 
        className="absolute top-4 right-4 text-white text-2xl" 
        onClick={onClose}
      >
        &times;
      </button>

      <h1 className="text-3xl font-bold mb-6 text-cyan-400">
        {lang === 'en' ? 'Trip Summary' : '旅行总结'}
      </h1>

      <div className="w-full max-w-3xl overflow-y-auto space-y-4">
        {memories.length === 0 ? (
          <p className="text-gray-400">
            {lang === 'en' ? 'No memories yet.' : '还没有回忆。'}
          </p>
        ) : (
          memories.map((memory) => (
            <div 
              key={memory.id} 
              className="p-4 bg-gray-800 rounded-md border border-cyan-500"
            >
              <h2 className="text-xl font-semibold text-neon-cyan">{memory.title}</h2>
              <p className="mt-2 text-gray-300">{memory.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SummaryScreen;
