import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface TossImpactTimelineProps {
  matches: IPLMatch[];
}

export const TossImpactTimeline = ({ matches }: TossImpactTimelineProps) => {
  const chartData = useMemo(() => {
    const seasonStats = new Map<string, { matches: number, tossWinnerWins: number }>();

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result' || !m.toss_winner) return;
      const stats = seasonStats.get(m.season) || { matches: 0, tossWinnerWins: 0 };
      stats.matches++;
      if (m.toss_winner === m.winner) {
        stats.tossWinnerWins++;
      }
      seasonStats.set(m.season, stats);
    });

    return Array.from(seasonStats.entries())
      .map(([season, stats]) => ({
        season,
        winPercentage: stats.matches > 0 ? (stats.tossWinnerWins / stats.matches) * 100 : 0
      }))
      .sort((a, b) => a.season.localeCompare(b.season)); // Sort chronologically

  }, [matches]);

  if (chartData.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Toss Impact Across IPL Seasons</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
            <XAxis dataKey="season" stroke="var(--theme-text-muted, #CBD5E1)" angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="var(--theme-text-muted, #CBD5E1)" domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }}
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }}
              formatter={(value: any) => [`${Number(value).toFixed(1)}%`, 'Toss Winner Win Rate']}
            />
            <Line type="monotone" dataKey="winPercentage" name="Win %" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4, fill: '#FF6B35' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
