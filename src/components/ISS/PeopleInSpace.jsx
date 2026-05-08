import React from 'react';

export default function PeopleInSpace({ people, loading }) {
  const groups = people.reduce((acc, person) => {
    const craft = person.craft || 'Unknown';
    if (!acc[craft]) acc[craft] = [];
    acc[craft].push(person);
    return acc;
  }, {});

  return (
    <div className="cyber-card p-4 md:p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900 dark:text-neon-pink font-mono uppercase tracking-wider dark:text-glow-pink">
          <span>🚀</span> People in Space
        </h2>
        <div className="bg-blue-50 dark:bg-neon-pink/10 text-blue-600 dark:text-neon-pink px-3 py-1 rounded-full text-sm font-mono font-semibold border border-blue-200 dark:border-neon-pink/30">
          {loading ? '...' : `${people.length} people`}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="space-y-4">
            <div className="skeleton h-4 w-24 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton h-12 w-full rounded-lg"></div>
              ))}
            </div>
          </div>
        ) : people.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-400 h-full flex items-center justify-center font-mono">
            No data available
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([craft, members]) => (
              <div key={craft}>
                <h3 className="text-xs uppercase tracking-[0.15em] text-blue-600 dark:text-neon-orange font-mono font-bold mb-3 dark:text-glow-orange">
                  ▸ {craft}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {members.map((member, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gray-50 dark:bg-[#070c18] rounded-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-neon-cyan/10 hover:border-blue-300 dark:hover:border-neon-cyan/30 transition-all group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform">👨‍🚀</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm">{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
