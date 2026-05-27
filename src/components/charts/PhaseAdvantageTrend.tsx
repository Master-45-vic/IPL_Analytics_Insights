import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface PhaseAdvantageTrendProps {
  matches: IPLMatch[];
}

export const PhaseAdvantageTrend = ({ matches }: PhaseAdvantageTrendProps) => {
  const chartData = useMemo(() => {
    const seasonData = new Map<string, { winPP: number, winMid: number, winDeath: number, losePP: number, loseMid: number, loseDeath: number, matches: number }>();

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result' || !m.season) return;

      const stats = seasonData.get(m.season) || { winPP: 0, winMid: 0, winDeath: 0, losePP: 0, loseMid: 0, loseDeath: 0, matches: 0 };
      
      const isT1Winner = m.winner === m.innings1_team;
      if (isT1Winner) {
        stats.winPP += Number(m.innings1_powerplay||0); stats.winMid += Number(m.innings1_middle||0); stats.winDeath += Number(m.innings1_death||0);
        stats.losePP += Number(m.innings2_powerplay||0); stats.loseMid += Number(m.innings2_middle||0); stats.loseDeath += Number(m.innings2_death||0);
      } else {
        stats.winPP += Number(m.innings2_powerplay||0); stats.winMid += Number(m.innings2_middle||0); stats.winDeath += Number(m.innings2_death||0);
        stats.losePP += Number(m.innings1_powerplay||0); stats.loseMid += Number(m.innings1_middle||0); stats.loseDeath += Number(m.innings1_death||0);
      }
      stats.matches++;
      seasonData.set(m.season, stats);
    });

    return Array.from(seasonData.entries())
      .map(([season, s]) => ({
        season,
        'Powerplay Advantage': (s.winPP - s.losePP) / s.matches,
        'Middle Overs Advantage': (s.winMid - s.loseMid) / s.matches,
        'Death Overs Advantage': (s.winDeath - s.loseDeath) / s.matches
      }))
      .sort((a, b) => a.season.localeCompare(b.season));
  }, [matches]);

  if (chartData.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Phase Advantage Over Time</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
            <XAxis dataKey="season" stroke="var(--theme-text-muted, #CBD5E1)" angle={-45} textAnchor="end" height={60} />
            <YAxis stroke="var(--theme-text-muted, #CBD5E1)" tickFormatter={(val) => `+${val}`} />
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }}
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }}
              formatter={(value: any) => [`+${Number(value).toFixed(1)} Runs`, '']}
            />
            <Legend />
            <Line type="monotone" dataKey="Powerplay Advantage" stroke="#FF6B35" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Middle Overs Advantage" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Death Overs Advantage" stroke="#00D4FF" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
