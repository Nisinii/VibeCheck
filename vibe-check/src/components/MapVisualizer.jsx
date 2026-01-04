import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { Coffee, Utensils, Beer, ShoppingBag, Music, Info, DollarSign } from 'lucide-react';

// ------------------------------------------------------------------
// HELPER: ICON SELECTOR
// ------------------------------------------------------------------
// Returns a Lucide icon based on the place type string.
const getPlaceIcon = (type) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('cafe') || t.includes('coffee')) return <Coffee className="w-3 h-3 md:w-4 md:h-4" />;
  if (t.includes('bar') || t.includes('pub') || t.includes('night')) return <Beer className="w-3 h-3 md:w-4 md:h-4" />;
  if (t.includes('shop') || t.includes('store')) return <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />;
  if (t.includes('club') || t.includes('music')) return <Music className="w-3 h-3 md:w-4 md:h-4" />;
  return <Utensils className="w-3 h-3 md:w-4 md:h-4" />;
};

// ------------------------------------------------------------------
// COMPONENT: CUSTOM MARKER CONTENT
// ------------------------------------------------------------------
// Renders the HTML content for the Google Maps Advanced Marker.
// It displays the icon, price level ($), and color-codes based on 'vibe'.
const MarkerContent = ({ place }) => {
  // Generate price string (e.g., "$$") or default to "$"
  const price = "$".repeat(place.priceLevel || 1);
  
  // Use vibe colors passed from parent, or default to white/slate
  const bgClass = place.vibeBg || 'bg-white';
  const textClass = place.vibeColor || 'text-slate-700';
  const borderClass = place.vibeColor ? place.vibeColor.replace('text-', 'border-') : 'border-slate-200';

  return (
    <div className={`relative group transition-all duration-300 hover:scale-110 hover:z-50 cursor-pointer`}>
      {/* Marker Bubble */}
      <div className={`flex items-center gap-1.5 px-2 py-1.5 md:px-3 md:py-2 rounded-full shadow-lg border-2 ${bgClass} ${borderClass}`}>
        <span className={`${textClass}`}>{getPlaceIcon(place.type)}</span>
        <div className="w-px h-3 bg-slate-200/50" />
        <span className="text-[10px] md:text-xs font-black text-slate-700 tracking-tighter">{price}</span>
      </div>
      {/* Marker Arrow (Triangle at bottom) */}
      <div className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-b-2 border-r-2 bg-inherit ${bgClass} ${borderClass}`} />
    </div>
  );
};

// ------------------------------------------------------------------
// COMPONENT: MAP LEGEND
// ------------------------------------------------------------------
// Floating legend explaining the color codes (Vibe Intensity) and Price symbols.
const MapLegend = () => (
  <div className="absolute bottom-6 left-6 z-10 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-xl max-w-[200px] animate-in slide-in-from-bottom-4 duration-500">
    
    {/* Section 1: Vibe Intensity Colors */}
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
        <Info className="w-3 h-3" /> Vibe Intensity
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-purple-500 shadow-sm shadow-purple-200" />
          <span className="text-[10px] font-bold text-slate-600">Electric (1k+)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
          <span className="text-[10px] font-bold text-slate-600">Buzzing (500+)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm shadow-amber-200" />
          <span className="text-[10px] font-bold text-slate-600">Lively (100+)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
          <span className="text-[10px] font-bold text-slate-600">Chill (Quiet)</span>
        </div>
      </div>
    </div>

    {/* Section 2: Price Range Keys */}
    <div>
      <div className="flex items-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">
        <DollarSign className="w-3 h-3" /> Price Range
      </div>
      <div className="grid grid-cols-2 gap-y-2">
        <div className="text-[10px] font-bold text-slate-600">
          <span className="text-slate-900 font-black mr-1">$</span> Cheap
        </div>
        <div className="text-[10px] font-bold text-slate-600">
          <span className="text-slate-900 font-black mr-1">$$</span> Moderate
        </div>
        <div className="text-[10px] font-bold text-slate-600">
          <span className="text-slate-900 font-black mr-1">$$$</span> Upscale
        </div>
        <div className="text-[10px] font-bold text-slate-600">
          <span className="text-slate-900 font-black mr-1">$$$$</span> Luxury
        </div>
      </div>
    </div>

  </div>
);

// ------------------------------------------------------------------
// MAIN COMPONENT: MAP VISUALIZER
// ------------------------------------------------------------------
const MapVisualizer = ({ places, userLocation }) => {
  const mapRef = useRef(null);
  const rootRefs = useRef([]); // Store React roots for cleanup

  useEffect(() => {
    // Ensure API is loaded and location is available
    if (!userLocation || !window.google?.maps) return;

    const initMap = async () => {
      // Import necessary libraries
      const { Map } = await window.google.maps.importLibrary("maps");
      const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");

      // Initialize Map
      const map = new Map(mapRef.current, {
        center: userLocation,
        zoom: 14,
        mapId: "DEMO_MAP_ID", // Required for Advanced Markers
        disableDefaultUI: true,
        clickableIcons: false,
      });

      // Create Markers for each place
      places.forEach((place) => {
        if (!place.lat || !place.lng) return;

        // Create a DOM container for the React component
        const markerContainer = document.createElement('div');
        const root = createRoot(markerContainer);
        
        // Render custom marker into container
        root.render(<MarkerContent place={place} />);
        
        // Track root for cleanup
        rootRefs.current.push(root);

        // Add Advanced Marker to Map
        const marker = new AdvancedMarkerElement({
          map,
          position: { lat: place.lat, lng: place.lng },
          content: markerContainer,
          title: place.name,
        });

        // Add Click Listener (Zoom in on click)
        marker.addListener("click", () => {
          map.setZoom(16);
          map.setCenter(marker.position);
        });
      });
    };

    initMap();

    // Cleanup: Unmount all marker roots when component unmounts or updates
    return () => {
      rootRefs.current.forEach(root => root.unmount());
      rootRefs.current = [];
    };
  }, [places, userLocation]);

  return (
    <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-inner border border-slate-200 group">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Overlay Legend */}
      <MapLegend />
    </div>
  );
};

export default MapVisualizer;