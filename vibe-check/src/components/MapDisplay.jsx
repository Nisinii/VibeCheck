import { useEffect, useRef } from 'react';

// Notice we don't import the "Loader" class anymore
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

const MapDisplay = ({ center }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    // 1. Set your options globally (functional API)
    setOptions({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    const initMap = async () => {
      try {
        // 2. Import libraries functionally
        const { Map } = await importLibrary("maps");
        const { AdvancedMarkerElement } = await importLibrary("marker");

        const map = new Map(mapRef.current, {
          center: center,
          zoom: 14,
          mapId: "DEMO_MAP_ID", 
          disableDefaultUI: true,
        });

        new AdvancedMarkerElement({
          map: map,
          position: center,
          title: "You are here",
        });
        
      } catch (error) {
        console.error("Maps failed to load:", error);
      }
    };

    initMap();
  }, [center]);

  return (
    <div 
      ref={mapRef} 
      style={{ 
        height: '450px', 
        width: '100%', 
        borderRadius: '16px',
        overflow: 'hidden'
      }} 
    />
  );
};

export default MapDisplay;