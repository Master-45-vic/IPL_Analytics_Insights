import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface CapTimelineProps {
  players: PlayerMatchRecord[];
}

export const CapTimeline = ({ players }: CapTimelineProps) => {
  const chartData = useMemo(() => {
    const seasonData = new Map<string, Map<string, { runs: number, wickets: number }>>();

    players.forEach(p => {
      if (!p.season) return;
      const sMap = seasonData.get(p.season) || new Map<string, { runs: number, wickets: number }>();
      const stats = sMap.get(p.player) || { runs: 0, wickets: 0 };
      stats.runs += p.runs || 0;
      stats.wickets += p.wickets || 0;
      sMap.set(p.player, stats);
      seasonData.set(p.season, sMap);
    });

    return Array.from(seasonData.entries()).map(([season, sMap]) => {
      let orangeRuns = 0, orangePlayer = "";
      let purpleWickets = 0, purplePlayer = "";

      sMap.forEach((stats, player) => {
        if (stats.runs > orangeRuns) { orangeRuns = stats.runs; orangePlayer = player; }
        if (stats.wickets > purpleWickets) { purpleWickets = stats.wickets; purplePlayer = player; }
      });

      return {
        season,
        OrangeRuns: orangeRuns,
        OrangePlayer: orangePlayer,
        PurpleWickets: purpleWickets,
        PurplePlayer: purplePlayer
      };
    }).sort((a, b) => a.season.localeCompare(b.season));

  }, [players]);

  if (chartData.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-ipl-bg-card border border-ipl-border p-4 rounded-lg shadow-xl min-w-[200px]">
          <p className="font-bold text-ipl-text mb-3 border-b border-ipl-border pb-2">{label}</p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-1">Orange Cap</p>
              <p className="text-sm font-bold text-ipl-text">{payload[0]?.payload.OrangePlayer}</p>
              <p className="text-lg font-extrabold text-orange-400">{payload[0]?.value} <span className="text-xs font-normal">Runs</span></p>
            </div>
            <div>
              <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Purple Cap</p>
              <p className="text-sm font-bold text-ipl-text">{payload[1]?.payload.PurplePlayer}</p>
              <p className="text-lg font-extrabold text-purple-400">{payload[1]?.value} <span className="text-xs font-normal">Wickets</span></p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Orange & Purple Cap Evolution</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
            <XAxis dataKey="season" stroke="var(--theme-text-muted, #CBD5E1)" angle={-45} textAnchor="end" height={60} />
            <YAxis yAxisId="left" stroke="var(--theme-text-muted, #CBD5E1)" domain={[400, 1000]} />
            <YAxis yAxisId="right" orientation="right" stroke="var(--theme-text-muted, #CBD5E1)" domain={[15, 35]} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--theme-border, #ffffff20)', strokeWidth: 2 }} />
            <Legend />
            <Line yAxisId="left" type="monotone" dataKey="OrangeRuns" name="Orange Cap (Runs)" stroke="#F97316" strokeWidth={3} dot={{ r: 4, fill: '#F97316' }} activeDot={{ r: 6 }} />
            <Line yAxisId="right" type="monotone" dataKey="PurpleWickets" name="Purple Cap (Wickets)" stroke="#A855F7" strokeWidth={3} dot={{ r: 4, fill: '#A855F7' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
