import React from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';

const ControlBar = ({ viewMode, setViewMode }) => (
  // CHANGED: 'justify-between' -> 'justify-end' to push the buttons to the right
  <div className="relative z-10 w-full max-w-[2000px] mx-auto px-4 md:px-8 mb-8 flex flex-row items-end justify-end">
    
    {/* Removed the Text/Count Section entirely */}
    
    {/* Right: View Toggles (High Contrast) */}
    <div className="flex items-center gap-1 bg-zinc-900/80 border border-white/10 p-1.5 rounded-xl backdrop-blur-md shadow-xl">
      <button 
        onClick={() => setViewMode('grid')} 
        className={`p-3 rounded-lg transition-all duration-300 ${
          viewMode === 'grid' 
            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
            : 'text-zinc-500 hover:text-white hover:bg-white/10'
        }`}
        aria-label="Grid View"
      >
        <LayoutGrid className="w-5 h-5" />
      </button>
      <button 
        onClick={() => setViewMode('map')} 
        className={`p-3 rounded-lg transition-all duration-300 ${
          viewMode === 'map' 
            ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-105' 
            : 'text-zinc-500 hover:text-white hover:bg-white/10'
        }`}
        aria-label="Map View"
      >
        <MapIcon className="w-5 h-5" />
      </button>
    </div>

  </div>
);

export default ControlBar;