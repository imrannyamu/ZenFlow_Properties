
import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, Home, Menu, X, LogOut, Clock, ReceiptText, Wrench, Building2, Folder, BarChart3, Database, Smartphone, FileSearch, Megaphone, RefreshCw, ShieldCheck, HelpCircle, Scale, ShieldAlert, Briefcase, Share2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserRole } from '../types';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  onLogout: () => void;
  onSwitchRole: () => void;
  userRole: UserRole | null;
  overdueAlertsCount: number;
  totalTenants: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, onLogout, onSwitchRole, userRole, overdueAlertsCount, totalTenants }) => {
  const location = useLocation();

  const getDynamicNavItems = () => {
    let primaryLabel = 'Dashboard';
    if (userRole === 'LANDLORD' || userRole === 'FOUNDER') primaryLabel = 'Executive Overview';
    else if (userRole === 'MANAGER') primaryLabel = 'Operations Center';
    else if (userRole === 'TENANT') primaryLabel = 'My Home';
    else if (userRole === 'SERVICE_PROVIDER') primaryLabel = 'Provider Hub';

    const items = [
      { label: primaryLabel, path: '/dashboard', icon: LayoutDashboard },
      { label: 'Properties', path: '/properties', icon: Building2 },
      { label: 'Tenants', path: '/tenants', icon: Users },
      { label: 'Applications', path: '/applications', icon: FileSearch },
      { label: 'Advertising', path: '/advertise', icon: Megaphone },
      { label: 'Report Center', path: '/reports', icon: BarChart3 },
      { label: 'Documents', path: '/documents', icon: Folder },
      { label: 'Lease Audit Pro', path: '/lease-audit', icon: Scale },
      { label: 'Compliance & Tax', path: '/compliance', icon: ShieldCheck },
      { label: 'Maintenance', path: '/maintenance', icon: Wrench },
      { label: 'Job Portal', path: '/provider-portal', icon: Briefcase },
      { label: 'Expenses', path: '/expenses', icon: ReceiptText },
      { label: 'Tenant Portal', path: '/tenant-portal', icon: Smartphone },
      { label: 'Support Center', path: '/help', icon: HelpCircle },
      { label: 'Settings', path: '/settings', icon: Settings },
    ];

    return items.filter(item => {
      if (!userRole) return false;
      
      if (userRole === 'FOUNDER' || userRole === 'LANDLORD') {
         return item.path !== '/tenant-portal';
      }
      
      if (userRole === 'MANAGER') {
        const hidden = ['/reports', '/tenant-portal', '/provider-portal'];
        return !hidden.includes(item.path);
      }
      
      if (userRole === 'TENANT') {
        const allowed = ['/dashboard', '/tenant-portal', '/settings', '/help'];
        return allowed.includes(item.path);
      }

      if (userRole === 'SERVICE_PROVIDER') {
        const allowed = ['/provider-portal', '/settings', '/help'];
        return allowed.includes(item.path);
      }
      
      return true;
    });
  };

  const navItems = getDynamicNavItems();
  const isMarketingPage = location.pathname === '/' || location.pathname === '/home';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fixed inset-0 bg-slate-900/40 z-[80] backdrop-blur-[2px] ${!isMarketingPage ? 'lg:hidden' : ''}`}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-72 bg-white border-r border-slate-200 z-[90] shadow-2xl overflow-y-auto ${!isMarketingPage ? 'lg:hidden' : ''}`}
            >
              <SidebarInner 
                navItems={navItems} 
                closeMenu={() => setIsOpen(false)} 
                onLogout={onLogout} 
                onSwitchRole={onSwitchRole}
                userRole={userRole}
                totalTenants={totalTenants} 
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {!isMarketingPage && (
        <aside className="hidden lg:block fixed left-0 top-[73px] h-[calc(100vh-73px)] w-64 bg-white border-r border-slate-200 z-[40]">
          <SidebarInner 
            navItems={navItems} 
            onLogout={onLogout} 
            onSwitchRole={onSwitchRole}
            userRole={userRole}
            totalTenants={totalTenants} 
          />
        </aside>
      )}
    </>
  );
};

interface SidebarInnerProps {
  navItems: Array<{ label: string, path: string, icon: any, badge?: number }>;
  closeMenu?: () => void;
  onLogout: () => void;
  onSwitchRole: () => void;
  userRole: UserRole | null;
  totalTenants: number;
}

const SidebarInner: React.FC<SidebarInnerProps> = ({ navItems, closeMenu, onLogout, onSwitchRole, userRole, totalTenants }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const isMarketingPage = location.pathname === '/' || location.pathname === '/home';
  
  const handleUpgradeClick = () => {
    navigate('/settings?tab=subscription');
    if (closeMenu) closeMenu();
  };

  const handleLinkClick = () => {
    if (closeMenu) closeMenu();
  };

  const handleInviteFundi = () => {
    setShowInviteModal(true);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/#/join-network`;
    navigator.clipboard.writeText(link);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-full p-6 bg-white">
      <div className="flex items-center justify-between mb-8 px-2">
         <Link to="/home" onClick={handleLinkClick} className="flex items-center gap-3 group cursor-pointer shrink-0">
            <div className="bg-emerald-600 p-2.5 rounded-xl text-white shadow-lg shadow-emerald-100 group-hover:rotate-6 transition-transform">
               <ShieldCheck size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">ZenFlow</span>
         </Link>
         {(closeMenu || isMarketingPage) && (
           <button onClick={closeMenu} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors">
             <X size={24} />
           </button>
         )}
      </div>

      {userRole !== 'SERVICE_PROVIDER' && (
        <div className="mb-6 px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Inventory</span>
          </div>
          <span className={`text-xs font-black ${totalTenants > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
            {totalTenants} Tenants
          </span>
        </div>
      )}

      <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleLinkClick}
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

        {/* Invite a Fundi Feature for Manager/Landlord roles */}
        {(userRole === 'MANAGER' || userRole === 'LANDLORD' || userRole === 'FOUNDER') && (
          <button
            onClick={handleInviteFundi}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-blue-600 hover:bg-blue-50 transition-all font-bold group mt-4 border border-blue-100 border-dashed"
          >
            <Briefcase size={20} className="group-hover:rotate-6 transition-transform" />
            <span className="tracking-tight">Invite a Fundi</span>
          </button>
        )}
      </nav>

      <div className="pt-6 border-t border-slate-100 mt-auto space-y-4 shrink-0 bg-white">
        {userRole !== 'TENANT' && userRole !== 'MANAGER' && userRole !== 'SERVICE_PROVIDER' && (
          <div className="bg-emerald-50 border border-emerald-200/30 p-4 rounded-2xl shadow-sm">
            <div className="flex items-center gap-2 mb-2 text-emerald-800">
              <Clock size={14} className="animate-pulse text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-wider">Trial Status</span>
            </div>
            <p className="text-[11px] font-bold text-emerald-900 mb-2 leading-tight">
              28 Days Remaining
            </p>
            <div className="h-1 w-full bg-white/60 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '70%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-emerald-600 rounded-full"
              />
            </div>
            <button 
              onClick={handleUpgradeClick}
              className="mt-3 w-full py-2 bg-emerald-600 text-white text-[10px] font-black rounded-lg hover:bg-emerald-700 transition-all shadow-sm"
            >
              UPGRADE NOW
            </button>
          </div>
        )}

        <div className="px-4 py-2 bg-slate-900 rounded-xl flex items-center gap-2 mb-2 border border-emerald-500/20 shadow-xl shadow-slate-200">
           <ShieldCheck size={14} className="text-emerald-500" />
           <span className="text-[9px] font-black text-white uppercase tracking-widest">
             <span className="text-emerald-400">{userRole}</span>
           </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {userRole !== 'MANAGER' && (
            <button
              onClick={() => {
                onSwitchRole();
                handleLinkClick();
              }}
              className="flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-bold group border border-slate-100"
              title="Switch Role"
            >
              <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-[9px] uppercase tracking-widest">Switch</span>
            </button>
          )}
          <button
            onClick={() => {
              onLogout();
              handleLinkClick();
            }}
            className={`flex items-center justify-center gap-2 px-3 py-3 rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold group border border-slate-100 ${userRole === 'MANAGER' ? 'col-span-2' : ''}`}
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-[9px] uppercase tracking-widest">Logout</span>
          </button>
        </div>
      </div>

      {/* Invite Fundi Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInviteModal(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 z-10 overflow-hidden"
            >
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                   <Briefcase size={32} />
                </div>
                <div>
                   <h3 className="text-2xl font-black text-slate-900 tracking-tight">Expand Your Network</h3>
                   <p className="text-slate-500 font-medium mt-2">Send this link to professional plumbers, electricians, or fundis you trust.</p>
                </div>

                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                  <div className="truncate text-xs font-mono text-slate-400">
                    {window.location.origin}/#/join-network
                  </div>
                  <button 
                    onClick={copyLink}
                    className={`shrink-0 p-3 rounded-xl transition-all ${isCopied ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 hover:text-slate-900 shadow-sm'}`}
                  >
                    {isCopied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>

                <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em]">Link copied will open the verification form</p>
                
                <button 
                  onClick={() => setShowInviteModal(false)}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                >
                  Done
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-50" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Sidebar;
