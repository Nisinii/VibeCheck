import { useState, useCallback, useRef } from 'react';
import { MOODS } from '../utils/constants';

// ------------------------------------------------------------------
// HELPER: CALCULATE VIBE
// ------------------------------------------------------------------
// Determines the "Vibe Label" and colors based on review count.
// This is a heuristic: more reviews = "buzzing/electric", fewer = "chill".
const calculateVibe = (reviewCount, isOpen) => {
  if (!isOpen) return { label: "Dormant", color: "text-slate-400", bg: "bg-slate-100" };
  if (reviewCount > 1000) return { label: "Electric", color: "text-purple-600", bg: "bg-purple-50" };
  if (reviewCount > 500) return { label: "Buzzing", color: "text-rose-600", bg: "bg-rose-50" };
  if (reviewCount > 100) return { label: "Lively", color: "text-amber-600", bg: "bg-amber-50" };
  if (reviewCount > 20) return { label: "Chill", color: "text-emerald-600", bg: "bg-emerald-50" };
  return { label: "Quiet", color: "text-slate-600", bg: "bg-slate-100" };
};

// ------------------------------------------------------------------
// HOOK: USE PLACES FETCHER
// ------------------------------------------------------------------
// The core logic for interacting with the Google Places API (New).
// Handles:
// 1. Geolocation (User position)
// 2. Search Strategy (Text Search vs Category Browse)
// 3. Data Normalization (Google Data -> App Data)
// 4. Filtering (Budget, etc.)

export const usePlacesFetcher = (apiReady, activeMood, searchQuery, radius = 2, budget = []) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Ref to store location so it doesn't trigger re-renders if the object reference changes
  const locationRef = useRef(null);

  // STABILIZE DEPENDENCIES
  // Arrays (like budget) create new references on every render, causing infinite loops.
  // We turn it into a primitive string key for the useEffect dependency array.
  const budgetKey = (budget || []).join(',');

  const fetchPlaces = useCallback(async () => {
    // Guard: Don't run if API isn't loaded
    if (!apiReady || !window.google?.maps) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Import the specific libraries needed from the SDK
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      
      // ------------------------------------------------------------------
      // STEP 1: GET USER LOCATION
      // ------------------------------------------------------------------
      let location = locationRef.current;
      
      // If we don't have a location yet, try to get it
      if (!location) {
        try {
          const pos = await new Promise((res, rej) => 
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 })
          );
          location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          locationRef.current = location; // Cache it
        } catch (e) {
          console.warn("Geolocation failed, defaulting to Stockholm");
          location = { lat: 59.334591, lng: 18.063240 }; 
          locationRef.current = location;
        }
      }

      let results = [];
      const commonFields = ['id', 'displayName', 'types', 'rating', 'userRatingCount', 'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 'location', 'regularOpeningHours'];
      
      // ------------------------------------------------------------------
      // STEP 2: CHOOSE STRATEGY
      // ------------------------------------------------------------------
      
      // STRATEGY A: SEMANTIC SEARCH
      // Used when the user types something specific (e.g., "cozy rainy cafe")
      if (searchQuery && searchQuery.trim().length > 0) {
        const request = {
          textQuery: searchQuery,
          locationBias: { center: location, radius: radius * 1000 },
          isOpenNow: true, // Filters for currently open places
          fields: commonFields,
        };
        const { places: searchResults } = await Place.searchByText(request);
        results = searchResults;
      } 
      // STRATEGY B: MOOD BROWSE
      // Used when simply exploring categories (e.g., clicking "Chill" or "Romantic")
      else {
        const mood = MOODS.find(m => m.id === activeMood) || MOODS[0];
        const request = {
          includedPrimaryTypes: mood.types,
          locationRestriction: { center: location, radius: radius * 1000 },
          maxResultCount: 20,
          rankPreference: SearchNearbyRankPreference.POPULARITY,
          fields: commonFields,
        };
        const { places: nearbyResults } = await Place.searchNearby(request);
        results = nearbyResults;
      }

      // ------------------------------------------------------------------
      // STEP 3: NORMALIZE DATA
      // ------------------------------------------------------------------
      if (results && results.length > 0) {
        let formatted = results.map(p => {
          const isOpen = p.businessStatus === 'OPERATIONAL';
          const vibe = calculateVibe(p.userRatingCount || 0, isOpen);
          
          // Parse Price Level (Google uses strings like 'PRICE_LEVEL_MODERATE' in new API)
          let rawPrice = p.priceLevel;
          let parsedPrice = 2; // Default to $$
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
            // Helper to get image URL from Google Photo object
            image: p.photos?.[0]?.getURI({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
            
            // App-specific fields
            vibeScore: Math.floor(Math.random() * 15) + 85, // Simulation
            vibeLabel: vibe.label,
            vibeColor: vibe.color,
            vibeBg: vibe.bg,
            aiSummary: `High-fidelity ${p.primaryTypeDisplayName || 'venue'} curated for its ${p.rating > 4.5 ? 'exceptional' : 'consistent'} atmosphere.`
          };
        });

        // ------------------------------------------------------------------
        // STEP 4: APPLY LOCAL FILTERS (Budget)
        // ------------------------------------------------------------------
        if (budget && budget.length > 0) {
          formatted = formatted.filter(place => budget.includes(place.priceLevel));
        }

        setPlaces(formatted);
      } else {
        setPlaces([]);
      }

    } catch (err) {
      // Handle "Zero Results" gracefully, otherwise report error
      if (err.message && err.message.includes("ZERO_RESULTS")) {
        setPlaces([]);
      } else {
        console.error(err);
        setError(err.message || "Spatial link disrupted.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiReady, activeMood, searchQuery, radius, budgetKey]); // Re-create function when these change

  return { places, isLoading, error, fetchPlaces, userLocation: locationRef.current };
};