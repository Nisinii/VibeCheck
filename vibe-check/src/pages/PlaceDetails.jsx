import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Phone, Globe as GlobeIcon, Clock, 
  Share2, Bookmark, ArrowUpRight, 
  MessageSquare, Zap, ArrowLeft, Check, Loader2
} from 'lucide-react';

// HOOKS & UTILS
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { useFavorites } from '../hooks/useFavorites';
import { generateVibeSummary } from '../utils/ai'; 
import { API_KEY } from '../utils/constants';

// ------------------------------------------------------------------
// HELPER: STATIC VIBE TAGGING
// ------------------------------------------------------------------
// Provides an immediate visual tag based on place types before AI loads.
const getVibeFromPlace = (place) => {
  if (!place || !place.types) return 'Classic';
  const types = place.types;
  if (types.includes('night_club') || types.includes('bar') || types.includes('casino')) return 'Electric';
  if (types.includes('spa') || types.includes('park') || types.includes('book_store')) return 'Relaxed';
  if (types.includes('cafe') || types.includes('bakery')) return 'Cozy';
  if (place.price_level >= 3) return 'Upscale';
  return 'Casual';
};

// ------------------------------------------------------------------
// PAGE: PLACE DETAILS
// ------------------------------------------------------------------
// Displays full information for a specific location.
// Features:
// 1. Fetches deep details via Google PlacesService (Photos, Reviews, Hours)
// 2. Triggers Gemini AI to analyze the reviews for a Vibe Summary
// 3. Handles Sharing and Bookmarking

export default function PlaceDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // ------------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // ------------------------------------------------------------------
  
  // Place Data (Initialize with navigation state if available to prevent flash)
  const [place, setPlace] = useState(location.state?.place || null);
  const [loading, setLoading] = useState(!location.state?.place);
  const [error, setError] = useState(null);
  
  // UI State
  const [vibeTag, setVibeTag] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // AI Analysis State
  const [geminiSummary, setGeminiSummary] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Hooks
  const { isFavorite, toggleFavorite } = useFavorites();
  const { apiReady } = useGoogleMapsScript(API_KEY);

  // ------------------------------------------------------------------
  // 2. DATA FETCHING (Google Maps)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!apiReady || !id) return;

    const fetchFullDetails = () => {
      try {
        // Use an invisible div to initialize the service (Standard JS API pattern)
        const dummyDiv = document.createElement('div');
        const service = new window.google.maps.places.PlacesService(dummyDiv);

        const request = {
          placeId: id,
          fields: [
            'name', 'rating', 'user_ratings_total', 'formatted_address', 
            'photos', 'reviews', 'opening_hours', 'website', 
            'formatted_phone_number', 'url', 'price_level', 'types', 'geometry'
          ]
        };

        service.getDetails(request, (placeData, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && placeData) {
            const fullPlace = { ...placeData, place_id: id, id: id };
            setPlace(fullPlace);
            setVibeTag(getVibeFromPlace(fullPlace));
          } else {
            if (!place) setError("Could not fetch place details");
          }
          setLoading(false);
        });

      } catch (err) {
        console.error("Service Error:", err);
        setError("Failed to initialize map service");
        setLoading(false);
      }
    };

    fetchFullDetails();
  }, [apiReady, id]);

  // ------------------------------------------------------------------
  // 3. AI VIBE CHECK
  // ------------------------------------------------------------------
  // Triggers once we have the reviews from the Google API
  useEffect(() => {
    if (place?.reviews?.length > 0 && !geminiSummary && !isAnalyzing) {
      const runVibeCheck = async () => {
        setIsAnalyzing(true);
        // Send data to utility function (Gemini API)
        const summary = await generateVibeSummary(place.name, place.reviews);
        setGeminiSummary(summary);
        setIsAnalyzing(false);
      };

      runVibeCheck();
    }
  }, [place]); 

  // ------------------------------------------------------------------
  // 4. HANDLERS & HELPERS
  // ------------------------------------------------------------------

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBookmark = () => {
    if (!place) return;
    
    // Convert Google Photo Object to URL string for storage
    const photoString = place.photos?.[0]?.getUrl 
      ? place.photos[0].getUrl({ maxWidth: 500, maxHeight: 400 }) 
      : null;

    const placeToSave = {
      id: id,
      place_id: id,
      name: place.name,
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      vicinity: place.formatted_address,
      types: place.types,
      price_level: place.price_level,
      storedPhotoUrl: photoString
    };
    toggleFavorite(placeToSave);
  };

  const getPhotoUrl = (index) => {
    if (place?.photos?.[index]?.getUrl) {
      return place.photos[index].getUrl({ maxWidth: 1200, maxHeight: 800 });
    }
    return "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1200"; // Dark fallback
  };

  // ------------------------------------------------------------------
  // 5. RENDER STATES (Loading / Error)
  // ------------------------------------------------------------------
  
  if (loading && !place) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="animate-pulse flex flex-col items-center">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <div className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Syncing Satellites...</div>
      </div>
    </div>
  );

  if (error || (!loading && !place)) return (
    <div className="min-h-screen flex items-center justify-center bg-black text-rose-500">
      <div className="text-center">
        <p className="text-xl font-bold mb-4">{error || "Signal Lost"}</p>
        <button onClick={() => navigate('/')} className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-zinc-200">
          Return to Base
        </button>
      </div>
    </div>
  );

  const isFav = isFavorite(id);

  // ------------------------------------------------------------------
  // 6. MAIN RENDER
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black pb-20 font-sans text-zinc-100 selection:bg-indigo-500 selection:text-white">
      
      {/* --- HERO IMAGE GRID --- */}
      <div className="relative w-full h-96 bg-zinc-900 group">
        
        {/* Navigation Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 bg-black/40 backdrop-blur-md border border-white/10 p-3 rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105 group-hover:opacity-100"
        >
          <ArrowLeft size={20} className="text-white hover:text-black transition-colors" />
        </button>

        {/* Dynamic Photo Mosaic */}
        <div className="w-full h-full grid grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-1 md:gap-2 opacity-90">
          <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden">
            <img src={getPhotoUrl(0)} alt="Main" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden">
            <img src={getPhotoUrl(1)} alt="Detail 1" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden">
            <img src={getPhotoUrl(2)} alt="Detail 2" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="hidden lg:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden lg:col-start-4 lg:row-start-1">
              <img src={getPhotoUrl(3)} alt="Detail 3" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
          <div className="hidden lg:block col-span-1 row-span-1 relative cursor-pointer overflow-hidden lg:col-start-4 lg:row-start-2">
            <img src={getPhotoUrl(4) || getPhotoUrl(1)} alt="Detail 4" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
          </div>
        </div>
      </div>

      {/* --- CONTENT CONTAINER --- */}
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        
        {/* TITLE CARD (Glassmorphism) */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white mb-3 drop-shadow-lg">{place.name}</h1>
              
              {/* Metadata Badges */}
              <div className="flex items-center gap-4 text-sm text-zinc-400 flex-wrap">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <div className="flex text-yellow-400">
                    <span className="font-bold text-white mr-2 text-base">{place.rating || "N/A"}</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < Math.round(place.rating || 0) ? "currentColor" : "none"} className={i < Math.round(place.rating || 0) ? "" : "text-zinc-600"} />
                    ))}
                  </div>
                  <span className="text-zinc-500">({place.user_ratings_total || 0})</span>
                </div>
                
                <span className="text-zinc-600">•</span>
                <span className="font-medium text-white">{place.price_level ? "$".repeat(place.price_level) : "$$"}</span>
                <span className="text-zinc-600">•</span>
                
                {place.opening_hours && (
                   place.opening_hours.isOpen && place.opening_hours.isOpen() ? (
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs uppercase tracking-wide">Open Now</span>
                  ) : (
                    <span className="text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full text-xs uppercase tracking-wide">Closed</span>
                  )
                )}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              {place.url ? (
                <a href={place.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-xl font-bold transition shadow-lg shadow-white/5 hover:scale-105">
                  <ArrowUpRight size={18} /> Directions
                </a>
              ) : (
                 <button disabled className="flex items-center gap-2 bg-zinc-800 text-zinc-500 px-6 py-3 rounded-xl font-bold cursor-not-allowed border border-white/5">
                   <ArrowUpRight size={18} /> Directions
                 </button>
              )}

              <button onClick={handleShare} className={`flex items-center gap-2 px-4 py-3 border rounded-xl transition-all duration-300 ${isCopied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 w-32 justify-center' : 'bg-black/40 border-white/10 hover:bg-white/10 text-white'}`}>
                {isCopied ? ( <><Check size={18} /> <span className="text-sm font-bold">Copied</span></> ) : ( <Share2 size={20} /> )}
              </button>

              <button onClick={handleBookmark} className={`p-3 border rounded-xl transition-all duration-300 ${isFav ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-black/40 border-white/10 hover:bg-white/10 text-white'}`}>
                <Bookmark size={20} fill={isFav ? "currentColor" : "none"}/>
              </button>
            </div>
          </div>
        </div>

        {/* --- GRID LAYOUT (Main Content + Sidebar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Vibe & Reviews */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI VIBE ANALYSIS CARD */}
            <div className="relative overflow-hidden rounded-[2rem] p-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 shadow-lg shadow-indigo-500/20">
              <div className="relative bg-zinc-950 rounded-[1.8rem] p-8 h-full">
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                  <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 border border-indigo-500/30">
                    <Zap size={20} />
                  </div>
                  <span className="text-xs font-black tracking-widest text-white uppercase">AI Vibe Analysis</span>
                  
                  {vibeTag && (
                    <span className="ml-auto px-3 py-1 bg-indigo-600 text-white font-bold rounded-full text-[10px] uppercase tracking-wide shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                      {vibeTag} Energy
                    </span>
                  )}
                </div>
                
                <p className="text-lg md:text-xl font-medium text-zinc-200 leading-relaxed">
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2 text-zinc-500 animate-pulse">
                        <Loader2 className="animate-spin" size={18}/> analyzing signals...
                    </span>
                  ) : geminiSummary ? (
                    `"${geminiSummary}"`
                  ) : (
                    <span className="text-zinc-500 text-base not-italic">No signals available to analyze.</span>
                  )}
                </p>
              </div>
            </div>

            {/* REVIEWS LIST */}
            <div>
              <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <MessageSquare size={16} /> Recent Reviews <span className="text-zinc-600">({place.reviews?.length || 0})</span>
              </h3>
              
              <div className="space-y-4">
                {place.reviews && place.reviews.length > 0 ? (
                  place.reviews.map((review, index) => (
                    <div key={index} className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-zinc-900 transition duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.profile_photo_url || "https://ui-avatars.com/api/?name=User&background=random&color=fff&background=3f3f46"} 
                            alt={review.author_name} 
                            className="w-10 h-10 rounded-full border border-zinc-700" 
                          />
                          <div>
                            <p className="font-bold text-white text-sm">{review.author_name}</p>
                            <p className="text-xs text-zinc-500">{review.relative_time_description}</p>
                          </div>
                        </div>
                        <div className="flex text-indigo-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-zinc-700"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-zinc-300 leading-relaxed text-sm">{review.text}</p>
                    </div>
                  ))
                ) : (
                   <div className="p-12 text-center border border-dashed border-zinc-800 rounded-2xl">
                     <p className="text-zinc-500 text-sm">No transmissions found.</p>
                   </div>
                )}
              </div>

              {place.url && (
                <a 
                  href={place.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 group flex items-center justify-center gap-2 w-full py-4 bg-zinc-900 border border-white/10 hover:bg-zinc-800 hover:border-white/20 rounded-xl font-bold text-zinc-400 hover:text-white transition shadow-sm"
                >
                  Read all reviews on Google Maps <ArrowUpRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Contact & Hours) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              
              {/* CONTACT INFO CARD */}
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden p-6">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-6">Data Points</h3>

                <div className="space-y-5">
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors border border-white/5">
                        <GlobeIcon size={18} className="text-zinc-400 group-hover:text-white" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-bold text-white truncate group-hover:text-indigo-400 transition-colors">Website</p>
                        <p className="text-xs text-zinc-500">Official Link</p>
                      </div>
                    </a>
                  )}
                  {place.formatted_phone_number && (
                    <div className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors border border-white/5">
                        <Phone size={18} className="text-zinc-400 group-hover:text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-white group-hover:text-emerald-400 transition-colors">{place.formatted_phone_number}</p>
                        <p className="text-xs text-zinc-500">Voice Line</p>
                      </div>
                    </div>
                  )}
                  <a href={place.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors border border-white/5">
                      <MapPin size={18} className="text-zinc-400 group-hover:text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white group-hover:text-rose-400 transition-colors">Get Directions</p>
                      <p className="text-xs text-zinc-500 truncate max-w-[200px]">{place.formatted_address}</p>
                    </div>
                  </a>
                </div>

                {/* Minimap Preview */}
                <a href={place.url} target="_blank" rel="noreferrer" className="mt-8 block h-40 w-full rounded-2xl relative group overflow-hidden border border-white/10">
                    <img src={getPhotoUrl(4) || getPhotoUrl(0)} alt="Location" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 group-hover:scale-105 transition-transform">
                        <MapPin size={14} className="text-rose-500"/> View Map
                      </span>
                    </div>
                </a>
              </div>
              
              {/* HOURS CARD */}
              <div className="bg-zinc-900/50 backdrop-blur-md rounded-[2rem] border border-white/5 p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-white text-xs uppercase tracking-widest">
                  <Clock size={16} className="text-zinc-500" /> Temporal Data
                </h3>
                <div className="space-y-3 text-sm">
                  {place.opening_hours?.weekday_text?.map((day, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-white/5 last:border-0 last:pb-0">
                      <span className="text-zinc-500 font-medium">{day.split(': ')[0]}</span>
                      <span className="text-zinc-200 font-bold">{day.split(': ')[1]}</span>
                    </div>
                  )) || <p className="text-zinc-500 italic">Hours not available</p>}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}