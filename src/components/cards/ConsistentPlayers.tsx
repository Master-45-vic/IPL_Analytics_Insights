import { motion } from 'framer-motion';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';
import { Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ConsistentPlayersProps {
  players: PlayerMatchRecord[];
}

export const ConsistentPlayers = ({ players }: ConsistentPlayersProps) => {
  const consistentRankings = useMemo(() => {
    const scores = new Map<string, number[]>();

    players.forEach(p => {
      if (p.isBatter) {
        const s = scores.get(p.player) || [];
        s.push(p.runs || 0);
        scores.set(p.player, s);
      }
    });

    const arr = Array.from(scores.entries())
      .filter(([_, s]) => s.length >= 10) // Minimum 10 innings
      .map(([name, s]) => {
        const sum = s.reduce((a, b) => a + b, 0);
        const avg = sum / s.length;
        
        // Calculate Standard Deviation
        const squareDiffs = s.map(value => Math.pow(value - avg, 2));
        const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / s.length;
        const stdDev = Math.sqrt(avgSquareDiff);
        
        // Coefficient of Variation = stdDev / avg (lower is better, meaning less relative variance)
        const cv = avg > 0 ? (stdDev / avg) * 100 : 999;
        
        return { name, avg, stdDev, cv, innings: s.length, totalRuns: sum };
      })
      .filter(p => p.avg >= 25) // Must average at least 25 to be considered a 'top' consistent player
      .sort((a, b) => a.cv - b.cv)
      .slice(0, 5); // Top 5

    return arr;
  }, [players]);

  if (consistentRankings.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full relative" id="consistent-batters-chart">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <Target className="text-ipl-primary" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Most Consistent Batters</h3>
          <p className="text-xs text-ipl-text-muted">Ranked by lowest variance coefficient (Min 10 inns, 25+ avg)</p>
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
              formatter={(val: number) => [`${val.toFixed(1)}%`, 'CV (Variance)']}
            />
            <Bar dataKey="cv" fill="var(--theme-primary, #00D4FF)" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
