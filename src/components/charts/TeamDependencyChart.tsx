import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface TeamDependencyChartProps {
  players: PlayerMatchRecord[];
}

export const TeamDependencyChart = ({ players }: TeamDependencyChartProps) => {
  const chartData = useMemo(() => {
    const teamStats = new Map<string, { totalRuns: number, players: Map<string, number> }>();

    players.forEach(p => {
      if (!p.team) return;
      const ts = teamStats.get(p.team) || { totalRuns: 0, players: new Map<string, number>() };
      ts.totalRuns += p.runs || 0;
      
      const pRuns = ts.players.get(p.player) || 0;
      ts.players.set(p.player, pRuns + (p.runs || 0));
      
      teamStats.set(p.team, ts);
    });

    const data = Array.from(teamStats.entries()).map(([team, ts]) => {
      const top3 = Array.from(ts.players.entries()).sort((a, b) => b[1] - a[1]).slice(0, 3);
      const top3Total = top3.reduce((sum, p) => sum + p[1], 0);
      const othersTotal = ts.totalRuns - top3Total;
      
      return {
        team,
        'Top 3 Players': (top3Total / ts.totalRuns) * 100,
        'Rest of Team': (othersTotal / ts.totalRuns) * 100,
        top3Names: top3.map(p => p[0]).join(', ')
      };
    }).filter(d => d['Top 3 Players'] > 0);

    return data;
  }, [players]);

  if (chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ipl-bg-card border border-ipl-border p-3 rounded-lg shadow-xl">
          <p className="font-bold text-ipl-text mb-2">{label}</p>
          <p className="text-sm font-bold text-ipl-primary">Top 3 Contribution: {payload[0].value.toFixed(1)}%</p>
          <p className="text-xs text-ipl-text-muted mt-1 max-w-[200px]">{payload[0].payload.top3Names}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Team Dependency Analysis (Runs)</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
            <XAxis dataKey="team" stroke="var(--theme-text-muted, #CBD5E1)" angle={-45} textAnchor="end" height={80} interval={0} tick={{fontSize: 10}} />
            <YAxis stroke="var(--theme-text-muted, #CBD5E1)" tickFormatter={val => `${val}%`} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--theme-border, #ffffff05)' }} />
            <Legend verticalAlign="top" />
            <Bar dataKey="Top 3 Players" stackId="a" fill="#F97316" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Rest of Team" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
