import React, { useState } from 'react';

export default function NewsCard({ article, index }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString(undefined, { 
        month: 'short', day: 'numeric', year: 'numeric' 
      }) 
    : '';

  return (
    <div className="border border-gray-200 dark:border-cyber-border rounded-lg overflow-hidden hover:border-blue-300 dark:hover:border-neon-cyan/40 transition-all bg-white dark:bg-[#070c18] group">
      <div 
        className="p-4 flex items-center gap-4 cursor-pointer"
        onClick={toggleExpand}
      >
        {/* Index number */}
        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-blue-100 dark:bg-neon-cyan/10 text-blue-600 dark:text-neon-cyan flex items-center justify-center text-xs font-mono font-bold border border-blue-200 dark:border-neon-cyan/30">
          {index + 1}
        </div>
        
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-16 h-12 rounded-md overflow-hidden bg-gray-100 dark:bg-cyber-card flex items-center justify-center border border-gray-200 dark:border-cyber-border">
          {!imgError && article.urlToImage ? (
            <img 
              src={article.urlToImage} 
              alt={article.title} 
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-lg opacity-50">📰</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-blue-600 dark:text-neon-orange uppercase text-[10px] font-mono font-bold tracking-wider truncate max-w-[50%]">
              {article.source?.name || 'Unknown Source'}
            </span>
            <span className="text-gray-400 dark:text-gray-600 text-[10px] font-mono">
              • {formattedDate}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-neon-cyan transition-colors">
            {article.title}
          </h3>
          {article.author && (
            <span className="text-gray-400 dark:text-gray-600 text-xs block mt-1 truncate font-mono">
              By {article.author}
            </span>
          )}
        </div>

        {/* Expand icon */}
        <div className="flex-shrink-0 text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-neon-cyan transition-colors">
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-100 dark:border-cyber-border">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            {article.description || 'No description available for this article.'}
          </p>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="cyber-btn cyber-btn-accent inline-flex items-center gap-1"
          >
            Read More <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      )}
    </div>
  );
}
