import React from 'react';
import { Star, MapPin, Clock } from 'lucide-react';

const PlaceCard = ({ place, onClick }) => (
  <div 
    onClick={() => onClick(place)}
    className="group cursor-pointer bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
  >
    <div className="relative h-72 overflow-hidden bg-slate-100">
      <img 
        src={place.image} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
        alt={place.name} 
        onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"; }} 
      />
      <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black shadow-xl flex items-center gap-1.5">
        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
        {place.rating || 'N/A'}
      </div>
      <div className="absolute bottom-6 left-6 right-6 inline-block">
        <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-lg inline-block">
          {place.vibeScore}% Fidelity
        </div>
      </div>
    </div>
    <div className="p-8">
      <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mb-1 block truncate">{place.type}</span>
      <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors truncate mb-4">{place.name}</h3>
      <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
        <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-indigo-400" /> {place.distance}</span>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-indigo-400" /> {place.hours}</span>
      </div>
    </div>
  </div>
);

export default PlaceCard;