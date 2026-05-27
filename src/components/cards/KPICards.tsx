import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Hash, Trophy, XCircle, Percent } from 'lucide-react';

interface KPICardsProps {
  totalMatches: number;
  tossWinnerWins: number;
  tossLoserWins: number;
}

export const KPICards = ({ totalMatches, tossWinnerWins, tossLoserWins }: KPICardsProps) => {
  const advantage = totalMatches > 0 ? ((tossWinnerWins / totalMatches) * 100).toFixed(1) : '0.0';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard title="Total Matches" value={totalMatches} icon={<Hash size={24} className="text-ipl-text-muted" />} color="bg-white/10" />
      <KPICard title="Toss Winner Wins" value={tossWinnerWins} icon={<Trophy size={24} className="text-white" />} color="bg-ipl-primary" isHighlighted />
      <KPICard title="Toss Loser Wins" value={tossLoserWins} icon={<XCircle size={24} className="text-white" />} color="bg-ipl-accent" isHighlighted />
      <KPICard title="Advantage %" value={parseFloat(advantage)} isPercent icon={<Percent size={24} className="text-white" />} color="bg-ipl-success" isHighlighted />
    </div>
  );
};

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  isPercent?: boolean;
  isHighlighted?: boolean;
}

const KPICard = ({ title, value, icon, color, isPercent = false, isHighlighted = false }: KPICardProps) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    // Simple count-up animation
    const duration = 1000;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // ease out quad
      const current = end * (1 - (1 - progress) * (1 - progress));
      
      if (frame === totalFrames) {
        setDisplayValue(end);
        clearInterval(counter);
      } else {
        setDisplayValue(current);
      }
    }, frameDuration);
    
    return () => clearInterval(counter);
  }, [value]);

  const formattedValue = isPercent 
    ? displayValue.toFixed(1) + '%'
    : Math.round(displayValue).toLocaleString();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`glass-card p-6 flex items-center justify-between overflow-hidden relative group`}
    >
      {/* Decorative gradient blob */}
      {isHighlighted && (
        <div className={`absolute -right-10 -bottom-10 w-32 h-32 ${color} rounded-full opacity-20 blur-3xl group-hover:opacity-40 transition-opacity duration-500`}></div>
      )}
      
      <div>
        <h4 className="text-sm font-medium text-ipl-text-muted mb-2">{title}</h4>
        <div className="text-3xl font-bold font-mono tracking-tight text-white">
          {formattedValue}
        </div>
      </div>
      
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} ${!isHighlighted ? 'border border-white/10' : 'shadow-lg'}`}>
        {icon}
      </div>
    </motion.div>
  );
};
