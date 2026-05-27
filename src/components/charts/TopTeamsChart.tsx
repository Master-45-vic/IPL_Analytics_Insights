import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export interface TeamTossInsight {
  team: string;
  matches: number;
  tossWinnerWins: number;
  tossLoserWins: number;
  tossWinnerWinRate: number;
  tossLoserWinRate: number;
}

interface TopTeamsChartProps {
  teamsData: TeamTossInsight[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-ipl-bg-card/90 backdrop-blur-md border border-ipl-border p-3 rounded-xl shadow-2xl">
        <p className="font-bold text-ipl-text mb-1">{data.team}</p>
        <p className="text-sm text-ipl-text-muted">Matches (Won Toss): {data.matches}</p>
        <p className="text-sm font-bold text-ipl-primary mt-1">
          Win Rate When Winning Toss: {(data.tossWinnerWinRate * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

export const TopTeamsChart = ({ teamsData }: TopTeamsChartProps) => {
  // Filter teams with at least 5 matches where they won the toss, and sort by win rate
  const sortedTeams = [...teamsData]
    .filter(t => t.matches >= 5)
    .sort((a, b) => b.tossWinnerWinRate - a.tossWinnerWinRate)
    .slice(0, 5) // Top 5
    .map(t => ({
      ...t,
      winRatePercent: parseFloat((t.tossWinnerWinRate * 100).toFixed(1)),
      shortName: t.team.replace(' Challengers', '').replace(' Super', '').replace(' Kings', '').replace(' Indians', '').replace(' Capitals', '').replace(' Sunrisers', '').replace(' Royals', '').replace(' Knight', '') // simple shortening for display if needed
    }));

  if (sortedTeams.length === 0) return <div className="h-full flex items-center justify-center text-ipl-text-muted">Not enough data</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-[300px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedTeams}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 40, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 100]}
            stroke="var(--theme-text-muted, #CBD5E1)" 
            tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} 
            tickFormatter={(val) => `${val}%`}
          />
          <YAxis 
            dataKey="shortName" 
            type="category" 
            stroke="var(--theme-text-muted, #CBD5E1)" 
            tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 11 }}
            width={100}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} content={<CustomTooltip />} />
          <Bar 
            dataKey="winRatePercent" 
            fill="var(--theme-primary, #00D4FF)" 
            radius={[0, 4, 4, 0]} 
            animationDuration={1500}
            barSize={20}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
