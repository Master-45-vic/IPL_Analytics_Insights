import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { PlayerMatchRecord } from '../../types';
import { useMemo } from 'react';

interface VenueKingsProps {
  players: PlayerMatchRecord[];
}

export const VenueKings = ({ players }: VenueKingsProps) => {
  const kings = useMemo(() => {
    const venueStats = new Map<string, Map<string, number>>();
    const venueMatches = new Map<string, number>();

    players.forEach(p => {
      if (!p.venue) return;
      
      const vCount = venueMatches.get(p.venue) || 0;
      venueMatches.set(p.venue, vCount + 1);

      if (p.isBatter) {
        const vMap = venueStats.get(p.venue) || new Map<string, number>();
        const runs = vMap.get(p.player) || 0;
        vMap.set(p.player, runs + (p.runs || 0));
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
      return { venue, player: best[0], runs: best[1] };
    }).filter(Boolean);
  }, [players]);

  if (kings.length === 0) return null;

  return (
    <div className="glass-card p-6 flex flex-col h-full relative" id="venue-kings-chart">
      <div className="flex items-center gap-3 mb-6 border-b border-ipl-border pb-4">
        <MapPin className="text-ipl-accent" size={24} />
        <div>
          <h3 className="text-xl font-bold text-ipl-text">Venue Kings</h3>
          <p className="text-xs text-ipl-text-muted">Undisputed run-scorers at iconic stadiums</p>
        </div>
      </div>
      
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={kings} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" horizontal={true} vertical={false} />
            <XAxis type="number" stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey="venue" 
              stroke="var(--theme-text-muted, #CBD5E1)" 
              width={90} 
              tick={{ fontSize: 11 }} 
              axisLine={false} 
              tickLine={false} 
              tickFormatter={(val) => val.split(' ')[0]} 
            />
            <Tooltip 
              cursor={{ fill: 'var(--theme-border, #ffffff05)' }} 
              contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }}
              labelFormatter={(val) => `Venue: ${val}`}
              formatter={(val: number, name: string, props: any) => [val, `Runs (${props.payload.player})`]}
            />
            <Bar dataKey="runs" fill="var(--theme-accent, #FF6B35)" radius={[0, 4, 4, 0]} barSize={20} animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
