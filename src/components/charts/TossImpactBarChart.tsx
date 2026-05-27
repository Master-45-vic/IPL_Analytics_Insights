import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface TossImpactBarChartProps {
  data: {
    category: string;
    tossWinnerWins: number;
    tossLoserWins: number;
  }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-ipl-bg-card/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
        <p className="font-bold text-white mb-2 pb-2 border-b border-white/10">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2 text-sm my-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
            <span className="text-ipl-text-muted">{entry.name}:</span>
            <span className="font-bold text-white ml-auto">{entry.value} Wins</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TossImpactBarChart = ({ data }: TossImpactBarChartProps) => {
  if (!data || data.length === 0) return <div className="h-full flex items-center justify-center text-white/50">No data available</div>;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="h-[400px] w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="category" 
            stroke="#CBD5E1" 
            tick={{ fill: '#CBD5E1', fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: '#ffffff20' }}
          />
          <YAxis 
            stroke="#CBD5E1" 
            tick={{ fill: '#CBD5E1', fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip cursor={{ fill: '#ffffff05' }} content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="tossWinnerWins" 
            name="Toss Winner Won Match" 
            fill="#00D4FF" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
          <Bar 
            dataKey="tossLoserWins" 
            name="Toss Loser Won Match" 
            fill="#FF6B35" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
