import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface VenueTossMatrixProps {
  matches: IPLMatch[];
}

export const VenueTossMatrix = ({ matches }: VenueTossMatrixProps) => {
  const { chartData, uniqueSeasons } = useMemo(() => {
    const matrix = new Map<string, { matches: number, tossWinnerWins: number }>();
    const seasons = new Set<string>();

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result' || !m.toss_winner || !m.venue || !m.season) return;
      seasons.add(m.season);
      
      const key = `${m.season}|${m.venue}`;
      const stats = matrix.get(key) || { matches: 0, tossWinnerWins: 0 };
      stats.matches++;
      if (m.toss_winner === m.winner) {
        stats.tossWinnerWins++;
      }
      matrix.set(key, stats);
    });

    const data = Array.from(matrix.entries()).map(([key, stats]) => {
      const [season, venue] = key.split('|');
      return {
        season,
        venue,
        winRate: (stats.tossWinnerWins / stats.matches) * 100,
        matches: stats.matches
      };
    }).filter(d => d.matches >= 3); // Minimum matches to show

    return { 
      chartData: data, 
      uniqueSeasons: Array.from(seasons).sort((a,b)=>a.localeCompare(b)) 
    };
  }, [matches]);

  if (chartData.length === 0) return null;

  const getColor = (rate: number) => {
    if (rate >= 60) return '#10B981'; // Strong advantage
    if (rate <= 40) return '#EF4444'; // Strong disadvantage
    return '#3B82F6'; // Neutral
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-ipl-bg-card border border-ipl-border p-3 rounded-lg shadow-xl">
          <p className="font-bold text-ipl-text mb-1">{data.venue} ({data.season})</p>
          <p className="text-sm text-ipl-text-muted">Matches: {data.matches}</p>
          <p className="text-sm font-bold text-ipl-primary">Toss Winner Win Rate: {data.winRate.toFixed(1)}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full overflow-x-auto">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Venue Toss Advantage Matrix (Min 3 matches)</h3>
      <div className="min-w-[800px] min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, left: 100, bottom: 20 }}>
            <XAxis dataKey="season" type="category" allowDuplicatedCategory={false} tick={{fill: '#CBD5E1', fontSize: 12}} />
            <YAxis dataKey="venue" type="category" allowDuplicatedCategory={false} tick={{fill: '#CBD5E1', fontSize: 10}} width={120} />
            <ZAxis dataKey="winRate" range={[50, 400]} />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#ffffff30' }} />
            <Scatter data={chartData} shape="circle">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.winRate)} opacity={0.8} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center gap-6 mt-4 text-xs text-ipl-text-muted">
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10B981]"></div> Strong Advantage (&gt;60%)</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div> Neutral</span>
        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#EF4444]"></div> Disadvantage (&lt;40%)</span>
      </div>
    </div>
  );
};
