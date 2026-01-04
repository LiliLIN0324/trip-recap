
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Memory } from '../types';
import { ACTIVITY_COLORS, TRANSLATIONS } from '../constants';

interface StatsViewProps {
  memories: Memory[];
  lang: 'en' | 'zh';
}

const StatsView: React.FC<StatsViewProps> = ({ memories, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const activityData = Object.entries(
    memories.reduce((acc, curr) => {
      acc[curr.activityType] = (acc[curr.activityType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }));

  const monthData = Object.entries(
    memories.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US', { month: 'short' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div className="w-full h-full p-6 sm:p-10 overflow-y-auto font-cyber">
      <div className="max-w-6xl mx-auto space-y-12 py-10">
        <header>
          <h2 className="text-4xl font-bold mb-2 neo-text-gradient uppercase tracking-tight">{t.activityInsights}</h2>
          <p className="text-cyan-500/40 text-[10px] tracking-[0.4em] uppercase font-black">Analytical_Protocol_v4.2</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl h-[400px]">
            <h3 className="text-xs font-bold mb-6 text-pink-500 tracking-widest uppercase">{t.activityDistribution}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={activityData}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ACTIVITY_COLORS[entry.name] || '#8884d8'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #00ffff33', borderRadius: '4px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="rect" />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-panel p-8 rounded-3xl h-[400px]">
            <h3 className="text-xs font-bold mb-6 text-pink-500 tracking-widest uppercase">{t.memoriesPerMonth}</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthData}>
                <XAxis dataKey="name" stroke="#333" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#050505', border: '1px solid #00ffff33', borderRadius: '4px' }}
                />
                <Bar dataKey="value" fill="#00ffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-10 rounded-3xl text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-[7px] uppercase tracking-widest text-zinc-500 mb-2">{t.totalMemories}</p>
              <p className="text-4xl font-black italic neo-text-gradient">[{memories.length}]</p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-widest text-zinc-500 mb-2">{t.countries}</p>
              <p className="text-4xl font-black italic neo-text-gradient">
                [{new Set(memories.map(m => m.location.name.split(',').pop()?.trim())).size}]
              </p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-widest text-zinc-500 mb-2">{t.peakMonth}</p>
              <p className="text-4xl font-black italic neo-text-gradient">
                {[...monthData].sort((a, b) => b.value - a.value)[0]?.name || '---'}
              </p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-widest text-zinc-500 mb-2">{t.topType}</p>
              <p className="text-4xl font-black italic neo-text-gradient uppercase">
                {[...activityData].sort((a, b) => b.value - a.value)[0]?.name.substring(0, 4) || '---'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsView;
