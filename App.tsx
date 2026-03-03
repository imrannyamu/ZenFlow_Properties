
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Landing from './pages/Landing';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Documents from './pages/Documents';
import Expenses from './pages/Expenses';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import TenantPortal from './pages/TenantPortal';
import Applications from './pages/Applications';
import PublicApply from './pages/PublicApply';
import Advertise from './pages/Advertise';
import PublicListing from './pages/PublicListing';
import Help from './pages/Help';
import LeaseAudit from './pages/LeaseAudit';
import Compliance from './pages/Compliance';
import JoinNetwork from './pages/JoinNetwork';
import ProviderPortal from './pages/ProviderPortal';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';
import TrialBanner from './components/TrialBanner';
import Navbar from './components/Navbar';
import LoginModal from './components/LoginModal';
import DemoLeadModal from './components/DemoLeadModal';
import NotificationDrawer from './components/NotificationDrawer';
import SupportTicketModal from './components/SupportTicketModal';
import ScrollToTop from './components/ScrollToTop';
import { Alert, Notification, Tenant, Lead, MaintenanceTicket, Contractor, Expense, Property, UserRole, ProviderApplication, LedgerEntry } from './types';
import { INITIAL_PROPERTIES, INITIAL_LEADS, INITIAL_TENANTS, SYSTEM_CONFIG } from './config/constants';
import { authService } from './services/authService';
import LaunchScreen from "./LaunchScreen";

const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isFounder, setIsFounder] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [loginMode, setLoginMode] = useState<'login' | 'signup'>('login');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [lastContext, setLastContext] = useState<{ name?: string, ref?: string } | undefined>();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);
  


  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('zenflow_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('zenflow_tenants');
    return saved ? JSON.parse(saved) : INITIAL_TENANTS;
  });

  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('zenflow_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('zenflow_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const [maintenanceTickets, setMaintenanceTickets] = useState<MaintenanceTicket[]>(() => {
    const saved = localStorage.getItem('zenflow_maintenance');
    return saved ? JSON.parse(saved) : [];
  });

  const [contractors, setContractors] = useState<Contractor[]>(() => {
    const saved = localStorage.getItem('zenflow_contractors');
    return saved ? JSON.parse(saved) : [];
  });

  const [providerApps, setProviderApps] = useState<ProviderApplication[]>(() => {
    const saved = localStorage.getItem('zenflow_provider_apps');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('zenflow_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [alerts, setAlerts] = useState<Alert[]>(() => {
    const saved = localStorage.getItem('zenflow_alerts');
    return saved ? JSON.parse(saved) : [{ id: 1, message: "System ready.", type: "maintenance", severity: "low", isResolved: false }];
  });
  useEffect(() => {
  const timer = setTimeout(() => {
    setShowSplash(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  // ENFORCEMENT LOGIC: Automatic Late Fee Engine
  // TODO: Move this logic to a backend cron job or serverless function
  // REPLACE WITH DATABASE QUERY
  useEffect(() => {
    const SYSTEM_DATE = new Date(SYSTEM_CONFIG.DATE); 
    const automations = JSON.parse(localStorage.getItem('zenflow_automations') || '{}');
    const LATE_FEE_AMOUNT = automations.lateFeeAmount || SYSTEM_CONFIG.LATE_FEE_DEFAULT;
    const GLOBAL_GRACE = automations.gracePeriod || SYSTEM_CONFIG.GRACE_PERIOD_DEFAULT;

    const updatedTenants = tenants.map(t => {
      const dueDate = t.dueDate || 5;
      const penaltyThreshold = dueDate + GLOBAL_GRACE;
      
      // If we are past the penalty date and tenant hasn't paid full rent
      if (SYSTEM_DATE.getDate() > penaltyThreshold && t.status !== 'Paid') {
        const ledger = t.ledger || [
          { id: 'l1', date: '2026-02-01', description: 'Monthly Rent - February', type: 'DEBIT', amount: t.rentAmount, balance: t.rentAmount }
        ];
        
        // Check if a late fee was already applied for this month
        const feeApplied = ledger.some(e => e.description === 'Automated Late Fee' && e.date.includes('2026-02'));
        
        if (!feeApplied) {
          const lastBalance = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;
          const newEntry: LedgerEntry = {
            id: `l-auto-fee-${Date.now()}`,
            date: '2026-02-14', // Placed just after grace period
            description: 'Automated Late Fee',
            type: 'DEBIT',
            amount: LATE_FEE_AMOUNT,
            balance: lastBalance + LATE_FEE_AMOUNT
          
          };
          
          return {
            
            ...t,
            ledger: [...ledger, newEntry],
            status: 'Late'
          };
        }
      }
      return t;
    });

    // Only update if changes occurred to prevent infinite loops
    if (JSON.stringify(updatedTenants) !== JSON.stringify(tenants)) {
      setTenants(updatedTenants);
    }
  }, [tenants]);

  useEffect(() => {
    localStorage.setItem('zenflow_properties', JSON.stringify(properties));
    localStorage.setItem('zenflow_tenants', JSON.stringify(tenants));
    localStorage.setItem('zenflow_leads', JSON.stringify(leads));
    localStorage.setItem('zenflow_expenses', JSON.stringify(expenses));
    localStorage.setItem('zenflow_maintenance', JSON.stringify(maintenanceTickets));
    localStorage.setItem('zenflow_notifications', JSON.stringify(notifications));
    localStorage.setItem('zenflow_alerts', JSON.stringify(alerts));
    localStorage.setItem('zenflow_contractors', JSON.stringify(contractors));
    localStorage.setItem('zenflow_provider_apps', JSON.stringify(providerApps));
  }, [properties, tenants, leads, expenses, maintenanceTickets, notifications, alerts, contractors, providerApps]);

  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = { ...expense, id: `exp-${Date.now()}` };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleAddMaintenanceRequest = (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticket,
      id: `m-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-KE', { hour12: false })
    };
    setMaintenanceTickets(prev => [newTicket, ...prev]);
  };

  const handleAssignContractor = (ticketId: string, contractorId: string) => {
    setMaintenanceTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: 'In Progress', contractorId } : t
    ));
  };

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    setUserRole(null);
    setIsSidebarOpen(false);
    setIsNewUser(false);
    setIsFounder(false);
  };

  const handleSwitchRole = () => {
    handleLogout();
    navigate('/');
  };

  const showNavbar = location.pathname === '/' || location.pathname === '/home' || isAuthenticated;
  if (showSplash) {
  return <LaunchScreen />;
}

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col overflow-hidden">
      {showNavbar && (
        <Navbar 
          onLoginClick={() => { setLoginMode('login'); setIsLoginOpen(true); }} 
          onDemoClick={() => setIsDemoOpen(true)}
          onMenuClick={() => setIsSidebarOpen(true)}
          isMenuOpen={isNavbarOpen} 
          setIsMenuOpen={setIsNavbarOpen} 
          isAuthenticated={isAuthenticated} 
        />
      )}
      
      <div className="flex-1 flex overflow-hidden relative">
        {isAuthenticated && (
          <Sidebar 
            isOpen={isSidebarOpen} 
            setIsOpen={setIsSidebarOpen} 
            onLogout={handleLogout} 
            onSwitchRole={handleSwitchRole}
            userRole={userRole}
            overdueAlertsCount={alerts.filter(a => !a.isResolved).length} 
            totalTenants={tenants.length}
          />
        )}

        <div className={`flex-1 flex flex-col overflow-hidden ${isAuthenticated && location.pathname !== '/home' && location.pathname !== '/' ? 'lg:pl-64' : ''}`}>
          <div 
            id="main-scroll-container"
            ref={scrollContainerRef}
            className="flex-1 flex flex-col overflow-y-auto pt-[73px] scroll-smooth"
          >
            {isAuthenticated && userRole !== 'TENANT' && userRole !== 'MANAGER' && userRole !== 'SERVICE_PROVIDER' && location.pathname !== '/' && location.pathname !== '/home' && <TrialBanner />}
            
            <main className="flex-1 w-full relative">
              <Routes>
                <Route path="/" element={<Welcome onGetStarted={() => { setLoginMode('signup'); setIsLoginOpen(true); }} onLogin={() => { setLoginMode('login'); setIsLoginOpen(true); }} onDemoClick={() => setIsDemoOpen(true)} isAuthenticated={isAuthenticated} userRole={userRole} />} />
                <Route path="/home" element={<Landing setIsLoginOpen={() => { setLoginMode('signup'); setIsLoginOpen(true); }} isAuthenticated={isAuthenticated} userRole={userRole} tenants={tenants} maintenanceTickets={maintenanceTickets} expenses={expenses} properties={properties} />} />
                <Route path="/apply" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><PublicApply leads={leads} setLeads={setLeads} properties={properties} /></div>} />
                <Route path="/listing/:unitId" element={<div className="w-full"><PublicListing properties={properties} /></div>} />
                <Route path="/join-network" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><JoinNetwork providerApps={providerApps} setProviderApps={setProviderApps} /></div>} />
                <Route element={isAuthenticated ? <Outlet /> : <Navigate to="/" replace />}>
                  <Route path="/dashboard" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Dashboard alerts={alerts} notifications={notifications} resolveAlert={(id) => setAlerts(a => a.map(x => x.id === id ? {...x, isResolved: true} : x))} onOpenNotifications={() => setIsNotificationsOpen(true)} unreadCount={notifications.filter(n => !n.isRead).length} onOpenSupport={() => setIsSupportModalOpen(true)} onContextUpdate={setLastContext} maintenanceTickets={maintenanceTickets} expenses={expenses} userRole={userRole} tenants={tenants} properties={properties} /></div>} />
                  <Route path="/tenants" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Tenants tenants={tenants} setTenants={setTenants} leads={leads} setLeads={setLeads} properties={properties} setProperties={setProperties} onOpenSupport={() => setIsSupportModalOpen(true)} onContextUpdate={setLastContext} userRole={userRole} /></div>} />
                  <Route path="/applications" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Applications leads={leads} setLeads={setLeads} tenants={tenants} setTenants={setTenants} properties={properties} setProperties={setProperties} /></div>} />
                  <Route path="/advertise" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Advertise properties={properties} /></div>} />
                  <Route path="/properties" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Properties properties={properties} setProperties={setProperties} /></div>} />
                  <Route path="/expenses" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Expenses expenses={expenses} onAddExpense={handleAddExpense} /></div>} />
                  <Route path="/documents" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Documents auditLogs={[]} userRole={userRole} userEmail={userEmail} tenants={tenants} /></div>} />
                  <Route path="/lease-audit" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><LeaseAudit /></div>} />
                  <Route path="/compliance" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Compliance /></div>} />
                  <Route path="/maintenance" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Maintenance tickets={maintenanceTickets} contractors={contractors} providerApps={providerApps} setProviderApps={setProviderApps} setContractors={setContractors} onAddRequest={handleAddMaintenanceRequest} onAssign={handleAssignContractor} /></div>} />
                  <Route path="/reports" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Reports /></div>} />
                  <Route path="/tenant-portal" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><TenantPortal /></div>} />
                  <Route path="/provider-portal" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><ProviderPortal tickets={maintenanceTickets} setTickets={setMaintenanceTickets} setNotifications={setNotifications} /></div>} />
                  <Route path="/settings" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Settings isFounder={isFounder} isNewUser={isNewUser} userEmail={userEmail} /></div>} />
                </Route>
                <Route path="/help" element={<div className="p-4 md:p-10 max-w-7xl mx-auto w-full"><Help userRole={userRole} /></div>} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isLoginOpen && (
          <LoginModal mode={loginMode} onClose={() => setIsLoginOpen(false)} onLoginSuccess={(email, isNew, isFound, role) => { setIsAuthenticated(true); setUserEmail(email); setIsNewUser(isNew); setIsFounder(isFound); setUserRole(role); setIsLoginOpen(false); }} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isDemoOpen && (<DemoLeadModal onClose={() => setIsDemoOpen(false)} />)}
      </AnimatePresence>
      <NotificationDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} notifications={notifications} onMarkAllRead={() => setNotifications(n => n.map(x => ({...x, isRead: true})))} onMarkAsRead={(id) => setNotifications(n => n.map(x => x.id === id ? {...x, isRead: true} : x))} />
      <SupportTicketModal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} onSubmit={() => setIsSupportModalOpen(false)} tenants={tenants} prefill={lastContext} />
      <ScrollToTop />
    </div>
  );
};

export default App;
