import React, { useState, useEffect } from 'react';
import { 
  Github, Linkedin, Mail, Check, MapPin, 
  Cpu, Code2, Terminal, Globe, Palette, 
  Layout, FileText, ArrowUpRight, Database, 
  Cloud, Server, GraduationCap 
} from 'lucide-react';

// COMPONENTS & HOOKS
import Footer from '../components/Footer';
import NavBar from '../components/NavBar';
import { useGoogleMapsScript } from '../hooks/useGoogleMaps';
import { API_KEY } from '../utils/constants';

// ASSETS
import profileImg from '../assets/developer.jpeg';
import resumePdf from '../assets/resume.pdf'; 

// ------------------------------------------------------------------
// PAGE: DEVELOPER PROFILE
// ------------------------------------------------------------------
// Displays information about the creator (You).
// Features:
// - Hero Bio Section
// - Tech Stack Grid
// - Contact/Email Copy Interaction
// - Resume Download
// - Core Expertise Tags

const DeveloperPage = () => {
  const [copied, setCopied] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 1. Initialize Google Maps Script (Ensures NavBar API check passes)
  const { apiReady } = useGoogleMapsScript(API_KEY);

  // 2. Handle Scroll Effect for NavBar transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Handle Email Copy to Clipboard
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('wnisini.niketha@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* ------------------------------------------------------------------
          GLOBAL BACKGROUND
      ------------------------------------------------------------------ */}
      <div className="fixed inset-0 h-full w-full bg-[#050505] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      <NavBar apiReady={apiReady} isScrolled={isScrolled} />

      {/* ------------------------------------------------------------------
          MAIN CONTENT CONTAINER
      ------------------------------------------------------------------ */}
      <div className="relative z-10 w-full max-w-[2000px] mx-auto px-4 md:px-8 space-y-4 md:space-y-6 pt-32 pb-20">
        
        {/* --- SECTION 1: HERO BIO --- */}
        <div className="rounded-[2.5rem] p-8 md:p-12 border border-white/5 relative overflow-hidden group flex flex-col justify-center min-h-[600px] bg-[#0a0a0a]">
            
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop" 
                    alt="Programming Background" 
                    className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/50"></div>
            </div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center lg:items-stretch h-full">
                
                {/* Profile Picture */}
                <div className="shrink-0 relative lg:w-[450px] flex items-center justify-center">
                   <div className="w-72 h-72 md:w-96 md:h-96 rounded-[2.5rem] border-4 border-white/5 overflow-hidden shadow-2xl bg-black transform rotate-3 hover:rotate-0 transition-transform duration-500 ease-out">
                       <img 
                         src={profileImg} 
                         alt="Nisini Niketha" 
                         className="w-full h-full object-cover"
                       />
                   </div>
                </div>

                {/* Text Content */}
                <div className="flex-1 flex flex-col justify-center lg:justify-between text-center lg:text-left w-full py-2">
                    <div>
                        <h1 className="text-5xl md:text-7xl xl:text-8xl font-black mb-6 leading-[0.9] tracking-tighter text-white drop-shadow-lg uppercase">
                        HI, I'M <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                            NISINI NIKETHA.
                        </span>
                        </h1>
                        
                        <div className="space-y-8 w-full">
                            <h2 className="text-2xl md:text-3xl font-bold text-zinc-400">
                            Software Engineer & Web Developer.
                            </h2>
                            
                            <div className="text-zinc-300 text-lg md:text-xl leading-relaxed font-light space-y-4">
                            <p>
                                I build pixel-perfect, user-centric digital experiences. I'm obsessed with clean code, modern aesthetics, and finding the intersection between complex data and intuitive design.
                            </p>
                            <p>
                                Currently pursuing my <span className="text-white font-semibold">Master's in Software Engineering & Management</span> at the <span className="text-white font-semibold">University of Gothenburg</span>. My research focuses on AI-driven UI adaptation and scalable cloud architectures.
                            </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Social/Status Pills */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-10 lg:mt-0">
                        <StatusPill icon={MapPin} text="Gothenburg, Sweden" color="text-indigo-400" />
                        <StatusPill icon={GraduationCap} text="MSc Student" color="text-purple-400" />
                        
                        <a href="https://github.com/Nisinii" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-white hover:text-black">
                            <Github size={18} />
                            GitHub
                        </a>
                        <a href="https://www.linkedin.com/in/nisini-niketha/" target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5]">
                            <Linkedin size={18} />
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </div>

        {/* --- SECTION 2: TECH & CONTACT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            
            {/* Tech Stack Grid (Left) */}
            <div className="lg:col-span-6 bg-[#0a0a0a] rounded-[2.5rem] p-8 md:p-12 border border-white/5 h-full min-h-[400px] flex flex-col">
                <h3 className="font-black text-xl mb-8 flex items-center gap-3 uppercase tracking-widest text-zinc-500">
                    <Cpu size={24} className="text-indigo-500" /> Technical Arsenal
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1">
                   {[
                     { name: "React", icon: <Code2 size={20}/> },
                     { name: "Node.js", icon: <Terminal size={20}/> },
                     { name: "TypeScript", icon: <Code2 size={20}/> },
                     { name: "Next.js", icon: <Globe size={20}/> },
                     { name: "Tailwind", icon: <Palette size={20}/> },
                     { name: "Figma", icon: <Layout size={20}/> },
                     { name: "PostgreSQL", icon: <Database size={20}/> },
                     { name: "AWS", icon: <Cloud size={20}/> },
                     { name: "Docker", icon: <Server size={20}/> },
                   ].map((tech, i) => (
                     <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors cursor-default border border-white/5 group h-full">
                        <span className="text-zinc-400 group-hover:text-white transition-colors group-hover:scale-110 transform duration-300">{tech.icon}</span>
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wide group-hover:text-white transition-colors">{tech.name}</span>
                     </div>
                   ))}
                </div>
            </div>

            {/* Contact / CTA (Right) */}
            <div className="lg:col-span-6 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-[2.5rem] p-8 md:p-12 border border-indigo-500/20 flex flex-col justify-center text-center lg:text-left h-full min-h-[400px]">
                <h3 className="font-black text-4xl md:text-5xl mb-6 tracking-tighter uppercase text-white leading-tight">
                  Let's build something <br/> <span className="text-indigo-400">extraordinary.</span>
                </h3>
                <p className="text-indigo-200/70 text-lg md:text-xl mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                  I'm currently open to new opportunities and collaborations. Whether you have a project in mind or just want to chat about the future of tech, my inbox is always open.
                </p>
                
                <button 
                  onClick={handleCopyEmail}
                  className="w-full md:w-auto py-5 px-10 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all active:scale-95 flex items-center justify-center gap-3 text-white shadow-[0_0_30px_rgba(79,70,229,0.3)] tracking-wide uppercase text-sm group"
                >
                  {copied ? <Check size={20} /> : <Mail size={20} className="group-hover:-rotate-12 transition-transform"/>}
                  {copied ? 'Email Copied!' : 'Copy Email Address'}
                </button>
            </div>
        </div>

        {/* --- SECTION 3: RESUME & EXPERTISE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            
            {/* Resume Download */}
            <a 
              href={resumePdf} 
              download="Nisini_Niketha_Resume.pdf"
              className="lg:col-span-1 bg-[#0a0a0a] rounded-[2.5rem] p-10 border border-white/5 flex flex-col justify-between hover:border-purple-500/30 transition-all cursor-pointer h-64"
            >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-purple-400 mb-4">
                   <FileText size={32} />
                </div>
                <div>
                   <p className="text-sm text-zinc-500 uppercase font-black tracking-widest mb-2">Resume</p>
                   <div className="font-black text-2xl flex items-center gap-2 text-white">
                      View My Resume <ArrowUpRight size={24}/>
                   </div>
                </div>
            </a>
            
            {/* Core Expertise Tags */}
            <div className="lg:col-span-2 bg-[#0a0a0a] rounded-[2.5rem] p-10 md:p-12 border border-white/5 flex flex-col justify-center h-64">
                <h3 className="text-zinc-500 uppercase font-black tracking-widest text-sm mb-8">Core Expertise</h3>
                <div className="flex flex-wrap gap-4">
                   {['Frontend Architecture', 'UI/UX Design', 'Full Stack Development', 'Cloud Infrastructure', 'API Design', 'AI Integration'].map(item => (
                       <span key={item} className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-sm font-bold text-zinc-300 hover:bg-white hover:text-black transition-all cursor-default">
                           {item}
                       </span>
                   ))}
                </div>
            </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

// --- HELPER COMPONENT ---
const StatusPill = ({ icon: Icon, text, color }) => (
    <div className="px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center gap-2 text-sm font-bold uppercase tracking-wide transition-colors cursor-default hover:bg-white/10">
        <Icon size={18} className={color} />
        {text}
    </div>
);

export default DeveloperPage;