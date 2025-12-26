import React, { useEffect, useRef } from 'react';

const MapVisualizer = ({ places, userLocation }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!userLocation || !window.google?.maps) return;

    const initMap = async () => {
      const { Map } = await window.google.maps.importLibrary("maps");
      const { AdvancedMarkerElement, PinElement } = await window.google.maps.importLibrary("marker");

      const map = new Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        mapId: "DEMO_MAP_ID", // Required for Advanced Markers
        disableDefaultUI: true,
        styles: [ /* Optional: Add custom dark mode styles here */ ]
      });

      // User Location Marker (Blue Dot)
      const userPin = new PinElement({
        background: "#4F46E5",
        borderColor: "#ffffff",
        glyphColor: "#ffffff",
        scale: 1.2,
      });

      new AdvancedMarkerElement({
        map,
        position: userLocation,
        content: userPin.element,
        title: "You are here",
      });

      // Places Markers
      places.forEach((place) => {
        const pin = new PinElement({
          background: "#ffffff",
          borderColor: "#CBD5E1",
          glyphColor: "#4F46E5",
        });

        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: place.lat, lng: place.lng },
          content: pin.element,
          title: place.name,
        });

        // Simple info window on click
        marker.addListener("click", () => {
           const infoWindow = new window.google.maps.InfoWindow({
             content: `
               <div style="padding: 8px; font-family: sans-serif;">
                 <strong style="font-size: 14px;">${place.name}</strong><br/>
                 <span style="font-size: 12px; color: #64748b;">${place.rating} ⭐ • ${place.type}</span>
               </div>
             `
           });
           infoWindow.open(map, marker);
        });
      });
    };

    initMap();
  }, [places, userLocation]);

  return <div ref={mapRef} className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-200" />;
};

export default MapVisualizer;