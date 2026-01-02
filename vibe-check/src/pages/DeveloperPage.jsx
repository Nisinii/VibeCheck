import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Github, Linkedin, Globe, 
  Code2, Database, Map, Sparkles 
} from 'lucide-react';
import Footer from '../components/Footer';

// PLACEHOLDER IMAGE: Replace this with a path to your actual photo in /public or src/assets
// e.g., import profileImg from '../assets/my-profile-pic.jpg';
const profileImg = "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=800&h=800";

const DeveloperPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-indigo-100">
      
      {/* Floating Back Button */}
      <button 
        onClick={() => navigate('/')} 
        className="fixed top-6 left-6 z-30 bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg border border-slate-100 hover:bg-white hover:scale-105 transition-all group"
        aria-label="Back to App"
      >
        <ArrowLeft size={20} className="text-slate-700 group-hover:-translate-x-1 transition-transform" />
      </button>

      <main className="max-w-5xl mx-auto px-6 md:px-12 py-24 md:py-32 relative">
        
        {/* SECTION 1: THE DEVELOPER (Split Layout) */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center mb-32">
          
          {/* Text Content */}
          <div className="md:col-span-7 space-y-8 order-2 md:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-widest">
              <Code2 size={16} /> The Creator
            </div>
            
            <div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
                Hi, I'm <span className="text-indigo-600">[Your Name]</span>.
              </h1>
              <h2 className="text-2xl md:text-3xl text-slate-500 font-medium">
                Frontend Engineer & UI Designer.
              </h2>
            </div>

            <p className="text-slate-600 leading-relaxed text-lg max-w-2xl">
              I build pixel-perfect, user-centric digital experiences. I'm obsessed with clean code, modern aesthetics, and finding the intersection between complex data and intuitive design.
              <br /><br />
              Based in [Your Location]. Always building.
            </p>

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 pt-2">
              <SocialButton icon={Github} link="https://github.com/[yourusername]" label="GitHub" />
              <SocialButton icon={Linkedin} link="https://linkedin.com/in/[yourusername]" label="LinkedIn" />
              <SocialButton icon={Globe} link="https://[yourportfolio].com" label="Portfolio" />
            </div>
          </div>

          {/* Image */}
          <div className="md:col-span-5 order-1 md:order-2 relative group">
            {/* Decorative blob background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-400 rounded-[3rem] rotate-6 scale-105 opacity-20 blur-2xl group-hover:rotate-12 group-hover:scale-110 transition-transform duration-700"></div>
            <img 
              src={profileImg} 
              alt="Developer" 
              className="rounded-[3rem] shadow-2xl border-4 border-white relative z-10 object-cover aspect-square w-full grayscale group-hover:grayscale-0 transition-all duration-700" 
            />
          </div>
        </section>


        {/* SECTION 2: THE PROJECT (Card Layout) */}
        <section>
           <div className="text-center mb-16">
             <h3 className="text-3xl font-black mb-4">About The Project.</h3>
             <p className="text-slate-500 text-lg max-w-2xl mx-auto">
               "Vibe Check" was created to solve the problem of generic 5-star ratings. It uses modern tech to decode the atmosphere of a place before you arrive.
             </p>
           </div>

           <div className="bg-white border border-slate-200 rounded-[3rem] p-8 md:p-16 shadow-xl shadow-slate-200/50 relative overflow-hidden">
             {/* Decorative background element */}
             <Sparkles className="absolute -right-12 -top-12 text-indigo-50 w-80 h-80 -rotate-12 pointer-events-none" />
             
             <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                 <TechCard 
                   icon={Zap} 
                   title="Modern Stack" 
                   desc="Built for speed with React, Vite, and Tailwind CSS. State management via React Hooks." 
                 />
                 <TechCard 
                   icon={Map} 
                   title="Google Maps (New)" 
                   desc="Leveraging the latest Places Library (v3) for semantic search and rich location data." 
                 />
                 <TechCard 
                   icon={Database} 
                   title="AI Powered" 
                   desc="Integrated Gemini AI to synthesize hundreds of reviews into concise 'vibe summaries'." 
                 />
             </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

// --- Helper Components for this page ---

const SocialButton = ({ icon: Icon, link, label }) => (
  <a 
    href={link} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center gap-3 pl-4 pr-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-md transition-all group"
  >
    <Icon size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
    {label}
  </a>
);

const TechCard = ({ icon: Icon, title, desc }) => (
  <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-3xl hover:bg-indigo-50/50 hover:border-indigo-100 transition-colors group">
    <div className="bg-white p-3 rounded-2xl inline-block shadow-sm mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-indigo-600" />
    </div>
    <h4 className="text-xl font-black text-slate-900 mb-3">{title}</h4>
    <p className="text-slate-500 font-medium leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default DeveloperPage;