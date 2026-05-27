import { useState, useMemo } from 'react';
import type { VenueInsight } from '../../types';
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface VenueInsightsTableProps {
  venuesData: VenueInsight[];
}

export const VenueInsightsTable = ({ venuesData }: VenueInsightsTableProps) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: keyof VenueInsight; direction: 'asc' | 'desc' } | null>({ key: 'matches', direction: 'desc' });
  
  const itemsPerPage = 5;

  const handleSort = (key: keyof VenueInsight) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedData = useMemo(() => {
    let sortableItems = [...venuesData];
    
    if (search) {
      sortableItems = sortableItems.filter(item => 
        item.venue.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return sortableItems;
  }, [venuesData, search, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const currentData = filteredAndSortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const SortIcon = () => <ArrowUpDown size={14} className="inline ml-1 text-white/30" />;

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="text-xl font-bold text-white">Venue Insights</h3>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input 
            type="text" 
            placeholder="Search venue..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-ipl-primary/50 text-white transition-colors"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-ipl-text-muted text-sm border-b border-white/10">
              <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('venue')}>
                Venue <SortIcon />
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('matches')}>
                Matches <SortIcon />
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('tossWinnerWinRate')}>
                Toss Winner Win % <SortIcon />
              </th>
              <th className="p-4 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => handleSort('tossLoserWinRate')}>
                Toss Loser Win % <SortIcon />
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((row, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={row.venue} 
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="p-4 text-sm font-medium text-white">{row.venue}</td>
                  <td className="p-4 text-sm text-ipl-text-muted group-hover:text-white transition-colors">{row.matches}</td>
                  <td className="p-4 text-sm font-bold text-ipl-primary">{(row.tossWinnerWinRate * 100).toFixed(1)}%</td>
                  <td className="p-4 text-sm font-bold text-ipl-accent">{(row.tossLoserWinRate * 100).toFixed(1)}%</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-8 text-center text-white/40">No venues match your search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {totalPages > 1 && (
        <div className="p-4 mt-auto flex items-center justify-between border-t border-white/10 bg-white/5">
          <span className="text-sm text-ipl-text-muted">
            Showing {((page - 1) * itemsPerPage) + 1} to {Math.min(page * itemsPerPage, filteredAndSortedData.length)} of {filteredAndSortedData.length}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
