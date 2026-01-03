import React, { useState } from 'react';
import { Zap, Github, Twitter, Instagram, ArrowUpRight, Check, Loader2 } from 'lucide-react';

const Footer = () => {
  // State for the newsletter interaction
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;

    // Simulate an API call
    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <footer id="footer" className="bg-black border-t border-white/10 pt-20 pb-10 w-full relative z-10">
      
      {/* 1. MATCHING MARGINS: Standardized max-w and px to match Home.jsx */}
      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand & Vibe */}
          <div className="md:col-span-4 lg:col-span-5 space-y-6">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                <Zap className="w-5 h-5 text-black fill-black" />
              </div>
              <span className="font-black text-xl tracking-tight text-white">VIBE CHECK.</span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm">
              Decoding the atmosphere of cities using AI and real-time social frequency data. 
              Find the pulse of your next destination.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink icon={Twitter} href="#" />
              <SocialLink icon={Instagram} href="#" />
              <SocialLink icon={Github} href="#" />
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500">
              <li><FooterLink>Search Places</FooterLink></li>
              <li><FooterLink>Saved Collection</FooterLink></li>
              <li><FooterLink>Trending Now</FooterLink></li>
              <li><FooterLink>Cities</FooterLink></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500">
              <li><a href="/developer" className="hover:text-white transition-colors">About the Dev</a></li>
              <li><FooterLink>API Access</FooterLink></li>
              <li><FooterLink>Careers</FooterLink></li>
              <li><FooterLink>Contact</FooterLink></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Interaction */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="font-bold text-white mb-4 uppercase tracking-widest text-xs">Stay in the loop</h4>
            <p className="text-zinc-400 text-sm mb-4">Get the latest vibe reports sent to your inbox.</p>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative w-full">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'success'}
                  className="bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm w-full text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 focus:bg-zinc-800 transition-colors disabled:opacity-50"
                />
                {status === 'success' && (
                  <Check className="absolute right-3 top-3 text-emerald-400 w-5 h-5 animate-in zoom-in" />
                )}
              </div>
              
              <button 
                type="submit"
                disabled={status === 'loading' || status === 'success'}
                className={`px-4 py-3 rounded-xl text-sm font-bold transition-all min-w-[80px] flex justify-center items-center ${
                  status === 'success' 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-white text-black hover:bg-zinc-200 hover:scale-105'
                }`}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === 'success' ? (
                  "Joined"
                ) : (
                  "Join"
                )}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-xs text-emerald-400 mt-2 font-bold animate-in slide-in-from-top-1">
                Welcome to the frequency! ⚡
              </p>
            )}
          </div>

        </div>

        {/* BOTTOM SECTION: Copyright & Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm font-medium">
            © {new Date().getFullYear()} Vibe Check Inc. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold text-zinc-600">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Helper Components
const SocialLink = ({ icon: Icon, href }) => (
  <a 
    href={href} 
    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 border border-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

const FooterLink = ({ children }) => (
  <a href="#" className="flex items-center gap-1 hover:text-white transition-colors group">
    {children}
    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
  </a>
);

export default Footer;