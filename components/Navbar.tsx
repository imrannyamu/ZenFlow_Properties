
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X, ArrowRight, Smartphone, LayoutGrid, HelpCircle } from 'lucide-react';
// Added AnimatePresence to fix "Cannot find name 'AnimatePresence'" errors
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onLoginClick: () => void;
  onDemoClick: () => void;
  onMenuClick: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (val: boolean) => void;
  isAuthenticated: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onDemoClick, onMenuClick, isMenuOpen, setIsMenuOpen, isAuthenticated }) => {
  const location = useLocation();
  const isMarketingPage = location.pathname === '/' || location.pathname === '/home';

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Portfolio', path: '/properties' },
    { label: 'Features', path: '/#features' },
    { label: 'Pricing', path: '/#pricing' },
    { label: 'Support', path: '/help' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white/90 backdrop-blur-md border-b border-slate-100 h-[73px] flex items-center">
      <div className="max-w-7xl mx-auto px-6 w-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group cursor-pointer relative z-50">
          <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300">
            <Zap size={22} fill="white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">ZenFlow</span>
        </Link>

        {/* Desktop Navigation */}
        {!isAuthenticated && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className={`text-sm font-bold transition-all duration-200 hover:text-emerald-600 relative py-1 group/link ${
                  location.pathname === link.path ? 'text-emerald-600' : 'text-slate-500'
                }`}
              >
                {link.label}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-emerald-600 origin-left transition-transform duration-300 ${
                  location.pathname === link.path ? 'scale-x-100' : 'scale-x-0 group-hover/link:scale-x-100'
                }`} />
              </Link>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!isAuthenticated && (
            <button
              onClick={onDemoClick}
              className="hidden lg:flex items-center gap-2 px-5 py-2 bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full hover:bg-emerald-100 transition-all border border-emerald-100 active:scale-95"
            >
              Book Demo
            </button>
          )}
          
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* HIDDEN ON MARKETING PAGES PER STRICT DIRECTIVE */}
              {isAuthenticated && !isMarketingPage && (
                <button
                  onClick={onMenuClick}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95 group"
                >
                  <Menu size={18} className="group-hover:rotate-90 transition-transform duration-300" />
                  Menu
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="hidden sm:block px-6 py-2.5 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-100"
            >
              Login
            </button>
          )}
          
          {/* Mobile Menu Toggle (Only for unauthenticated users) */}
          {!isAuthenticated && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-emerald-600 transition-colors bg-slate-50 rounded-xl border border-slate-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav Overlay (Unauthenticated) */}
      <AnimatePresence>
        {!isAuthenticated && isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden absolute top-[73px] left-0 right-0 overflow-hidden bg-white border-b border-slate-100 shadow-xl"
          >
            <div className="px-6 py-8 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-black transition-colors ${
                    location.pathname === link.path ? 'text-emerald-600' : 'text-slate-900 hover:text-emerald-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <button
                  onClick={() => { setIsMenuOpen(false); onDemoClick(); }}
                  className="w-full py-4 bg-emerald-50 text-emerald-700 border border-emerald-100 font-black rounded-2xl flex items-center justify-center gap-2"
                >
                  <Smartphone size={20} /> Book a Free Demo
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLoginClick();
                  }}
                  className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                >
                  Sign In to ZenFlow
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
