import { useState, useCallback } from 'react';
import { MOODS } from '../utils/constants';

// Helper to determine vibe based on popularity and time
const calculateVibe = (reviewCount, isOpen) => {
  if (!isOpen) return { label: "Dormant", color: "text-slate-400", bg: "bg-slate-100" };
  if (reviewCount > 1000) return { label: "Electric", color: "text-purple-600", bg: "bg-purple-50" };
  if (reviewCount > 500) return { label: "Buzzing", color: "text-rose-600", bg: "bg-rose-50" };
  if (reviewCount > 100) return { label: "Lively", color: "text-amber-600", bg: "bg-amber-50" };
  if (reviewCount > 20) return { label: "Chill", color: "text-emerald-600", bg: "bg-emerald-50" };
  return { label: "Quiet", color: "text-slate-600", bg: "bg-slate-100" };
};

export const usePlacesFetcher = (apiReady, activeMood, searchQuery, radius = 2) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchPlaces = useCallback(async () => {
    if (!apiReady || !window.google?.maps) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      
      const getPosition = () => new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 });
      });

      let location;
      try {
        const pos = await getPosition();
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(location);
      } catch (e) {
        console.warn("Geolocation failed, defaulting to NYC");
        location = { lat: 40.7128, lng: -74.0060 };
        setUserLocation(location);
      }

      const mood = MOODS.find(m => m.id === activeMood);
      
      const request = {
        includedPrimaryTypes: mood.types,
        locationRestriction: { center: location, radius: radius * 1000 },
        maxResultCount: 20,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        // CHANGED: Added 'regularOpeningHours' to fields
        fields: [
          'id', 'displayName', 'types', 'rating', 'userRatingCount', 
          'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName', 
          'location', 'regularOpeningHours'
        ],
      };

      const { places: results } = await Place.searchNearby(request);

      if (results && results.length > 0) {
        const formatted = results.map(p => {
          const isOpen = p.businessStatus === 'OPERATIONAL'; // Simplified check
          const vibe = calculateVibe(p.userRatingCount || 0, isOpen);

          return {
            id: p.id,
            name: p.displayName || "Establishment",
            type: p.primaryTypeDisplayName || "Venue",
            rating: p.rating || 0,
            reviews: p.userRatingCount || 0,
            lat: p.location.lat(),
            lng: p.location.lng(),
            priceLevel: p.priceLevel ? parseInt(p.priceLevel.replace('PRICE_LEVEL_', '')) : 2,
            isOpen: isOpen,
            hours: isOpen ? "Open Now" : "Closed",
            image: p.photos?.[0]?.getURI({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
            vibeScore: Math.floor(Math.random() * 15) + 85,
            // NEW: Vibe Level Data
            vibeLabel: vibe.label,
            vibeColor: vibe.color,
            vibeBg: vibe.bg,
            aiSummary: `High-fidelity ${p.primaryTypeDisplayName || 'venue'} curated for its ${p.rating > 4.5 ? 'exceptional' : 'consistent'} atmosphere.`
          };
        });

        setPlaces(searchQuery 
          ? formatted.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : formatted
        );
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.warn("API Partial Failure", err);
      setError(err.message || "Spatial link disrupted.");
    } finally {
      setIsLoading(false);
    }
  }, [apiReady, activeMood, searchQuery, radius]);

  return { places, isLoading, error, fetchPlaces, userLocation };
};