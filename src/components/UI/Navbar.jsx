import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 border-b border-gray-200 dark:border-neon-cyan/20 bg-white dark:bg-cyber-bg sticky top-0 z-50 transition-colors duration-300">
      <div className="flex items-center gap-4">
        {/* Logo icon */}
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-neon-cyan/10 border border-blue-200 dark:border-neon-cyan/40 flex items-center justify-center">
          <span className="text-blue-600 dark:text-neon-cyan text-lg">🛰</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-blue-600 dark:text-neon-cyan uppercase tracking-[0.2em] font-mono dark:text-glow-cyan">
            MISSION CONTROL DASHBOARD
          </span>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Real-Time ISS and News Intelligence
          </h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-neon-green/10 border border-green-200 dark:border-neon-green/30">
          <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-neon-green status-dot"></div>
          <span className="text-[10px] font-mono font-semibold text-green-700 dark:text-neon-green dark:text-glow-green uppercase tracking-wider">
            All Systems Online
          </span>
        </div>
        {/* Live Clock */}
        <div className="hidden md:block px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-cyber-card border border-gray-200 dark:border-neon-cyan/30">
          <span className="text-sm font-mono text-gray-600 dark:text-neon-cyan dark:text-glow-cyan">
            {time}
          </span>
        </div>
        <button 
          onClick={toggleTheme}
          className="cyber-btn cyber-btn-primary"
        >
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </nav>
  );
}
