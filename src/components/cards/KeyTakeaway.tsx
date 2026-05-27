import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import type { VenueInsight } from '../../types';

interface KeyTakeawayProps {
  insight?: string;
  totalMatches?: number;
  tossWinnerWins?: number;
  venuesData?: VenueInsight[];
}

export const KeyTakeaway = ({ insight, totalMatches, tossWinnerWins, venuesData }: KeyTakeawayProps) => {
  
  if (insight) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-ipl-primary/20 via-ipl-primary-dark/20 to-ipl-bg-card border border-ipl-primary/30 rounded-xl p-6 mb-8 flex items-start sm:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute -left-4 -top-4 w-24 h-24 bg-ipl-primary/20 rounded-full blur-2xl"></div>
        
        <div className="p-3 bg-ipl-primary/20 rounded-full shrink-0 relative z-10">
          <Lightbulb className="text-ipl-primary" size={24} />
        </div>
        
        <div className="relative z-10">
          <h4 className="text-sm font-bold text-ipl-primary uppercase tracking-wider mb-1">Key Takeaway</h4>
          <p className="text-lg text-ipl-text font-medium leading-relaxed">
            {insight}
          </p>
        </div>
      </motion.div>
    );
  }

  if (totalMatches === undefined || tossWinnerWins === undefined || !venuesData) return null;
  if (totalMatches === 0) return null;

  const winRate = ((tossWinnerWins / totalMatches) * 100).toFixed(1);
  
  const validVenues = venuesData.filter(v => v.matches >= 5);
  let topVenueStr = "";
  
  if (validVenues.length > 0) {
    const topVenue = validVenues.reduce((prev, current) => 
      (current.tossWinnerWinRate > prev.tossWinnerWinRate) ? current : prev
    );
    topVenueStr = ` The strongest toss advantage occurred at ${topVenue.venue}, where toss winners won ${(topVenue.tossWinnerWinRate * 100).toFixed(1)}% of matches.`;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-ipl-primary/20 via-ipl-primary-dark/20 to-ipl-bg-card border border-ipl-primary/30 rounded-xl p-6 mb-8 flex items-start sm:items-center gap-4 relative overflow-hidden"
    >
      <div className="absolute -left-4 -top-4 w-24 h-24 bg-ipl-primary/20 rounded-full blur-2xl"></div>
      
      <div className="p-3 bg-ipl-primary/20 rounded-full shrink-0 relative z-10">
        <Lightbulb className="text-ipl-primary" size={24} />
      </div>
      
      <div className="relative z-10">
        <h4 className="text-sm font-bold text-ipl-primary uppercase tracking-wider mb-1">Key Takeaway</h4>
        <p className="text-lg text-ipl-text font-medium leading-relaxed">
          Across {totalMatches.toLocaleString()} selected IPL matches, teams winning the toss won <span className="text-ipl-primary font-bold">{winRate}%</span> of games.{topVenueStr}
        </p>
      </div>
    </motion.div>
  );
};
