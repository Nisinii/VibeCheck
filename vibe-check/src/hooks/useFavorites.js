import { useState, useEffect } from 'react';

// ------------------------------------------------------------------
// HOOK: USE FAVORITES
// ------------------------------------------------------------------
// Manages the user's list of saved places.
// It persists data to localStorage so favorites survive page reloads.

export const useFavorites = () => {
  
  // ------------------------------------------------------------------
  // 1. STATE WITH LAZY INITIALIZATION
  // ------------------------------------------------------------------
  // We pass a function to useState instead of a value.
  // This ensures the expensive `localStorage.getItem` call only runs
  // once when the component mounts, not on every re-render.
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vibecheck_favorites');
      // If data exists, parse it. If not, return empty array.
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse favorites from storage", e);
      return [];
    }
  });

  // ------------------------------------------------------------------
  // 2. SYNC TO LOCAL STORAGE
  // ------------------------------------------------------------------
  // Whenever the `favorites` array changes, update localStorage.
  useEffect(() => {
    localStorage.setItem('vibecheck_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // ------------------------------------------------------------------
  // 3. ACTIONS
  // ------------------------------------------------------------------
  
  // Adds or removes a place from the list based on existence
  const toggleFavorite = (place) => {
    setFavorites(prev => {
      const exists = prev.find(p => p.id === place.id);
      if (exists) {
        // Remove it
        return prev.filter(p => p.id !== place.id);
      } else {
        // Add it
        return [...prev, place];
      }
    });
  };

  // Helper to check UI state (e.g. for filling the heart icon)
  const isFavorite = (placeId) => {
    return favorites.some(p => p.id === placeId);
  };

  return { favorites, toggleFavorite, isFavorite };
};