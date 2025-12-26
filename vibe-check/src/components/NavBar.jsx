import React from 'react';

const NavBar = ({ apiReady, isScrolled }) => (
  <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'py-6'}`}>
    <div className="w-full px-4 md:px-12 2xl:px-24 mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-md transition-transform group-hover:scale-105">V</div>
        <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">vibecheck</span>
      </div>
      
      <div className="flex items-center gap-6">
         <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-full text-indigo-600">
           <span className={`w-1.5 h-1.5 rounded-full ${apiReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
           {apiReady ? 'Engine Online' : 'Syncing'}
         </div>
      </div>
    </div>
  </nav>
);

export default NavBar;