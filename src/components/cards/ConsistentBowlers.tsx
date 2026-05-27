import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';
import { Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConsistentBowlersProps {
  players: PlayerMatchRecord[];
}

export const ConsistentBowlers = ({ players }: ConsistentBowlersProps) => {
  const consistentRankings = useMemo(() => {
    const stats = new Map<string, { runs: number, balls: number, innings: number }>();

    players.forEach(p => {
      if (p.isBowler) {
        const s = stats.get(p.player) || { runs: 0, balls: 0, innings: 0 };
        if (p.bowlingBalls > 0) {
            s.runs += (p.bowlingRuns || 0);
            s.balls += (p.bowlingBalls || 0);
            s.innings += 1;
            stats.set(p.player, s);
        }
      }
    });

    const arr = Array.from(stats.entries())
      .filter(([_, s]) => s.innings >= 10 && s.balls >= 120) // Minimum 10 innings and 20 overs
      .map(([name, s]) => {
        const economy = (s.runs / s.balls) * 6;
        return { name, economy, innings: s.innings, overs: (s.balls / 6).toFixed(1) };
      })
      .sort((a, b) => a.economy - b.economy) // Lowest economy is best
      .slice(0, 5); // Top 5

    return arr;
  }, [players]);

  if (consistentRankings.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full relative" id="consistent-bowlers-chart">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <Target className="text-ipl-success" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Most Economical Bowlers</h3>
          <p className="text-xs text-ipl-text-muted">Ranked by lowest economy rate (Min 10 inns, 20 overs)</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={consistentRankings} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fontSize: 12 }} />
            <YAxis type="category" dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" width={90} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }} 
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }}
              formatter={(val: any) => [Number(val).toFixed(2), 'Economy Rate']}
            />
            <Bar dataKey="economy" fill="var(--theme-success, #10B981)" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
