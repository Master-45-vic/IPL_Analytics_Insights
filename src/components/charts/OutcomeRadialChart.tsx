import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';
import { motion } from 'framer-motion';

interface OutcomeRadialChartProps {
  tossWinnerWins: number;
  tossLoserWins: number;
}

export const OutcomeRadialChart = ({ tossWinnerWins, tossLoserWins }: OutcomeRadialChartProps) => {
  const total = tossWinnerWins + tossLoserWins;
  if (total === 0) return <div className="h-full flex items-center justify-center text-ipl-text-muted">No data available</div>;

  const winRate = (tossWinnerWins / total) * 100;

  const data = [
    {
      name: 'Advantage',
      value: winRate,
      fill: 'var(--theme-primary, #00D4FF)'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="h-[300px] w-full relative flex items-center justify-center"
    >
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none flex-col">
        <span className="text-4xl font-extrabold text-ipl-text">{winRate.toFixed(1)}%</span>
        <span className="text-xs text-ipl-text-muted uppercase tracking-widest mt-2 font-medium">Toss Winner</span>
        <span className="text-xs text-ipl-text-muted uppercase tracking-widest font-medium">Win Rate</span>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="75%" 
          outerRadius="90%" 
          barSize={15} 
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: 'var(--theme-border, rgba(255,255,255,0.05))' }}
            dataKey="value"
            cornerRadius={10}
            animationDuration={1500}
            animationBegin={200}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
