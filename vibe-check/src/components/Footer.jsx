import React from 'react';
import { Github, Linkedin, ArrowUpRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// IMPORT YOUR LOGO
import logoImg from '../assets/logo.png'; 

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper to handle scrolling if on home page, or navigating if not
  const handleScrollLink = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } }); 
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <footer id="footer" className="bg-black border-t border-white/10 pt-20 pb-10 w-full relative z-10">
      
      <div className="w-full max-w-[2000px] mx-auto px-4 md:px-8">
        
        {/* TOP SECTION: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Column 1: Brand & Vibe - Takes up left half */}
          <div className="md:col-span-6 lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <img 
                src={logoImg} 
                alt="Vibe Check Logo" 
                className="w-10 h-10 object-contain brightness-200 grayscale contrast-125" 
              />
              <span className="font-black text-xl tracking-tighter text-white leading-none">
                VIBE<span className="text-zinc-500">CHECK.</span>
              </span>
            </div>
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm">
              Decoding the atmosphere of cities using AI and real-time social frequency data. 
              Find the pulse of your next destination.
            </p>
            <div className="flex gap-4 pt-2">
              <SocialLink icon={Linkedin} href="https://www.linkedin.com/in/nisini-niketha/" />
              <SocialLink icon={Github} href="https://github.com/Nisinii" />
            </div>
          </div>

          {/* SPACER: Columns 7 & 8 are skipped automatically by specifying col-start-9 below 
             This pushes the following columns to the right side.
          */}

          {/* Column 2: Navigation - Starts at column 9 on Large screens */}
          <div className="md:col-span-3 lg:col-span-2 lg:col-start-9">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500">
              <li>
                <button onClick={(e) => handleScrollLink(e, 'hero-search')} className="flex items-center gap-1 hover:text-white transition-colors group">
                  Search Places
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-1 text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </button>
              </li>
              <li>
                <button onClick={(e) => handleScrollLink(e, 'collection-section')} className="flex items-center gap-1 hover:text-white transition-colors group">
                  Saved Collection
                  <ArrowUpRight size={12} className="opacity-0 -translate-y-1 text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Company - Placed at the end */}
          <div className="md:col-span-3 lg:col-span-2">
            <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs">Company</h4>
            <ul className="space-y-4 text-sm font-medium text-zinc-500">
              <li><Link to="/developer" className="hover:text-white transition-colors">About the Dev</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Vibe Check</Link></li>
              <li>
                <FooterLink href="https://developers.google.com/maps/documentation/places/web-service/overview">
                    API Access
                </FooterLink>
              </li>
            </ul>
          </div>
          
        </div>

        {/* BOTTOM SECTION: Copyright & Links */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-sm font-medium">
            © {new Date().getFullYear()} Vibe Check Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

// Helper Components

const SocialLink = ({ icon: Icon, href }) => (
  <a 
    href={href} 
    target="_blank"
    rel="noreferrer"
    className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 border border-white/5 hover:bg-white hover:text-black hover:border-white transition-all duration-300"
  >
    <Icon size={18} />
  </a>
);

const FooterLink = ({ children, href = "#" }) => (
  <a href={href} target={href.startsWith('http') ? "_blank" : "_self"} rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors group">
    {children}
    <ArrowUpRight size={12} className="opacity-0 -translate-y-1 text-white group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
  </a>
);

export default Footer;