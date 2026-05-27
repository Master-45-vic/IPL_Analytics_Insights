import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface OutcomeDonutChartProps {
  tossWinnerWins: number;
  tossLoserWins: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-ipl-bg-card/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
        <span className="text-white font-medium">{data.name}:</span>
        <span className="font-bold text-white ml-2">{data.value}</span>
      </div>
    );
  }
  return null;
};

export const OutcomeDonutChart = ({ tossWinnerWins, tossLoserWins }: OutcomeDonutChartProps) => {
  const total = tossWinnerWins + tossLoserWins;
  if (total === 0) return <div className="h-full flex items-center justify-center text-white/50">No data available</div>;

  const data = [
    { name: 'Toss Winner Victory', value: tossWinnerWins, color: '#00D4FF' },
    { name: 'Toss Loser Victory', value: tossLoserWins, color: '#FF6B35' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-[300px] w-full relative"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
        <span className="text-3xl font-bold text-white">{total}</span>
        <span className="text-xs text-ipl-text-muted uppercase tracking-widest mt-1">Matches</span>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            paddingAngle={5}
            dataKey="value"
            animationDuration={1500}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(255,255,255,0.05)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            formatter={(value) => <span className="text-ipl-text-muted text-sm">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
