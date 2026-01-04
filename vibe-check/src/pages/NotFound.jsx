import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MapPinOff, ArrowLeft } from 'lucide-react';

// ------------------------------------------------------------------
// PAGE: 404 NOT FOUND
// ------------------------------------------------------------------
// Displayed when a user navigates to a non-existent route.
// Features:
// - Atmospheric "Glitch" aesthetic matching the app theme
// - Navigation controls to return to safety
// - Consistent background grid animations

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-hidden relative flex flex-col items-center justify-center">
        
        {/* ------------------------------------------------------------------
            1. GLOBAL BACKGROUND & ATMOSPHERE
        ------------------------------------------------------------------ */}
        {/* Grid Pattern */}
        <div className="fixed inset-0 h-full w-full bg-[#050505] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>
        
        {/* Ambient Glow (Center) */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/10 rounded-full blur-[128px] pointer-events-none"></div>

        {/* ------------------------------------------------------------------
            2. MAIN CONTENT AREA
        ------------------------------------------------------------------ */}
        <div className="relative z-10 text-center space-y-8 p-6 max-w-2xl w-full">
            
            {/* Error Message & Icon */}
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
                
                {/* Glitchy 404 Text */}
                <h1 className="text-9xl md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/5 leading-none select-none">
                    404
                </h1>
                
                {/* Subtitle Badge */}
                <div className="flex items-center justify-center gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                        <MapPinOff className="text-white" size={24} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-white">
                        Vibe Not Found
                    </h2>
                </div>
                
                {/* Description */}
                <p className="text-zinc-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
                    We've scanned the sector, but this location is off the grid. It might have been deleted, moved, or never existed in this timeline.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center items-center animate-in slide-in-from-bottom-8 duration-700 delay-150">
                <button 
                    onClick={() => navigate(-1)}
                    className="group px-8 py-3 bg-zinc-900 text-zinc-400 border border-white/10 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-zinc-800 hover:text-white transition-all flex items-center gap-2"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    <span>Go Back</span>
                </button>

                <button 
                    onClick={() => navigate('/')}
                    className="group px-10 py-4 bg-white text-black rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] flex items-center gap-2"
                >
                    <Home size={16} />
                    <span>Return to Base</span>
                </button>
            </div>
        </div>
        
        {/* ------------------------------------------------------------------
            3. FOOTER DECORATION
        ------------------------------------------------------------------ */}
        <div className="absolute bottom-8 text-zinc-800 text-[10px] font-mono uppercase tracking-[0.2em]">
            System Status: Signal Lost // Sector 404
        </div>
    </div>
  );
};

export default NotFound;