import { motion } from 'framer-motion';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';
import { Shield, Zap } from 'lucide-react';

interface BowlingRoleImpactProps {
  players: PlayerMatchRecord[];
}

export const BowlingRoleImpact = ({ players }: BowlingRoleImpactProps) => {
  const roles = useMemo(() => {
    const stats = new Map<string, { w: number, runs: number, balls: number }>();

    players.forEach(p => {
      if (!p.isBowler) return;
      const s = stats.get(p.player) || { w: 0, runs: 0, balls: 0 };
      s.w += p.wickets || 0;
      s.runs += p.bowlingRuns || 0;
      s.balls += p.bowlingBalls || 0;
      stats.set(p.player, s);
    });

    const arr = Array.from(stats.entries()).filter(s => s[1].balls >= 120).map(([name, s]) => ({
      name,
      ...s,
      sr: s.w > 0 ? s.balls / s.w : 999,
      econ: s.runs / (s.balls / 6)
    }));

    const strike = [...arr].sort((a,b) => a.sr - b.sr).slice(0, 5);
    const econ = [...arr].sort((a,b) => a.econ - b.econ).slice(0, 5);

    return { strike, econ };
  }, [players]);

  if (roles.strike.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Bowling Role Impact</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="flex items-center gap-2 font-bold text-ipl-primary mb-4 border-b border-ipl-border pb-2">
            <Zap size={18} /> Elite Strike Bowlers
          </h4>
          <div className="flex flex-col gap-3">
            {roles.strike.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                <span className="font-bold text-ipl-text text-sm">{p.name}</span>
                <span className="text-ipl-primary font-bold">{p.sr.toFixed(1)} <span className="text-[10px] text-ipl-text-muted">SR</span></span>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="flex items-center gap-2 font-bold text-[#10B981] mb-4 border-b border-ipl-border pb-2">
            <Shield size={18} /> Economy Masters
          </h4>
          <div className="flex flex-col gap-3">
            {roles.econ.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex justify-between items-center bg-black/20 p-2 rounded-lg">
                <span className="font-bold text-ipl-text text-sm">{p.name}</span>
                <span className="text-[#10B981] font-bold">{p.econ.toFixed(1)} <span className="text-[10px] text-ipl-text-muted">ECON</span></span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
