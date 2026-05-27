import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface BattingStyleDistributionProps {
  players: PlayerMatchRecord[];
}

export const BattingStyleDistribution = ({ players }: BattingStyleDistributionProps) => {
  const chartData = useMemo(() => {
    const pStats = new Map<string, { runs: number, balls: number, outs: number }>();

    players.forEach(p => {
      if (!p.isBatter) return;
      const s = pStats.get(p.player) || { runs: 0, balls: 0, outs: 0 };
      s.runs += p.runs || 0;
      s.balls += p.ballsFaced || 0;
      s.outs += p.isOut || 0;
      pStats.set(p.player, s);
    });

    let power = 0, agg = 0, anchor = 0, accum = 0;

    pStats.forEach(s => {
      if (s.runs < 100) return; // Min 100 runs
      const sr = (s.runs / s.balls) * 100;
      const avg = s.outs > 0 ? s.runs / s.outs : s.runs;

      if (sr >= 150) power++;
      else if (sr >= 135) agg++;
      else if (avg >= 30) anchor++;
      else accum++;
    });

    return [
      { name: 'Power Hitters (SR > 150)', value: power, fill: '#FF6B35' },
      { name: 'Aggressive (SR 135-150)', value: agg, fill: '#10B981' },
      { name: 'Anchors (Avg > 30)', value: anchor, fill: '#3B82F6' },
      { name: 'Accumulators (Avg < 30)', value: accum, fill: '#64748B' },
    ].filter(d => d.value > 0);
  }, [players]);

  if (chartData.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Batting Style Distribution</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={2} dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
            <Legend layout="vertical" verticalAlign="middle" align="right" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
