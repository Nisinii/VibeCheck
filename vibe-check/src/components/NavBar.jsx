import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Github, Home, Code2, Info } from 'lucide-react';

// IMPORT YOUR LOGO
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

  // Helper classes for consistent styling
  const linkClass = "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors";
  const hiddenLinkClass = "hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors";

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
          <img 
            src={logoImg} 
            alt="Vibe Check Logo" 
            className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" 
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tighter text-white leading-none">
              VIBE<span className="text-zinc-500">CHECK.</span>
            </span>
          </div>
        </div>
        
        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-6 md:gap-10">
          
          {/* SLOT 1: Shows 'Home' if not on homepage, otherwise shows 'About' */}
          {(location.pathname === '/developer' || location.pathname === '/about') ? (
            <Link to="/" className={hiddenLinkClass}>
              <Home className="w-4 h-4" />
              Home
            </Link>
          ) : (
            <Link to="/about" className={hiddenLinkClass}>
              <Info className="w-4 h-4" />
              About
            </Link>
          )}

          {/* SLOT 2: Logic depends on page to ensure correct order */}
          {location.pathname === '/developer' ? (
            // If on Developer page, Slot 2 is "About" (So order is Home -> About)
            <Link to="/about" className={linkClass}>
              <Info className="w-4 h-4" />
              About
            </Link>
          ) : location.pathname === '/about' ? (
            // If on About page, Slot 2 is "Developer" (So order is Home -> Developer)
            <Link to="/developer" className={linkClass}>
              <Code2 className="w-4 h-4" />
              Developer
            </Link>
          ) : (
            // If on Home page, Slot 2 is "Developer" (So order is About -> Developer)
            <Link to="/developer" className={linkClass}>
              <Code2 className="w-4 h-4" />
              Developer
            </Link>
          )}

          {/* GITHUB LINK (Always last) */}
          <a 
            href="https://github.com/Nisinii/VibeCheck" 
            target="_blank" 
            rel="noreferrer" 
            className={linkClass}
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