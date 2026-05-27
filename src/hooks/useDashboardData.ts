import { useState, useEffect, useMemo } from 'react';
import type { DashboardData, MatchFilterState } from '../types';
import { loadAndProcessData, filterMatches } from '../utils/dataProcessing';

export const useDashboardData = (csvFilePath: string) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<MatchFilterState>({
    seasons: [],
    teams: [],
    venues: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const processedData = await loadAndProcessData(csvFilePath);
        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to parse CSV'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [csvFilePath]);

  const filteredMatches = useMemo(() => {
    if (!data) return [];
    return filterMatches(data.matches, filters.seasons, filters.teams, filters.venues);
  }, [data, filters]);

  const updateFilters = (newFilters: Partial<MatchFilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return {
    data,
    filteredMatches,
    loading,
    error,
    filters,
    updateFilters,
  };
};
