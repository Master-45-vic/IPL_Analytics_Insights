import { motion } from 'framer-motion';
import { Target, Zap, ShieldAlert } from 'lucide-react';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface MatchMomentumCardProps {
  matches: IPLMatch[];
}

export const MatchMomentumCard = ({ matches }: MatchMomentumCardProps) => {
  const insights = useMemo(() => {
    let pp60Wins = 0, pp60Total = 0;
    let death60Wins = 0, death60Total = 0;
    let mid90Wins = 0, mid90Total = 0;

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result') return;

      const checkInnings = (runs: number, phase: 'pp' | 'mid' | 'death', isWin: boolean) => {
        if (phase === 'pp' && runs >= 60) { pp60Total++; if (isWin) pp60Wins++; }
        if (phase === 'mid' && runs >= 90) { mid90Total++; if (isWin) mid90Wins++; }
        if (phase === 'death' && runs >= 60) { death60Total++; if (isWin) death60Wins++; }
      };

      const isT1Win = m.winner === m.innings1_team;
      
      checkInnings(Number(m.innings1_powerplay||0), 'pp', isT1Win);
      checkInnings(Number(m.innings1_middle||0), 'mid', isT1Win);
      checkInnings(Number(m.innings1_death||0), 'death', isT1Win);

      checkInnings(Number(m.innings2_powerplay||0), 'pp', !isT1Win);
      checkInnings(Number(m.innings2_middle||0), 'mid', !isT1Win);
      checkInnings(Number(m.innings2_death||0), 'death', !isT1Win);
    });

    const ppRate = pp60Total > 0 ? (pp60Wins / pp60Total) * 100 : 0;
    const midRate = mid90Total > 0 ? (mid90Wins / mid90Total) * 100 : 0;
    const deathRate = death60Total > 0 ? (death60Wins / death60Total) * 100 : 0;

    return [
      { 
        title: "Powerplay Dominance", 
        desc: `Teams scoring 60+ runs in the Powerplay win ${ppRate.toFixed(1)}% of matches.`,
        icon: <Zap className="text-yellow-400" size={24} /> 
      },
      { 
        title: "Middle Over Control", 
        desc: `Teams scoring 90+ runs in the Middle Overs win ${midRate.toFixed(1)}% of matches.`,
        icon: <ShieldAlert className="text-ipl-primary" size={24} /> 
      },
      { 
        title: "Death Over Explosion", 
        desc: `Teams scoring 60+ runs in the Death Overs win ${deathRate.toFixed(1)}% of matches.`,
        icon: <Target className="text-[#00D4FF]" size={24} /> 
      }
    ];
  }, [matches]);

  if (matches.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Match Momentum & Win Probability</h3>
      <div className="flex flex-col gap-4 flex-1 justify-center">
        {insights.map((item, i) => (
          <motion.div 
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-ipl-border hover:border-ipl-primary/50 transition-colors"
          >
            <div className="p-3 bg-white/5 rounded-full">
              {item.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-ipl-text uppercase tracking-wider">{item.title}</h4>
              <p className="text-ipl-text-muted">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
