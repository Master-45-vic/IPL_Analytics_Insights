import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Swords, Check } from 'lucide-react';
import type { PlayerMatchRecord } from '../../types';

interface HeadToHeadLegendsProps {
  players: PlayerMatchRecord[];
}

export const HeadToHeadLegends = ({ players }: HeadToHeadLegendsProps) => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const allPlayerNames = useMemo(() => {
    const names = new Set<string>();
    players.forEach(p => { if (p.isBatter) names.add(p.player); });
    return Array.from(names).sort();
  }, [players]);

  const togglePlayer = (name: string) => {
    if (selectedPlayers.includes(name)) {
      setSelectedPlayers(selectedPlayers.filter(p => p !== name));
    } else {
      if (selectedPlayers.length < 2) setSelectedPlayers([...selectedPlayers, name]);
    }
  };

  const filteredNames = search ? allPlayerNames.filter(n => n.toLowerCase().includes(search.toLowerCase())) : allPlayerNames;

  const compareStats = useMemo(() => {
    if (selectedPlayers.length !== 2) return null;
    const [p1, p2] = selectedPlayers;
    
    const p1Stats = { runs: 0, balls: 0, sixes: 0, fours: 0, hs: 0, matches: 0, outs: 0 };
    const p2Stats = { runs: 0, balls: 0, sixes: 0, fours: 0, hs: 0, matches: 0, outs: 0 };

    players.forEach(p => {
      if (p.player === p1) {
        p1Stats.matches++;
        p1Stats.runs += p.runs || 0;
        p1Stats.balls += p.ballsFaced || 0;
        p1Stats.sixes += p.sixes || 0;
        p1Stats.fours += p.fours || 0;
        if ((p.runs || 0) > p1Stats.hs) p1Stats.hs = p.runs || 0;
        p1Stats.outs += p.isOut || 0;
      } else if (p.player === p2) {
        p2Stats.matches++;
        p2Stats.runs += p.runs || 0;
        p2Stats.balls += p.ballsFaced || 0;
        p2Stats.sixes += p.sixes || 0;
        p2Stats.fours += p.fours || 0;
        if ((p.runs || 0) > p2Stats.hs) p2Stats.hs = p.runs || 0;
        p2Stats.outs += p.isOut || 0;
      }
    });

    return [
      { 
        label: 'Runs', 
        val1: p1Stats.runs, 
        val2: p2Stats.runs, 
        win1: p1Stats.runs > p2Stats.runs, 
        win2: p2Stats.runs > p1Stats.runs 
      },
      { 
        label: 'Strike Rate', 
        val1: p1Stats.balls ? (p1Stats.runs / p1Stats.balls) * 100 : 0, 
        val2: p2Stats.balls ? (p2Stats.runs / p2Stats.balls) * 100 : 0,
        win1: (p1Stats.balls ? (p1Stats.runs / p1Stats.balls) : 0) > (p2Stats.balls ? (p2Stats.runs / p2Stats.balls) : 0),
        win2: (p2Stats.balls ? (p2Stats.runs / p2Stats.balls) : 0) > (p1Stats.balls ? (p1Stats.runs / p1Stats.balls) : 0)
      },
      { 
        label: 'Average', 
        val1: p1Stats.outs ? p1Stats.runs / p1Stats.outs : p1Stats.runs, 
        val2: p2Stats.outs ? p2Stats.runs / p2Stats.outs : p2Stats.runs,
        win1: (p1Stats.outs ? p1Stats.runs / p1Stats.outs : p1Stats.runs) > (p2Stats.outs ? p2Stats.runs / p2Stats.outs : p2Stats.runs),
        win2: (p2Stats.outs ? p2Stats.runs / p2Stats.outs : p2Stats.runs) > (p1Stats.outs ? p1Stats.runs / p1Stats.outs : p1Stats.runs)
      },
      { 
        label: 'Sixes', 
        val1: p1Stats.sixes, 
        val2: p2Stats.sixes,
        win1: p1Stats.sixes > p2Stats.sixes,
        win2: p2Stats.sixes > p1Stats.sixes
      },
      { 
        label: 'Highest Score', 
        val1: p1Stats.hs, 
        val2: p2Stats.hs,
        win1: p1Stats.hs > p2Stats.hs,
        win2: p2Stats.hs > p1Stats.hs
      },
    ];
  }, [selectedPlayers, players]);

  return (
    <div className="glass-card p-6 flex flex-col mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-ipl-border pb-4">
        <div>
          <h3 className="text-xl font-bold text-ipl-text flex items-center gap-2">
            <Swords className="text-ipl-primary" /> Head-to-Head Legends
          </h3>
          <p className="text-xs text-ipl-text-muted mt-1">Select exactly two players to compare their career stats</p>
        </div>
        
        <div className="relative min-w-[250px]">
          <div 
            className="bg-black/30 border border-white/10 rounded-lg p-2 cursor-pointer flex justify-between items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="text-sm font-medium">
              {selectedPlayers.length === 0 ? "Select 2 Players" : `${selectedPlayers.length}/2 Selected`}
            </span>
            <span className="text-xs text-white/50">▼</span>
          </div>

          {isOpen && (
            <div className="absolute top-full right-0 mt-2 w-[300px] bg-ipl-bg-card border border-white/10 rounded-lg shadow-2xl z-40 max-h-64 flex flex-col overflow-hidden">
              <div className="p-2 border-b border-white/10 shrink-0">
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 px-3 text-sm focus:outline-none focus:border-ipl-primary text-white"
                  placeholder="Search player..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="overflow-y-auto p-1 custom-scrollbar">
                {filteredNames.map(name => {
                  const isSelected = selectedPlayers.includes(name);
                  const isDisabled = !isSelected && selectedPlayers.length >= 2;
                  return (
                    <div 
                      key={name}
                      onClick={() => !isDisabled && togglePlayer(name)}
                      className={`px-3 py-2 text-sm flex items-center justify-between rounded-md transition-colors ${
                        isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:bg-white/5'
                      }`}
                    >
                      <span className={isSelected ? 'text-ipl-primary font-medium' : 'text-ipl-text-muted'}>{name}</span>
                      {isSelected && <Check size={14} className="text-ipl-primary shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {compareStats && selectedPlayers.length === 2 ? (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4 mb-2">
            <h4 className="text-lg font-bold text-ipl-primary text-left w-1/3">{selectedPlayers[0]}</h4>
            <span className="text-xs font-bold text-ipl-text-muted uppercase tracking-widest text-center w-1/3">VS</span>
            <h4 className="text-lg font-bold text-[#00D4FF] text-right w-1/3">{selectedPlayers[1]}</h4>
          </div>
          
          {compareStats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-ipl-border/50"
            >
              <div className={`w-1/3 text-left font-bold ${stat.win1 ? 'text-ipl-primary text-xl' : 'text-ipl-text-muted text-sm'}`}>
                {typeof stat.val1 === 'number' && stat.label.includes('Rate') || stat.label.includes('Average') ? stat.val1.toFixed(1) : stat.val1}
              </div>
              <div className="w-1/3 text-center text-xs text-ipl-text font-bold uppercase tracking-wider bg-white/5 py-1 px-2 rounded-full">
                {stat.label}
              </div>
              <div className={`w-1/3 text-right font-bold ${stat.win2 ? 'text-[#00D4FF] text-xl' : 'text-ipl-text-muted text-sm'}`}>
                {typeof stat.val2 === 'number' && stat.label.includes('Rate') || stat.label.includes('Average') ? stat.val2.toFixed(1) : stat.val2}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12 text-ipl-text-muted text-sm">
          Select exactly 2 players to view the head-to-head battle.
        </div>
      )}
    </div>
  );
};
