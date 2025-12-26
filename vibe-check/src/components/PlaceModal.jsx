import React from 'react';
import { X, Star, ExternalLink } from 'lucide-react';

const PlaceModal = ({ place, onClose }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
    <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl transition-opacity" onClick={onClose} />
    
    <div className="relative w-full max-w-5xl bg-white rounded-[2rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 flex flex-col md:flex-row border border-slate-100 max-h-[90vh] md:max-h-[800px]">
      
      {/* Close Button */}
      <button 
        onClick={onClose} 
        className="absolute top-4 right-4 md:top-10 md:right-10 z-30 w-10 h-10 md:w-12 md:h-12 bg-white/80 backdrop-blur border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-xl"
      >
        <X className="w-5 h-5 md:w-6 md:h-6" />
      </button>

      {/* Image Section */}
      <div className="w-full md:w-1/2 h-48 md:h-auto flex-shrink-0 bg-slate-100">
        <img src={place.image} className="w-full h-full object-cover" alt={place.name} />
      </div>

      {/* Content Section */}
      <div className="w-full md:w-1/2 p-6 md:p-20 flex flex-col overflow-y-auto">
        
        {/* Type Badge */}
        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 inline-block border border-indigo-100 self-start">
          {place.type}
        </span>
        
        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 text-slate-900 leading-tight">
          {place.name}
        </h2>
        
        {/* Rating */}
        <div className="flex items-center gap-4 md:gap-6 mb-8 text-amber-500 font-black">
          <Star className="w-5 h-5 md:w-6 md:h-6 fill-amber-500" /> 
          {place.rating} 
          <span className="text-slate-200 h-6 w-px bg-slate-100 mx-2" /> 
          <span className="text-slate-400 text-[10px] md:text-xs tracking-widest uppercase">{place.reviews} Reviews</span>
        </div>
        
        {/* AI Summary */}
        <div className="p-6 md:p-10 bg-indigo-50/30 border border-indigo-100/50 rounded-3xl mb-8 md:mb-12">
          <p className="text-slate-600 text-sm md:text-lg leading-relaxed italic font-medium">
            "{place.aiSummary}"
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-6 md:gap-10 mb-8 md:mb-12 border-b border-slate-50 pb-8 md:pb-12">
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vibe Match</div>
            <div className="text-2xl md:text-4xl font-black text-indigo-600">{place.vibeScore}%</div>
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Pricing</div>
            <div className="text-2xl md:text-4xl font-black text-slate-900">{"$".repeat(place.priceLevel)}</div>
          </div>
        </div>
        
        {/* Action Button */}
        <button 
          onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.id}`, '_blank')} 
          className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] md:text-xs hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 md:gap-4 mt-auto"
        >
          Launch Maps <ExternalLink className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default PlaceModal;