import { useMemo } from 'react';
import { FilterPanel } from '../components/filters/FilterPanel';
import { KPICards } from '../components/cards/KPICards';
import { TossImpactBarChart } from '../components/charts/TossImpactBarChart';
import { OutcomeRadialChart } from '../components/charts/OutcomeRadialChart';
import { TopVenuesChart } from '../components/charts/TopVenuesChart';
import { VenueInsightsTable } from '../components/tables/VenueInsightsTable';
import { DataStoryCards } from '../components/cards/DataStoryCards';
import { TossKeyRecords } from '../components/cards/TossKeyRecords';
import { TossImpactTimeline } from '../components/charts/TossImpactTimeline';
import { TossDecisionIntelligence } from '../components/charts/TossDecisionIntelligence';
import { motion } from 'framer-motion';
import type { VenueInsight, DashboardData, IPLMatch, MatchFilterState } from '../types';

interface TossAnalysisProps {
  data: DashboardData | null;
  filteredMatches: IPLMatch[];
  filters: MatchFilterState;
  updateFilters: (filters: Partial<MatchFilterState>) => void;
}

import { TeamAnalysis } from './TeamAnalysis';

export const TossAnalysis = ({ data, filteredMatches, filters, updateFilters }: TossAnalysisProps) => {

  if (filters.teams.length === 1) {
    return <TeamAnalysis data={data} filteredMatches={filteredMatches} filters={filters} updateFilters={updateFilters} />;
  }

  const { tossWinnerWins, tossLoserWins, totalMatches, venuesData } = useMemo(() => {
    let winnerWins = 0;
    let loserWins = 0;
    const venueMap = new Map<string, { matches: number; winnerWins: number; loserWins: number }>();

    filteredMatches.forEach(match => {
      if (!match.winner || match.winner === 'No Result' || !match.toss_winner) return;

      const tossWinnerWonMatch = match.toss_winner === match.winner;
      
      if (tossWinnerWonMatch) winnerWins++;
      else loserWins++;

      if (match.venue) {
        const vStats = venueMap.get(match.venue) || { matches: 0, winnerWins: 0, loserWins: 0 };
        vStats.matches++;
        if (tossWinnerWonMatch) vStats.winnerWins++;
        else vStats.loserWins++;
        venueMap.set(match.venue, vStats);
      }
    });

    const vData: VenueInsight[] = Array.from(venueMap.entries()).map(([venue, stats]) => ({
      venue,
      matches: stats.matches,
      tossWinnerWins: stats.winnerWins,
      tossLoserWins: stats.loserWins,
      tossWinnerWinRate: stats.matches > 0 ? stats.winnerWins / stats.matches : 0,
      tossLoserWinRate: stats.matches > 0 ? stats.loserWins / stats.matches : 0,
    }));

    return {
      tossWinnerWins: winnerWins,
      tossLoserWins: loserWins,
      totalMatches: winnerWins + loserWins,
      venuesData: vData
    };
  }, [filteredMatches]);

  const chartData = [
    {
      category: 'Overall Matches',
      tossWinnerWins,
      tossLoserWins
    }
  ];



  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12" id="dashboard-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-ipl-text mb-2">Does Winning the Toss Really Matter?</h2>
          <p className="text-ipl-text-muted">Explore how toss outcomes influence match victories across seasons, venues and teams.</p>
        </div>
      </div>

      <FilterPanel 
        filters={filters} 
        updateFilters={updateFilters}
        uniqueSeasons={data?.uniqueSeasons || []}
        uniqueTeams={data?.uniqueTeams || []}
        uniqueVenues={data?.uniqueVenues || []}
      />

      {totalMatches === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-12 flex flex-col items-center justify-center text-center my-12"
        >
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 text-3xl">🏏</div>
          <h3 className="text-xl font-bold text-ipl-text mb-2">No Matches Found</h3>
          <p className="text-ipl-text-muted max-w-md">Try adjusting your filters. The selected combination yielded zero results.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <KPICards 
            totalMatches={totalMatches}
            tossWinnerWins={tossWinnerWins}
            tossLoserWins={tossLoserWins}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 glass-card p-6 flex flex-col relative" id="toss-impact-chart">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-ipl-text">Toss Impact Comparison</h3>
              </div>
              <div className="flex-1 min-h-[350px]">
                <TossImpactBarChart data={chartData} />
              </div>
            </div>
            
            <div className="glass-card p-6 flex flex-col relative" id="outcome-radial-chart">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-ipl-text">Advantage Dial</h3>
              </div>
              <div className="flex-1 min-h-[300px]">
                <OutcomeRadialChart 
                  tossWinnerWins={tossWinnerWins}
                  tossLoserWins={tossLoserWins}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="glass-card p-6 relative" id="top-venues-chart">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-ipl-text">Top Toss Advantage Venues</h3>
                </div>
                <div className="h-[300px]">
                  <TopVenuesChart venuesData={venuesData} />
                </div>
              </div>
              
              <div className="min-h-[400px]">
                <VenueInsightsTable venuesData={venuesData} />
              </div>
            </div>

            <div>
              <DataStoryCards 
                totalMatches={totalMatches}
                venuesData={venuesData}
                matches={filteredMatches}
              />
            </div>
          </div>

          <h3 className="text-2xl font-extrabold text-ipl-text mb-6 mt-12 border-b border-ipl-border pb-2">Deep Cricket Intelligence</h3>
          <TossKeyRecords matches={filteredMatches} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <TossImpactTimeline matches={filteredMatches} />
            <TossDecisionIntelligence matches={filteredMatches} />
          </div>

        </motion.div>
      )}
    </div>
  );
};
