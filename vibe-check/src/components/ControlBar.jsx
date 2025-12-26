import React from 'react';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';

const ControlBar = ({ isLoading, resultCount, viewMode, setViewMode }) => (
  <section className="sticky top-16 md:top-20 z-40 px-4 md:px-12 2xl:px-24 w-full mx-auto py-3 bg-slate-50/80 backdrop-blur-md mb-8 md:mb-12 flex flex-row items-center justify-between border-b border-slate-200">
    <div className="flex items-center gap-3">
      <h2 className="hidden md:block text-sm font-bold text-slate-400 uppercase tracking-widest">Real-time Nodes</h2>
      <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 rounded text-indigo-600 uppercase">
        {isLoading ? 'Scanning...' : `${resultCount} Found`}
      </span>
    </div>
    
    <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
      <button 
        onClick={() => setViewMode('grid')} 
        className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button 
        onClick={() => setViewMode('map')} 
        className={`p-1.5 md:p-2 rounded-md transition-all ${viewMode === 'map' ? 'bg-slate-100 text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
      >
        <MapIcon className="w-4 h-4" />
      </button>
    </div>
  </section>
);

export default ControlBar;