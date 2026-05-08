import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

export default function ISSSpeedChart({ speedHistory }) {
  const { isDark } = useTheme();

  if (!speedHistory || speedHistory.length === 0) {
    return (
      <div className="cyber-card p-6 flex items-center justify-center h-[340px]">
        <div className="text-center">
          <span className="text-3xl mb-2 block">📡</span>
          <p className="text-gray-500 dark:text-neon-cyan/50 font-mono text-sm dark:text-glow-cyan">Collecting speed data...</p>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: isDark ? '#0d1525' : '#ffffff',
    border: `1px solid ${isDark ? '#00e5ff44' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: isDark ? '#00e5ff' : '#1a2332',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '12px',
    boxShadow: isDark ? '0 0 20px rgba(0, 229, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <div className="cyber-card p-4 md:p-6 h-full min-h-[340px] flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-neon-cyan font-mono uppercase tracking-wider dark:text-glow-cyan flex items-center gap-2">
        📈 Speed History
      </h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height={270}>
          <AreaChart data={speedHistory} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
            <defs>
              <linearGradient id="speedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDark ? '#00e5ff' : '#3b82f6'} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={isDark ? '#00e5ff' : '#3b82f6'} stopOpacity={0}/>
              </linearGradient>
              {isDark && (
                <filter id="neonGlow">
                  <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#00e5ff" floodOpacity="0.6"/>
                </filter>
              )}
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={isDark ? '#1a2540' : '#e2e8f0'} 
              vertical={false}
            />
            <XAxis 
              dataKey="time" 
              angle={-45} 
              textAnchor="end" 
              tick={{ fill: isDark ? '#00e5ff88' : '#64748b', fontSize: 10, fontFamily: '"Share Tech Mono", monospace' }} 
              interval="preserveStartEnd"
              minTickGap={40}
              axisLine={{ stroke: isDark ? '#1a2540' : '#e2e8f0' }}
              tickLine={{ stroke: isDark ? '#1a254066' : '#e2e8f0' }}
            />
            <YAxis 
              domain={['auto', 'auto']} 
              tickFormatter={(val) => `${(val/1000).toFixed(0)}k`}
              tick={{ fill: isDark ? '#00e5ff88' : '#64748b', fontSize: 11, fontFamily: '"Share Tech Mono", monospace' }} 
              axisLine={{ stroke: isDark ? '#1a2540' : '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value.toLocaleString()} km/h`, 'ISS Speed']}
              labelStyle={{ color: isDark ? '#00e5ff66' : '#94a3b8', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="speed"
              name="ISS Speed"
              stroke={isDark ? '#00e5ff' : '#3b82f6'}
              strokeWidth={2}
              fill="url(#speedGradient)"
              dot={false}
              activeDot={{ r: 5, fill: isDark ? '#00e5ff' : '#3b82f6', stroke: isDark ? '#0a0e1a' : '#fff', strokeWidth: 2 }}
              isAnimationActive={false}
              style={isDark ? { filter: 'url(#neonGlow)' } : {}}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
