import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../context/ThemeContext';

const COLORS_DARK = ['#00e5ff', '#ff2d78', '#00ff88', '#ff6b2b', '#b537f2'];
const COLORS_LIGHT = ['#3b82f6', '#ec4899', '#10b981', '#f97316', '#8b5cf6'];

const DISPLAY_NAMES = {
  technology: 'Technology',
  science: 'Science',
  space: 'Space',
  business: 'Business',
  health: 'Health'
};

export default function NewsDistributionChart({ articleCounts, onCategoryClick }) {
  const { isDark } = useTheme();
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  const data = useMemo(() => {
    if (!articleCounts) return [];
    return Object.entries(articleCounts)
      .filter(([_, count]) => count > 0)
      .map(([key, count]) => ({
        name: DISPLAY_NAMES[key] || key,
        value: count,
        key: key
      }));
  }, [articleCounts]);

  if (data.length === 0) {
    return (
      <div className="cyber-card p-6 flex items-center justify-center h-[340px]">
        <div className="text-center">
          <span className="text-3xl mb-2 block">📊</span>
          <p className="text-gray-500 dark:text-neon-cyan/50 font-mono text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  const tooltipStyle = {
    backgroundColor: isDark ? '#0d1525' : '#ffffff',
    border: `1px solid ${isDark ? '#00e5ff44' : '#e2e8f0'}`,
    borderRadius: '8px',
    color: isDark ? '#c8d6e5' : '#1a2332',
    fontFamily: '"Share Tech Mono", monospace',
    fontSize: '12px',
    boxShadow: isDark ? '0 0 20px rgba(0, 229, 255, 0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
  };

  return (
    <div className="cyber-card p-4 md:p-6 h-full min-h-[340px] flex flex-col">
      <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-neon-orange font-mono uppercase tracking-wider dark:text-glow-orange flex items-center gap-2">
        📊 News by Category
      </h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
              onClick={(entry) => {
                if (entry && entry.key) {
                  onCategoryClick(entry.key);
                }
              }}
              style={{ cursor: 'pointer' }}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  stroke={isDark ? '#0a0e1a' : '#ffffff'} 
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={tooltipStyle}
              formatter={(value) => [`${value} articles`, 'Count']}
              itemStyle={{ color: isDark ? '#c8d6e5' : '#64748b' }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px', fontFamily: '"Share Tech Mono", monospace' }}
              layout="horizontal" 
              verticalAlign="bottom" 
              align="center"
              formatter={(value) => <span className="text-gray-600 dark:text-gray-400">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
