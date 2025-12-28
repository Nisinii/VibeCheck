import React, { useState, useEffect } from 'react';
import { X, Star, ExternalLink, Activity, Sparkles, Loader2, Heart } from 'lucide-react';
import { generateVibeSummary } from '../utils/ai';

const PlaceModal = ({ place, onClose, onToggleFavorite, isFavorite }) => {
  const [aiSummary, setAiSummary] = useState(null);
  const [loadingAi, setLoadingAi] = useState(true);

  // --- AI LOGIC ---
  useEffect(() => {
    // If we already have a summary (e.g. from cache), don't re-fetch
    if (aiSummary) return;

    const fetchVibe = async () => {
      try {
        if (!window.google?.maps?.places) return;

        // 1. Create the Place instance using the specific ID
        const placeRef = new window.google.maps.places.Place({
          id: place.id, 
        });

        // 2. Fetch only the 'reviews' field to minimize data usage
        await placeRef.fetchFields({
          fields: ['reviews'],
        });

        // 3. Access the data directly from the instance (2025 SDK pattern)
        const reviews = placeRef.reviews;

        if (reviews && reviews.length > 0) {
          // 4. Send reviews to Gemini
          const summary = await generateVibeSummary(place.name, reviews);
          setAiSummary(summary);
        } else {
          setAiSummary("Not enough data points for a vibe check.");
        }
      } catch (error) {
        console.error("Failed to fetch reviews for AI:", error);
        setAiSummary("Vibe Engine unavailable.");
      } finally {
        setLoadingAi(false);
      }
    };

    fetchVibe();
  }, [place.id, place.name]); // Re-run only if the place changes

  // --- RENDER ---
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      
      {/* Backdrop with Blur */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row border border-slate-100 max-h-[90vh] md:max-h-[800px]">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 md:top-10 md:right-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl"
        >
          <X className="w-5 h-5 md:w-6 md:h-6" />
        </button>

        {/* Favorite/Save Button (Top Right) */}
        <button 
          onClick={() => onToggleFavorite(place)}
          className="absolute top-4 right-16 md:top-10 md:right-28 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl"
        >
           <Heart 
             className={`w-5 h-5 md:w-6 md:h-6 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-900'}`} 
           />
        </button>

        {/* LEFT SIDE: Image */}
        <div className="w-full md:w-1/2 h-56 md:h-auto flex-shrink-0 bg-slate-100 relative">
          <img 
            src={place.image} 
            className="w-full h-full object-cover" 
            alt={place.name} 
          />
          {/* Mobile Overlay Gradient for readability */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent md:hidden" />
        </div>

        {/* RIGHT SIDE: Content */}
        <div className="w-full md:w-1/2 p-6 md:p-12 xl:p-16 flex flex-col overflow-y-auto bg-white relative">
          
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
             <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
               {place.type}
             </span>
             {/* Dynamic Vibe Level Badge */}
             <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/50 flex items-center gap-1 ${place.vibeBg || 'bg-slate-100'} ${place.vibeColor || 'text-slate-600'}`}>
               <Activity className="w-3 h-3" /> {place.vibeLabel || 'Analyzing'}
             </span>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 leading-[0.95]">
            {place.name}
          </h2>
          
          {/* Rating */}
          <div className="flex items-center gap-4 md:gap-6 mb-8 text-amber-500 font-black">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-500" /> 
              <span className="text-lg md:text-xl">{place.rating}</span>
            </div>
            <span className="text-slate-200 h-6 w-px bg-slate-100" /> 
            <span className="text-slate-400 text-[10px] md:text-xs tracking-widest uppercase">{place.reviews} Reviews</span>
          </div>
          
          {/* AI Vibe Summary Box */}
          <div className="relative p-6 md:p-8 bg-indigo-50/30 border border-indigo-100/50 rounded-3xl mb-8 md:mb-10 overflow-hidden">
            {/* Label */}
            <div className="absolute top-4 left-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-400">
              <Sparkles className="w-3 h-3" /> Gemini Intelligence
            </div>

            {/* Content or Loader */}
            {loadingAi ? (
              <div className="flex items-center gap-3 text-slate-400 mt-6 min-h-[40px]">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                <span className="text-xs font-medium italic">Reading reviews...</span>
              </div>
            ) : (
              <p className="text-slate-600 text-sm md:text-base leading-relaxed italic font-medium mt-6">
                "{aiSummary}"
              </p>
            )}
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12 border-b border-slate-50 pb-8 md:pb-12">
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vibe Match</div>
              <div className="text-2xl md:text-4xl font-black text-indigo-600">{place.vibeScore}%</div>
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pricing</div>
              <div className="text-2xl md:text-4xl font-black text-slate-900">{"$".repeat(place.priceLevel)}</div>
            </div>
          </div>
          
          {/* Navigation Button */}
          <button 
            onClick={() => {
              const query = encodeURIComponent(place.name);
              // Use the universal Google Maps schema
              const url = `https://www.google.com/maps/search/?api=1&query=${query}&query_place_id=${place.id}`;
              window.open(url, '_blank');
            }}
            className="w-full py-4 md:py-5 bg-slate-900 text-white rounded-2xl md:rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-indigo-600 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 md:gap-4 mt-auto"
          >
            Launch Navigation <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default PlaceModal;