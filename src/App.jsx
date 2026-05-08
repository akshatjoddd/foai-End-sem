import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/UI/Navbar';
import ISSTracker from './components/ISS/ISSTracker';
import ISSSpeedChart from './components/ISS/ISSSpeedChart';
import PeopleInSpace from './components/ISS/PeopleInSpace';
import NewsDashboard from './components/News/NewsDashboard';
import NewsDistributionChart from './components/News/NewsDistributionChart';
import Chatbot from './components/Chatbot/Chatbot';
import { useTheme } from './context/ThemeContext';
import { useISS } from './hooks/useISS';
import { useNews } from './hooks/useNews';

export default function App() {
  const { isDark } = useTheme();
  
  const {
    positions, currentPos, speed, nearestPlace, loading: issLoading, error: issError,
    autoRefresh, speedHistory, people, peopleLoading,
    manualRefresh, toggleAutoRefresh
  } = useISS();

  const {
    newsByCategory, activeCategory, setActiveCategory,
    loading: newsLoading, error: newsError,
    searchQuery, setSearchQuery, sortBy, setSortBy,
    refreshCategory, getFilteredArticles, getArticleCountByCategory,
    allCategories
  } = useNews();

  const filteredArticles = getFilteredArticles();
  const articleCounts = getArticleCountByCategory();

  return (
    <div className="min-h-screen bg-light-bg dark:bg-cyber-bg text-gray-900 dark:text-gray-200 font-sans transition-colors duration-300 grid-bg">
      <Navbar />
      
      {/* Section header */}
      <div className="max-w-screen-2xl mx-auto px-4 pt-8 pb-2">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-[2px] bg-blue-500 dark:bg-neon-cyan rounded"></div>
          <span className="text-xs font-mono text-blue-600 dark:text-neon-cyan uppercase tracking-[0.2em] dark:text-glow-cyan">
            Live Data Feed
          </span>
          <div className="w-8 h-[2px] bg-blue-500 dark:bg-neon-cyan rounded"></div>
        </div>
        <h2 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">
          SPACE <span className="text-blue-600 dark:text-neon-orange dark:text-glow-orange">INTELLIGENCE</span>
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-500 font-mono mt-1">Real-time metrics from the International Space Station network</p>
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* ROW 1: ISS Tracker & Speed Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ISSTracker 
              positions={positions}
              currentPos={currentPos}
              speed={speed}
              nearestPlace={nearestPlace}
              loading={issLoading}
              error={issError}
              autoRefresh={autoRefresh}
              manualRefresh={manualRefresh}
              toggleAutoRefresh={toggleAutoRefresh}
            />
          </div>
          <div className="xl:col-span-1">
            <ISSSpeedChart speedHistory={speedHistory} />
          </div>
        </div>

        {/* ROW 2: People in Space & News Distribution Chart */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PeopleInSpace people={people} loading={peopleLoading} />
          </div>
          <div className="xl:col-span-1">
            <NewsDistributionChart 
              articleCounts={articleCounts} 
              onCategoryClick={(cat) => setActiveCategory(cat)} 
            />
          </div>
        </div>

        {/* ROW 3: News Dashboard */}
        <div className="w-full">
          <NewsDashboard 
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            loading={newsLoading}
            error={newsError}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
            refreshCategory={refreshCategory}
            filteredArticles={filteredArticles}
            articleCounts={articleCounts}
            allCategories={allCategories}
          />
        </div>

      </main>

      {/* Footer */}
      <footer className="max-w-screen-2xl mx-auto px-4 py-6 border-t border-gray-200 dark:border-cyber-border mt-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono text-gray-500 dark:text-gray-600">
            © 2024 <span className="text-blue-600 dark:text-neon-cyan">Mission Control Dashboard</span> — Built with React + Vite
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-blue-50 dark:bg-neon-cyan/10 text-blue-600 dark:text-neon-cyan border border-blue-200 dark:border-neon-cyan/30">React 18</span>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-purple-50 dark:bg-neon-purple/10 text-purple-600 dark:text-neon-purple border border-purple-200 dark:border-neon-purple/30">Vite</span>
            <span className="text-[10px] font-mono px-2 py-1 rounded bg-orange-50 dark:bg-neon-orange/10 text-orange-600 dark:text-neon-orange border border-orange-200 dark:border-neon-orange/30">Llama 3.2</span>
          </div>
        </div>
      </footer>

      <Chatbot 
        issContext={{
          lat: currentPos?.latitude,
          lon: currentPos?.longitude,
          place: nearestPlace,
          speed: speed,
          trackedCount: positions.length,
          peopleCount: people.length,
          astronautNames: people.map(p => p.name).join(', ')
        }}
        newsContext={newsByCategory}
      />

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: isDark ? '#0d1525' : '#ffffff',
            color: isDark ? '#00e5ff' : '#333333',
            border: `1px solid ${isDark ? '#00e5ff44' : '#e2e8f0'}`,
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: '"Share Tech Mono", monospace',
            boxShadow: isDark ? '0 0 20px rgba(0, 229, 255, 0.15)' : '0 2px 10px rgba(0,0,0,0.1)',
          },
          duration: 3000
        }}
      />
    </div>
  );
}
