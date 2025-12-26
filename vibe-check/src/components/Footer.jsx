import React from 'react';

const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-20 md:pt-40 pb-12 md:pb-20 px-4 md:px-12 2xl:px-24 text-center md:text-left w-full">
    <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-20">
      
      {/* Brand Section */}
      <div className="max-w-xs mx-auto md:mx-0">
        <div className="font-black italic text-3xl md:text-4xl 2xl:text-5xl tracking-tighter text-slate-900 mb-6 md:mb-8 underline decoration-indigo-600">
          VC.
        </div>
        <p className="text-slate-500 text-sm 2xl:text-base leading-relaxed font-medium">
          Curating urban geography through the lens of real-time spatial intelligence.
        </p>
      </div>
      
      {/* Links Section */}
      <div className="flex flex-col md:flex-row gap-12 md:gap-24 mx-auto md:mx-0">
        <div>
          <h4 className="text-[10px] md:text-[11px] 2xl:text-xs font-black uppercase tracking-widest text-slate-900 mb-6 md:mb-8">
            Infrastructure
          </h4>
          <ul className="space-y-3 md:space-y-4 text-slate-400 text-[10px] md:text-[11px] 2xl:text-xs font-bold uppercase tracking-widest">
            <li>Google Cloud</li>
            <li>Places SDK v4</li>
            <li>React PROD</li>
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] md:text-[11px] 2xl:text-xs font-black uppercase tracking-widest text-slate-900 mb-6 md:mb-8">
            Developer
          </h4>
          <ul className="space-y-3 md:space-y-4 text-slate-400 text-[10px] md:text-[11px] 2xl:text-xs font-bold uppercase tracking-widest hover:text-indigo-600 cursor-pointer">
            <li>Architecture</li>
            <li>Documentation</li>
          </ul>
        </div>
      </div>
    </div>
    
    {/* Bottom Bar */}
    <div className="w-full mx-auto mt-20 md:mt-32 pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-slate-300 text-[10px] 2xl:text-xs font-black uppercase tracking-[0.2em] gap-4 md:gap-0">
      <p>© 2025 VibeCheck AI</p>
      <div>Linked_v6.0_BETA</div>
    </div>
  </footer>
);

export default Footer;