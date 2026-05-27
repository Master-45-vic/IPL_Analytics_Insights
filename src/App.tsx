import { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { TossAnalysis } from './pages/TossAnalysis';
import { MatchPhaseAnalysis } from './pages/MatchPhaseAnalysis';
import { PlayerPerformance } from './pages/PlayerPerformance';
import { useDashboardData } from './hooks/useDashboardData';
import { IplLoadingScreen } from './components/layout/IplLoadingScreen';

function App() {
  const [activeTab, setActiveTab] = useState('Toss Analysis');
  const { data, filteredMatches, loading, error, filters, updateFilters } = useDashboardData('/matches.json');

  if (loading) {
    return <IplLoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ipl-bg-dark flex items-center justify-center text-ipl-accent">
        <div className="glass-card p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-2">Failed to load data</h2>
          <p className="text-white/70">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ipl-bg-dark text-ipl-text font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="pt-6 max-w-7xl mx-auto px-6 lg:px-8 mt-6">
        {activeTab === 'Toss Analysis' && (
          <TossAnalysis 
            data={data}
            filteredMatches={filteredMatches}
            filters={filters}
            updateFilters={updateFilters}
          />
        )}
        
        {activeTab === 'Match Phase Analysis' && (
          <MatchPhaseAnalysis 
            data={data}
            filteredMatches={filteredMatches}
            filters={filters}
            updateFilters={updateFilters}
          />
        )}

        {activeTab === 'Player Performance' && (
          <PlayerPerformance 
            filters={filters}
            updateFilters={updateFilters}
            dashboardData={data}
          />
        )}
      </main>

      <footer className="border-t border-ipl-border mt-12 py-8 bg-ipl-bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-ipl-primary to-ipl-primary-dark flex items-center justify-center">
              <span className="font-bold text-white text-xs">I</span>
            </div>
            <span className="font-bold text-sm">IPL Analytics</span>
          </div>
          <p className="text-sm text-ipl-text-muted">
            &copy; {new Date().getFullYear()} IPL Match Analytics. Designed for Data Exploration.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
