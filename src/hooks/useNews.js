import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const CATEGORIES = ['technology', 'science', 'space', 'business', 'health'];
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export function useNews() {
  const [newsByCategory, setNewsByCategory] = useState({
    technology: [], science: [], space: [], business: [], health: []
  });
  const [activeCategory, setActiveCategory] = useState('technology');
  const [loading, setLoading] = useState({
    technology: true, science: true, space: true, business: true, health: true
  });
  const [error, setError] = useState({
    technology: null, science: null, space: null, business: null, health: null
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('publishedAt');

  const fetchCategory = useCallback(async (category, force = false) => {
    try {
      setLoading(prev => ({ ...prev, [category]: true }));
      setError(prev => ({ ...prev, [category]: null }));

      const cacheKey = `news_cache_${category}`;
      const cachedStr = localStorage.getItem(cacheKey);
      
      if (!force && cachedStr) {
        const cached = JSON.parse(cachedStr);
        if (Date.now() - cached.timestamp < CACHE_DURATION) {
          setNewsByCategory(prev => ({ ...prev, [category]: cached.articles }));
          setLoading(prev => ({ ...prev, [category]: false }));
          return;
        }
      }

      const apiKey = import.meta.env.VITE_NEWS_API_KEY;
      let url = '';
      if (category === 'space') {
        url = `/news-api/everything?q=space OR NASA OR ISS OR SpaceX&pageSize=10&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
      } else {
        url = `/news-api/top-headlines?category=${category}&pageSize=10&language=en&apiKey=${apiKey}`;
      }

      const res = await axios.get(url);
      const validArticles = (res.data.articles || [])
        .filter(a => a.title && a.title !== '[Removed]' && a.urlToImage)
        .slice(0, 10);

      localStorage.setItem(cacheKey, JSON.stringify({
        articles: validArticles,
        timestamp: Date.now()
      }));

      setNewsByCategory(prev => ({ ...prev, [category]: validArticles }));
    } catch (err) {
      setError(prev => ({ ...prev, [category]: 'Failed to load news' }));
    } finally {
      setLoading(prev => ({ ...prev, [category]: false }));
    }
  }, []);

  useEffect(() => {
    CATEGORIES.forEach(cat => fetchCategory(cat));
  }, [fetchCategory]);

  const refreshCategory = async (category) => {
    await fetchCategory(category, true);
    toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} news refreshed!`);
  };

  const getFilteredArticles = () => {
    let articles = [...newsByCategory[activeCategory]];
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      articles = articles.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.source && a.source.name && a.source.name.toLowerCase().includes(q)) ||
        (a.author && a.author.toLowerCase().includes(q))
      );
    }

    if (sortBy === 'publishedAt') {
      articles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'source') {
      articles.sort((a, b) => {
        const s1 = a.source?.name || '';
        const s2 = b.source?.name || '';
        return s1.localeCompare(s2);
      });
    }

    return articles;
  };

  const getArticleCountByCategory = () => {
    const counts = {};
    CATEGORIES.forEach(cat => {
      counts[cat] = newsByCategory[cat].length;
    });
    return counts;
  };

  return {
    newsByCategory,
    activeCategory, setActiveCategory,
    loading, error,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    refreshCategory,
    getFilteredArticles,
    getArticleCountByCategory,
    allCategories: CATEGORIES
  };
}
