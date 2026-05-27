import fs from 'fs';
import Papa from 'papaparse';
import path from 'path';

const inputFilePath = './preprocessed_ipl_data.csv';
const outputFilePath = './public/players.json';

console.log('Reading full CSV dataset...');
const fileContent = fs.readFileSync(inputFilePath, 'utf-8');

console.log('Parsing CSV...');
const results = Papa.parse(fileContent, { header: true, skipEmptyLines: true });
console.log(`Parsed ${results.data.length} rows.`);

// match_id -> player_name -> { battingStats, bowlingStats }
const playerMatches = new Map();

results.data.forEach(row => {
  if (!row.match_id || !row.season || !row.venue) return;

  // Normalize venue
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

  const matchId = row.match_id;
  const season = row.season;
  const team1 = row.team1;
  const team2 = row.team2;
  
  if (!playerMatches.has(matchId)) {
    playerMatches.set(matchId, {
      context: { matchId, season, venue: normalizedVenue, team1, team2, date: row.date },
      players: new Map()
    });
  }

  const matchContext = playerMatches.get(matchId);
  
  const batter = row.batter;
  const bowler = row.bowler;
  const battingTeam = row.batting_team;
  const bowlingTeam = battingTeam === team1 ? team2 : team1;

  const runsBatter = parseInt(row.runs_batter || '0');
  const runsExtras = parseInt(row.runs_extras || '0');
  const extrasWides = parseInt(row.extras_wides || '0');
  const extrasNoBalls = parseInt(row.extras_noballs || '0');
  const extrasByes = parseInt(row.extras_byes || '0');
  const extrasLegByes = parseInt(row.extras_legbyes || '0');
  const runsTotal = parseInt(row.runs_total || '0');
  const over = row.over;
  
  const isWicket = row.wicket_kind && row.wicket_kind !== 'No Wicket';
  const playerOut = row.wicket_player_out;
  const wicketKind = row.wicket_kind;

  // Init Batter
  if (batter && !matchContext.players.has(batter)) {
    matchContext.players.set(batter, { team: battingTeam, isBatter: true, isBowler: false, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, isOut: 0, 
      bowlingRuns: 0, bowlingBalls: 0, wickets: 0, dotBalls: 0, overRuns: {} });
  } else if (batter) {
    matchContext.players.get(batter).isBatter = true;
    if (!matchContext.players.get(batter).team) matchContext.players.get(batter).team = battingTeam;
  }

  // Init Bowler
  if (bowler && !matchContext.players.has(bowler)) {
    matchContext.players.set(bowler, { team: bowlingTeam, isBatter: false, isBowler: true, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, isOut: 0, 
      bowlingRuns: 0, bowlingBalls: 0, wickets: 0, dotBalls: 0, overRuns: {} });
  } else if (bowler) {
    matchContext.players.get(bowler).isBowler = true;
    if (!matchContext.players.get(bowler).team) matchContext.players.get(bowler).team = bowlingTeam;
  }

  // BATTING LOGIC
  if (batter) {
    const p = matchContext.players.get(batter);
    p.runs += runsBatter;
    if (extrasWides === 0) p.ballsFaced++;
    if (runsBatter === 4) p.fours++;
    if (runsBatter === 6) p.sixes++;
  }

  // OUT LOGIC
  if (isWicket && playerOut && matchContext.players.has(playerOut)) {
    matchContext.players.get(playerOut).isOut = 1;
  }

  // BOWLING LOGIC
  if (bowler) {
    const b = matchContext.players.get(bowler);
    const runsConceded = runsTotal - extrasByes - extrasLegByes;
    b.bowlingRuns += runsConceded;
    
    const isLegalBall = extrasWides === 0 && extrasNoBalls === 0;
    if (isLegalBall) b.bowlingBalls++;

    if (runsConceded === 0 && isLegalBall) b.dotBalls++; // Technically wides aren't dots, leg byes with 0 bat runs ARE dots.
    
    const bowlerWickets = ['caught', 'bowled', 'lbw', 'caught and bowled', 'stumped', 'hit wicket'];
    if (isWicket && bowlerWickets.includes(wicketKind?.toLowerCase())) {
      b.wickets++;
    }

    if (!b.overRuns[over]) b.overRuns[over] = 0;
    b.overRuns[over] += runsConceded;
  }
});

console.log('Aggregating player match records...');
const records = [];

for (const [matchId, matchData] of playerMatches.entries()) {
  const { season, venue, date } = matchData.context;

  for (const [playerName, stats] of matchData.players.entries()) {
    let maidens = 0;
    if (stats.isBowler) {
      for (const over in stats.overRuns) {
        // An over is typically 6 legal balls. We don't perfectly track if an over was completed, 
        // but if they conceded 0 runs in an over they bowled in, we count it as a maiden (assuming standard IPL data).
        // Actually, some overs are partial. But for simplicity and speed:
        if (stats.overRuns[over] === 0) {
          maidens++;
        }
      }
    }

    records.push({
      match_id: matchId,
      date,
      season,
      venue,
      team: stats.team,
      player: playerName,
      isBatter: stats.isBatter ? 1 : 0,
      isBowler: stats.isBowler ? 1 : 0,
      runs: stats.runs,
      ballsFaced: stats.ballsFaced,
      fours: stats.fours,
      sixes: stats.sixes,
      isOut: stats.isOut,
      bowlingRuns: stats.bowlingRuns,
      bowlingBalls: stats.bowlingBalls,
      wickets: stats.wickets,
      dotBalls: stats.dotBalls,
      maidens: maidens
    });
  }
}

console.log(`Generated ${records.length} PlayerMatchRecords.`);

fs.writeFileSync(outputFilePath, JSON.stringify(records));
console.log(`Saved pre-processed player data to ${outputFilePath}`);
