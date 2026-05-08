import React from 'react';
import ISSMap from './ISSMap';

export default function ISSTracker({ 
  positions, currentPos, speed, nearestPlace, loading, error, 
  autoRefresh, manualRefresh, toggleAutoRefresh 
}) {
  return (
    <div className="cyber-card p-4 md:p-6 scanline-overlay">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 relative z-10">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-neon-cyan font-mono uppercase tracking-wider dark:text-glow-cyan">
          <span>🛸</span> ISS Live Tracking
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={manualRefresh}
            disabled={loading}
            className="cyber-btn cyber-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ↻ Refresh Now
          </button>
          <button 
            onClick={toggleAutoRefresh}
            className={`cyber-btn ${
              autoRefresh 
                ? 'cyber-btn-accent' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600'
            }`}
          >
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-neon-pink/40 text-red-700 dark:text-neon-pink px-4 py-3 rounded-lg mb-6 flex justify-between items-center relative z-10">
          <span className="font-mono text-sm">{error}</span>
          <button onClick={manualRefresh} className="underline text-sm font-semibold hover:text-red-800 dark:hover:text-neon-pink dark:text-glow-pink">
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 relative z-10">
        <StatBox 
          label="Latitude / Longitude" 
          value={currentPos ? `${currentPos.latitude.toFixed(3)}, ${currentPos.longitude.toFixed(3)}` : ''} 
          loading={loading && !currentPos}
          color="cyan"
        />
        <StatBox 
          label="Speed" 
          value={currentPos ? `${speed.toLocaleString()} km/h` : ''} 
          loading={loading && !currentPos}
          color="orange"
        />
        <StatBox 
          label="Nearest Place" 
          value={nearestPlace} 
          loading={loading && !currentPos}
          color="green"
        />
        <StatBox 
          label="Tracked Positions" 
          value={positions.length} 
          loading={loading && !currentPos}
          color="purple"
        />
      </div>

      <div className="relative z-10">
        <ISSMap loading={loading} positions={positions} currentPos={currentPos} />
      </div>
    </div>
  );
}

const colorMap = {
  cyan: { text: 'dark:text-neon-cyan', glow: 'dark:text-glow-cyan', border: 'dark:border-neon-cyan/20' },
  orange: { text: 'dark:text-neon-orange', glow: 'dark:text-glow-orange', border: 'dark:border-neon-orange/20' },
  green: { text: 'dark:text-neon-green', glow: 'dark:text-glow-green', border: 'dark:border-neon-green/20' },
  purple: { text: 'dark:text-neon-purple', glow: 'dark:text-glow-purple', border: 'dark:border-neon-purple/20' },
};

function StatBox({ label, value, loading, color = 'cyan' }) {
  const c = colorMap[color];
  return (
    <div className={`bg-gray-50 dark:bg-[#070c18] rounded-lg p-4 flex flex-col justify-center min-h-[88px] border border-gray-100 ${c.border} transition-colors`}>
      <span className={`text-xs text-gray-500 ${c.text} mb-1 font-mono uppercase tracking-wider`}>{label}</span>
      {loading ? (
        <div className="skeleton h-6 w-3/4 rounded mt-1"></div>
      ) : (
        <span className={`text-lg md:text-xl font-bold truncate text-gray-900 ${c.text} ${c.glow}`} title={String(value)}>{value}</span>
      )}
    </div>
  );
}
