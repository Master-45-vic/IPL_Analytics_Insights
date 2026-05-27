export interface IPLMatch {
  match_id: string;
  date: string;
  season: string;
  venue: string;
  city: string;
  team1: string;
  team2: string;
  toss_winner: string;
  toss_decision: string;
  winner: string;
  win_by_runs: string;
  win_by_wickets: string;
  player_of_match: string;
  innings1_team: string;
  innings1_powerplay: number;
  innings1_middle: number;
  innings1_death: number;
  innings2_team: string;
  innings2_powerplay: number;
  innings2_middle: number;
  innings2_death: number;
  // Ball by ball fields omitted for brevity as we deduplicate on match_id
}

export interface PlayerMatchRecord {
  match_id: string;
  date: string;
  season: string;
  venue: string;
  team: string;
  player: string;
  isBatter: number;
  isBowler: number;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: number;
  bowlingRuns: number;
  bowlingBalls: number;
  wickets: number;
  dotBalls: number;
  maidens: number;
}

export interface MatchFilterState {
  seasons: string[];
  teams: string[];
  venues: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface TossImpactData {
  category: string;
  tossWinnerWins: number;
  tossLoserWins: number;
  tossWinnerWinRate: number;
  tossLoserWinRate: number;
  totalMatches: number;
}

export interface VenueInsight {
  venue: string;
  matches: number;
  tossWinnerWins: number;
  tossLoserWins: number;
  tossWinnerWinRate: number;
  tossLoserWinRate: number;
}

export interface DashboardData {
  matches: IPLMatch[];
  uniqueSeasons: string[];
  uniqueTeams: string[];
  uniqueVenues: string[];
}
