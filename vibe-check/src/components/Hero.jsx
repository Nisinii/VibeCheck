import React from 'react';
import { Search } from 'lucide-react';
import { MOODS } from '../utils/constants';

// ------------------------------------------------------------------
// COMPONENT: HERO SECTION
// ------------------------------------------------------------------
// Displays the main title and the search/filter controls card.
// Props:
// - searchQuery, setSearchQuery: Controls the text input
// - activeMood, setActiveMood: Controls the selected vibe category
// - radius, setRadius: Controls the distance slider
// - budget, setBudget: Controls the cost range ($ to $$$$)

const Hero = ({ 
  searchQuery, setSearchQuery, activeMood, setActiveMood, 
  radius, setRadius, budget, setBudget 
}) => {

  // Toggle specific budget levels in/out of the array
  const toggleBudget = (level) => {
    setBudget(prev => prev.includes(level) ? prev.filter(b => b !== level) : [...prev, level]);
  };

  return (
    <header className="relative z-10 pt-32 md:pt-48 pb-12 px-4 md:px-8 w-full max-w-[2000px] mx-auto">
      
      {/* MAIN GRID: Split into Text (Left) and Controls (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-end">
        
        {/* --- LEFT COLUMN: HEADLINE & SUBTEXT --- */}
        <div className="lg:col-span-7 xl:col-span-6 text-center lg:text-left">
          <h1 className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter text-white leading-[0.9] mb-8 drop-shadow-2xl">
            ATMOSPHERE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 animate-gradient-x">
              DECODED.
            </span>
          </h1>
          <p className="text-zinc-300 text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed font-light drop-shadow-md">
            Forget generic 5-star ratings. Discover your next destination based on how it actually feels right now.
          </p>
        </div>
        
        {/* --- RIGHT COLUMN: GLASS CONTROL CARD --- */}
        <div className="lg:col-span-5 xl:col-span-6 w-full">
          
          <div className="relative bg-black/40 backdrop-blur-2xl border border-white/10 p-6 md:p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* Top Shine Effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div className="space-y-8 relative z-10">
              
              {/* 1. SEARCH INPUT */}
              <div className="space-y-3">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Comfy cafe to have evening coffee"
                    className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-indigo-500/50 focus:bg-black/80 focus:outline-none transition-all text-white placeholder:text-zinc-600 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* 2. FILTERS ROW (Radius & Budget) */}
              <div className="grid grid-cols-2 gap-6">
                
                {/* Radius Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Range</label>
                    <span className="text-xs font-bold text-white bg-white/10 px-2 py-0.5 rounded border border-white/5">{radius} KM</span>
                  </div>
                  <input 
                    type="range" min="1" max="20" step="1"
                    value={radius}
                    onChange={(e) => setRadius(parseInt(e.target.value))}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Budget Toggles */}
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 block">Cost</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <button
                        key={level}
                        onClick={() => toggleBudget(level)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                          budget.includes(level) 
                            ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-transparent border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 hover:bg-white/5'
                        }`}
                      >
                        {Array(level).fill('$').join('')}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* 3. VIBE SELECTOR (Previously Moods) */}
              <div className="space-y-3">
                <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 ml-1">Vibe</label>
                
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((mood) => {
                    const Icon = mood.icon;
                    const isActive = activeMood === mood.id;
                    return (
                      <button
                        key={mood.id}
                        onClick={() => setActiveMood(mood.id)}
                        className={`group flex items-center gap-2 px-4 py-3 rounded-xl transition-all border text-xs font-bold ${
                          isActive 
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]' 
                            : 'bg-black/40 border-white/5 text-zinc-500 hover:bg-white/10 hover:text-white hover:border-white/20'
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 transition-colors ${isActive ? 'text-white' : 'text-zinc-600 group-hover:text-white'}`} />
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
};

export default Hero;