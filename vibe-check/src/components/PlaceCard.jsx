import React from 'react';
import { Star, MapPin, Clock, Activity, Heart } from 'lucide-react';

const PlaceCard = ({ place, onClick, onToggleFavorite, isFavorite }) => {
  
  // 1. SMART IMAGE LOGIC
  // Checks for: Saved URL (Bookmark) -> OR Live API Function -> OR Fallback
  const imageSrc = place.storedPhotoUrl 
    || (place.photos?.[0]?.getUrl ? place.photos[0].getUrl({ maxWidth: 600 }) : place.image) 
    || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600";

  // Helper to handle heart click
  const handleHeartClick = (e) => {
    e.stopPropagation(); 
    onToggleFavorite(place);
  };

  // Safe Fallbacks for Vibe Data (in case it's a bookmark without calculated vibes)
  const vibeLabel = place.vibeLabel || "Classic";
  const vibeBg = place.vibeBg || "bg-indigo-100";
  const vibeColor = place.vibeColor || "text-indigo-600";
  const vibeScore = place.vibeScore || 85;

  return (
    <div 
      onClick={() => onClick(place)}
      className="group cursor-pointer bg-white border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative"
    >
      <div className="relative h-72 overflow-hidden bg-slate-100">
        <img 
          src={imageSrc} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
          alt={place.name} 
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"; }} 
        />
        
        {/* Rating Badge */}
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1.5 z-10">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          {place.rating || 'N/A'}
        </div>

        {/* Vibe Badge */}
        <div className="absolute top-6 left-6 z-10">
           <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-1.5 ${vibeBg} ${vibeColor} border border-white/50`}>
             <Activity className="w-3 h-3" />
             {vibeLabel}
           </div>
        </div>

        {/* HEART BUTTON (Added this!) */}
        <button 
          onClick={handleHeartClick}
          className="absolute bottom-6 right-6 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-lg hover:scale-110 transition-transform z-20 group/heart"
        >
          <Heart 
            className={`w-5 h-5 transition-colors duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover/heart:text-red-400'}`} 
          />
        </button>

        <div className="absolute bottom-6 left-6 inline-block z-10">
          <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg inline-block">
            {vibeScore}% Fidelity
          </div>
        </div>
      </div>

      <div className="p-8">
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 block truncate">
            {place.types ? place.types[0].replace('_', ' ') : 'Restaurant'}
        </span>
        <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-4">{place.name}</h3>
        <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
          <span className="flex items-center gap-1.5 truncate">
             <MapPin className="w-4 h-4 text-indigo-400 shrink-0" /> 
             <span className="truncate max-w-[100px]">{place.vicinity || place.formatted_address || 'Nearby'}</span>
          </span>
          <span className="flex items-center gap-1.5">
             <Clock className="w-4 h-4 text-indigo-400" /> 
             {place.opening_hours?.isOpen && place.opening_hours.isOpen() ? "Open" : "Closed"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;