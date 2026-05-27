import { useState, useEffect, useMemo } from 'react';
import type { PlayerMatchRecord, MatchFilterState } from '../types';

export const usePlayersData = (url: string, filters: MatchFilterState) => {
  const [data, setData] = useState<PlayerMatchRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch player data');
        return res.json();
      })
      .then((jsonData: PlayerMatchRecord[]) => {
        setData(jsonData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }, [url]);

  const filteredPlayers = useMemo(() => {
    if (!data) return [];
    
    return data.filter(record => {
      // Date filter
      if (filters.dateRange?.start && new Date(record.date) < new Date(filters.dateRange.start)) return false;
      if (filters.dateRange?.end && new Date(record.date) > new Date(filters.dateRange.end)) return false;
      
      // Seasons filter
      if (filters.seasons.length > 0 && !filters.seasons.includes(record.season)) return false;
      
      // Venues filter
      if (filters.venues.length > 0 && !filters.venues.includes(record.venue)) return false;
      
      // Teams filter (a record is associated with the player's team)
      // If team filter is active, only include players from that team? 
      // Wait, in Match Dashboard, team filter means "Matches where team X played".
      // For Player Performance, if you select CSK, you want to see CSK players.
      if (filters.teams.length > 0 && !filters.teams.includes(record.team)) return false;
      
      return true;
    });
  }, [data, filters]);

  return { data, filteredPlayers, loading, error };
};
