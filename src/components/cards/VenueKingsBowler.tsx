import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface VenueKingsBowlerProps {
  players: PlayerMatchRecord[];
}

export const VenueKingsBowler = ({ players }: VenueKingsBowlerProps) => {
  const kings = useMemo(() => {
    const venueStats = new Map<string, Map<string, number>>();
    const venueMatches = new Map<string, number>();

    players.forEach(p => {
      if (!p.venue) return;
      
      const vCount = venueMatches.get(p.venue) || 0;
      venueMatches.set(p.venue, vCount + 1);

      if (p.isBowler) {
        const vMap = venueStats.get(p.venue) || new Map<string, number>();
        const wickets = vMap.get(p.player) || 0;
        vMap.set(p.player, wickets + (p.wickets || 0));
        venueStats.set(p.venue, vMap);
      }
    });

    // Find top 4 venues by number of entries (most popular venues)
    const topVenues = Array.from(venueMatches.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(v => v[0]);

    return topVenues.map(venue => {
      const playerMap = venueStats.get(venue);
      if (!playerMap) return null;
      
      const best = Array.from(playerMap.entries()).sort((a, b) => b[1] - a[1])[0];
      return { venue, player: best[0], wickets: best[1] };
    }).filter(Boolean);
  }, [players]);

  if (kings.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <MapPin className="text-ipl-accent" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Venue Kings (Bowlers)</h3>
          <p className="text-xs text-ipl-text-muted">Undisputed wicket-takers at iconic stadiums</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {kings.map((k: any, i) => (
          <motion.div 
            key={k.venue}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors border border-transparent hover:border-ipl-accent/30 flex justify-between items-center"
          >
            <div>
              <p className="text-xs text-ipl-text-muted mb-1 truncate max-w-[150px]" title={k.venue}>{k.venue}</p>
              <p className="font-bold text-ipl-text truncate max-w-[150px]">{k.player}</p>
            </div>
            <div className="text-right">
              <p className="font-extrabold text-ipl-accent text-lg">{k.wickets}</p>
              <p className="text-[10px] uppercase tracking-wider text-ipl-text-muted">Wickets</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
