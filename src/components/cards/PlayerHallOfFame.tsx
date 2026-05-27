import { motion } from 'framer-motion';
import { Trophy, Star, Target, Shield, Zap, TrendingUp } from 'lucide-react';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface PlayerHallOfFameProps {
  players: PlayerMatchRecord[];
}

export const PlayerHallOfFame = ({ players }: PlayerHallOfFameProps) => {
  const records = useMemo(() => {
    const agg = new Map<string, any>();

    players.forEach(p => {
      const s = agg.get(p.player) || { runs: 0, wickets: 0, sixes: 0, fours: 0, ballsFaced: 0, bowlingRuns: 0, bowlingBalls: 0 };
      s.runs += p.runs || 0;
      s.wickets += p.wickets || 0;
      s.sixes += p.sixes || 0;
      s.fours += p.fours || 0;
      s.ballsFaced += p.ballsFaced || 0;
      s.bowlingRuns += p.bowlingRuns || 0;
      s.bowlingBalls += p.bowlingBalls || 0;
      agg.set(p.player, s);
    });

    const arr = Array.from(agg.entries()).map(([name, stats]) => ({
      name,
      ...stats,
      sr: stats.ballsFaced > 0 ? (stats.runs / stats.ballsFaced) * 100 : 0,
      econ: stats.bowlingBalls > 0 ? (stats.bowlingRuns / (stats.bowlingBalls / 6)) : 999
    }));

    const fallback = { name: 'N/A', runs: 0, wickets: 0, sixes: 0, fours: 0, sr: 0, econ: 0 };
    const topRuns = arr.sort((a,b) => b.runs - a.runs)[0] || fallback;
    const topWickets = arr.sort((a,b) => b.wickets - a.wickets)[0] || fallback;
    const topSixes = arr.sort((a,b) => b.sixes - a.sixes)[0] || fallback;
    const topFours = arr.sort((a,b) => b.fours - a.fours)[0] || fallback;
    const topSR = arr.filter(a => a.runs >= 200).sort((a,b) => b.sr - a.sr)[0] || fallback;
    const topEcon = arr.filter(a => a.bowlingBalls >= 120).sort((a,b) => a.econ - b.econ)[0] || fallback;

    return { topRuns, topWickets, topSixes, topFours, topSR, topEcon };
  }, [players]);

  if (!records.topRuns || records.topRuns.name === 'N/A') return null;

  const Avatar = ({ name, color }: { name: string, color: string }) => {
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return (
      <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center font-bold text-white shadow-lg mr-4`}>
        {initials}
      </div>
    );
  };

  const cards = [
    { title: 'Most Runs', player: records.topRuns, value: records.topRuns.runs, unit: 'Runs', icon: <Trophy size={20} />, color: 'bg-gradient-to-br from-yellow-400 to-yellow-600' },
    { title: 'Most Wickets', player: records.topWickets, value: records.topWickets.wickets, unit: 'Wickets', icon: <Target size={20} />, color: 'bg-gradient-to-br from-purple-400 to-purple-600' },
    { title: 'Most Sixes', player: records.topSixes, value: records.topSixes.sixes, unit: 'Sixes', icon: <Star size={20} />, color: 'bg-gradient-to-br from-blue-400 to-blue-600' },
    { title: 'Most Fours', player: records.topFours, value: records.topFours.fours, unit: 'Fours', icon: <TrendingUp size={20} />, color: 'bg-gradient-to-br from-green-400 to-green-600' },
    { title: 'Best Strike Rate (Min 200 Runs)', player: records.topSR, value: records.topSR.sr.toFixed(1), unit: 'SR', icon: <Zap size={20} />, color: 'bg-gradient-to-br from-red-400 to-red-600' },
    { title: 'Best Economy (Min 20 Overs)', player: records.topEcon, value: records.topEcon.econ.toFixed(1), unit: 'Econ', icon: <Shield size={20} />, color: 'bg-gradient-to-br from-teal-400 to-teal-600' },
  ];

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-extrabold text-ipl-text mb-6">Hall of Fame</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((c, i) => (
          <motion.div 
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5 relative overflow-hidden group border-l-4 border-l-ipl-primary hover:bg-white/5 transition-all"
          >
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity transform scale-150">
              {c.icon}
            </div>
            <p className="text-xs font-bold text-ipl-text-muted uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-ipl-primary">{c.icon}</span> {c.title}
            </p>
            <div className="flex items-center">
              <Avatar name={c.player.name} color={c.color} />
              <div>
                <h4 className="text-lg font-bold text-ipl-text truncate max-w-[150px]" title={c.player.name}>{c.player.name}</h4>
                <p className="text-2xl font-extrabold text-ipl-primary mt-1">
                  {c.value} <span className="text-sm font-normal text-ipl-text-muted">{c.unit}</span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
