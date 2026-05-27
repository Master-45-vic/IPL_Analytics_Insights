import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterPanel } from '../components/filters/FilterPanel';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, ZAxis, Legend } from 'recharts';
import type { DashboardData, MatchFilterState } from '../types';
import { usePlayersData } from '../hooks/usePlayersData';
import { PlayerProfilePanel } from '../components/cards/PlayerProfilePanel';
import { PlayerHallOfFame } from '../components/cards/PlayerHallOfFame';
import { ConsistentPlayers } from '../components/cards/ConsistentPlayers';
import { VenueKings } from '../components/cards/VenueKings';
import { BattingStyleDistribution } from '../components/charts/BattingStyleDistribution';
import { BowlingRoleImpact } from '../components/cards/BowlingRoleImpact';
import { HeadToHeadLegends } from '../components/cards/HeadToHeadLegends';

interface PlayerPerformanceProps {
  dashboardData: DashboardData | null;
  filters: MatchFilterState;
  updateFilters: (filters: Partial<MatchFilterState>) => void;
}

export const PlayerPerformance = ({ dashboardData, filters, updateFilters }: PlayerPerformanceProps) => {
  const { filteredPlayers, loading, error } = usePlayersData('/players.json', filters);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerType, setPlayerType] = useState<'Batters' | 'Bowlers'>('Batters');

  const aggregatedStats = useMemo(() => {
    if (!filteredPlayers || filteredPlayers.length === 0) return { batters: [], bowlers: [] };

    const playerMap = new Map();

    filteredPlayers.forEach(record => {
      if (!playerMap.has(record.player)) {
        playerMap.set(record.player, {
          name: record.player,
          team: record.team,
          isBatter: record.isBatter === 1,
          isBowler: record.isBowler === 1,
          runs: 0, ballsFaced: 0, fours: 0, sixes: 0, dismissals: 0,
          wickets: 0, bowlingRuns: 0, bowlingBalls: 0, dotBalls: 0, maidens: 0,
          matches: 0
        });
      }

      const p = playerMap.get(record.player);
      p.matches++;
      p.runs += record.runs;
      p.ballsFaced += record.ballsFaced;
      p.fours += record.fours;
      p.sixes += record.sixes;
      p.dismissals += record.isOut;
      
      p.wickets += record.wickets;
      p.bowlingRuns += record.bowlingRuns;
      p.bowlingBalls += record.bowlingBalls;
      p.dotBalls += record.dotBalls;
      p.maidens += record.maidens;
    });

    const arr = Array.from(playerMap.values());

    const batters = arr.filter(p => p.runs > 0 || p.ballsFaced > 0).map(p => ({
      ...p,
      strikeRate: p.ballsFaced > 0 ? (p.runs / p.ballsFaced) * 100 : 0,
      average: p.dismissals > 0 ? p.runs / p.dismissals : p.runs
    })).sort((a, b) => b.runs - a.runs);

    const bowlers = arr.filter(p => p.bowlingBalls > 0).map(p => ({
      ...p,
      overs: p.bowlingBalls / 6,
      economy: p.bowlingBalls > 0 ? (p.bowlingRuns / (p.bowlingBalls / 6)) : 0,
      bowlingAverage: p.wickets > 0 ? p.bowlingRuns / p.wickets : 0,
      bowlingStrikeRate: p.wickets > 0 ? p.bowlingBalls / p.wickets : 0
    })).sort((a, b) => b.wickets - a.wickets);

    return { batters, bowlers };
  }, [filteredPlayers]);

  const getPlayerStats = (name: string) => {
    const batter = aggregatedStats.batters.find(b => b.name === name);
    const bowler = aggregatedStats.bowlers.find(b => b.name === name);
    if (batter && bowler) return { ...batter, ...bowler, isBatter: true, isBowler: true };
    if (batter) return { ...batter, isBatter: true, isBowler: false };
    if (bowler) return { ...bowler, isBatter: false, isBowler: true };
    return null;
  };

  const getPlayerTrend = (name: string) => {
    return filteredPlayers.filter(p => p.player === name).map(p => ({
      date: p.date,
      runs: p.runs,
      wickets: p.wickets
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };



  if (loading) return <div className="text-center py-20">Loading Player Data...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Error loading data.</div>;

  const renderGlobalBatters = () => {
    const top10 = aggregatedStats.batters.slice(0, 10);
    const bubbleData = aggregatedStats.batters.filter(b => b.runs > 50).map(b => ({
      name: b.name,
      runs: b.runs,
      strikeRate: Number(b.strikeRate.toFixed(1)),
      sixes: b.sixes,
      team: b.team
    }));

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="glass-card p-5 border-l-4 border-l-ipl-primary">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Top Run Scorer</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{aggregatedStats.batters[0]?.name || '-'}</span>
            <span className="text-ipl-primary font-bold">{aggregatedStats.batters[0]?.runs || 0} runs</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-accent">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Most Sixes</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.batters].sort((a,b)=>b.sixes-a.sixes)[0]?.name || '-'}</span>
            <span className="text-ipl-accent font-bold">{[...aggregatedStats.batters].sort((a,b)=>b.sixes-a.sixes)[0]?.sixes || 0} sixes</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-success">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Highest Strike Rate</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.batters].filter(b=>b.runs>100).sort((a,b)=>b.strikeRate-a.strikeRate)[0]?.name || '-'}</span>
            <span className="text-ipl-success font-bold">{[...aggregatedStats.batters].filter(b=>b.runs>100).sort((a,b)=>b.strikeRate-a.strikeRate)[0]?.strikeRate.toFixed(1) || 0} SR</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-white">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Best Average</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.batters].filter(b=>b.runs>100).sort((a,b)=>b.average-a.average)[0]?.name || '-'}</span>
            <span className="text-white font-bold">{[...aggregatedStats.batters].filter(b=>b.runs>100).sort((a,b)=>b.average-a.average)[0]?.average.toFixed(1) || 0} Avg</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 relative" id="top-run-scorers">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Top 10 Run Scorers</h3>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#CBD5E1" />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="runs" fill="#00D4FF" radius={[0, 4, 4, 0]} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 relative" id="runs-vs-sr">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Runs vs Strike Rate</h3>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" dataKey="runs" name="Runs" stroke="#CBD5E1" tick={{ fontSize: 12 }} />
                  <YAxis type="number" dataKey="strikeRate" name="Strike Rate" stroke="#CBD5E1" tick={{ fontSize: 12 }} />
                  <ZAxis type="number" dataKey="sixes" range={[50, 400]} name="Sixes" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Scatter name="Batters" data={bubbleData} fill="#FF6B35" onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderGlobalBowlers = () => {
    const top10 = aggregatedStats.bowlers.slice(0, 10);
    const scatterData = aggregatedStats.bowlers.filter(b => b.overs >= 10).map(b => ({
      name: b.name,
      wickets: b.wickets,
      economy: Number(b.economy.toFixed(2)),
      team: b.team,
      strikeRate: Number(b.bowlingStrikeRate.toFixed(1))
    }));

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="glass-card p-5 border-l-4 border-l-ipl-primary">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Most Wickets</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{aggregatedStats.bowlers[0]?.name || '-'}</span>
            <span className="text-ipl-primary font-bold">{aggregatedStats.bowlers[0]?.wickets || 0} wickets</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-success">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Best Economy</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.bowlers].filter(b=>b.overs>20).sort((a,b)=>a.economy-b.economy)[0]?.name || '-'}</span>
            <span className="text-ipl-success font-bold">{[...aggregatedStats.bowlers].filter(b=>b.overs>20).sort((a,b)=>a.economy-b.economy)[0]?.economy.toFixed(2) || 0} Econ</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-ipl-accent">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Most Dot Balls</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.bowlers].sort((a,b)=>b.dotBalls-a.dotBalls)[0]?.name || '-'}</span>
            <span className="text-ipl-accent font-bold">{[...aggregatedStats.bowlers].sort((a,b)=>b.dotBalls-a.dotBalls)[0]?.dotBalls || 0} dots</span>
          </div>
          <div className="glass-card p-5 border-l-4 border-l-white">
            <span className="text-ipl-text-muted text-sm font-bold uppercase block mb-1">Best Strike Rate</span>
            <span className="text-2xl font-extrabold text-ipl-text truncate block">{[...aggregatedStats.bowlers].filter(b=>b.wickets>10).sort((a,b)=>a.bowlingStrikeRate-b.bowlingStrikeRate)[0]?.name || '-'}</span>
            <span className="text-white font-bold">{[...aggregatedStats.bowlers].filter(b=>b.wickets>10).sort((a,b)=>a.bowlingStrikeRate-b.bowlingStrikeRate)[0]?.bowlingStrikeRate.toFixed(1) || 0} SR</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 relative" id="top-wicket-takers">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Top 10 Wicket Takers</h3>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#CBD5E1" />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="wickets" fill="#00D4FF" radius={[0, 4, 4, 0]} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6 relative" id="econ-vs-wickets">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-ipl-text">Economy vs Wickets</h3>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis type="number" dataKey="economy" name="Economy" stroke="#CBD5E1" domain={['auto', 'auto']} tick={{ fontSize: 12 }} reversed={true} />
                  <YAxis type="number" dataKey="wickets" name="Wickets" stroke="#CBD5E1" tick={{ fontSize: 12 }} />
                  <ZAxis type="number" dataKey="strikeRate" range={[50, 400]} name="Strike Rate" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Scatter name="Bowlers" data={scatterData} fill="#10B981" onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer hover:opacity-80 transition-opacity" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderTeamMode = () => {
    const selectedTeam = filters.teams[0];
    const topBatters = aggregatedStats.batters.slice(0, 5);
    const topBowlers = aggregatedStats.bowlers.slice(0, 5);

    const totalRuns = aggregatedStats.batters.reduce((sum, b) => sum + b.runs, 0);
    const top3Runs = aggregatedStats.batters.slice(0, 3).reduce((sum, b) => sum + b.runs, 0);
    
    const stackedData = [{
      name: 'Runs Contribution',
      [aggregatedStats.batters[0]?.name || 'Batter 1']: aggregatedStats.batters[0]?.runs || 0,
      [aggregatedStats.batters[1]?.name || 'Batter 2']: aggregatedStats.batters[1]?.runs || 0,
      [aggregatedStats.batters[2]?.name || 'Batter 3']: aggregatedStats.batters[2]?.runs || 0,
      'Others': totalRuns - top3Runs
    }];

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-2">{selectedTeam} Top Performers</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6" id="team-batters">
            <h3 className="text-xl font-bold text-ipl-text mb-6">Top Batters</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBatters} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="runs" fill="#00D4FF" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6" id="team-bowlers">
            <h3 className="text-xl font-bold text-ipl-text mb-6">Top Bowlers</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBowlers} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="wickets" fill="#10B981" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="glass-card p-6" id="team-contribution">
          <h3 className="text-xl font-bold text-ipl-text mb-6">Runs Contribution Breakdown</h3>
          <div className="h-[150px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stackedData} layout="vertical" stackOffset="expand">
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" hide />
                <Tooltip formatter={(value: any) => [`${(Number(value) * 100).toFixed(1)}%`, 'Contribution']} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey={aggregatedStats.batters[0]?.name || 'Batter 1'} stackId="a" fill="#00D4FF" />
                <Bar dataKey={aggregatedStats.batters[1]?.name || 'Batter 2'} stackId="a" fill="#FF6B35" />
                <Bar dataKey={aggregatedStats.batters[2]?.name || 'Batter 3'} stackId="a" fill="#10B981" />
                <Bar dataKey="Others" stackId="a" fill="#475569" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderVenueMode = () => {
    const selectedVenue = filters.venues[0];
    const topBatters = aggregatedStats.batters.slice(0, 5);
    const topBowlers = aggregatedStats.bowlers.slice(0, 5);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-2">{selectedVenue} Specialists</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6" id="venue-batters">
            <h3 className="text-xl font-bold text-ipl-text mb-6">Top Run Scorers Here</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBatters} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="runs" fill="#00D4FF" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6" id="venue-bowlers">
            <h3 className="text-xl font-bold text-ipl-text mb-6">Top Wicket Takers Here</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBowlers} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="wickets" fill="#10B981" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderSeasonMode = () => {
    const selectedSeason = filters.seasons[0];
    const topBatters = aggregatedStats.batters.slice(0, 5);
    const topBowlers = aggregatedStats.bowlers.slice(0, 5);

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 space-y-8">
        <h3 className="text-2xl font-extrabold text-ipl-text mb-2">{selectedSeason} Season Leaders</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 border-t-4 border-t-[#FF9933]" id="orange-cap">
            <h3 className="text-xl font-bold text-[#FF9933] mb-6">Orange Cap Race</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBatters} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="runs" fill="#FF9933" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="glass-card p-6 border-t-4 border-t-[#8A2BE2]" id="purple-cap">
            <h3 className="text-xl font-bold text-[#8A2BE2] mb-6">Purple Cap Race</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topBowlers} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="name" stroke="#CBD5E1" width={100} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#111827', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="wickets" fill="#8A2BE2" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#fff' }} onClick={(data: any) => setSelectedPlayer(data?.name || null)} className="cursor-pointer" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12" id="player-dashboard-container">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-ipl-text mb-2">Player Performance Analysis</h2>
          <p className="text-ipl-text-muted">Explore the top batters, lethal bowlers, and venue specialists across the IPL.</p>
        </div>
      </div>

      <div className="mb-6 flex gap-4">
        <button 
          onClick={() => setPlayerType('Batters')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${playerType === 'Batters' ? 'bg-ipl-primary text-ipl-bg-dark' : 'bg-white/5 text-ipl-text hover:bg-white/10'}`}
        >
          Batters
        </button>
        <button 
          onClick={() => setPlayerType('Bowlers')}
          className={`px-6 py-2 rounded-full font-bold transition-colors ${playerType === 'Bowlers' ? 'bg-ipl-primary text-ipl-bg-dark' : 'bg-white/5 text-ipl-text hover:bg-white/10'}`}
        >
          Bowlers
        </button>
      </div>

      <FilterPanel 
        filters={filters} 
        updateFilters={updateFilters}
        uniqueSeasons={dashboardData?.uniqueSeasons || []}
        uniqueTeams={dashboardData?.uniqueTeams || []}
        uniqueVenues={dashboardData?.uniqueVenues || []}
      />

      {filters.teams.length === 1 ? renderTeamMode() : 
       filters.venues.length === 1 ? renderVenueMode() :
       filters.seasons.length === 1 ? renderSeasonMode() :
       playerType === 'Batters' ? renderGlobalBatters() : renderGlobalBowlers()}

      <h3 className="text-2xl font-extrabold text-ipl-text mb-6 mt-12 border-b border-ipl-border pb-2">Player Intelligence & Legacy Metrics</h3>
      
      <PlayerHallOfFame players={filteredPlayers} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ConsistentPlayers players={filteredPlayers} />
        <VenueKings players={filteredPlayers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BattingStyleDistribution players={filteredPlayers} />
        <BowlingRoleImpact players={filteredPlayers} />
      </div>

      <HeadToHeadLegends players={filteredPlayers} />

      <AnimatePresence>
        {selectedPlayer && (
          <PlayerProfilePanel 
            playerName={selectedPlayer} 
            onClose={() => setSelectedPlayer(null)} 
            playerStats={getPlayerStats(selectedPlayer)}
            trendData={getPlayerTrend(selectedPlayer)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
