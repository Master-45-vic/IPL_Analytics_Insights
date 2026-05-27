import fs from 'fs';
import path from 'path';

const logosDir = './public/logos';
if (!fs.existsSync(logosDir)) {
  fs.mkdirSync(logosDir, { recursive: true });
}

// Map of known teams to colors
const teamColors = {
  'Chennai Super Kings': '#FBBF24',
  'Mumbai Indians': '#005DA0',
  'Royal Challengers Bengaluru': '#EA1A2A',
  'Royal Challengers Bangalore': '#EA1A2A',
  'Kolkata Knight Riders': '#3A225D',
  'Sunrisers Hyderabad': '#FF822A',
  'Rajasthan Royals': '#EA1EA8',
  'Delhi Capitals': '#004C93',
  'Delhi Daredevils': '#004C93',
  'Punjab Kings': '#ED1B24',
  'Kings XI Punjab': '#ED1B24',
  'Gujarat Titans': '#1B2133',
  'Lucknow Super Giants': '#0050A0',
  'Rising Pune Supergiant': '#D11D9B',
  'Rising Pune Supergiants': '#D11D9B',
  'Gujarat Lions': '#E04F16',
  'Pune Warriors': '#2F9BE3',
  'Deccan Chargers': '#F9A31A',
  'Kochi Tuskers Kerala': '#E63A90'
};

const getAbbreviation = (name) => {
  return name.split(' ').map(w => w[0]).join('').substring(0, 3).toUpperCase();
};

const matches = JSON.parse(fs.readFileSync('./public/matches.json', 'utf8'));

matches.uniqueTeams.forEach(team => {
  const color = teamColors[team] || '#4F46E5';
  const abbr = getAbbreviation(team);
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="20" fill="${color}" />
    <text x="50" y="50" font-family="Arial, sans-serif" font-weight="bold" font-size="30" fill="white" text-anchor="middle" dominant-baseline="central">${abbr}</text>
  </svg>`;
  
  // Safe filename
  const safeName = team.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  fs.writeFileSync(path.join(logosDir, `${safeName}.svg`), svg);
});

console.log('Successfully generated team logos in public/logos/');
