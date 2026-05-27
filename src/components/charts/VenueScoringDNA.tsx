import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { IPLMatch, MatchFilterState } from '../../types';
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface VenueScoringDNAProps {
  matches: IPLMatch[];
  filters: MatchFilterState;
}

export const VenueScoringDNA = ({ matches, filters }: VenueScoringDNAProps) => {
  const chartData = useMemo(() => {
    if (filters.venues.length !== 1 || matches.length === 0) return [];
    
    const selectedVenue = filters.venues[0];
    
    let venuePP = 0, venueMid = 0, venueDeath = 0;
    let globalPP = 0, globalMid = 0, globalDeath = 0;
    let venueInnings = 0, globalInnings = 0;

    matches.forEach(m => {
      const pp = Number(m.innings1_powerplay||0) + Number(m.innings2_powerplay||0);
      const mid = Number(m.innings1_middle||0) + Number(m.innings2_middle||0);
      const death = Number(m.innings1_death||0) + Number(m.innings2_death||0);

      if (m.venue === selectedVenue) {
        venuePP += pp; venueMid += mid; venueDeath += death;
        venueInnings += 2;
      }
      globalPP += pp; globalMid += mid; globalDeath += death;
      globalInnings += 2;
    });

    if (venueInnings === 0) return [];

    return [
      { metric: 'Powerplay (1-6)', Venue: venuePP/venueInnings, Global: globalPP/globalInnings, fullMark: Math.max(venuePP/venueInnings, globalPP/globalInnings) * 1.2 },
      { metric: 'Middle Overs (7-15)', Venue: venueMid/venueInnings, Global: globalMid/globalInnings, fullMark: Math.max(venueMid/venueInnings, globalMid/globalInnings) * 1.2 },
      { metric: 'Death Overs (16-20)', Venue: venueDeath/venueInnings, Global: globalDeath/globalInnings, fullMark: Math.max(venueDeath/venueInnings, globalDeath/globalInnings) * 1.2 },
    ];
  }, [matches, filters.venues]);

  if (filters.venues.length !== 1 || chartData.length === 0) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 flex flex-col h-full">
      <h3 className="text-xl font-bold text-ipl-text mb-6">Venue Scoring DNA: {filters.venues[0]}</h3>
      <div className="flex-1 min-h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="var(--theme-border, #ffffff20)" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
            <PolarRadiusAxis angle={90} domain={[0, 'auto']} tick={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} formatter={(val: any) => Number(val).toFixed(1)} />
            <Legend />
            <Radar name={filters.venues[0]} dataKey="Venue" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.4} />
            <Radar name="Global Average" dataKey="Global" stroke="#475569" fill="#475569" fillOpacity={0.4} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
