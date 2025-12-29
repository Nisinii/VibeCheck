import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Phone, Globe as GlobeIcon, Clock, 
  Share2, Bookmark, ArrowUpRight, 
  MessageSquare, Zap, ArrowLeft, Check
} from 'lucide-react';

// Hooks & Utils
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { useFavorites } from '../hooks/useFavorites';
import { generateVibeSummary } from '../utils/ai'; // <--- IMPORT YOUR FILE HERE
import { API_KEY } from '../utils/constants';

// Helper for static tags
const getVibeFromPlace = (place) => {
  if (!place || !place.types) return 'Classic';
  const types = place.types;
  if (types.includes('night_club') || types.includes('bar') || types.includes('casino')) return 'Electric';
  if (types.includes('spa') || types.includes('park') || types.includes('book_store')) return 'Relaxed';
  if (types.includes('cafe') || types.includes('bakery')) return 'Cozy';
  if (place.price_level >= 3) return 'Upscale';
  return 'Casual';
};

export default function PlaceDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // State
  const [place, setPlace] = useState(location.state?.place || null);
  const [loading, setLoading] = useState(!location.state?.place);
  const [error, setError] = useState(null);
  const [vibeTag, setVibeTag] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  
  // AI State
  const [geminiSummary, setGeminiSummary] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { apiReady } = useGoogleMapsScript(API_KEY);

  // 1. Fetch Google Maps Data
  useEffect(() => {
    if (!apiReady || !id) return;

    const fetchFullDetails = () => {
      try {
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

  // 2. USE YOUR AI UTILITY FUNCTION
  useEffect(() => {
    if (place?.reviews?.length > 0 && !geminiSummary && !isAnalyzing) {
      const runVibeCheck = async () => {
        setIsAnalyzing(true);
        // Call your function from ai.js
        const summary = await generateVibeSummary(place.name, place.reviews);
        setGeminiSummary(summary);
        setIsAnalyzing(false);
      };

      runVibeCheck();
    }
  }, [place]); 

  // --- HANDLERS ---

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleBookmark = () => {
    if (!place) return;
    
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
    return "/api/placeholder/800/600";
  };

  // --- RENDER ---
  
  if (loading && !place) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
        <div className="text-gray-400 font-medium">Checking the vibe...</div>
      </div>
    </div>
  );

  if (error || (!loading && !place)) return (
    <div className="min-h-screen flex items-center justify-center text-red-500">
      <div className="text-center">
        <p className="text-xl font-bold mb-4">{error || "Place not found"}</p>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-black text-white rounded-lg">
          Go Home
        </button>
      </div>
    </div>
  );

  const isFav = isFavorite(id);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-96 bg-gray-200 group">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-white transition-all duration-300 hover:scale-105 group-hover:opacity-100"
        >
          <ArrowLeft size={20} className="text-gray-800" />
        </button>

        {/* PHOTO GRID */}
        <div className="w-full h-full grid grid-cols-3 lg:grid-cols-4 grid-rows-2 gap-1 md:gap-2">
          <div className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden">
            <img src={getPhotoUrl(0)} alt="Main" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
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

      {/* 2. MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">{place.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400">
                    <span className="font-bold text-gray-900 mr-1 text-base">{place.rating || "N/A"}</span>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill={i < Math.round(place.rating || 0) ? "currentColor" : "none"} className={i < Math.round(place.rating || 0) ? "" : "text-gray-300"} />
                    ))}
                  </div>
                  <span className="text-gray-400">({place.user_ratings_total || 0} reviews)</span>
                </div>
                <span>•</span>
                <span>{place.price_level ? "$".repeat(place.price_level) : "$$"}</span>
                <span>•</span>
                {place.opening_hours && (
                   place.opening_hours.isOpen && place.opening_hours.isOpen() ? (
                    <span className="text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full text-xs">Open Now</span>
                  ) : (
                    <span className="text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-full text-xs">Closed</span>
                  )
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              {place.url ? (
                <a href={place.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-medium transition shadow-lg shadow-red-200">
                  <Star size={18} /> Review
                </a>
              ) : (
                 <button disabled className="flex items-center gap-2 bg-gray-300 text-white px-5 py-2.5 rounded-xl font-medium cursor-not-allowed">
                   <Star size={18} /> Review
                 </button>
              )}

              <button onClick={handleShare} className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl transition-all duration-300 ${isCopied ? 'bg-green-50 border-green-200 text-green-700 w-32 justify-center' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                {isCopied ? ( <><Check size={18} /> <span className="text-sm font-semibold">Copied</span></> ) : ( <Share2 size={20} /> )}
              </button>

              <button onClick={handleBookmark} className={`p-2.5 border rounded-xl transition-all duration-300 ${isFav ? 'bg-red-50 border-red-200 text-red-500 shadow-inner' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}>
                <Bookmark size={20} fill={isFav ? "currentColor" : "none"}/>
              </button>
            </div>
          </div>
        </div>

        {/* 3. CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN (Main Content) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* VIBE ANALYSIS CARD */}
            <div className="bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden shadow-sm min-h-[160px]">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                <Zap size={120} className="text-indigo-600" />
              </div>
              
              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  <Zap size={20} />
                </div>
                <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">Gemini Vibe Check</span>
                
                {vibeTag && (
                  <span className="ml-auto px-3 py-1 bg-indigo-600 text-white font-bold rounded-full text-xs uppercase tracking-wide shadow-md shadow-indigo-200">
                    {vibeTag} Energy
                  </span>
                )}
              </div>
              
              <p className="text-xl font-medium text-gray-800 italic relative z-10 leading-relaxed">
                {isAnalyzing ? (
                  <span className="animate-pulse text-gray-400">Reading recent reviews to analyze the vibe...</span>
                ) : geminiSummary ? (
                   `"${geminiSummary}"`
                ) : (
                   <span className="text-gray-400 text-base not-italic">No reviews available to analyze.</span>
                )}
              </p>
            </div>

            {/* REVIEWS LIST */}
            <div>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MessageSquare size={20} /> 
                Recent Reviews <span className="text-gray-400 font-normal text-lg">({place.reviews?.length || 0})</span>
              </h3>
              
              <div className="space-y-6">
                {place.reviews && place.reviews.length > 0 ? (
                  place.reviews.map((review, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={review.profile_photo_url} 
                            alt={review.author_name} 
                            className="w-10 h-10 rounded-full border border-gray-200" 
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{review.author_name}</p>
                            <p className="text-xs text-gray-500">{review.relative_time_description}</p>
                          </div>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "text-gray-300"} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed text-sm">{review.text}</p>
                    </div>
                  ))
                ) : (
                   <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                     <p className="text-gray-500">No detailed reviews available via API yet.</p>
                   </div>
                )}
              </div>

              {place.url && (
                <a 
                  href={place.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 group flex items-center justify-center gap-2 w-full py-4 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-xl font-medium text-gray-600 transition shadow-sm"
                >
                  Read all reviews on Google Maps <ArrowUpRight size={18} className="group-hover:translate-x-1 transition-transform"/>
                </a>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (Sticky Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              
              {/* CONTACT INFO CARD */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="p-6 space-y-5">
                  {place.website && (
                    <a href={place.website} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition cursor-pointer group">
                      <GlobeIcon className="text-gray-400 shrink-0 mt-1 group-hover:text-blue-600 transition-colors" size={20} />
                      <div className="overflow-hidden">
                        <p className="font-medium text-blue-600 truncate group-hover:underline">Website</p>
                        <p className="text-xs text-gray-400">Visit official site</p>
                      </div>
                    </a>
                  )}
                  {place.formatted_phone_number && (
                    <div className="flex items-start gap-4 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition cursor-pointer group">
                      <Phone className="text-gray-400 shrink-0 mt-1 group-hover:text-green-600 transition-colors" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">{place.formatted_phone_number}</p>
                        <p className="text-xs text-gray-400">Call business</p>
                      </div>
                    </div>
                  )}
                  <a href={place.url} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:bg-gray-50 p-2 -mx-2 rounded-lg transition cursor-pointer group">
                    <MapPin className="text-gray-400 shrink-0 mt-1 group-hover:text-red-500 transition-colors" size={20} />
                    <div>
                      <p className="font-medium text-gray-900">Get Directions</p>
                      <p className="text-sm text-gray-500 mt-0.5">{place.formatted_address}</p>
                    </div>
                  </a>
                </div>

                <a href={place.url} target="_blank" rel="noreferrer" className="block h-48 w-full bg-gray-100 relative group overflow-hidden border-t border-gray-100">
                   <img src={getPhotoUrl(4) || getPhotoUrl(0)} alt="Location" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition duration-500" />
                   <div className="absolute inset-0 flex items-center justify-center">
                     <span className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-sm font-semibold text-sm flex items-center gap-2 group-hover:scale-105 transition-transform">
                       <MapPin size={16} className="text-red-500"/> View on Map
                     </span>
                   </div>
                </a>
              </div>
              
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold flex items-center gap-2 mb-4 text-gray-900">
                  <Clock size={18} /> Opening Hours
                </h3>
                <div className="space-y-3 text-sm">
                  {place.opening_hours?.weekday_text?.map((day, i) => (
                    <div key={i} className="flex justify-between py-1 border-b border-gray-50 last:border-0 last:pb-0">
                      <span className="text-gray-600 font-medium">{day.split(': ')[0]}</span>
                      <span className="text-gray-900">{day.split(': ')[1]}</span>
                    </div>
                  )) || <p className="text-gray-500 italic">Hours not available</p>}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}