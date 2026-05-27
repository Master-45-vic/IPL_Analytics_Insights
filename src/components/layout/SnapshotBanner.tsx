import { motion } from 'framer-motion';
import { usePlayersData } from '../../hooks/usePlayersData';
import type { MatchFilterState } from '../../types';

interface SnapshotBannerProps {
  filters: MatchFilterState;
  totalMatches: number;
}

export const SnapshotBanner = ({ filters, totalMatches }: SnapshotBannerProps) => {
  const { filteredPlayers, loading } = usePlayersData('/players.json', filters);

  if (loading) return <div className="h-20 bg-ipl-bg-card animate-pulse" />;

  let totalRuns = 0;
  let totalWickets = 0;
  let totalSixes = 0;
  let totalFours = 0;

  filteredPlayers.forEach(p => {
    totalRuns += p.runs || 0;
    totalSixes += p.sixes || 0;
    totalFours += p.fours || 0;
    totalWickets += p.wickets || 0;
  });

  const uniquePlayers = new Set(filteredPlayers.map(p => p.player)).size;

  const items = [
    { label: 'Matches', value: totalMatches.toLocaleString() },
    { label: 'Players', value: uniquePlayers.toLocaleString() },
    { label: 'Total Runs', value: totalRuns.toLocaleString() },
    { label: 'Wickets', value: totalWickets.toLocaleString() },
    { label: 'Sixes', value: totalSixes.toLocaleString() },
    { label: 'Fours', value: totalFours.toLocaleString() }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-ipl-bg-card via-ipl-bg-dark to-ipl-bg-card border-b border-ipl-border sticky top-16 z-40 shadow-lg shadow-black/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto hide-scrollbar">
        <div className="flex items-center justify-between min-w-max gap-8">
          {items.map((item, idx) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-ipl-text-muted text-[10px] font-bold uppercase tracking-wider mb-0.5">{item.label}</span>
              <span className="text-ipl-text text-lg font-extrabold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
