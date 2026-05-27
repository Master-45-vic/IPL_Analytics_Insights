import { useMemo } from 'react';
import { FilterPanel } from '../components/filters/FilterPanel';
import { motion } from 'framer-motion';
import { Trophy, XCircle, Users, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { DashboardData, IPLMatch, MatchFilterState } from '../types';

interface TeamAnalysisProps {
  data: DashboardData | null;
  filteredMatches: IPLMatch[];
  filters: MatchFilterState;
  updateFilters: (filters: Partial<MatchFilterState>) => void;
}

export const TeamAnalysis = ({ data, filteredMatches, filters, updateFilters }: TeamAnalysisProps) => {

  const selectedTeam = filters.teams.length === 1 ? filters.teams[0] : null;

  const stats = useMemo(() => {
    if (!selectedTeam) return null;

    let matchesPlayed = 0;
    let wins = 0;
    let losses = 0;
    let winsAfterWinningToss = 0;
    let winsAfterLosingToss = 0;
    let lossesAfterWinningToss = 0;
    let lossesAfterLosingToss = 0;

    const matchResults: {
      date: string;
      opponent: string;
      venue: string;
      tossWinner: string;
      tossDecision: string;
      matchWinner: string;
      teamWon: boolean;
      wonToss: boolean;
    }[] = [];

    filteredMatches.forEach(match => {
      // Must be playing
      if (match.team1 !== selectedTeam && match.team2 !== selectedTeam) return;
      if (!match.winner || match.winner === 'No Result') return;

      matchesPlayed++;

      const teamWon = match.winner === selectedTeam;
      const wonToss = match.toss_winner === selectedTeam;

      if (teamWon) wins++;
      else losses++;

      if (teamWon && wonToss) winsAfterWinningToss++;
      if (teamWon && !wonToss) winsAfterLosingToss++;
      if (!teamWon && wonToss) lossesAfterWinningToss++;
      if (!teamWon && !wonToss) lossesAfterLosingToss++;

      // Create structured match row for table
      const opponent = match.team1 === selectedTeam ? match.team2 : match.team1;
      matchResults.push({
        date: match.date,
        opponent,
        venue: match.venue,
        tossWinner: match.toss_winner,
        tossDecision: match.toss_decision,
        matchWinner: match.winner,
        teamWon,
        wonToss
      });
    });

    return {
      matchesPlayed,
      wins,
      losses,
      winRate: matchesPlayed > 0 ? (wins / matchesPlayed) * 100 : 0,
      winsAfterWinningToss,
      winsAfterLosingToss,
      lossesAfterWinningToss,
      lossesAfterLosingToss,
      matchResults: matchResults.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  }, [filteredMatches, selectedTeam]);



  if (!selectedTeam || !stats) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 h-screen">
        <FilterPanel 
          filters={filters} 
          updateFilters={updateFilters}
          uniqueSeasons={data?.uniqueSeasons || []}
          uniqueTeams={data?.uniqueTeams || []}
          uniqueVenues={data?.uniqueVenues || []}
        />
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-16 flex flex-col items-center justify-center text-center mt-12"
        >
          <Users size={64} className="text-ipl-primary mb-4 opacity-50" />
          <h3 className="text-2xl font-bold text-ipl-text mb-2">Team Analysis Mode</h3>
          <p className="text-ipl-text-muted max-w-md text-lg">
            Please select <strong className="text-ipl-primary">exactly one team</strong> from the Filter Panel to unlock deep team-specific toss analytics.
          </p>
        </motion.div>
      </div>
    );
  }

  const seasonLabel = filters.seasons.length === 1 ? ` (${filters.seasons[0]})` : '';

  // Charts Data
  const winsBreakdownData = [
    { name: 'Won Match + Won Toss', value: stats.winsAfterWinningToss, fill: 'var(--theme-primary, #00D4FF)' },
    { name: 'Won Match + Lost Toss', value: stats.winsAfterLosingToss, fill: 'var(--theme-accent, #FF6B35)' }
  ];

  const lossesBreakdownData = [
    { name: 'Lost Match + Won Toss', value: stats.lossesAfterWinningToss, fill: 'var(--theme-accent, #FF6B35)' },
    { name: 'Lost Match + Lost Toss', value: stats.lossesAfterLosingToss, fill: 'var(--theme-border, #475569)' }
  ];

  const safeTeamName = selectedTeam.replace(/[^a-z0-9]/gi, '_').toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12" id="team-dashboard-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <img src={`/logos/${safeTeamName}.svg`} alt={selectedTeam} className="w-16 h-16 rounded-xl object-contain shadow-lg" onError={(e) => e.currentTarget.style.display = 'none'} />
          <div>
            <h2 className="text-3xl font-extrabold text-ipl-text mb-1 uppercase tracking-wider">{selectedTeam} <span className="text-ipl-primary">Analysis</span></h2>
            <p className="text-ipl-text-muted">Analyzing how toss outcomes directly affected {selectedTeam}'s match results.</p>
          </div>
        </div>
      </div>

      <FilterPanel 
        filters={filters} 
        updateFilters={updateFilters}
        uniqueSeasons={data?.uniqueSeasons || []}
        uniqueTeams={data?.uniqueTeams || []}
        uniqueVenues={data?.uniqueVenues || []}
      />

      {stats.matchesPlayed === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="glass-card p-12 flex flex-col items-center justify-center text-center my-12"
        >
          <h3 className="text-xl font-bold text-ipl-text mb-2">No Matches Found</h3>
          <p className="text-ipl-text-muted">The selected team did not play in this combination of filters.</p>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card p-5 border-l-4 border-l-ipl-text-muted flex flex-col justify-center">
              <span className="text-ipl-text-muted text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-1"><Hash size={14}/> Total Matches</span>
              <span className="text-3xl font-extrabold text-ipl-text">{stats.matchesPlayed}</span>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-ipl-success flex flex-col justify-center">
              <span className="text-ipl-text-muted text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-1"><Trophy size={14}/> Matches Won</span>
              <span className="text-3xl font-extrabold text-ipl-text">{stats.wins} <span className="text-sm font-medium text-ipl-success ml-2">({stats.winRate.toFixed(1)}%)</span></span>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-ipl-primary flex flex-col justify-center">
              <span className="text-ipl-text-muted text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-1">Won After Winning Toss</span>
              <span className="text-3xl font-extrabold text-ipl-text">{stats.winsAfterWinningToss} <span className="text-sm font-medium text-ipl-primary ml-2">({stats.wins > 0 ? ((stats.winsAfterWinningToss/stats.wins)*100).toFixed(0) : 0}% of wins)</span></span>
            </div>
            <div className="glass-card p-5 border-l-4 border-l-ipl-accent flex flex-col justify-center">
              <span className="text-ipl-text-muted text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-1">Won After Losing Toss</span>
              <span className="text-3xl font-extrabold text-ipl-text">{stats.winsAfterLosingToss} <span className="text-sm font-medium text-ipl-accent ml-2">({stats.wins > 0 ? ((stats.winsAfterLosingToss/stats.wins)*100).toFixed(0) : 0}% of wins)</span></span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Wins Breakdown Chart */}
            <div className="glass-card p-6 flex flex-col relative" id="team-wins-chart">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-ipl-text uppercase tracking-wider">How {selectedTeam} Won Its Matches{seasonLabel}</h3>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={winsBreakdownData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} />
                    <YAxis stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                      {winsBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Wins Distribution Donut */}
            <div className="glass-card p-6 flex flex-col relative" id="team-wins-donut">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-ipl-text uppercase tracking-wider">Wins Distribution</h3>
              </div>
              <div className="flex-1 min-h-[300px] relative">
                {stats.wins > 0 ? (
                  <>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-sm font-bold text-ipl-text-muted">Total Wins</span>
                      <span className="text-3xl font-extrabold text-ipl-text">{stats.wins}</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={winsBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius="60%"
                          outerRadius="80%"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {winsBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-ipl-text-muted">No Wins Recorded</div>
                )}
              </div>
            </div>

            {/* Losses Breakdown Chart */}
            <div className="glass-card p-6 flex flex-col relative" id="team-losses-chart">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-bold text-ipl-text uppercase tracking-wider">How {selectedTeam} Lost Its Matches{seasonLabel}</h3>
              </div>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={lossesBreakdownData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--theme-border, #ffffff10)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} />
                    <YAxis stroke="var(--theme-text-muted, #CBD5E1)" tick={{ fill: 'var(--theme-text-muted, #CBD5E1)', fontSize: 12 }} allowDecimals={false} />
                    <Tooltip cursor={{ fill: 'var(--theme-border, #ffffff05)' }} contentStyle={{ backgroundColor: 'var(--theme-bg-card, #111827)', borderColor: 'var(--theme-border, #ffffff20)', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={60}>
                      {lossesBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
            <div className="lg:col-span-3 glass-card overflow-hidden">
              <div className="p-5 border-b border-ipl-border bg-black/5 dark:bg-white/5">
                <h3 className="text-lg font-bold text-ipl-text uppercase tracking-wider">Match Results ({selectedTeam})</h3>
              </div>
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black/5 dark:bg-white/5 text-ipl-text-muted sticky top-0 z-10 backdrop-blur-md">
                    <tr>
                      <th className="p-4 font-semibold whitespace-nowrap">Date</th>
                      <th className="p-4 font-semibold">Opponent</th>
                      <th className="p-4 font-semibold">Venue</th>
                      <th className="p-4 font-semibold">Toss</th>
                      <th className="p-4 font-semibold">Match Winner</th>
                      <th className="p-4 font-semibold text-center">Won After</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ipl-border">
                    {stats.matchResults.map((m, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 whitespace-nowrap text-ipl-text-muted">{m.date}</td>
                        <td className="p-4 font-medium text-ipl-text">{m.opponent}</td>
                        <td className="p-4 text-ipl-text-muted">{m.venue}</td>
                        <td className="p-4">
                          <span className={m.tossWinner === selectedTeam ? 'text-ipl-primary font-bold' : 'text-ipl-text-muted'}>
                            {m.tossWinner} ({m.tossDecision})
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={m.teamWon ? 'text-ipl-success font-bold flex items-center gap-1' : 'text-ipl-accent font-bold flex items-center gap-1'}>
                            {m.teamWon ? <Trophy size={14}/> : <XCircle size={14}/>} {m.matchWinner}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          {m.teamWon && (
                            <span className={`px-2 py-1 rounded text-xs font-bold ${m.wonToss ? 'bg-ipl-primary/20 text-ipl-primary' : 'bg-ipl-accent/20 text-ipl-accent'}`}>
                              {m.wonToss ? 'Winning Toss' : 'Losing Toss'}
                            </span>
                          )}
                          {!m.teamWon && (
                            <span className="text-ipl-text-muted text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {stats.matchResults.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-ipl-text-muted">No matches found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-ipl-primary">
              <h3 className="text-lg font-bold text-ipl-text uppercase tracking-wider mb-6">Key Insights</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2 text-ipl-primary">
                    <Trophy size={18} />
                    <h4 className="font-bold">Winning the Toss</h4>
                  </div>
                  <p className="text-sm text-ipl-text-muted leading-relaxed">
                    {selectedTeam} won <strong className="text-ipl-text">{stats.winsAfterWinningToss}</strong> out of <strong className="text-ipl-text">{stats.winsAfterWinningToss + stats.lossesAfterWinningToss}</strong> matches (
                    <strong className="text-ipl-text">{(stats.winsAfterWinningToss + stats.lossesAfterWinningToss > 0 ? (stats.winsAfterWinningToss / (stats.winsAfterWinningToss + stats.lossesAfterWinningToss) * 100).toFixed(1) : 0)}%</strong>) when they won the toss.
                  </p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2 text-ipl-accent">
                    <XCircle size={18} />
                    <h4 className="font-bold">Losing the Toss</h4>
                  </div>
                  <p className="text-sm text-ipl-text-muted leading-relaxed">
                    {selectedTeam} won <strong className="text-ipl-text">{stats.winsAfterLosingToss}</strong> out of <strong className="text-ipl-text">{stats.winsAfterLosingToss + stats.lossesAfterLosingToss}</strong> matches (
                    <strong className="text-ipl-text">{(stats.winsAfterLosingToss + stats.lossesAfterLosingToss > 0 ? (stats.winsAfterLosingToss / (stats.winsAfterLosingToss + stats.lossesAfterLosingToss) * 100).toFixed(1) : 0)}%</strong>) when they lost the toss.
                  </p>
                </div>
                
                <div className="pt-4 border-t border-ipl-border">
                  <p className="text-sm text-ipl-text-muted leading-relaxed italic">
                    Overall, {selectedTeam} won <strong className="text-ipl-text">{stats.winRate.toFixed(1)}%</strong> of their matches in the selected filters.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
