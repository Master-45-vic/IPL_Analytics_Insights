import { motion } from 'framer-motion';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';
import { Target } from 'lucide-react';

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
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <Target className="text-ipl-primary" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Most Consistent Batters</h3>
          <p className="text-xs text-ipl-text-muted">Ranked by lowest variance coefficient (Min 10 inns, 25+ avg)</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {consistentRankings.map((p, i) => (
          <motion.div 
            key={p.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-ipl-primary/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-ipl-text-muted w-6">#{i + 1}</span>
              <div>
                <p className="font-bold text-ipl-text">{p.name}</p>
                <p className="text-xs text-ipl-text-muted">{p.innings} innings • {p.totalRuns} runs</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-ipl-primary">{p.cv.toFixed(1)}% <span className="text-xs text-ipl-text-muted">CV</span></p>
              <p className="text-xs text-ipl-text-muted">Avg: {p.avg.toFixed(1)}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
