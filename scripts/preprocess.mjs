import fs from 'fs';
import Papa from 'papaparse';

const inputFilePath = './preprocessed_ipl_data.csv';
const outputFilePath = './public/matches.json';

console.log('Reading full CSV dataset...');
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

console.log('Parsing CSV...');
const results = Papa.parse(fileContent, { header: true, skipEmptyLines: true });

console.log(`Parsed ${results.data.length} rows.`);

const matchesMap = new Map();
const seasonsSet = new Set();
const teamsSet = new Set();
const venuesSet = new Set();

results.data.forEach(row => {
  if (!row.match_id) return;
  
  // Normalize venue names
  let normalizedVenue = row.venue || '';
  if (normalizedVenue.includes('M. Chinnaswamy') || normalizedVenue.includes('M Chinnaswamy')) {
    normalizedVenue = 'M Chinnaswamy Stadium';
  } else if (normalizedVenue.includes('Wankhede')) {
    normalizedVenue = 'Wankhede Stadium';
  } else if (normalizedVenue.includes('Chidambaram') || normalizedVenue.includes('Chepauk')) {
    normalizedVenue = 'MA Chidambaram Stadium';
  } else if (normalizedVenue.includes('Arun Jaitley') || normalizedVenue.includes('Feroz Shah')) {
    normalizedVenue = 'Arun Jaitley Stadium';
  }
  
  if (!matchesMap.has(row.match_id)) {
    const match = {
      match_id: row.match_id,
      date: row.date,
      season: row.season,
      venue: normalizedVenue,
      city: row.city,
      team1: row.team1,
      team2: row.team2,
      toss_winner: row.toss_winner,
      toss_decision: row.toss_decision,
      winner: row.winner,
      win_by_runs: row.win_by_runs,
      win_by_wickets: row.win_by_wickets,
      player_of_match: row.player_of_match,
      // Initialize Phase Data
      innings1_team: '',
      innings1_powerplay: 0,
      innings1_middle: 0,
      innings1_death: 0,
      innings2_team: '',
      innings2_powerplay: 0,
      innings2_middle: 0,
      innings2_death: 0,
    };
    matchesMap.set(row.match_id, match);
    
    if (match.season) seasonsSet.add(match.season);
    if (match.team1) teamsSet.add(match.team1);
    if (match.team2) teamsSet.add(match.team2);
    if (match.venue) venuesSet.add(match.venue);
  }

  // Phase aggregation
  const match = matchesMap.get(row.match_id);
  const inning = parseInt(row.innings || '0');
  const over = parseInt(row.over || '0');
  const runs = parseInt(row.runs_total || '0');
  const battingTeam = row.batting_team;

  if (inning === 1) {
    if (!match.innings1_team && battingTeam) match.innings1_team = battingTeam;
    if (over >= 0 && over <= 5) match.innings1_powerplay += runs;
    else if (over >= 6 && over <= 14) match.innings1_middle += runs;
    else if (over >= 15 && over <= 19) match.innings1_death += runs;
  } else if (inning === 2) {
    if (!match.innings2_team && battingTeam) match.innings2_team = battingTeam;
    if (over >= 0 && over <= 5) match.innings2_powerplay += runs;
    else if (over >= 6 && over <= 14) match.innings2_middle += runs;
    else if (over >= 15 && over <= 19) match.innings2_death += runs;
  }
});

const data = {
  matches: Array.from(matchesMap.values()),
  uniqueSeasons: Array.from(seasonsSet).sort((a, b) => b.localeCompare(a)),
  uniqueTeams: Array.from(teamsSet).sort(),
  uniqueVenues: Array.from(venuesSet).sort()
};

console.log(`Extracted ${data.matches.length} unique matches with phase data.`);

fs.writeFileSync(outputFilePath, JSON.stringify(data));
console.log(`Saved pre-processed data to ${outputFilePath}`);
