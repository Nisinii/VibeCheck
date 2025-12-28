import { useState, useEffect } from 'react';

export const useFavorites = () => {
  // FIX: Use "Lazy Initialization" to read storage BEFORE the component renders
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vibecheck_favorites');
      // If data exists, parse it. If not, return empty array.
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites", e);
      return [];
    }
  });

  // Now this Effect only runs when you actually change the favorites
  useEffect(() => {
    localStorage.setItem('vibecheck_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (place) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === place.id);
      if (exists) {
        return prev.filter(p => p.id !== place.id);
      } else {
        return [...prev, place];
      }
    });
  };

  const isFavorite = (placeId) => {
    return favorites.some(p => p.id === placeId);
  };

  return { favorites, toggleFavorite, isFavorite };
};