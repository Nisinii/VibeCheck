import { useState, useCallback, useRef } from 'react';
import { MOODS } from '../utils/constants';

// Keep vibe logic
const calculateVibe = (reviewCount, isOpen) => {
  if (!isOpen) return { label: "Dormant", color: "text-slate-400", bg: "bg-slate-100" };
  if (reviewCount > 1000) return { label: "Electric", color: "text-purple-600", bg: "bg-purple-50" };
  if (reviewCount > 500) return { label: "Buzzing", color: "text-rose-600", bg: "bg-rose-50" };
  if (reviewCount > 100) return { label: "Lively", color: "text-amber-600", bg: "bg-amber-50" };
  if (reviewCount > 20) return { label: "Chill", color: "text-emerald-600", bg: "bg-emerald-50" };
  return { label: "Quiet", color: "text-slate-600", bg: "bg-slate-100" };
};

export const usePlacesFetcher = (apiReady, activeMood, searchQuery, radius = 2, budget = []) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use Ref to prevent infinite loops caused by location object changing
  const locationRef = useRef(null);

  // STABILIZE DEPENDENCIES
  const budgetKey = (budget || []).join(',');

  const fetchPlaces = useCallback(async () => {
    if (!apiReady || !window.google?.maps) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      
      // 1. Get Location (Stabilized with Ref)
      let location = locationRef.current;
      if (!location) {
        try {
          const pos = await new Promise((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 })
          );
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          locationRef.current = location; 
        } catch (e) {
          console.warn("Geolocation failed, defaulting to Stockholm");
          location = { lat: 59.334591, lng: 18.063240 }; 
          locationRef.current = location;
        }
      }

      let results = [];
      
      // STRATEGY A: Semantic Search
      if (searchQuery && searchQuery.trim().length > 0) {
        const request = {
          textQuery: searchQuery,
          locationBias: { center: location, radius: radius * 1000 },
          isOpenNow: true, // <--- FIXED: Changed from 'openNow' to 'isOpenNow'
          fields: ['id', 'displayName', 'types', 'rating', 'userRatingCount', 'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 'location', 'regularOpeningHours'],
        };
        const { places: searchResults } = await Place.searchByText(request);
        results = searchResults;
      } 
      // STRATEGY B: Mood Browse
      else {
        const mood = MOODS.find(m => m.id === activeMood) || MOODS[0];
        const request = {
          includedPrimaryTypes: mood.types,
          locationRestriction: { center: location, radius: radius * 1000 },
          maxResultCount: 20,
          rankPreference: SearchNearbyRankPreference.POPULARITY,
          // isOpenNow: true, // Optional: Uncomment if you only want open places in browse mode too
          fields: ['id', 'displayName', 'types', 'rating', 'userRatingCount', 'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 'location', 'regularOpeningHours'],
        };
        const { places: nearbyResults } = await Place.searchNearby(request);
        results = nearbyResults;
      }

      // 2. Process Results
      if (results && results.length > 0) {
        let formatted = results.map(p => {
          const isOpen = p.businessStatus === 'OPERATIONAL';
          const vibe = calculateVibe(p.userRatingCount || 0, isOpen);
          
          let rawPrice = p.priceLevel;
          let parsedPrice = 2; 
          if (typeof rawPrice === 'string') {
             if (rawPrice.includes('INEXPENSIVE')) parsedPrice = 1;
             else if (rawPrice.includes('MODERATE')) parsedPrice = 2;
             else if (rawPrice.includes('EXPENSIVE')) parsedPrice = 3;
             else if (rawPrice.includes('VERY_EXPENSIVE')) parsedPrice = 4;
          } else if (typeof rawPrice === 'number') parsedPrice = rawPrice;

          return {
            id: p.id,
            place_id: p.id,
            name: p.displayName || "Establishment",
            type: p.primaryTypeDisplayName || "Venue",
            rating: p.rating || 0,
            reviews: p.userRatingCount || 0,
            lat: p.location.lat(),
            lng: p.location.lng(),
            priceLevel: parsedPrice,
            isOpen: isOpen,
            hours: isOpen ? "Open Now" : "Closed",
            image: p.photos?.[0]?.getURI({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
            vibeScore: Math.floor(Math.random() * 15) + 85,
            vibeLabel: vibe.label,
            vibeColor: vibe.color,
            vibeBg: vibe.bg,
            aiSummary: `High-fidelity ${p.primaryTypeDisplayName || 'venue'} curated for its ${p.rating > 4.5 ? 'exceptional' : 'consistent'} atmosphere.`
          };
        });

        // 3. Apply Budget Filter
        if (budget && budget.length > 0) {
          formatted = formatted.filter(place => budget.includes(place.priceLevel));
        }

        setPlaces(formatted);
      } else {
        setPlaces([]);
      }

    } catch (err) {
      if (err.message && err.message.includes("ZERO_RESULTS")) {
        setPlaces([]);
      } else {
        setError(err.message || "Spatial link disrupted.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiReady, activeMood, searchQuery, radius, budgetKey]);

  return { places, isLoading, error, fetchPlaces, userLocation: locationRef.current };
};