import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Phone, MessageSquare, Instagram, Globe } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 py-16 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Branding - Centered */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-900/50">
            <Zap size={28} fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">ZenFlow</span>
          <p className="text-sm font-bold max-w-xs mt-2 italic">
            Kenya's premium property management engine.
          </p>
        </div>
        
        {/* Legal Links - Horizontal */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-12">
          <Link to="/help" className="text-xs font-black uppercase tracking-widest hover:text-emerald-500 transition-colors duration-200">Help Center</Link>
          <Link to="/privacy" className="text-xs font-black uppercase tracking-widest hover:text-emerald-500 transition-colors duration-200">Privacy Policy</Link>
          <Link to="/terms" className="text-xs font-black uppercase tracking-widest hover:text-emerald-500 transition-colors duration-200">Terms of Service</Link>
        </div>

        {/* Social icons - Emerald Accents */}
        <div className="flex items-center gap-6 mb-12">
          <a href="tel:0793710082" className="text-emerald-600 hover:text-emerald-400 transition-colors duration-200" aria-label="Call Us">
            <Phone size={22} />
          </a>
          <a href="https://wa.me/254793710082" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 transition-colors duration-200" aria-label="WhatsApp">
            <MessageSquare size={22} />
          </a>
          <a href="https://www.instagram.com/_.imuu.vvs._" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:text-emerald-400 transition-colors duration-200" aria-label="Instagram">
            <Instagram size={22} />
          </a>
        </div>
        
        {/* Final Copyright */}
        <div className="pt-10 border-t border-slate-800 w-full flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
          <p>© 2026 ZenFlow Properties. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Globe size={14} className="text-emerald-600" />
            <span>Nairobi, Kenya</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;