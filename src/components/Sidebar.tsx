
import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Home, Menu, X, LogOut, Clock, ReceiptText, Wrench, Building2, Folder } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Hardcoded notification count for the demo
  const overdueAlertsCount = 3;

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: overdueAlertsCount },
    { label: 'Properties', path: '/properties', icon: Building2 },
    { label: 'Tenants', path: '/tenants', icon: Users },
    { label: 'Documents', path: '/documents', icon: Folder },
    { label: 'Maintenance', path: '/maintenance', icon: Wrench },
    { label: 'Expenses', path: '/expenses', icon: ReceiptText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <div className="lg:hidden fixed top-5 right-5 z-[70]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-3 bg-white border border-slate-100 rounded-2xl shadow-xl text-emerald-600 active:scale-90 transition-transform"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-slate-900/30 backdrop-blur-[4px] z-[50]"
              onClick={() => setIsOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-72 bg-white/95 backdrop-blur-2xl border-r border-slate-200/50 z-[60] shadow-2xl"
            >
              <SidebarInner navItems={navItems} closeMenu={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:block fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-200 z-[40]">
        <SidebarInner navItems={navItems} />
      </aside>
    </>
  );
};

interface SidebarInnerProps {
  navItems: Array<{ label: string, path: string, icon: any, badge?: number }>;
  closeMenu?: () => void;
}

const SidebarInner: React.FC<SidebarInnerProps> = ({ navItems, closeMenu }) => (
  <div className="flex flex-col h-full p-6">
    <Link to="/" onClick={closeMenu} className="flex items-center gap-3 mb-10 px-2 group cursor-pointer">
      <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
        <Home size={22} fill="currentColor" />
      </div>
      <span className="text-2xl font-black tracking-tight text-slate-900">ZenFlow</span>
    </Link>

    <nav className="flex-1 space-y-1.5">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          onClick={closeMenu}
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative
            ${isActive 
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 font-bold' 
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 font-medium'}
          `}
        >
          <item.icon size={20} className={`transition-transform duration-300 group-hover:scale-110`} />
          <span className="tracking-tight">{item.label}</span>
          
          {item.badge && item.badge > 0 && (
            <span className="absolute right-4 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-4 ring-white shadow-sm">
              {item.badge}
            </span>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="pt-6 border-t border-slate-100 mt-auto space-y-4">
      <div className="bg-emerald-100 border border-emerald-200/30 p-4 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-emerald-800">
          <Clock size={14} className="animate-pulse text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-wider">Trial Status</span>
        </div>
        <p className="text-[11px] font-bold text-emerald-900 mb-2 leading-tight">
          28 Days of Free Trial Remaining
        </p>
        <div className="h-1 w-full bg-white/60 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '70%' }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-600 rounded-full"
          />
        </div>
        <button className="mt-3 w-full py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
          UPGRADE TO PRO
        </button>
      </div>

      <NavLink
        to="/"
        onClick={closeMenu}
        className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold group"
      >
        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
        Logout
      </NavLink>
    </div>
  </div>
);

export default Sidebar;
