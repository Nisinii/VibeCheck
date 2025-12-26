import { useState, useCallback } from 'react';
import { MOODS } from '../utils/constants';

/**
 * Hook to fetch places data based on location and active mood.
 */
export const usePlacesFetcher = (apiReady, activeMood, searchQuery) => {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaces = useCallback(async () => {
    if (!apiReady || !window.google?.maps) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      
      // Get User Location
      const getPosition = () => new Promise((res, rej) => {
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 6000 });
      });

      let location;
      try {
        const pos = await getPosition();
        location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch (e) {
        console.warn("Geolocation failed, defaulting to NYC");
        location = { lat: 40.7128, lng: -74.0060 }; // Default Fallback
      }

      const mood = MOODS.find(m => m.id === activeMood);
      
      const request = {
        includedPrimaryTypes: mood.types,
        locationRestriction: { center: location, radius: 4000 },
        maxResultCount: 15,
        rankPreference: SearchNearbyRankPreference.POPULARITY,
        fields: [
          'id', 'displayName', 'types', 'rating', 'userRatingCount', 
          'priceLevel', 'photos', 'businessStatus', 'primaryTypeDisplayName'
        ],
      };

      const { places: results } = await Place.searchNearby(request);

      if (results && results.length > 0) {
        const formatted = results.map(p => ({
          id: p.id,
          name: p.displayName || "Establishment",
          type: p.primaryTypeDisplayName || "Venue",
          rating: p.rating || 0,
          reviews: p.userRatingCount || 0,
          distance: "Nearby",
          priceLevel: p.priceLevel ? parseInt(p.priceLevel.replace('PRICE_LEVEL_', '')) : 2,
          isOpen: p.businessStatus === 'OPERATIONAL',
          hours: p.businessStatus === 'OPERATIONAL' ? "Operational" : "Closed",
          // Safe access to photos
          image: p.photos?.[0]?.getURI({ maxWidth: 800 }) || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600",
          vibeScore: Math.floor(Math.random() * 10) + 90, // Simulation
          busyLevel: p.businessStatus === 'OPERATIONAL' ? 'Normal' : 'Limited',
          aiSummary: `High-fidelity ${p.primaryTypeDisplayName || 'venue'} curated for its ${p.rating > 4.5 ? 'exceptional' : 'consistent'} atmosphere.`
        }));

        setPlaces(searchQuery 
          ? formatted.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
          : formatted
        );
      } else {
        setPlaces([]);
      }
    } catch (err) {
      console.warn("API Partial Failure", err);
      if (err.message && err.message.includes("fields")) {
         setError("API Field Mask Error. Please check requested fields."); 
      } else {
         setError(err.message || "Spatial link disrupted.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [apiReady, activeMood, searchQuery]);

  return { places, isLoading, error, fetchPlaces };
};