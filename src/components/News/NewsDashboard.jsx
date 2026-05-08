import React from 'react';
import NewsCard from './NewsCard';

const CATEGORY_LABELS = {
  technology: { icon: '💻', text: 'Technology' },
  science: { icon: '🔬', text: 'Science' },
  space: { icon: '🚀', text: 'Space' },
  business: { icon: '💼', text: 'Business' },
  health: { icon: '❤️', text: 'Health' }
};

export default function NewsDashboard({
  activeCategory, setActiveCategory,
  loading, error,
  searchQuery, setSearchQuery,
  sortBy, setSortBy,
  refreshCategory,
  filteredArticles,
  articleCounts,
  allCategories
}) {
  const isError = error[activeCategory];
  const isLoading = loading[activeCategory];

  return (
    <div className="cyber-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-neon-green font-mono uppercase tracking-wider dark:text-glow-green">
          <span>📰</span> Breaking News
        </h2>
        <button 
          onClick={() => refreshCategory(activeCategory)}
          disabled={isLoading}
          className="cyber-btn cyber-btn-primary disabled:opacity-50"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {allCategories.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-mono font-medium transition-all flex items-center gap-2 border
                ${isActive 
                  ? 'bg-blue-600 dark:bg-neon-cyan/20 text-white dark:text-neon-cyan border-blue-600 dark:border-neon-cyan/50 dark:shadow-[0_0_10px_rgba(0,229,255,0.2)]' 
                  : 'bg-gray-100 dark:bg-cyber-card text-gray-600 dark:text-gray-400 border-gray-200 dark:border-cyber-border hover:bg-gray-200 dark:hover:bg-[#111b30] hover:border-gray-300 dark:hover:border-neon-cyan/30'
                }`}
            >
              <span>{CATEGORY_LABELS[cat].icon}</span>
              <span>{CATEGORY_LABELS[cat].text}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-white/20 dark:bg-neon-cyan/20' : 'bg-gray-200 dark:bg-cyber-border'}`}>
                {articleCounts[cat] || 0}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="🔍 Search title, source, author..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-neon-cyan/20 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500 dark:focus:border-neon-cyan dark:focus:shadow-[0_0_10px_rgba(0,229,255,0.2)] transition-all text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-600"
          />
        </div>
        <select 
          value={sortBy} 
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-50 dark:bg-[#070c18] border border-gray-200 dark:border-neon-cyan/20 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:border-blue-500 dark:focus:border-neon-cyan transition-all text-gray-900 dark:text-gray-200 min-w-[150px]"
        >
          <option value="publishedAt">Sort by Date</option>
          <option value="source">Sort by Source</option>
        </select>
      </div>

      {isError && (
        <div className="bg-red-50 dark:bg-red-900/15 border border-red-300 dark:border-neon-pink/30 text-red-700 dark:text-neon-pink px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <span className="font-mono text-sm">{isError}</span>
          <button onClick={() => refreshCategory(activeCategory)} className="underline text-sm font-semibold font-mono">
            Retry
          </button>
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-20 w-full rounded-lg"></div>
          ))
        ) : filteredArticles.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-gray-500 dark:text-gray-500">
            <span className="text-4xl mb-2">🔍</span>
            <p className="font-mono text-sm">No articles found</p>
          </div>
        ) : (
          filteredArticles.map((article, index) => (
            <NewsCard key={`${article.url}-${index}`} article={article} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
