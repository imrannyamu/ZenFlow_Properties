
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, 
  Activity, 
  Wallet, 
  Landmark, 
  Bell, 
  AlertCircle,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  Loader2,
  Wrench,
  LifeBuoy,
  X,
  AlertTriangle,
  TrendingUp,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Building2,
  Receipt,
  Scan,
  FileSearch,
  Sparkles,
  Shield,
  FileText,
  CreditCard,
  User,
  Activity as ActivityIcon,
  // Fix: Added missing BarChart3 import
  BarChart3,
  Flame,
  ArrowLeft
} from 'lucide-react';
import { MetricCardProps, Alert, MaintenanceTicket, Expense, Property, Tenant, UserRole } from '../types';
import RevenueChart from '../components/RevenueChart';
import AIFinancialInsight from '../components/AIFinancialInsight';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

const CollectionProgress: React.FC<{ collected: number, total: number }> = ({ collected, total }) => {
  const percentage = Math.round((collected / total) * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group">
      <div className="relative flex items-center justify-center shrink-0">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} className="text-emerald-600" />
        </svg>
        <span className="absolute text-lg font-black text-slate-900 tracking-tighter">{percentage}%</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">Collection Progress</p>
        <h3 className="text-xl font-black text-slate-900">KES {(collected / 1000000).toFixed(2)}M</h3>
        <p className="text-xs font-bold text-slate-500">of KES {(total / 1000000).toFixed(2)}M expected</p>
      </div>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, variant = 'emerald' }) => {
  const variantClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600',
    rose: 'text-rose-600 bg-rose-50 group-hover:bg-rose-600',
    slate: 'text-slate-900 bg-slate-50 group-hover:bg-slate-900',
  };

  const trendClasses = trend?.startsWith('+') 
    ? 'bg-emerald-100 text-emerald-700' 
    : 'bg-rose-100 text-rose-700';

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl group-hover:text-white transition-colors duration-300 ${variantClasses[variant]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${trendClasses}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
  );
};

interface DashboardProps {
  alerts: Alert[];
  notifications?: Notification[];
  resolveAlert: (id: number) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  onOpenSupport: () => void;
  onContextUpdate: (ctx: { name?: string, ref?: string }) => void;
  maintenanceTickets?: MaintenanceTicket[];
  expenses?: Expense[];
  userRole?: UserRole | null;
  tenants?: Tenant[];
  properties?: Property[];
}

const Dashboard: React.FC<DashboardProps> = ({ 
  alerts, 
  notifications = [],
  resolveAlert, 
  onOpenNotifications, 
  unreadCount, 
  onOpenSupport, 
  onContextUpdate,
  maintenanceTickets = [],
  expenses = [],
  userRole,
  tenants = [],
  properties = []
}) => {
  const navigate = useNavigate();
  const [redirectingAlertId, setRedirectingAlertId] = useState<number | null>(null);
  const [showCheckmarkId, setShowCheckmarkId] = useState<number | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);

  const activeAlerts = alerts.filter(a => !a.isResolved || showCheckmarkId === a.id);

  // FINANCIAL DYNAMICS
  const baseCollectedRent = 1240000;
  const totalExpenses = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const netIncome = baseCollectedRent - totalExpenses;

  const handleTakeAction = (alert: Alert) => {
    const match = alert.message.match(/(.*?)\s\((.*?)\)/);
    if (match) {
       onContextUpdate({ name: match[1].trim(), ref: match[2].trim() });
    }

    setRedirectingAlertId(alert.id);
    setTimeout(() => {
      setRedirectingAlertId(null);
      if (alert.type === 'maintenance') {
        navigate(`/maintenance?view=manager`);
      } else {
        setShowCheckmarkId(alert.id);
        setTimeout(() => {
          resolveAlert(alert.id);
          setShowCheckmarkId(null);
        }, 1500);
        
        if (alert.type === 'rent') {
          navigate('/tenants?tab=active');
        } else if (alert.type === 'lease') {
          navigate('/documents?filter=p1&type=Lease');
        }
      }
    }, 600);
  };

  // --- SPECIALIZED ROLE-BASED RENDERING ---

  if (userRole === 'LANDLORD' || userRole === 'FOUNDER') {
    const totalUnits = properties.reduce((sum, p) => sum + p.units.length, 0);
    const occupiedUnits = properties.reduce((sum, p) => sum + p.units.filter(u => u.status === 'Occupied').length, 0);
    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;
    
    const currentMonthCollection = tenants
      .filter(t => t.status === 'Paid')
      .reduce((sum, t) => sum + (t.rentAmount || 0), 0);
      
    const totalArrears = tenants
      .filter(t => t.status === 'Late' || t.status === 'Partial')
      .reduce((sum, t) => sum + (t.rentAmount || 0), 0);

    const estimatedTax = currentMonthCollection * 0.075;

    return (
      <div className="animate-in fade-in duration-700">
        <div className="space-y-12">
          {/* EXECUTIVE HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                Executive Overview
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                 <ShieldCheck size={20} className="text-emerald-600" />
                 <p className="text-lg">Global Overview of <span className="text-slate-900 font-black">All Assets</span></p>
              </div>
            </motion.div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/reports')}
                className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center gap-2"
              >
                <BarChart3 size={18} /> Deep Analytics
              </button>
            </div>
          </div>

          {/* PROFIT & GROWTH GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/reports')} className="bg-white p-8 rounded-[2.5rem] border-2 border-emerald-50 shadow-xl shadow-emerald-50/20 cursor-pointer group">
              <div className="flex justify-between items-start mb-8">
                 <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <TrendingUp size={24} />
                 </div>
                 <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">+12.4% vs LW</span>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monthly Collection</p>
              <h3 className="text-3xl font-black text-emerald-600 tracking-tighter">KES {currentMonthCollection.toLocaleString()}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/reports')} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/20 cursor-pointer group">
              <div className="flex justify-between items-start mb-8">
                 <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PieChart size={24} />
                 </div>
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100" />)}
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Portfolio Occupancy</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{occupancyRate}%</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/reports')} className="bg-white p-8 rounded-[2.5rem] border-2 border-rose-50 shadow-xl shadow-rose-50/20 cursor-pointer group">
              <div className="flex justify-between items-start mb-8">
                 <div className="p-3 bg-rose-50 text-rose-600 rounded-xl group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <ShieldAlert size={24} />
                 </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Outstanding Debt</p>
              <h3 className="text-3xl font-black text-rose-600 tracking-tighter">KES {totalArrears.toLocaleString()}</h3>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} onClick={() => navigate('/reports')} className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden cursor-pointer group">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                   <div className="p-3 bg-white/10 text-emerald-400 rounded-xl">
                      <Landmark size={24} />
                   </div>
                   <div className="bg-emerald-500/20 px-2 py-1 rounded-md border border-emerald-500/30">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">KRA MRI (7.5%)</span>
                   </div>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Est. Income Tax</p>
                <h3 className="text-3xl font-black text-white tracking-tighter">KES {estimatedTax.toLocaleString()}</h3>
              </div>
              <Landmark size={140} className="absolute -right-8 -bottom-8 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'MANAGER') {
    const activeTickets = maintenanceTickets.filter(t => t.status !== 'Completed');
    const urgentTicketsCount = activeTickets.filter(t => t.priority === 'Urgent' || t.priority === 'Emergency').length;
    const unpaidRentTotal = tenants
      .filter(t => t.status === 'Late' || t.status === 'Active')
      .reduce((sum, t) => sum + (t.rentAmount || 0), 0);

    const securityAlerts = notifications.filter(n => n.title.includes('SECURITY ALERT'));

    return (
      <div className="animate-in fade-in duration-700">
        <div className="space-y-12">
          {/* OPERATIONAL HEADER */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">
                Operations Center
              </h1>
              <div className="flex items-center gap-2 text-slate-500 font-bold">
                 <Building2 size={18} className="text-emerald-600" />
                 <p className="text-lg">Managing <span className="text-slate-900 font-black">{properties.length} Properties</span></p>
              </div>
            </motion.div>
          </div>

          {securityAlerts.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-4">
                <ShieldAlert size={20} className="text-rose-600" />
                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">Active Security Alerts</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {securityAlerts.map(alert => (
                  <motion.div 
                    key={alert.id}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-rose-600 rounded-[2rem] p-6 text-white shadow-xl shadow-rose-100 flex items-center justify-between gap-6"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Flame size={24} className="animate-pulse" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg tracking-tight">{alert.title}</h4>
                        <p className="text-rose-100 text-sm font-medium">{alert.message}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-60">{new Date(alert.timestamp).toLocaleTimeString()}</p>
                      <button onClick={onOpenNotifications} className="mt-2 px-4 py-1.5 bg-white text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all">View Details</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[3rem] p-10 border-2 border-slate-100 transition-all shadow-xl shadow-slate-200/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-10">
                   <div className="p-4 rounded-2xl bg-amber-50 text-amber-600">
                      <Wrench size={32} />
                   </div>
                   {urgentTicketsCount > 0 && <span className="flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white shadow-lg animate-pulse"><AlertTriangle size={14} /> {urgentTicketsCount} Urgent</span>}
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Active Maintenance</h3>
                <p className="text-5xl font-black tracking-tighter text-slate-900">{activeTickets.length} <span className="text-2xl text-slate-400 font-bold uppercase tracking-widest">Tickets</span></p>
              </div>
              <button onClick={() => navigate('/maintenance')} className="mt-10 w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">Manage Repairs <ChevronRight size={16} /></button>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-10">
                   <div className="p-4 rounded-2xl bg-blue-50 text-blue-600">
                      <Receipt size={32} />
                   </div>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Recent Outflow</h3>
                <p className="text-5xl font-black tracking-tighter text-slate-900">{expenses.length} <span className="text-2xl text-slate-400 font-bold uppercase tracking-widest">Scans</span></p>
              </div>
              <button onClick={() => navigate('/expenses')} className="mt-10 w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"><Scan size={16} /> Add Receipt</button>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-10">
                   <div className="p-4 rounded-2xl bg-emerald-600/20 text-emerald-400">
                      <Users size={32} />
                   </div>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Unpaid Rent Total</h3>
                <p className="text-5xl font-black tracking-tighter text-emerald-400">KES {unpaidRentTotal.toLocaleString()}</p>
              </div>
              <button onClick={() => navigate('/tenants')} className="relative z-10 mt-10 w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2">View Reminders <ChevronRight size={16} /></button>
              <Users size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'TENANT') {
    const activeTenant = tenants[0] || { name: 'James Kamau', unit: 'A1', rentAmount: 25000, status: 'Active', dueDate: 5, leaseEnd: '2026-01-01', leaseStart: '2025-01-01' };
    const isPaid = activeTenant.status === 'Paid';

    if (showAgreement) {
      return (
        <div className="animate-in fade-in duration-700">
          <div className="max-w-4xl mx-auto py-8">
            <button 
              onClick={() => setShowAgreement(false)}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-black text-xs uppercase tracking-widest transition-all mb-8"
            >
              <ArrowLeft size={16} /> Back to My Home
            </button>
            
            <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-slate-100 shadow-2xl space-y-12 relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Lease Agreement</h2>
                  <p className="text-slate-500 font-medium uppercase tracking-widest text-xs">Official Tenancy Document</p>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl">
                  <ShieldCheck size={40} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant Name</p>
                    <p className="text-xl font-black text-slate-900">{activeTenant.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Number</p>
                    <p className="text-xl font-black text-slate-900">Unit {activeTenant.unit}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent</p>
                    <p className="text-xl font-black text-emerald-600">KES {activeTenant.rentAmount.toLocaleString()}</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Agreement Period</p>
                    <p className="text-xl font-black text-slate-900">
                      {new Date(activeTenant.leaseStart || '2025-01-01').toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })} — {new Date(activeTenant.leaseEnd || '2026-01-01').toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Deposit</p>
                    <p className="text-xl font-black text-slate-900">KES {(activeTenant.depositHeld || activeTenant.rentAmount).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 border-t border-slate-100 relative z-10">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Terms & Conditions Summary</h4>
                <div className="prose prose-slate max-w-none text-sm text-slate-600 font-medium leading-relaxed space-y-4">
                  <p>1. The tenant agrees to pay the specified rent amount on or before the {activeTenant.dueDate || 5}th of every month.</p>
                  <p>2. A late fee as specified in the system settings will apply for payments made after the grace period.</p>
                  <p>3. The tenant is responsible for maintaining the interior of the unit in good condition.</p>
                  <p>4. Sub-letting is strictly prohibited without written consent from the landlord.</p>
                </div>
              </div>

              <div className="pt-12 flex flex-col md:flex-row justify-between items-end gap-8 relative z-10">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant Signature</p>
                  <div className="font-serif text-3xl italic text-slate-400 border-b-2 border-slate-200 pb-2 px-4 min-w-[200px]">
                    {activeTenant.name}
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Landlord Signature</p>
                  <div className="font-serif text-3xl italic text-emerald-600/50 border-b-2 border-slate-200 pb-2 px-4 min-w-[200px]">
                    ZenFlow Properties
                  </div>
                </div>
              </div>

              <FileText size={400} className="absolute -right-20 -bottom-20 text-slate-50 pointer-events-none" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="animate-in fade-in duration-700">
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-2">My Home</h1>
              <p className="text-lg text-slate-500 font-bold">Welcome back, {activeTenant.name.split(' ')[0]}!</p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -5 }} className={`bg-white rounded-[3rem] p-10 border-2 transition-all shadow-xl flex flex-col justify-between ${isPaid ? 'border-emerald-500' : 'border-rose-500'}`}>
              <div>
                <div className="flex justify-between items-start mb-10">
                   <div className={`p-4 rounded-2xl ${isPaid ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      <Wallet size={32} />
                   </div>
                   <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${isPaid ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>{isPaid ? 'Paid' : 'Balance Due'}</span>
                </div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Current Statement</h3>
                <p className={`text-5xl font-black tracking-tighter ${isPaid ? 'text-slate-900' : 'text-rose-600'}`}>KES {isPaid ? '0' : activeTenant.rentAmount.toLocaleString()}</p>
              </div>
              <button onClick={() => navigate('/tenant-portal')} className={`mt-10 w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 ${isPaid ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-rose-600 text-white hover:bg-rose-700'}`}>{isPaid ? <><Receipt size={16} /> View History</> : <><CreditCard size={16} /> Pay Rent Now</>}</button>
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
              <div className="relative z-10 w-full text-left mb-6">
                <div className="p-3 bg-emerald-600/20 text-emerald-400 rounded-xl inline-flex mb-4"><Shield size={24} /></div>
                <h3 className="text-xl font-black tracking-tight">Tenancy Health</h3>
              </div>
              <div className="relative flex items-center justify-center mb-8 z-10">
                 <span className="text-6xl font-black text-white tracking-tighter">88</span>
              </div>
              <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
            </motion.div>

            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl flex flex-col justify-between">
              <div className="space-y-8">
                 <div className="flex justify-between items-start">
                    <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><FileText size={32} /></div>
                 </div>
                 <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">View Lease Agreement</h3>
                    <p className="text-2xl font-black text-slate-900 leading-tight">Secured until {new Date(activeTenant.leaseEnd || '2026-01-01').toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}</p>
                 </div>
              </div>
              <button onClick={() => setShowAgreement(true)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 text-xs uppercase tracking-widest">View Document <ChevronRight size={16} /></button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  if (userRole === 'SERVICE_PROVIDER') {
    useEffect(() => {
      navigate('/provider-portal');
    }, [navigate]);
    return null;
  }

  // --- ORIGINAL GENERIC DASHBOARD FALLBACK ---

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12 relative">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back. Your properties are performing at 94% capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group mr-2">
            <button 
              onClick={onOpenNotifications}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm relative group/bell"
            >
              <Bell size={20} className="group-hover/bell:animate-[bounce_1s_infinite]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-black text-white ring-2 ring-white shadow-lg animate-in zoom-in duration-300">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        <CollectionProgress collected={baseCollectedRent} total={1325000} />
        <MetricCard 
          title="Net Profit" 
          value={`KES ${netIncome.toLocaleString()}`} 
          trend="+14.1%" 
          icon={<Landmark size={24} />} 
          variant="slate"
        />
        <MetricCard 
          title="Total Expenses" 
          value={`KES ${totalExpenses.toLocaleString()}`} 
          trend="+8.2%" 
          icon={<Wallet size={24} />} 
          variant="rose"
        />
        <MetricCard 
          title="Occupancy Rate" 
          value="94.2%" 
          trend="+2.1%" 
          icon={<Users size={24} />} 
          variant="emerald"
        />
      </div>

      {/* 3. ACTIVE ALERTS SECTION (Inline strips, replacing floating toasts) */}
      {activeAlerts.length > 0 && (
        <div className="space-y-4 relative z-10">
          <div className="flex items-center gap-2 px-2">
            <Bell size={16} className="text-emerald-600" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Alerts Required</h2>
          </div>
          <div className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {activeAlerts.map((alert) => {
                const isMaintenance = alert.type === 'maintenance';
                const isRent = alert.type === 'rent';
                
                const cardStyles = isMaintenance 
                  ? 'bg-rose-50 border-rose-100 text-rose-900' 
                  : isRent 
                  ? 'bg-amber-50 border-amber-100 text-amber-900' 
                  : 'bg-slate-50 border-slate-100 text-slate-900';

                const iconStyles = isMaintenance 
                  ? 'bg-rose-100 text-rose-600' 
                  : isRent 
                  ? 'bg-amber-100 text-amber-600' 
                  : 'bg-white text-slate-400';

                return (
                  <motion.div 
                    key={alert.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-all group ${cardStyles}`}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 ${iconStyles}`}>
                        {isMaintenance ? <Wrench size={18} /> : isRent ? <AlertTriangle size={18} /> : <Bell size={18} />}
                      </div>
                      <p className="text-xs font-bold truncate pr-4">
                        {alert.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {showCheckmarkId === alert.id || alert.isResolved ? (
                        <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600">
                          <CheckCircle2 size={14} /> Logged
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleTakeAction(alert)}
                          disabled={redirectingAlertId !== null}
                          className="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border-2 border-current hover:bg-white/40 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                          {redirectingAlertId === alert.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <>Take Action <ChevronRight size={10} /></>
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* 4. CHARTS & INSIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[320px] flex flex-col">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <AIFinancialInsight />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
