import { useState, useCallback } from 'react';
import { MOODS } from '../utils/constants';

// --- 1. KEEPING YOUR VIBE LOGIC ---
const calculateVibe = (reviewCount, isOpen) => {
  if (!isOpen) return { label: "Dormant", color: "text-slate-400", bg: "bg-slate-100" };
  if (reviewCount > 1000) return { label: "Electric", color: "text-purple-600", bg: "bg-purple-50" };
  if (reviewCount > 500) return { label: "Buzzing", color: "text-rose-600", bg: "bg-rose-50" };
  if (reviewCount > 100) return { label: "Lively", color: "text-amber-600", bg: "bg-amber-50" };
  if (reviewCount > 20) return { label: "Chill", color: "text-emerald-600", bg: "bg-emerald-50" };
  return { label: "Quiet", color: "text-slate-600", bg: "bg-slate-100" };
};

// --- 2. UPDATED HOOK WITH BUDGET & SEMANTIC SEARCH ---
export const usePlacesFetcher = (apiReady, activeMood, searchQuery, radius = 2, budget = []) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchPlaces = useCallback(async () => {
    // Basic checks
    if (!apiReady || !window.google?.maps) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Import the modern libraries
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      
      // A. Get User Location (if not set)
      let location = userLocation;
      if (!location) {
        try {
          const pos = await new Promise((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 })
          );
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(location);
        } catch (e) {
          console.warn("Geolocation failed, defaulting to Stockholm");
          location = { lat: 59.334591, lng: 18.063240 }; // Default Stockholm
          setUserLocation(location);
        }
      }

      // B. Determine Strategy: "Semantic Search" vs "Mood Browse"
      let results = [];
      
      // STRATEGY 1: Semantic Search (User typed something)
      // This allows "nice calm restaurant for 4" to work!
      if (searchQuery && searchQuery.trim().length > 0) {
        console.log("Using Semantic Search for:", searchQuery);
        
        const request = {
          textQuery: searchQuery,
          // Bias results towards user, but allow finding best matches slightly further
          locationBias: {
            center: location,
            radius: radius * 1000, 
          },
          openNow: true,
          // Request specific fields to save money/latency
          fields: ['id', 'displayName', 'types', 'rating', 'userRatingCount', 'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 'location', 'regularOpeningHours'],
        };
        
        const { places: searchResults } = await Place.searchByText(request);
        results = searchResults;
      } 
      
      // STRATEGY 2: Mood Browse (User just clicked a category)
      // Uses the precise 'searchNearby' for better local discovery
      else {
        const mood = MOODS.find(m => m.id === activeMood) || MOODS[0];
        console.log("Using Nearby Search for Mood:", mood.id);

        const request = {
          includedPrimaryTypes: mood.types,
          locationRestriction: { 
            center: location, 
            radius: radius * 1000 // STRICT radius constraint
          },
          maxResultCount: 20,
          rankPreference: SearchNearbyRankPreference.POPULARITY,
          fields: ['id', 'displayName', 'types', 'rating', 'userRatingCount', 'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 'location', 'regularOpeningHours'],
        };

        const { places: nearbyResults } = await Place.searchNearby(request);
        results = nearbyResults;
      }

      // C. Process & Filter Results
      if (results && results.length > 0) {
        let formatted = results.map(p => {
          const isOpen = p.businessStatus === 'OPERATIONAL';
          const vibe = calculateVibe(p.userRatingCount || 0, isOpen);
          
          // Helper to parse price level safely
          // Google sometimes returns "PRICE_LEVEL_MODERATE" or numbers
          let rawPrice = p.priceLevel;
          let parsedPrice = 2; // Default to $$
          if (typeof rawPrice === 'string') {
             if (rawPrice.includes('INEXPENSIVE')) parsedPrice = 1;
             else if (rawPrice.includes('MODERATE')) parsedPrice = 2;
             else if (rawPrice.includes('EXPENSIVE')) parsedPrice = 3;
             else if (rawPrice.includes('VERY_EXPENSIVE')) parsedPrice = 4;
          } else if (typeof rawPrice === 'number') {
             parsedPrice = rawPrice;
          }

          return {
            id: p.id,
            place_id: p.id, // Ensure compatibility with both ID styles
            name: p.displayName || "Establishment",
            type: p.primaryTypeDisplayName || "Venue",
            rating: p.rating || 0,
            reviews: p.userRatingCount || 0,
            lat: p.location.lat(),
            lng: p.location.lng(),
            priceLevel: parsedPrice, // 1, 2, 3, or 4
            isOpen: isOpen,
            hours: isOpen ? "Open Now" : "Closed",
            // Use URI for High-Res image or fallback
            image: p.photos?.[0]?.getURI({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
            vibeScore: Math.floor(Math.random() * 15) + 85,
            
            // YOUR CUSTOM VIBE DATA
            vibeLabel: vibe.label,
            vibeColor: vibe.color,
            vibeBg: vibe.bg,
            aiSummary: `High-fidelity ${p.primaryTypeDisplayName || 'venue'} curated for its ${p.rating > 4.5 ? 'exceptional' : 'consistent'} atmosphere.`
          };
        });

        // --- 3. BUDGET FILTERING ---
        // If the user selected budget options (e.g. [1, 2]), filter out the rest
        if (budget.length > 0) {
          formatted = formatted.filter(place => budget.includes(place.priceLevel));
        }

        setPlaces(formatted);
      } else {
        setPlaces([]);
      }

    } catch (err) {
      console.warn("API Failure", err);
      // Don't show error for empty semantic searches, just empty list
      if (err.message && err.message.includes("ZERO_RESULTS")) {
        setPlaces([]);
      } else {
        setError(err.message || "Spatial link disrupted.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiReady, activeMood, searchQuery, radius, budget, userLocation]); // Dependencies

  return { places, isLoading, error, fetchPlaces, userLocation };
};