import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Github } from 'lucide-react';

// 1. IMPORT YOUR LOGO
import logoImg from '../assets/logo.png'; 

const NavBar = ({ isScrolled }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-black/50 backdrop-blur-xl border-b border-white/10 py-4' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8 flex items-center justify-between">
        
        {/* LOGO AREA */}
        <div 
          className="flex items-center gap-3 group cursor-pointer" 
          onClick={handleLogoClick}
        >
          {/* YOUR LOGO IMAGE (Standalone) */}
          <img 
            src={logoImg} 
            alt="Vibe Check Logo" 
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" 
          />
          
          {/* Brand Text */}
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              VIBE<span className="text-zinc-500">CHECK.</span>
            </span>
          </div>
        </div>
        
        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6 md:gap-10">
          
          <button 
             onClick={() => document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' })}
             className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            About
          </button>

          <Link 
            to="/developer" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            Developer
          </Link>

          <a 
            href="https://github.com/your-username" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden md:inline">GitHub</span>
          </a>

        </div>

      </div>
    </nav>
  );
};

export default NavBar;