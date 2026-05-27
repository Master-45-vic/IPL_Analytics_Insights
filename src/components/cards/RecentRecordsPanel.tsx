import { Trophy, ArrowUp, ArrowDown, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import type { IPLMatch } from '../../types';

interface RecentRecordsPanelProps {
  matches: IPLMatch[];
}

export const RecentRecordsPanel = ({ matches }: RecentRecordsPanelProps) => {
  if (matches.length === 0) return null;

  let highestScore = 0;
  let highestScoreTeam = "";
  
  let lowestScore = 999;
  let lowestScoreTeam = "";
  
  let biggestWin = 0;
  let biggestWinTeam = "";
  
  let highestChase = 0;
  let highestChaseTeam = "";

  matches.forEach(match => {
    const t1Runs = Number(match.innings1_powerplay || 0) + Number(match.innings1_middle || 0) + Number(match.innings1_death || 0);
    const t2Runs = Number(match.innings2_powerplay || 0) + Number(match.innings2_middle || 0) + Number(match.innings2_death || 0);

    // Highest Score
    if (t1Runs > highestScore) { highestScore = t1Runs; highestScoreTeam = match.innings1_team; }
    if (t2Runs > highestScore) { highestScore = t2Runs; highestScoreTeam = match.innings2_team; }

    // Lowest Score (ignore 0s which might be abandoned matches)
    if (t1Runs > 0 && t1Runs < lowestScore) { lowestScore = t1Runs; lowestScoreTeam = match.innings1_team; }
    if (t2Runs > 0 && t2Runs < lowestScore) { lowestScore = t2Runs; lowestScoreTeam = match.innings2_team; }

    // Biggest Win (Runs)
    const winByRuns = Number(match.win_by_runs || 0);
    if (winByRuns > biggestWin) {
      biggestWin = winByRuns;
      biggestWinTeam = match.winner;
    }

    // Highest Chase (Team 2 won)
    if (match.winner === match.innings2_team && t2Runs > highestChase) {
      highestChase = t2Runs;
      highestChaseTeam = match.innings2_team;
    }
  });

  const records = [
    { label: 'Highest Score', value: highestScore, team: highestScoreTeam, icon: <ArrowUp size={16} className="text-ipl-success" /> },
    { label: 'Lowest Score', value: lowestScore === 999 ? 0 : lowestScore, team: lowestScoreTeam, icon: <ArrowDown size={16} className="text-ipl-accent" /> },
    { label: 'Biggest Win (Runs)', value: biggestWin, team: biggestWinTeam, icon: <Trophy size={16} className="text-yellow-400" /> },
    { label: 'Highest Chase', value: highestChase, team: highestChaseTeam, icon: <Target size={16} className="text-ipl-primary" /> },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {records.map((rec, i) => (
        <motion.div 
          key={rec.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-4 flex flex-col justify-center border-t-2 border-t-ipl-border hover:border-t-ipl-primary transition-colors"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold text-ipl-text-muted uppercase tracking-wider">{rec.label}</span>
            {rec.icon}
          </div>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-extrabold text-ipl-text">{rec.value}</span>
            <span className="text-sm text-ipl-text-muted mb-1 truncate max-w-[80px]" title={rec.team}>{rec.team || 'N/A'}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
