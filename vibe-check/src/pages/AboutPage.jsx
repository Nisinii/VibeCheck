import React, { useState, useEffect } from 'react';
import { 
  Sliders, Radio, Shield, ArrowRight, 
  Cpu, Map, Code, Layers, 
  Search, Bookmark, MessageSquareText 
} from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

// COMPONENTS
import NavBar from '../components/NavBar'; 
import Footer from '../components/Footer';
import BobaBotComponent from '../components/BobaBotComponent';

// HOOKS & UTILS
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { API_KEY } from '../utils/constants';

// ------------------------------------------------------------------
// PAGE: ABOUT / LANDING
// ------------------------------------------------------------------
// The main marketing page explaining the "Vibe Check" concept.
// Features:
// - Hero Manifesto
// - 3D Boba Bot Interactive Element
// - 6-Grid Feature Breakdown
// - Tech Stack Showcase
// - Final Call to Action (CTA)

const AboutPage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Load Google Maps Script for global availability (used in features descriptions)
  const { apiReady } = useGoogleMapsScript(API_KEY);

  // Handle Navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ------------------------------------------------------------------
          GLOBAL BACKGROUND (Grid Pattern)
      ------------------------------------------------------------------ */}
      <div className="fixed inset-0 h-full w-full bg-[#050505] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <NavBar apiReady={apiReady} isScrolled={isScrolled} />

      {/* ------------------------------------------------------------------
          SECTION 1: HERO MANIFESTO
      ------------------------------------------------------------------ */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden z-10">
          
          {/* Background Image - Full Bleed */}
          <div className="absolute inset-0 z-0">
              <img 
                  src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2670&auto=format&fit=crop" 
                  alt="Atmospheric Vibe" 
                  className="w-full h-full object-cover opacity-50" 
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-black/30"></div>
          </div>

          {/* Text Content */}
          <div className="relative z-10 text-center px-4 max-w-7xl mx-auto space-y-8 pt-20">
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase drop-shadow-2xl">
                The Cure for <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">
                  Decision Fatigue.
                </span>
              </h1>
              
              <div className="max-w-2xl mx-auto text-xl md:text-2xl leading-relaxed font-light text-zinc-300 drop-shadow-lg">
                  <p className="mb-6">
                    You know the feeling. You open Maps. You see 4.5 stars. You see "Good for groups." 
                  </p>
                  <p>
                    You go there, and it's <span className="text-white font-medium italic">dead silent</span>, the lighting is harsh, and the vibe is... off.
                  </p>
              </div>
          </div>
      </section>

      {/* ------------------------------------------------------------------
          MAIN CONTENT CONTAINER
      ------------------------------------------------------------------ */}
      <div className="relative z-10 w-full max-w-[2000px] mx-auto pb-20 px-6 md:px-12 lg:px-24">
        
        {/* --- SECTION 2: INTRO & 3D BOT --- */}
        <section className="max-w-[1800px] mx-auto pt-20">
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-32">
                
                {/* Text Side (7 Columns) */}
                <div className="md:col-span-7 space-y-10 w-full">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-[0.9]">
                        Sentiment, <br/> Not Stars.
                    </h2>
                    <div className="space-y-8 text-zinc-400 text-xl md:text-2xl leading-relaxed w-full">
                        <p>
                            A raw 5-star rating is a flat metric in a multi-dimensional world. It doesn't tell you if the music is too loud for conversation, if the lighting is intimate enough for a date, or if the WiFi is stable enough for deep work.
                        </p>
                        <p>
                            Our AI goes deeper—reading between the lines of thousands of reviews to extract the <span className="text-white font-semibold">emotional texture</span> of a place. We don't just aggregate numbers; we quantify the atmosphere.
                        </p>
                    </div>
                </div>

                {/* 3D Model Side (5 Columns) */}
                <div className="md:col-span-5 flex justify-center md:justify-end w-full">
                  <BobaBotComponent />
                </div>
            </div>

            {/* --- SECTION 3: FEATURE GRID (6 ITEMS) --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
                
                {/* Feature 1: Real-Time Pulse */}
                <FeatureCard 
                  icon={Radio} 
                  number="01" 
                  title="Real-Time Pulse" 
                  desc="We pull live data via Google APIs so you never walk into a 'Closed' sign or a dead venue again." 
                />

                {/* Feature 2: Vibe Analysis */}
                <FeatureCard 
                  icon={MessageSquareText} 
                  number="02" 
                  title="Vibe Analysis" 
                  desc="Our LLM reads thousands of reviews instantly to summarize the crowd, noise level, and lighting." 
                />

                {/* Feature 3: Precision Controls */}
                <FeatureCard 
                  icon={Sliders} 
                  number="03" 
                  title="Precision Controls" 
                  desc="Filter by exact radius, budget, and specific moods like 'Intimacy' or 'Deep Work'." 
                />

                {/* Feature 4: Smart Search */}
                <FeatureCard 
                  icon={Search} 
                  number="04" 
                  title="Smart Search" 
                  desc="Search for vibes, not just names. Type 'cozy rainy day cafe' and let us find the perfect match." 
                />

                {/* Feature 5: Collections */}
                <FeatureCard 
                  icon={Bookmark} 
                  number="05" 
                  title="Collections" 
                  desc="Curate your own map. Save your favorite spots to build a personal 'Vibe Collection' for any city." 
                />

                {/* Feature 6: Zero Tracking */}
                <FeatureCard 
                  icon={Shield} 
                  number="06" 
                  title="Zero Tracking" 
                  desc="We use your location once to find places. We don't save it, sell it, or build a profile." 
                />

            </div>

            {/* --- SECTION 4: TECH STACK --- */}
            <div className="border-t border-white/10 pt-16">
                <h4 className="text-center text-sm font-mono uppercase tracking-widest text-zinc-500 mb-12">
                    Powered by Modern Infrastructure
                </h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <TechItem icon={Code} title="React + Vite" desc="Blazing fast frontend performance." />
                    <TechItem icon={Layers} title="Three.js / R3F" desc="Immersive 3D web experiences." />
                    <TechItem icon={Map} title="Google Places API" desc="Real-time global location data." />
                    <TechItem icon={Cpu} title="Gemini AI Model" desc="Advanced sentiment & vibe analysis." />
                </div>
            </div>

        </section>

        {/* --- SECTION 5: BIG CTA --- */}
        <section className="mt-32">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 group">
                {/* Background Textures */}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-black transition-colors duration-700 group-hover:from-indigo-950/30 group-hover:to-black"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-12 md:p-24 gap-10">
                    <div className="max-w-xl space-y-6 text-center md:text-left">
                        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-white">
                            Stop Guessing. <br/>
                            <span className="text-indigo-500">Start Living.</span>
                        </h2>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/')}
                        className="group relative px-12 py-6 bg-white text-black rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Launch App <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </span>
                    </button>
                </div>
            </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

// ------------------------------------------------------------------
// HELPER COMPONENTS
// ------------------------------------------------------------------

const FeatureCard = ({ icon: Icon, number, title, desc }) => (
  <div className="p-8 rounded-3xl border border-white/10 bg-zinc-900/20 backdrop-blur-sm flex flex-col justify-between min-h-[280px] group hover:border-white/20 transition-all hover:bg-white/5">
      <div className="flex justify-between items-start">
          <div className="p-3 bg-white/5 rounded-xl text-white group-hover:scale-110 transition-transform">
              <Icon size={32} />
          </div>
          <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">{number}</span>
      </div>
      <div className="mt-6">
          <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
          <p className="text-zinc-400">{desc}</p>
      </div>
  </div>
);

const TechItem = ({ icon: Icon, title, desc }) => (
  <div className="flex flex-col items-center text-center space-y-4 p-6 rounded-2xl hover:bg-white/5 transition-colors">
      <Icon size={32} className="text-zinc-400" />
      <div>
          <h5 className="font-bold text-white">{title}</h5>
          <p className="text-sm text-zinc-500 mt-1">{desc}</p>
      </div>
  </div>
);

export default AboutPage;