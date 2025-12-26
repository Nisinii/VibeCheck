import React from 'react';
import { Search, Zap } from 'lucide-react';
import { MOODS } from '../utils/constants';

const Hero = ({ searchQuery, setSearchQuery, activeMood, setActiveMood }) => (
  <header className="relative z-10 pt-28 md:pt-40 pb-12 md:pb-20 px-4 md:px-12 2xl:px-24 w-full mx-auto">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-center">
      
      {/* Text Section */}
      <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6 md:mb-8 shadow-sm">
          <Zap className="w-3 h-3 text-indigo-500" /> Infrastructure v6.0
        </div>
        
        <h1 className="text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl font-black tracking-tight text-slate-900 leading-[1.05] mb-6 md:mb-8 italic">
          DECODING <br />
          <span className="text-indigo-600 non-italic">ATMOSPHERE.</span>
        </h1>
        
        <p className="text-slate-500 text-base md:text-xl xl:text-2xl max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
          Synchronizing with the Google Places API (New) to curate destinations based on social frequency.
        </p>
      </div>
      
      {/* Control Panel Section */}
      <div className="lg:col-span-5 xl:col-span-6 w-full">
        <div className="bg-white border border-slate-200 p-6 md:p-8 xl:p-12 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
          <div className="space-y-6 xl:space-y-8">
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Search Perimeter</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Keyword filter..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 md:py-4 pl-12 pr-4 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all text-slate-900 font-medium text-sm md:text-base xl:text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Mood Selector */}
            <div className="space-y-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 ml-1">Current Mood</label>
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                {MOODS.map((mood) => {
                  const Icon = mood.icon;
                  const isActive = activeMood === mood.id;
                  return (
                    <button
                      key={mood.id}
                      onClick={() => setActiveMood(mood.id)}
                      className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 xl:py-4 xl:px-6 rounded-xl transition-all border text-[10px] md:text-xs xl:text-sm font-bold ${
                        isActive 
                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200' 
                          : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${isActive ? 'text-white' : mood.color}`} />
                      {mood.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Hero;