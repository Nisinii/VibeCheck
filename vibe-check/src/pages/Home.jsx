import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, Bookmark } from 'lucide-react';

// Hooks
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { usePlacesFetcher } from '../hooks/usePlacesFetcher';
import { useFavorites } from '../hooks/useFavorites';

// Components
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import ControlBar from '../components/ControlBar';
import PlaceCard from '../components/PlaceCard';
import MapVisualizer from '../components/MapVisualizer';
import Footer from '../components/Footer';
import { API_KEY } from '../utils/constants';

const Home = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [activeMood, setActiveMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isScrolled, setIsScrolled] = useState(false);
  const [radius, setRadius] = useState(5);
  
  // Pagination State (Shows 8 cards per page)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // --- HOOKS ---
  const { apiReady, error: scriptError } = useGoogleMapsScript(API_KEY);
  
  const { places, isLoading, error: fetchError, fetchPlaces, userLocation } = usePlacesFetcher(
    apiReady, 
    activeMood, 
    searchQuery, 
    radius
  );

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [showFavorites, setShowFavorites] = useState(false);

  // --- LOGIC ---

  // 1. Determine which list to use (Live API or Local Favorites)
  const allPlaces = showFavorites ? favorites : places;

  // 2. Reset to Page 1 if the list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [places, showFavorites, activeMood, searchQuery]);

  // 3. Scroll Listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 4. API Fetcher
  useEffect(() => {
    if (!apiReady || showFavorites) return; 
    const timer = setTimeout(() => {
      fetchPlaces();
    }, 600);
    return () => clearTimeout(timer);
  }, [apiReady, activeMood, searchQuery, radius, fetchPlaces, showFavorites]);

  // 5. Calculate Pagination Slices
  const totalPages = Math.ceil(allPlaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPlaces = allPlaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // 6. Navigation Handler (Replaces Modal)
  const handlePlaceClick = (place) => {
    // Navigate to the details page and pass the place data
    navigate(`/place/${place.id}`, { state: { place } });
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      <div className="fixed top-0 inset-x-0 h-[50vh] bg-gradient-to-b from-indigo-50/50 to-transparent pointer-events-none" />

      <NavBar apiReady={apiReady} isScrolled={isScrolled} />

      <Hero 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        activeMood={activeMood} 
        setActiveMood={(mood) => {
          setActiveMood(mood);
          setShowFavorites(false); // Switch back to API mode
        }}
        radius={radius}
        setRadius={setRadius}
      />

      {/* Toggle Buttons: Live vs Saved */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 2xl:px-24 mb-8 flex gap-4">
        <button 
          onClick={() => setShowFavorites(false)}
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all ${!showFavorites ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-400 border-slate-200 hover:border-slate-900'}`}
        >
          Live Feed
        </button>
        <button 
          onClick={() => setShowFavorites(true)}
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${showFavorites ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-slate-400 border-slate-200 hover:border-rose-500 hover:text-rose-500'}`}
        >
          <Bookmark className="w-3 h-3" /> Saved Collection ({favorites.length})
        </button>
      </div>

      <ControlBar 
        isLoading={isLoading && !showFavorites} 
        resultCount={allPlaces.length} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
        // Pagination Props
        page={currentPage}
        totalPages={totalPages}
        onNextPage={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        onPrevPage={() => setCurrentPage(p => Math.max(1, p - 1))}
      />

      <main className="relative z-10 px-4 md:px-12 2xl:px-24 w-full mx-auto pb-20 md:pb-32 min-h-[500px]">
        
        {/* LOADING STATE */}
        {isLoading && !showFavorites ? (
          <div className="py-40 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-600" />
            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Processing Telemetry...</p>
          </div>
        
        /* ERROR STATE */
        ) : (scriptError || fetchError) && !showFavorites ? (
           <div className="py-20 text-center text-rose-500 max-w-md mx-auto">
             <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 shadow-xl">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" />
               <p className="font-black text-sm uppercase tracking-widest mb-3 text-rose-700">Protocol Disruption</p>
               <p className="text-xs opacity-80 mb-6 leading-relaxed italic">"{scriptError || fetchError}"</p>
               <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-600 transition-colors">Reconnect Engine</button>
             </div>
           </div>
        
        /* MAP VIEW */
        ) : viewMode === 'map' ? (
          <div className="h-[600px] w-full">
            <MapVisualizer places={allPlaces} userLocation={userLocation} />
          </div>
        
        /* GRID VIEW (With Pagination) */
        ) : displayedPlaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {displayedPlaces.map((place) => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                onClick={handlePlaceClick} 
                onToggleFavorite={toggleFavorite} 
                isFavorite={isFavorite(place.id)} 
              />
            ))}
          </div>
        
        /* EMPTY STATE */
        ) : (
          <div className="py-40 text-center italic text-slate-400">
            {showFavorites ? "No saved places yet." : "Zero frequencies detected in search radius."}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;