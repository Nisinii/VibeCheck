import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

// Hooks
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { usePlacesFetcher } from '../hooks/usePlacesFetcher';

// Components
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ControlBar from '../components/ControlBar';
import PlaceCard from '../components/PlaceCard';
import PlaceModal from '../components/PlaceModal';
import MapVisualizer from '../components/MapVisualizer';
import Footer from '../components/Footer';
import { API_KEY } from '../utils/constants';

const Home = () => {
  const [activeMood, setActiveMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [radius, setRadius] = useState(5);

  const { apiReady, error: scriptError } = useGoogleMapsScript(API_KEY);
  const { places, isLoading, error: fetchError, fetchPlaces, userLocation } = usePlacesFetcher(apiReady, activeMood, searchQuery, radius);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!apiReady) return;
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 600);
    return () => clearTimeout(timer);
  }, [apiReady, activeMood, searchQuery, radius, fetchPlaces]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="fixed top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

      <NavBar apiReady={apiReady} isScrolled={isScrolled} />
      
      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeMood={activeMood} 
        setActiveMood={setActiveMood}
        radius={radius}        
        setRadius={setRadius}  
      />

      <ControlBar 
        isLoading={isLoading} 
        resultCount={places.length} 
        viewMode={viewMode} 
        setViewMode={setViewMode} 
      />

      <main className="relative z-10 px-4 md:px-12 2xl:px-24 w-full mx-auto pb-20 md:pb-32 min-h-[500px]">
        {isLoading ? (
          <div className="py-40 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Processing Telemetry...</p>
          </div>
        ) : (scriptError || fetchError) ? (
           <div className="py-20 text-center text-rose-500 max-w-md mx-auto">
             {/* Error UI ... */}
             <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" />
               <p className="font-black text-sm uppercase tracking-widest mb-3 text-rose-700">Protocol Disruption</p>
               <p className="text-xs opacity-80 mb-6 leading-relaxed italic">"{scriptError || fetchError}"</p>
               <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-600 transition-colors">Reconnect Engine</button>
             </div>
           </div>
        ) : viewMode === 'map' ? (
          // MAP VIEW
          <div className="h-[600px] w-full">
            <MapVisualizer places={places} userLocation={userLocation} />
          </div>
        ) : places.length > 0 ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6 gap-6 md:gap-10">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} onClick={setSelectedPlace} />
            ))}
          </div>
        ) : (
          <div className="py-40 text-center italic text-slate-400">Zero frequencies detected in search radius.</div>
        )}
      </main>

      {selectedPlace && (
        <PlaceModal place={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}

      <Footer />
    </div>
  );
};

export default Home;