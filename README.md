# 🏏 IPL Analytics Insights

A modern, interactive IPL analytics platform built using **React 19, TypeScript, Vite, Tailwind CSS, Recharts, and Framer Motion**. The dashboard transforms raw IPL ball-by-ball data into meaningful insights through advanced analytics, dynamic filtering, and rich visualizations.

---

## 📌 Overview

IPL Analytics Insights helps users explore IPL data from multiple perspectives, including:

- Toss impact on match outcomes
- Match phase performance (Powerplay, Middle Overs, Death Overs)
- Batter and bowler performance analytics
- Venue-specific trends
- Team-wise and season-wise comparisons
- Interactive player profiles and statistical insights

---
## 🎬 Demo & Presentation

- 📊 **Project Presentation (PPT):** https://canva.link/jkawb8qmk83rsru  
- 🎥 **Project Demo Video:** https://drive.google.com/file/d/1KBzhQEX7NaBAky5BA8LB1pj9NGAyH4XO/view
---

## ✨ Features

### 🎯 Toss Analysis
- Toss Winner vs Toss Loser comparison
- Toss impact trends across IPL seasons
- Toss decision intelligence (Bat First vs Bowl First)
- Venue-wise toss advantage analysis
- Dynamic filtering by season, team, and venue

### ⚡ Match Phase Analysis
- Powerplay (1–6), Middle Overs (7–15), and Death Overs (16–20) analytics
- Winning Teams vs Losing Teams phase comparison
- Phase contribution to match victories
- Winning Team Profile radar visualization
- Team-specific and venue-specific phase analysis
- Match momentum probability insights

### 👑 Player Performance Analysis
- Top batter and bowler leaderboards
- Hall of Fame section
- Venue specialists ("Venue Kings")
- Consistent player identification
- Batting and bowling role distributions
- Interactive player profile drawer
- Performance trend analysis

---

## 🔄 Data Engineering & Preprocessing Pipeline

The original IPL dataset contained over **280,000+ ball-by-ball deliveries (~68 MB)**. Processing this data directly in the browser would have caused performance issues and slow loading times.

To overcome this, a dedicated preprocessing pipeline was developed using **Node.js**.

### Data Processing Workflow

- Parsed raw IPL ball-by-ball datasets
- Cleaned and standardized venue names
- Removed duplicate match records
- Generated match-level statistics
- Calculated phase-wise scoring:
  - Powerplay (Overs 1–6)
  - Middle Overs (Overs 7–15)
  - Death Overs (Overs 16–20)
- Aggregated player performance metrics:
  - Runs
  - Balls Faced
  - Fours
  - Sixes
  - Strike Rate
  - Wickets
  - Economy Rate
  - Dot Balls
  - Maidens

### Optimized Data Outputs

The preprocessing scripts generate lightweight analytics-ready files:

```text
matches.json
players.json
```

### Benefits

- Faster dashboard loading
- Real-time filtering and analytics
- Reduced browser memory usage
- Smooth chart rendering
- Scalable architecture for future IPL seasons

### Custom Preprocessing Scripts

```text
scripts/
├── preprocess.mjs
└── preprocess_players.mjs
```

---

## 🎨 User Experience

- Premium glassmorphism design
- Dark sports analytics theme
- Smooth Framer Motion animations
- Responsive layout for desktop and mobile
- Interactive charts powered by Recharts
- Dynamic filtering across all modules

---

## 🛠 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Recharts
- Framer Motion
- Lucide React

### Data Processing

- Node.js
- Custom preprocessing scripts
- Optimized JSON data architecture

### Version Control & Deployment

- Git & GitHub
- Vercel

---

## 📂 Project Structure

```text
IPL_Analytics_Insights/
│
├── public/
│   └── data/
│       ├── matches.json
│       └── players.json
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
│   └── raw IPL datasets
│
├── notebooks/
│   └── exploratory analysis
│
└── README.md
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Master-45-vic/IPL_Analytics_Insights.git
cd IPL_Analytics_Insights
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## 📊 Analytics Modules

| Module | Description |
|----------|-------------|
| Toss Analysis | Analyze the impact of winning the toss on match outcomes |
| Match Phase Analysis | Explore Powerplay, Middle Overs, and Death Overs contributions |
| Player Performance | Evaluate batters, bowlers, consistency, and venue specialists |

---

## 🔮 Future Enhancements

- Head-to-head team analysis
- Win probability prediction models
- Advanced venue intelligence
- AI-generated cricket insights
- Fantasy cricket recommendation engine
- Machine learning-based match predictions

---

## 👨‍💻 Author

**Prashanth M**

Passionate about Data Analytics, Artificial Intelligence, Machine Learning, and Sports Analytics.

---

## 📄 License

This project was developed for educational, research, and competition purposes using publicly available IPL datasets.
