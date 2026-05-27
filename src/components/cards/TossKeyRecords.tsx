import { TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import type { IPLMatch } from '../../types';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TossKeyRecordsProps {
  matches: IPLMatch[];
}

export const TossKeyRecords = ({ matches }: TossKeyRecordsProps) => {
  const records = useMemo(() => {
    const venueStats = new Map<string, { m: number, w: number }>();
    const seasonStats = new Map<string, { m: number, w: number }>();

    matches.forEach(match => {
      if (!match.winner || match.winner === 'No Result' || !match.toss_winner) return;
      const tossWonMatch = match.toss_winner === match.winner;
      
      if (match.venue) {
        const vs = venueStats.get(match.venue) || { m: 0, w: 0 };
        vs.m++;
        if (tossWonMatch) vs.w++;
        venueStats.set(match.venue, vs);
      }

      if (match.season) {
        const ss = seasonStats.get(match.season) || { m: 0, w: 0 };
        ss.m++;
        if (tossWonMatch) ss.w++;
        seasonStats.set(match.season, ss);
      }
    });

    let bestVenue = "", worstVenue = "", maxSeason = "", minSeason = "";
    let bestVRate = 0, worstVRate = 100, maxSRate = 0, minSRate = 100;

    venueStats.forEach((stats, venue) => {
      if (stats.m >= 5) {
        const rate = (stats.w / stats.m) * 100;
        if (rate > bestVRate) { bestVRate = rate; bestVenue = venue; }
        if (rate < worstVRate) { worstVRate = rate; worstVenue = venue; }
      }
    });

    seasonStats.forEach((stats, season) => {
      if (stats.m >= 10) {
        const rate = (stats.w / stats.m) * 100;
        if (rate > maxSRate) { maxSRate = rate; maxSeason = season; }
        if (rate < minSRate) { minSRate = rate; minSeason = season; }
      }
    });

    return {
      bestVenue, bestVRate, worstVenue, worstVRate,
      maxSeason, maxSRate, minSeason, minSRate
    };
  }, [matches]);

  if (!records.bestVenue) return null;

  const cards = [
    { label: 'Highest Toss Advantage Venue', value: records.bestVenue, sub: `${records.bestVRate.toFixed(1)}% Win Rate`, icon: <MapPin className="text-ipl-success" size={20} /> },
    { label: 'Lowest Toss Advantage Venue', value: records.worstVenue, sub: `${records.worstVRate.toFixed(1)}% Win Rate`, icon: <MapPin className="text-ipl-accent" size={20} /> },
    { label: 'Max Toss Impact Season', value: records.maxSeason, sub: `${records.maxSRate.toFixed(1)}% Win Rate`, icon: <TrendingUp className="text-ipl-primary" size={20} /> },
    { label: 'Min Toss Impact Season', value: records.minSeason, sub: `${records.minSRate.toFixed(1)}% Win Rate`, icon: <TrendingDown className="text-yellow-400" size={20} /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => (
        <motion.div 
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-5 relative overflow-hidden group"
        >
          <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {card.icon}
          </div>
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xs font-bold text-ipl-text-muted uppercase tracking-wider">{card.label}</h4>
            {card.icon}
          </div>
          <div className="truncate text-xl font-extrabold text-ipl-text mb-1" title={card.value}>{card.value}</div>
          <div className="text-sm font-bold text-ipl-primary">{card.sub}</div>
        </motion.div>
      ))}
    </div>
  );
};
