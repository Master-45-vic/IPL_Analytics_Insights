🏏 IPL Analytics Insights

A modern, interactive IPL analytics platform built with React 19, TypeScript, Vite, Tailwind CSS, Recharts, and Framer Motion. The dashboard transforms raw IPL ball-by-ball data into meaningful visual insights through advanced analytics, dynamic filtering, and responsive visualizations.

📌 Overview

IPL Analytics Insights is designed to help users explore IPL data from multiple perspectives, including:

Toss impact on match outcomes
Match phase performance (Powerplay, Middle Overs, Death Overs)
Batter and bowler performance analytics
Venue-specific trends
Team-wise and season-wise comparisons
Interactive player profiles and statistical insights

The application preprocesses large IPL datasets into optimized JSON files, enabling instant filtering and smooth user interaction without performance issues.

✨ Key Features
🎯 Toss Analysis
Toss Winner vs Toss Loser match outcome comparison
Toss impact trends across IPL seasons
Toss decision intelligence (Bat First vs Bowl First)
Venue-wise toss advantage analysis
Dynamic filtering by season, team, and venue
⚡ Match Phase Analysis
Powerplay (1–6), Middle Overs (7–15), and Death Overs (16–20) analysis
Winning Teams vs Losing Teams phase comparison
Phase contribution to winning matches
Radar charts for winning team profiles
Team mode and venue mode analytics
Match momentum probability insights
👑 Player Performance Analysis
Top batters and bowlers leaderboards
Player Hall of Fame
Venue specialists ("Venue Kings")
Consistent player identification
Batting and bowling role distributions
Interactive player profile panel with performance trends
🎨 Modern User Experience
Premium glassmorphism design
Dark mode sports analytics theme
Framer Motion animations
Fully responsive layout
Dynamic charts powered by Recharts
Real-time filtering across all modules
🛠 Technology Stack
Frontend
React 19
TypeScript
Vite
Tailwind CSS
Framer Motion
Recharts
Lucide React
Data Processing
Node.js
Custom preprocessing scripts
JSON-based optimized data delivery
Version Control & Deployment
Git & GitHub
Vercel-ready architecture
📂 Project Structure
IPL_Analytics_Insights/
│
├── public/
│   ├── data/
│   │   ├── matches.json
│   │   └── players.json
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── assets/
│   └── App.tsx
│
├── scripts/
│   ├── preprocess.mjs
│   └── preprocess_players.mjs
│
├── data/
│   └── raw IPL CSV datasets
│
├── notebooks/
│   └── exploratory analysis notebooks
│
└── README.md
⚙️ Data Engineering Pipeline

The original IPL dataset contained over 280,000+ ball-by-ball records and was too large for direct browser processing.

To solve this:

Custom Node.js preprocessing scripts aggregate raw data.
Match-level and player-level statistics are calculated offline.
Optimized JSON datasets are generated.
React hooks cache data in memory for instant filtering and visualization.

This architecture dramatically improves performance and scalability.

📊 Analytics Modules
Module	Purpose
Toss Analysis	Understand how toss outcomes influence match results
Match Phase Analysis	Identify which innings phase contributes most to winning
Player Performance	Analyze batters, bowlers, consistency, and venue specialists
🚀 Getting Started
Clone Repository
git clone https://github.com/Master-45-vic/IPL_Analytics_Insights.git
cd IPL_Analytics_Insights
Install Dependencies
npm install
Run Development Server
npm run dev
Production Build
npm run build
Preview Production Build
npm run preview
📈 Future Enhancements
Head-to-head team analysis
Advanced bowling matchup analytics
Win probability prediction models
AI-generated match insights
Fantasy cricket recommendation engine
Predictive analytics using machine learning
👨‍💻 Author

Prashanth M

Passionate about Data Analytics, Artificial Intelligence, Machine Learning, and Sports Analytics.

📄 License

This project was developed for educational, research, and competition purposes using publicly available IPL datasets.
