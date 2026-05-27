import { useMemo } from 'react';
import { FilterPanel } from '../components/filters/FilterPanel';
import { WinningTeamProfile } from '../components/charts/WinningTeamProfile';
import { PhaseAdvantageTrend } from '../components/charts/PhaseAdvantageTrend';
import { PhaseWinContribution } from '../components/charts/PhaseWinContribution';
import { VenueScoringDNA } from '../components/charts/VenueScoringDNA';
import { MatchMomentumCard } from '../components/cards/MatchMomentumCard';
import { motion } from 'framer-motion';
import { Download, Activity, Target, Zap, Hash, Trophy, Layers } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';
import type { DashboardData, IPLMatch, MatchFilterState } from '../types';

interface MatchPhaseAnalysisProps {
  data: DashboardData | null;
  filteredMatches: IPLMatch[];
  filters: MatchFilterState;
  updateFilters: (filters: Partial<MatchFilterState>) => void;
}

export const MatchPhaseAnalysis = ({ data, filteredMatches, filters, updateFilters }: MatchPhaseAnalysisProps) => {

  const stats = useMemo(() => {
    let winnerPPRuns = 0;
    let winnerMiddleRuns = 0;
    let winnerDeathRuns = 0;

    let loserPPRuns = 0;
    let loserMiddleRuns = 0;
    let loserDeathRuns = 0;

    let validMatches = 0;

    // For Team Analysis
    const selectedTeam = filters.teams.length === 1 ? filters.teams[0] : null;
    let teamWins = 0;
    let teamLosses = 0;
    let teamWinPPRuns = 0;
    let teamWinMiddleRuns = 0;
    let teamWinDeathRuns = 0;
    let teamLossPPRuns = 0;
    let teamLossMiddleRuns = 0;
    let teamLossDeathRuns = 0;

    // For Venue Analysis
    const selectedVenue = filters.venues.length === 1 ? filters.venues[0] : null;
    let venuePPRuns = 0;
    let venueMiddleRuns = 0;
    let venueDeathRuns = 0;
    let venueInnings = 0;

    filteredMatches.forEach(match => {
      if (!match.winner || match.winner === 'No Result') return;

      const team1 = match.innings1_team;
      const team2 = match.innings2_team;
      if (!team1 || !team2) return;

      const isTeam1Winner = match.winner === team1;

      // Extract phase runs
      const pp1 = Number(match.innings1_powerplay || 0);
      const mid1 = Number(match.innings1_middle || 0);
      const death1 = Number(match.innings1_death || 0);

      const pp2 = Number(match.innings2_powerplay || 0);
      const mid2 = Number(match.innings2_middle || 0);
      const death2 = Number(match.innings2_death || 0);

      validMatches++;

      if (isTeam1Winner) {
        winnerPPRuns += pp1; winnerMiddleRuns += mid1; winnerDeathRuns += death1;
        loserPPRuns += pp2; loserMiddleRuns += mid2; loserDeathRuns += death2;
      } else {
        winnerPPRuns += pp2; winnerMiddleRuns += mid2; winnerDeathRuns += death2;
        loserPPRuns += pp1; loserMiddleRuns += mid1; loserDeathRuns += death1;
      }

      // Team specific logic
      if (selectedTeam && (team1 === selectedTeam || team2 === selectedTeam)) {
        const teamWon = match.winner === selectedTeam;
        const teamPP = team1 === selectedTeam ? pp1 : pp2;
        const teamMid = team1 === selectedTeam ? mid1 : mid2;
        const teamDeath = team1 === selectedTeam ? death1 : death2;

        if (teamWon) {
          teamWins++;
          teamWinPPRuns += teamPP; teamWinMiddleRuns += teamMid; teamWinDeathRuns += teamDeath;
        } else {
          teamLosses++;
          teamLossPPRuns += teamPP; teamLossMiddleRuns += teamMid; teamLossDeathRuns += teamDeath;
        }
      }

      // Venue specific logic
      if (selectedVenue && match.venue === selectedVenue) {
        venueInnings += 2;
        venuePPRuns += pp1 + pp2;
        venueMiddleRuns += mid1 + mid2;
        venueDeathRuns += death1 + death2;
      }
    });

    const safeDiv = (num: number, den: number) => den > 0 ? num / den : 0;

    return {
      validMatches,
      selectedTeam,
      selectedVenue,
      
      winnerPP: safeDiv(winnerPPRuns, validMatches),
      winnerMid: safeDiv(winnerMiddleRuns, validMatches),
      winnerDeath: safeDiv(winnerDeathRuns, validMatches),
      
      loserPP: safeDiv(loserPPRuns, validMatches),
      loserMid: safeDiv(loserMiddleRuns, validMatches),
      loserDeath: safeDiv(loserDeathRuns, validMatches),

      // Team
      teamWins,
      teamLosses,
      teamWinPP: safeDiv(teamWinPPRuns, teamWins),
      teamWinMid: safeDiv(teamWinMiddleRuns, teamWins),
      teamWinDeath: safeDiv(teamWinDeathRuns, teamWins),
      teamLossPP: safeDiv(teamLossPPRuns, teamLosses),
      teamLossMid: safeDiv(teamLossMiddleRuns, teamLosses),
      teamLossDeath: safeDiv(teamLossDeathRuns, teamLosses),

      // Venue
      venueInnings,
      venuePP: safeDiv(venuePPRuns, venueInnings),
      venueMid: safeDiv(venueMiddleRuns, venueInnings),
      venueDeath: safeDiv(venueDeathRuns, venueInnings),
    };
  }, [filteredMatches, filters.teams, filters.venues]);



  const renderMatchComparisonMode = () => {
    const match = filteredMatches[0];
    const pp1 = Number(match.innings1_powerplay || 0);
    const mid1 = Number(match.innings1_middle || 0);
    const death1 = Number(match.innings1_death || 0);

    const pp2 = Number(match.innings2_powerplay || 0);
    const mid2 = Number(match.innings2_middle || 0);
    const death2 = Number(match.innings2_death || 0);

    const chartData = [
      { name: 'Powerplay (1-6)', [match.innings1_team]: pp1, [match.innings2_team]: pp2 },
      { name: 'Middle (7-15)', [match.innings1_team]: mid1, [match.innings2_team]: mid2 },
      { name: 'Death (16-20)', [match.innings1_team]: death1, [match.innings2_team]: death2 },
    ];

    const team1Total = pp1 + mid1 + death1;
    const team2Total = pp2 + mid2 + death2;

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-6">Match Comparison Mode</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-5 border-l-4 border-l-ipl-success flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Match Winner</span>
            <span className="text-2xl font-extrabold text-ipl-success">{match.winner}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-primary flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">{match.innings1_team} Total</span>
            <span className="text-3xl font-extrabold text-ipl-text">{team1Total}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-accent flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">{match.innings2_team} Total</span>
            <span className="text-3xl font-extrabold text-ipl-text">{team2Total}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-text-muted flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Highest Phase</span>
            <span className="text-xl font-bold text-ipl-text">
              {Math.max(pp1, mid1, death1, pp2, mid2, death2) === Math.max(pp1, pp2) ? 'Powerplay' : Math.max(pp1, mid1, death1, pp2, mid2, death2) === Math.max(mid1, mid2) ? 'Middle Overs' : 'Death Overs'}
            </span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col relative mb-8" id="match-comp-chart">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-ipl-text">Phase Comparison: {match.innings1_team} vs {match.innings2_team}</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} />
                <YAxis stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} />
                <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey={match.innings1_team} fill="#00D4FF" radius={[4, 4, 0, 0]} />
                <Bar dataKey={match.innings2_team} fill="#FF6B35" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTeamMode = () => {
    const chartData = [
      { name: 'Powerplay (1-6)', Wins: stats.teamWinPP.toFixed(1), Losses: stats.teamLossPP.toFixed(1) },
      { name: 'Middle (7-15)', Wins: stats.teamWinMid.toFixed(1), Losses: stats.teamLossMid.toFixed(1) },
      { name: 'Death (16-20)', Wins: stats.teamWinDeath.toFixed(1), Losses: stats.teamLossDeath.toFixed(1) },
    ];

    const ppDiff = stats.teamWinPP - stats.teamLossPP;
    const midDiff = stats.teamWinMid - stats.teamLossMid;
    const deathDiff = stats.teamWinDeath - stats.teamLossDeath;
    const maxImpact = Math.max(ppDiff, midDiff, deathDiff);
    const impactPhase = maxImpact === ppDiff ? 'Powerplay' : maxImpact === midDiff ? 'Middle Overs' : 'Death Overs';

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-2">Team Phase Analysis</h3>
        <p className="text-ipl-text-muted mb-8">Analyzing which phase contributes most to {stats.selectedTeam}'s victories.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
           <div className="glass-card p-5 border-l-4 border-l-ipl-primary flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Most Impactful Phase</span>
            <span className="text-2xl font-extrabold text-ipl-primary">{impactPhase}</span>
          </div>
           <div className="glass-card p-5 border-l-4 border-l-ipl-text-muted flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">{impactPhase} Differential</span>
            <span className="text-3xl font-extrabold text-ipl-text">+{maxImpact.toFixed(1)} <span className="text-sm">runs</span></span>
          </div>
        </div>

        <div className="glass-card p-6 flex flex-col relative" id="team-phase-chart">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-ipl-text">{stats.selectedTeam} Winning vs Losing Phase Performance</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" />
                <YAxis stroke="var(--theme-text-muted, #CBD5E1)" />
                <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="Wins" name="Average Runs in Wins" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Losses" name="Average Runs in Losses" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderGlobalMode = () => {
    const chartData = [
      { name: 'Powerplay (1-6)', Winner: stats.winnerPP.toFixed(1), Loser: stats.loserPP.toFixed(1) },
      { name: 'Middle (7-15)', Winner: stats.winnerMid.toFixed(1), Loser: stats.loserMid.toFixed(1) },
      { name: 'Death (16-20)', Winner: stats.winnerDeath.toFixed(1), Loser: stats.loserDeath.toFixed(1) },
    ];

    const ppAdv = stats.winnerPP - stats.loserPP;
    const midAdv = stats.winnerMid - stats.loserMid;
    const deathAdv = stats.winnerDeath - stats.loserDeath;
    
    const rankingData = [
      { name: 'Death Overs', advantage: deathAdv },
      { name: 'Middle Overs', advantage: midAdv },
      { name: 'Powerplay', advantage: ppAdv },
    ].sort((a, b) => b.advantage - a.advantage);

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-5 border-l-4 border-l-ipl-text-muted flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Matches Analyzed</span>
            <span className="text-3xl font-extrabold text-ipl-text">{stats.validMatches}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-primary flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Best Winning Phase</span>
            <span className="text-2xl font-extrabold text-ipl-primary">{rankingData[0].name}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-success flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Avg Winner Runs</span>
            <span className="text-3xl font-extrabold text-ipl-text">{(stats.winnerPP + stats.winnerMid + stats.winnerDeath).toFixed(0)}</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-accent flex flex-col justify-center">
            <span className="text-ipl-text-muted text-sm font-bold uppercase mb-1">Avg Loser Runs</span>
            <span className="text-3xl font-extrabold text-ipl-text">{(stats.loserPP + stats.loserMid + stats.loserDeath).toFixed(0)}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 glass-card p-6 flex flex-col relative" id="global-phase-chart">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Average Runs by Phase (Winning vs Losing Teams)</h3>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" />
                  <YAxis stroke="var(--theme-text-muted, #CBD5E1)" />
                  <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                  <Legend />
                  <Bar dataKey="Winner" name="Winning Team Avg" fill="#00D4FF" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Loser" name="Losing Team Avg" fill="#475569" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col relative" id="ranking-chart">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Most Linked To Winning</h3>
            </div>
            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={rankingData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" horizontal={false} />
                  <XAxis type="number" stroke="var(--theme-text-muted, #CBD5E1)" />
                  <YAxis type="category" dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" />
                  <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                  <Bar dataKey="advantage" name="Phase Advantage (Runs)" fill="#FF6B35" radius={[0, 4, 4, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </motion.div>
    );
  };

  const renderVenueMode = () => {
    const chartData = [
      { name: 'Powerplay (1-6)', Average: stats.venuePP.toFixed(1) },
      { name: 'Middle (7-15)', Average: stats.venueMid.toFixed(1) },
      { name: 'Death (16-20)', Average: stats.venueDeath.toFixed(1) },
    ];

    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-2">Venue Phase Characteristics</h3>
        <p className="text-ipl-text-muted mb-8">Average scoring patterns across {stats.selectedVenue}</p>

        <div className="glass-card p-6 flex flex-col relative mb-8" id="venue-phase-chart">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-bold text-ipl-text">Average Runs per Phase ({stats.selectedVenue})</h3>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" />
                <YAxis stroke="var(--theme-text-muted, #CBD5E1)" />
                <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                <Bar dataKey="Average" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12" id="phase-dashboard-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-ipl-text mb-2">Match Phase Analysis</h2>
          <p className="text-ipl-text-muted">Analyze Powerplay, Middle, and Death overs to see which phase dominates IPL matches.</p>
        </div>
      </div>

      <FilterPanel 
        filters={filters} 
        updateFilters={updateFilters}
        uniqueSeasons={data?.uniqueSeasons || []}
        uniqueTeams={data?.uniqueTeams || []}
        uniqueVenues={data?.uniqueVenues || []}
      />

      {stats.validMatches === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 flex flex-col items-center justify-center text-center my-12">
          <h3 className="text-xl font-bold text-ipl-text mb-2">No Matches Found</h3>
        </motion.div>
      ) : (
        <>
          {filteredMatches.length === 1 ? renderMatchComparisonMode() : 
           stats.selectedTeam ? renderTeamMode() : 
           stats.selectedVenue ? renderVenueMode() :
           renderGlobalMode()}
           
          <h3 className="text-2xl font-extrabold text-ipl-text mb-6 mt-12 border-b border-ipl-border pb-2">Phase Intelligence & Deep Analytics</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <WinningTeamProfile matches={filteredMatches} filters={filters} />
            <PhaseWinContribution matches={filteredMatches} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <PhaseAdvantageTrend matches={filteredMatches} />
            </div>
            <div>
              <MatchMomentumCard matches={filteredMatches} />
            </div>
          </div>

          {stats.selectedVenue && (
            <div className="mb-8">
              <VenueScoringDNA matches={filteredMatches} filters={filters} />
            </div>
          )}
        </>
      )}
    </div>
  );
};
