import { motion } from 'framer-motion';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';
import { Target } from 'lucide-react';

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
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <Target className="text-ipl-success" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Most Economical Bowlers</h3>
          <p className="text-xs text-ipl-text-muted">Ranked by lowest economy rate (Min 10 inns, 20 overs)</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {consistentRankings.map((p, i) => (
          <motion.div 
            key={p.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-ipl-success/30"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl font-black text-ipl-text-muted w-6">#{i + 1}</span>
              <div>
                <p className="font-bold text-ipl-text">{p.name}</p>
                <p className="text-xs text-ipl-text-muted">{p.innings} innings • {p.overs} overs</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-ipl-success">{p.economy.toFixed(2)} <span className="text-xs text-ipl-text-muted">Econ</span></p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
