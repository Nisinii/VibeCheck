import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Loader2, AlertCircle, Bookmark, Zap } from 'lucide-react';

// HOOKS
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { usePlacesFetcher } from '../hooks/usePlacesFetcher';
import { useFavorites } from '../hooks/useFavorites';

// COMPONENTS
import NavBar from '../components/NavBar';
import Hero from '../components/Hero'; 
import ControlBar from '../components/ControlBar';
import PlaceCard from '../components/PlaceCard';
import MapVisualizer from '../components/MapVisualizer';
import Footer from '../components/Footer';
import { API_KEY } from '../utils/constants';

// ------------------------------------------------------------------
// PAGE: HOME
// ------------------------------------------------------------------
// The central hub of the application.
// Responsibilities:
// 1. Manages Search State (Query, Radius, Budget, Mood)
// 2. Orchestrates Data Fetching via Custom Hooks
// 3. Toggles between "Live API View" and "Saved Collection"
// 4. Handles Deep Linking/Scrolling from Footer

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Used to detect navigation state from Footer

  // ------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ------------------------------------------------------------------
  
  // Filter State
  const [activeMood, setActiveMood] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [budget, setBudget] = useState([]); 
  const [radius, setRadius] = useState(5); 

  // UI State
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'map'
  const [isScrolled, setIsScrolled] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false); // Toggle: API vs Local Storage

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // ------------------------------------------------------------------
  // 2. CUSTOM HOOKS
  // ------------------------------------------------------------------
  
  // Load Google Maps API (Global)
  const { apiReady, error: scriptError } = useGoogleMapsScript(API_KEY);
  
  // Fetch Places from API
  const { places, isLoading, error: fetchError, fetchPlaces, userLocation } = usePlacesFetcher(
    apiReady, activeMood, searchQuery, radius, budget 
  );

  // Manage Local Storage Favorites
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // ------------------------------------------------------------------
  // 3. LOGIC & EFFECTS
  // ------------------------------------------------------------------

  // Determine which dataset to show
  const allPlaces = showFavorites ? favorites : places;

  // Effect: Reset pagination when filters change
  useEffect(() => { 
    setCurrentPage(1); 
  }, [places, showFavorites, activeMood, searchQuery, budget]);

  // Effect: Navbar Transparency on Scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Effect: Debounced Data Fetching
  // We wait 600ms after user input stops before hitting the API to save quota
  useEffect(() => {
    if (!apiReady || showFavorites) return; 
    const timer = setTimeout(() => { fetchPlaces(); }, 600);
    return () => clearTimeout(timer);
  }, [apiReady, activeMood, searchQuery, radius, budget, fetchPlaces, showFavorites]); 

  // Effect: Handle Deep Linking / Scrolling from Footer
  // If we arrived here via navigate('/', { state: { scrollTo: 'id' } })
  useEffect(() => {
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      
      if (element) {
        // Small delay ensures the DOM is fully painted before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
        
        // Auto-switch tabs if the user clicked "Saved Collection" footer link
        if (location.state.scrollTo === 'collection-section') {
            setShowFavorites(true);
        }
      }
    }
  }, [location]);

  // Pagination Logic
  const totalPages = Math.ceil(allPlaces.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedPlaces = allPlaces.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const handlePlaceClick = (place) => {
    navigate(`/place/${place.id}`, { state: { place } });
  };

  // ------------------------------------------------------------------
  // 4. RENDER
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <img 
           src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop" 
           alt="Background" 
           className="w-full h-full object-cover opacity-60" 
         />
         <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black"></div>
      </div>

      <NavBar apiReady={apiReady} isScrolled={isScrolled} />

      {/* --- HERO SECTION --- */}
      {/* ID 'hero-search' allows footer to scroll here */}
      <div id="hero-search">
        <Hero 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
          activeMood={activeMood} setActiveMood={(mood) => { setActiveMood(mood); setShowFavorites(false); }}
          radius={radius} setRadius={setRadius}
          budget={budget} setBudget={setBudget}    
        />
      </div>

      {/* --- TOGGLE BUTTONS (Live vs Saved) --- */}
      {/* ID 'collection-section' allows footer to scroll here */}
      <div id="collection-section" className="relative z-10 w-full max-w-[2000px] mx-auto px-4 md:px-8 mb-10">
        <div className="flex gap-4">
          
          {/* Live Feed Toggle */}
          <button 
            onClick={() => setShowFavorites(false)}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 backdrop-blur-md ${
              !showFavorites 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                : 'bg-black/40 text-zinc-500 border-white/10 hover:border-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap size={14} className={!showFavorites ? 'fill-black' : ''} />
            Live Feed
          </button>
          
          {/* Favorites Toggle */}
          <button 
            onClick={() => setShowFavorites(true)}
            className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-2 backdrop-blur-md ${
              showFavorites 
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-105' 
                : 'bg-black/40 text-zinc-500 border-white/10 hover:border-white/50 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bookmark size={14} className={showFavorites ? 'fill-black' : ''} /> 
            Collection <span className="opacity-50 ml-1">({favorites.length})</span>
          </button>
        </div>
      </div>

      <ControlBar 
        isLoading={isLoading && !showFavorites} 
        resultCount={allPlaces.length} 
        viewMode={viewMode} 
        setViewMode={setViewMode}
      />

      {/* --- MAIN CONTENT AREA --- */}
      <main className="relative z-10 w-full max-w-[2000px] mx-auto px-4 md:px-8 pb-20 md:pb-32 min-h-[500px]">
        
        {/* State 1: Loading */}
        {isLoading && !showFavorites ? (
          <div className="py-40 flex flex-col items-center justify-center text-zinc-500">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-white" />
            <p className="font-bold uppercase tracking-[0.2em] text-[10px]">Syncing Satellites...</p>
          </div>
        
        // State 2: Error
        ) : (scriptError || fetchError) && !showFavorites ? (
           <div className="py-20 text-center text-rose-400 max-w-md mx-auto">
             <div className="bg-rose-950/30 p-8 rounded-[2.5rem] border border-rose-900/50 backdrop-blur-sm">
               <AlertCircle className="w-12 h-12 mx-auto mb-4" />
               <p className="font-black text-sm uppercase tracking-widest mb-3">Signal Lost</p>
               <button onClick={() => window.location.reload()} className="px-8 py-3 bg-rose-600 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-rose-500 transition-colors">Re-establish Link</button>
             </div>
           </div>
        
        // State 3: Map View
        ) : viewMode === 'map' ? (
          <div className="h-[600px] w-full rounded-[2.5rem] overflow-hidden border border-zinc-800 shadow-2xl">
            <MapVisualizer places={allPlaces} userLocation={userLocation} />
          </div>
        
        // State 4: Grid View (Success)
        ) : displayedPlaces.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {displayedPlaces.map((place) => (
                <PlaceCard 
                  key={place.id || place.place_id} 
                  place={place} 
                  onClick={handlePlaceClick} 
                  onToggleFavorite={toggleFavorite} 
                  isFavorite={isFavorite(place.id || place.place_id)} 
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-4 mt-12">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2 rounded-full border border-zinc-800 text-zinc-400 text-xs font-bold uppercase hover:bg-white hover:text-black disabled:opacity-30 transition-all"
                >
                  Previous
                </button>
                <span className="flex items-center text-xs font-bold text-zinc-500">
                  Page {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-6 py-2 rounded-full border border-zinc-800 text-zinc-400 text-xs font-bold uppercase hover:bg-white hover:text-black disabled:opacity-30 transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        
        // State 5: Empty State
        ) : (
          <div className="py-40 text-center">
            <p className="text-zinc-600 italic font-light text-lg">
              {showFavorites ? "Your collection is empty." : "No signals found in this sector."}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;