import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';

const INSIGHTS = [
  "Wankhede Stadium historically has the highest average scoring rate during Death Overs.",
  "Teams scoring 60+ in the Powerplay win 72% of all IPL matches.",
  "Virat Kohli dominates Chinnaswamy Stadium with an unmatched runs-per-innings ratio.",
  "Winning the toss in Chennai offers a 64% win probability when choosing to bat first.",
  "Death Overs create the largest winning margin differential across all T20 phases.",
  "Sunrisers Hyderabad bowlers concede 14% fewer runs in the Middle Overs than league average.",
  "Lasith Malinga remains the undisputed king of Death Overs economy and strike rate."
];

export const QuickInsightsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % INSIGHTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-ipl-primary/10 border border-ipl-primary/20 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-ipl-primary"></div>
      <div className="p-2 bg-ipl-primary/20 rounded-full shrink-0 text-ipl-primary">
        <Zap size={20} />
      </div>
      <div className="flex-1 overflow-hidden relative h-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center"
          >
            <p className="text-sm font-medium text-ipl-text truncate">
              <span className="text-ipl-primary font-bold mr-2">SMART INSIGHT:</span>
              {INSIGHTS[currentIndex]}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
