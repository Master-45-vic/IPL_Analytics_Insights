import { Lightbulb, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { VenueInsight, IPLMatch } from '../../types';
import { useMemo } from 'react';

interface DataStoryCardsProps {
  totalMatches: number;
  tossLoserWins?: number;
  venuesData: VenueInsight[];
  matches: IPLMatch[];
}

export const DataStoryCards = ({ totalMatches, venuesData, matches }: DataStoryCardsProps) => {
  if (totalMatches === 0) return null;
  
  const stories = [];

  // Venue Insights
  const validVenues = venuesData.filter(v => v.matches >= 5);
  if (validVenues.length > 0) {
    const highestVenue = validVenues.reduce((prev, current) => 
      (current.tossWinnerWinRate > prev.tossWinnerWinRate) ? current : prev
    );
    const lowestVenue = validVenues.reduce((prev, current) => 
      (current.tossWinnerWinRate < prev.tossWinnerWinRate) ? current : prev
    );

    stories.push({
      icon: <TrendingUp className="text-ipl-primary" size={20} />,
      title: "Highest Advantage Venue",
      desc: `${highestVenue.venue} shows the highest toss advantage at ${(highestVenue.tossWinnerWinRate * 100).toFixed(1)}%.`,
      color: "from-ipl-primary/20 to-transparent",
      borderColor: "border-ipl-primary/30"
    });

    if (lowestVenue.tossWinnerWinRate < 0.5) {
      stories.push({
        icon: <TrendingDown className="text-ipl-accent" size={20} />,
        title: "Lowest Advantage Venue",
        desc: `${lowestVenue.venue} actually penalizes toss winners, who only win ${(lowestVenue.tossWinnerWinRate * 100).toFixed(1)}% of matches.`,
        color: "from-ipl-accent/20 to-transparent",
        borderColor: "border-ipl-accent/30"
      });
    }
  }

  // Season Insights
  const { highestSeason, lowestSeason } = useMemo(() => {
    const seasonMap = new Map<string, { matches: number; winnerWins: number }>();
    matches.forEach(m => {
      if (!m.winner || m.winner === 'No Result' || !m.toss_winner || !m.season) return;
      const stats = seasonMap.get(m.season) || { matches: 0, winnerWins: 0 };
      stats.matches++;
      if (m.toss_winner === m.winner) stats.winnerWins++;
      seasonMap.set(m.season, stats);
    });

    const validSeasons = Array.from(seasonMap.entries())
      .filter(([_, stats]) => stats.matches >= 5)
      .map(([season, stats]) => ({
        season,
        winRate: stats.winnerWins / stats.matches
      }));

    if (validSeasons.length === 0) return { highestSeason: null, lowestSeason: null };

    const highest = validSeasons.reduce((prev, curr) => (curr.winRate > prev.winRate) ? curr : prev);
    const lowest = validSeasons.reduce((prev, curr) => (curr.winRate < prev.winRate) ? curr : prev);
    
    return { highestSeason: highest, lowestSeason: lowest };
  }, [matches]);

  if (highestSeason) {
    stories.push({
      icon: <Calendar className="text-ipl-success" size={20} />,
      title: "Most Toss-Dependent Season",
      desc: `IPL ${highestSeason.season} had the strongest toss effect, with toss winners winning ${(highestSeason.winRate * 100).toFixed(1)}%.`,
      color: "from-ipl-success/20 to-transparent",
      borderColor: "border-ipl-success/30"
    });
  }

  if (lowestSeason && lowestSeason.winRate < 0.55 && lowestSeason.season !== highestSeason?.season) {
    stories.push({
      icon: <Lightbulb className="text-white/70" size={20} />,
      title: "Least Toss-Dependent Season",
      desc: `IPL ${lowestSeason.season} was nearly balanced, with a toss win rate of only ${(lowestSeason.winRate * 100).toFixed(1)}%.`,
      color: "from-white/10 to-transparent",
      borderColor: "border-white/20"
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-xl font-bold text-ipl-text mb-2">Smart Insights Engine</h3>
      {stories.length > 0 ? stories.map((story, i) => (
        <motion.div 
          key={i}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 + 0.3 }}
          className={`glass-card p-5 border-l-4 ${story.borderColor} relative overflow-hidden`}
        >
          <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-r ${story.color} opacity-30 pointer-events-none`}></div>
          <div className="flex items-start gap-4 relative z-10">
            <div className="p-2 bg-ipl-text/5 dark:bg-white/5 rounded-lg border border-ipl-border shrink-0">
              {story.icon}
            </div>
            <div>
              <h4 className="font-bold text-ipl-text mb-1">{story.title}</h4>
              <p className="text-sm text-ipl-text-muted leading-relaxed">{story.desc}</p>
            </div>
          </div>
        </motion.div>
      )) : (
        <div className="p-4 text-center text-ipl-text-muted border border-ipl-border border-dashed rounded-xl">
          Not enough data to generate smart insights.
        </div>
      )}
    </div>
  );
};
