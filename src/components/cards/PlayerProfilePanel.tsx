import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PlayerProfilePanelProps {
  playerName: string;
  onClose: () => void;
  playerStats: any;
  trendData: any[];
}

export const PlayerProfilePanel = ({ playerName, onClose, playerStats, trendData }: PlayerProfilePanelProps) => {
  if (!playerStats) return null;

  const initials = playerName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const radarDataBatting = [
    { subject: 'Average', A: Math.min(playerStats.average, 60) * (100/60) }, // Normalized to 100
    { subject: 'Strike Rate', A: Math.min(playerStats.strikeRate, 200) * (100/200) },
    { subject: 'Boundary %', A: ((playerStats.fours * 4 + playerStats.sixes * 6) / (playerStats.runs || 1)) * 100 },
    { subject: 'Consistency', A: Math.min(playerStats.average * 2, 100) },
    { subject: 'Six Hitting', A: Math.min(playerStats.sixes * 5, 100) },
  ];

  const radarDataBowling = [
    { subject: 'Economy', A: 100 - (Math.min(playerStats.economy, 12) * (100/12)) }, // Lower economy is better
    { subject: 'Strike Rate', A: 100 - (Math.min(playerStats.bowlingStrikeRate, 30) * (100/30)) }, // Lower SR is better
    { subject: 'Average', A: 100 - (Math.min(playerStats.bowlingAverage, 40) * (100/40)) },
    { subject: 'Dot Ball %', A: (playerStats.dotBalls / (playerStats.bowlingBalls || 1)) * 100 },
    { subject: 'Wicket Threat', A: Math.min(playerStats.wickets * 5, 100) },
  ];

  const radarData = playerStats.isBatter ? radarDataBatting : radarDataBowling;

  return (
    <motion.div 
      initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }}
      className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-ipl-bg-card border-l border-ipl-border z-50 shadow-2xl p-6 overflow-y-auto"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full border-2 border-ipl-primary flex items-center justify-center bg-ipl-bg-dark text-xl font-bold text-ipl-primary">
            {initials}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-ipl-text">{playerName}</h2>
            <p className="text-ipl-text-muted">{playerStats.team}</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-ipl-text transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {playerStats.isBatter && (
          <>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Runs</span>
              <div className="text-2xl font-bold text-ipl-primary">{playerStats.runs}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Strike Rate</span>
              <div className="text-2xl font-bold text-ipl-success">{playerStats.strikeRate.toFixed(1)}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Average</span>
              <div className="text-2xl font-bold text-ipl-accent">{playerStats.average.toFixed(1)}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Sixes</span>
              <div className="text-2xl font-bold text-white">{playerStats.sixes}</div>
            </div>
          </>
        )}
        {playerStats.isBowler && !playerStats.isBatter && (
          <>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Wickets</span>
              <div className="text-2xl font-bold text-ipl-primary">{playerStats.wickets}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Economy</span>
              <div className="text-2xl font-bold text-ipl-success">{playerStats.economy.toFixed(2)}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Average</span>
              <div className="text-2xl font-bold text-ipl-accent">{playerStats.bowlingAverage.toFixed(1)}</div>
            </div>
            <div className="bg-ipl-bg-dark p-4 rounded-xl border border-white/5">
              <span className="text-ipl-text-muted text-xs uppercase font-bold">Dot Balls</span>
              <div className="text-2xl font-bold text-white">{playerStats.dotBalls}</div>
            </div>
          </>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold text-ipl-text mb-4">Skill Profile</h3>
        <div className="h-[250px] bg-ipl-bg-dark rounded-xl border border-white/5 pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="#ffffff20" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#CBD5E1', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name={playerName} dataKey="A" stroke="#00D4FF" fill="#00D4FF" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-ipl-text mb-4">Performance Trend</h3>
        <div className="h-[200px] bg-ipl-bg-dark rounded-xl border border-white/5 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="date" hide />
              <YAxis stroke="#CBD5E1" tick={{ fontSize: 10 }} width={30} />
              <Tooltip cursor={{ stroke: '#ffffff20' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
              <Line type="monotone" dataKey={playerStats.isBatter ? 'runs' : 'wickets'} stroke="#FF6B35" strokeWidth={2} dot={{ r: 2, fill: '#FF6B35' }} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

    </motion.div>
  );
};
