import { useState } from 'react';
import { Filter, Search, X, Check } from 'lucide-react';
import type { MatchFilterState } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterPanelProps {
  filters: MatchFilterState;
  updateFilters: (filters: Partial<MatchFilterState>) => void;
  uniqueSeasons: string[];
  uniqueTeams: string[];
  uniqueVenues: string[];
}

export const FilterPanel = ({ filters, updateFilters, uniqueSeasons, uniqueTeams, uniqueVenues }: FilterPanelProps) => {
  return (
    <div className="glass-card p-6 mb-8 mt-12 relative z-20">
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Filter className="text-ipl-primary" />
        <h3 className="text-xl font-bold">Analysis Filters</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MultiSelect 
          label="Season" 
          options={uniqueSeasons} 
          selected={filters.seasons} 
          onChange={(seasons) => updateFilters({ seasons })} 
          placeholder="All Seasons"
        />
        <MultiSelect 
          label="Team" 
          options={uniqueTeams} 
          selected={filters.teams} 
          onChange={(teams) => updateFilters({ teams })} 
          placeholder="All Teams"
        />
        <MultiSelect 
          label="Venue" 
          options={uniqueVenues} 
          selected={filters.venues} 
          onChange={(venues) => updateFilters({ venues })} 
          placeholder="All Venues"
          searchable
        />
      </div>
    </div>
  );
};

// Custom MultiSelect Dropdown
interface MultiSelectProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  searchable?: boolean;
}

const MultiSelect = ({ label, options, selected, onChange, placeholder, searchable = false }: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(o => o !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange([]);
  };

  const filteredOptions = searchable && search
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options;

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-ipl-text-muted mb-2">{label}</label>
      <div 
        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 cursor-pointer flex justify-between items-center hover:bg-white/10 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="truncate pr-4 text-sm font-medium">
          {selected.length === 0 ? (
            <span className="text-white/40">{placeholder}</span>
          ) : selected.length === 1 ? (
            selected[0]
          ) : (
             <span className="flex items-center gap-2">
               {selected.length} Selected
             </span>
          )}
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          {selected.length > 0 && (
            <button onClick={clearAll} className="p-1 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors">
              <X size={14} />
            </button>
          )}
          <div className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            ▼
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-ipl-bg-card border border-white/10 rounded-lg shadow-2xl z-40 max-h-64 flex flex-col overflow-hidden"
            >
              {searchable && (
                <div className="p-2 border-b border-white/10 shrink-0 relative">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-ipl-primary/50 text-white"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              <div className="overflow-y-auto p-1 custom-scrollbar">
                {filteredOptions.length === 0 ? (
                  <div className="p-4 text-center text-sm text-white/40">No results found</div>
                ) : (
                  filteredOptions.map(option => {
                    const isSelected = selected.includes(option);
                    const isTeam = label === 'Team';
                    const safeName = isTeam ? option.replace(/[^a-z0-9]/gi, '_').toLowerCase() : '';
                    
                    return (
                      <div 
                        key={option}
                        onClick={() => toggleOption(option)}
                        className="px-3 py-2 text-sm flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          {isTeam && (
                            <img src={`/logos/${safeName}.svg`} alt={option} className="w-5 h-5 rounded-md object-contain" />
                          )}
                          <span className={isSelected ? 'text-ipl-primary font-medium' : 'text-ipl-text-muted group-hover:text-ipl-text transition-colors'}>{option}</span>
                        </div>
                        {isSelected && <Check size={16} className="text-ipl-primary shrink-0" />}
                      </div>
                    );
                  })

                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
