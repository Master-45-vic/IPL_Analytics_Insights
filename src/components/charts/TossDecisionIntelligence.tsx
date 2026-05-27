import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';

interface TossDecisionIntelligenceProps {
  matches: IPLMatch[];
}

export const TossDecisionIntelligence = ({ matches }: TossDecisionIntelligenceProps) => {
  const chartData = useMemo(() => {
    let batWon = 0, batLost = 0;
    let fieldWon = 0, fieldLost = 0;

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result' || !m.toss_decision || !m.toss_winner) return;
      
      const tossWinnerWonMatch = m.toss_winner === m.winner;
      
      if (m.toss_decision.toLowerCase() === 'bat') {
        if (tossWinnerWonMatch) batWon++;
        else batLost++;
      } else {
        if (tossWinnerWonMatch) fieldWon++;
        else fieldLost++;
      }
    });

    return [
      { name: 'Bat First', 'Toss Winner Won': batWon, 'Toss Winner Lost': batLost },
      { name: 'Field First', 'Toss Winner Won': fieldWon, 'Toss Winner Lost': fieldLost }
    ];
  }, [matches]);

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Bat First vs Field First Success</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" />
            <YAxis stroke="var(--theme-text-muted, #CBD5E1)" />
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }} 
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} 
            />
            <Legend />
            <Bar dataKey="Toss Winner Won" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="Toss Winner Lost" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
