import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { IPLMatch, MatchFilterState } from '../../types';
import { usePlayersData } from '../../hooks/usePlayersData';
import { useMemo } from 'react';

interface WinningTeamProfileProps {
  matches: IPLMatch[];
  filters: MatchFilterState;
}

export const WinningTeamProfile = ({ matches, filters }: WinningTeamProfileProps) => {
  const { filteredPlayers, loading } = usePlayersData('/players.json', filters);

  const chartData = useMemo(() => {
    if (matches.length === 0 || filteredPlayers.length === 0) return [];

    let winPP = 0, winMid = 0, winDeath = 0, winTotal = 0;
    let losePP = 0, loseMid = 0, loseDeath = 0, loseTotal = 0;
    let win4s = 0, win6s = 0;
    let lose4s = 0, lose6s = 0;

    let validMatches = 0;

    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result') return;
      validMatches++;

      const isT1Winner = m.winner === m.innings1_team;
      const t1Total = Number(m.innings1_powerplay||0) + Number(m.innings1_middle||0) + Number(m.innings1_death||0);
      const t2Total = Number(m.innings2_powerplay||0) + Number(m.innings2_middle||0) + Number(m.innings2_death||0);

      if (isT1Winner) {
        winPP += Number(m.innings1_powerplay||0); winMid += Number(m.innings1_middle||0); winDeath += Number(m.innings1_death||0);
        winTotal += t1Total;
        losePP += Number(m.innings2_powerplay||0); loseMid += Number(m.innings2_middle||0); loseDeath += Number(m.innings2_death||0);
        loseTotal += t2Total;
      } else {
        winPP += Number(m.innings2_powerplay||0); winMid += Number(m.innings2_middle||0); winDeath += Number(m.innings2_death||0);
        winTotal += t2Total;
        losePP += Number(m.innings1_powerplay||0); loseMid += Number(m.innings1_middle||0); loseDeath += Number(m.innings1_death||0);
        loseTotal += t1Total;
      }
    });

    const matchWinners = new Set(matches.filter(m => m.winner && m.winner !== 'No Result').map(m => `${m.match_id}-${m.winner}`));

    filteredPlayers.forEach(p => {
      if (!p.isBatter) return;
      const isWinner = matchWinners.has(`${p.match_id}-${p.team}`);
      if (isWinner) {
        win4s += p.fours || 0;
        win6s += p.sixes || 0;
      } else {
        lose4s += p.fours || 0;
        lose6s += p.sixes || 0;
      }
    });

    if (validMatches === 0) return [];

    return [
      { metric: 'Total Runs', WinningTeam: winTotal/validMatches, LosingTeam: loseTotal/validMatches, fullMark: Math.max(winTotal/validMatches, loseTotal/validMatches) * 1.2 },
      { metric: 'Powerplay Runs', WinningTeam: winPP/validMatches, LosingTeam: losePP/validMatches, fullMark: Math.max(winPP/validMatches, losePP/validMatches) * 1.2 },
      { metric: 'Middle Overs', WinningTeam: winMid/validMatches, LosingTeam: loseMid/validMatches, fullMark: Math.max(winMid/validMatches, loseMid/validMatches) * 1.2 },
      { metric: 'Death Overs', WinningTeam: winDeath/validMatches, LosingTeam: loseDeath/validMatches, fullMark: Math.max(winDeath/validMatches, loseDeath/validMatches) * 1.2 },
      { metric: 'Boundaries (4s)', WinningTeam: win4s/validMatches, LosingTeam: lose4s/validMatches, fullMark: Math.max(win4s/validMatches, lose4s/validMatches) * 1.2 },
      { metric: 'Sixes', WinningTeam: win6s/validMatches, LosingTeam: lose6s/validMatches, fullMark: Math.max(win6s/validMatches, lose6s/validMatches) * 1.2 }
    ];
  }, [matches, filteredPlayers]);

  if (loading || chartData.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Winning Team Profile</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="var(--theme-border, #ffffff20)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} formatter={(val: any) => Number(val).toFixed(1)} />
            <Legend />
            <Radar name="Winning Teams" dataKey="WinningTeam" stroke="#10B981" fill="#10B981" fillOpacity={0.4} />
            <Radar name="Losing Teams" dataKey="LosingTeam" stroke="#EF4444" fill="#EF4444" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
