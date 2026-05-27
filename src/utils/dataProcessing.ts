import type { IPLMatch, DashboardData } from '../types';

export const loadAndProcessData = async (jsonFilePath: string): Promise<DashboardData> => {
  const response = await fetch(jsonFilePath);
  if (!response.ok) {
    throw new Error(`Failed to load data: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};

// Filter matches based on selections
export const filterMatches = (
  matches: IPLMatch[],
  seasons: string[],
  teams: string[],
  venues: string[]
): IPLMatch[] => {
  return matches.filter(match => {
    const seasonMatch = seasons.length === 0 || seasons.includes(match.season);
    const teamMatch = teams.length === 0 || teams.includes(match.team1) || teams.includes(match.team2);
    const venueMatch = venues.length === 0 || venues.includes(match.venue);
    return seasonMatch && teamMatch && venueMatch;
  });
};
