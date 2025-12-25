import { useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const MapDisplay = ({ center, mood, onPlacesFound }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    setOptions({ apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, version: "weekly" });

    const initMap = async () => {
      const { Map } = await importLibrary("maps");
      const { PlacesService } = await importLibrary("places");

      const map = new Map(mapRef.current, {
        center: center,
        zoom: 14,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: true,
      });

      // Define what we are looking for based on the mood
      const moodKeywords = {
        work: 'cafe wifi quiet',
        date: 'romantic restaurant wine bar',
        quick: 'takeaway fast food',
        budget: 'cheap eats diner'
      };

      const request = {
        location: center,
        radius: '2000', // 2km
        keyword: moodKeywords[mood] || 'restaurant'
      };

      const service = new PlacesService(map);
      
      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Send the live results back up to App.jsx
          onPlacesFound(results);
        }
      });
    };

    if (center) initMap();
  }, [center, mood]); // Re-run when center or mood changes

  return <div ref={mapRef} className="w-full h-full" />;
};

export default MapDisplay;