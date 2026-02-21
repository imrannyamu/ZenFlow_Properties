
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Smartphone, Wallet, Zap, Clock, ShieldCheck, 
  MessageSquare, AlertCircle, CheckCircle2, ChevronRight, 
  ArrowLeft, Download, Receipt, Camera, Bell, Flame,
  FileText, Droplets, Lightbulb, MapPin, Send, Wrench,
  Users, UserPlus, CreditCard, LogOut, Check, Sparkles,
  Dumbbell, Waves, Coffee, Key, QrCode, Package, Plus,
  Megaphone, Trash2, Heart, Shield, AlertTriangle, X,
  ShieldAlert, ImageIcon, Loader2, Cloud, Calendar, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Tenant, LedgerEntry } from '../types';
import FinancialLedger from '../components/FinancialLedger';
import ReceiptModal from '../components/ReceiptModal';

type SubView = 'dashboard' | 'vault' | 'certificate' | 'fix' | 'track' | 'utilities' | 'notices' | 'checkout' | 'success' | 'add-tenant' | 'amenities' | 'guest-access' | 'community';

const TenantPortal: React.FC = () => {
  const navigate = useNavigate();
  const [subView, setSubView] = useState<SubView>('dashboard');
  const [isReporting, setIsReporting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [isUploadingReport, setIsUploadingReport] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'sending_stk' | 'awaiting_pin' | 'success'>('idle');
  
  const [maintenanceTickets, setMaintenanceTickets] = useState<any[]>(() => {
    const saved = localStorage.getItem('zenflow_maintenance');
    return saved ? JSON.parse(saved) : [];
  });

  const [announcements] = useState([
    { id: 1, title: 'Water Maintenance', date: '2026-02-24', content: 'Water supply will be interrupted on Tuesday from 10 AM to 4 PM for tank cleaning.', priority: 'High' },
    { id: 2, title: 'New Security Protocol', date: '2026-02-20', content: 'Please ensure the main gate is locked after 10 PM. New guard shifts starting Monday.', priority: 'Medium' }
  ]);
  
  const [hasPackage, setHasPackage] = useState(true);
  const [guestKey, setGuestKey] = useState<string | null>(null);
  const [posts, setPosts] = useState([
    { id: 1, user: 'Sarah (B4)', text: 'Found a pair of car keys in the lobby. DM if they are yours!', type: 'Lost & Found' },
    { id: 2, user: 'John (A1)', text: 'Selling a clean LG Microwave - KES 8,000.', type: 'For Sale' }
  ]);

  const [tenants, setTenants] = useState<Tenant[]>(() => {
    const saved = localStorage.getItem('zenflow_tenants');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTenantId, setActiveTenantId] = useState<string>(() => {
    return tenants.length > 0 ? tenants[0].id : 't1';
  });

  const [receiptEntry, setReceiptEntry] = useState<{tenant: Tenant, entry: LedgerEntry} | null>(null);

  const activeTenant = useMemo(() => {
    return tenants.find(t => t.id === activeTenantId) || tenants[0] || {
      id: 't1',
      name: 'James Kamau',
      unit: 'A1',
      rentAmount: 25000,
      phone: '254700000000',
      status: 'Active',
      dueDate: 5,
      depositHeld: 25000,
      leaseStart: new Date().toISOString()
    };
  }, [tenants, activeTenantId]);

  const isNewTenant = useMemo(() => {
    const leaseStart = new Date(activeTenant.leaseStart);
    const today = new Date("2026-02-15"); // Mock System Date
    const diffDays = Math.ceil((today.getTime() - leaseStart.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7 && !activeTenant.conditionReportSubmitted;
  }, [activeTenant]);

  const ledgerData: LedgerEntry[] = useMemo(() => {
    if (activeTenant.ledger && activeTenant.ledger.length > 0) return activeTenant.ledger;
    const rent = activeTenant.rentAmount || 25000;
    return [
      { id: 'l1', date: '2026-02-01', description: 'Monthly Rent - February', type: 'DEBIT', amount: rent, balance: rent },
      { id: 'l2', date: '2026-02-04', description: 'M-Pesa Payment (Ref: ZF990K)', type: 'CREDIT', amount: rent, balance: 0 },
    ];
  }, [activeTenant]);

  const lateFeeEntry = useMemo(() => {
    return ledgerData.find(e => e.description === 'Automated Late Fee');
  }, [ledgerData]);

  const tenantScore = useMemo(() => {
    const seed = activeTenant.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return 60 + (seed % 36); 
  }, [activeTenant.id]);

  const handleGenerateGuestKey = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setGuestKey(pin);
  };

  const handlePanic = () => {
    setIsPanicActive(true);
    const newNotification = {
      id: `panic-${Date.now()}`,
      title: '🚨 SECURITY ALERT',
      message: `Emergency Panic Button triggered by ${activeTenant.name} in Unit ${activeTenant.unit}!`,
      type: 'support',
      timestamp: new Date().toISOString(),
      isRead: false,
      link: '/dashboard'
    };
    const savedNotifications = JSON.parse(localStorage.getItem('zenflow_notifications') || '[]');
    localStorage.setItem('zenflow_notifications', JSON.stringify([newNotification, ...savedNotifications]));
  };

  const handleConfirmPayment = async () => {
    if (!paymentAmount || isNaN(Number(paymentAmount))) return;
    setIsProcessingPayment(true);

    if (paymentMethod === 'mpesa') {
      // STK Push Logic
      setPaymentStatus('sending_stk');
      // Simulate API call to M-Pesa Daraja Gateway
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStatus('awaiting_pin');
      // Simulate user entering PIN on their phone
      await new Promise(resolve => setTimeout(resolve, 4000));
    } else {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const amount = Number(paymentAmount);
    const currentLedger = activeTenant.ledger || ledgerData;
    const lastBalance = currentLedger.length > 0 ? currentLedger[currentLedger.length - 1].balance : 0;
    
    const newEntry: LedgerEntry = {
      id: `pay-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      description: `Rent Payment - ${paymentMethod === 'mpesa' ? 'M-Pesa (STK Push)' : 'Card'}`,
      type: 'CREDIT',
      amount: amount,
      balance: lastBalance - amount
    };

    const updatedTenant = {
      ...activeTenant,
      ledger: [...currentLedger, newEntry],
      status: (lastBalance - amount) <= 0 ? 'Paid' : 'Partial'
    };

    setTenants(prev => prev.map(t => t.id === activeTenant.id ? updatedTenant : t));
    localStorage.setItem('zenflow_tenants', JSON.stringify(tenants.map(t => t.id === activeTenant.id ? updatedTenant : t)));
    
    setIsProcessingPayment(false);
    setPaymentStatus('idle');
    setSubView('success');
  };

  const handleMaintenanceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTicket = {
      id: `m-${Date.now()}`,
      title: formData.get('title'),
      description: formData.get('description'),
      unit: activeTenant.unit,
      priority: 'Routine',
      status: 'Pending',
      createdAt: new Date().toLocaleString('en-KE')
    };
    const updatedTickets = [newTicket, ...maintenanceTickets];
    setMaintenanceTickets(updatedTickets);
    localStorage.setItem('zenflow_maintenance', JSON.stringify(updatedTickets));
    setSubView('track');
  };

  const handleAddTenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    const newTenant: Tenant = {
      id: `t-${Date.now()}`,
      name,
      unit: 'New',
      phone: '254...',
      email: '',
      idNumber: '',
      rentAmount: 25000,
      dueDate: 5,
      leaseStart: new Date().toISOString(),
      leaseEnd: new Date().toISOString(),
      status: 'Active',
      payments: []
    };
    
    setTenants(prev => [newTenant, ...prev]);
    setActiveTenantId(newTenant.id);
    setSubView('dashboard');
  };

  const handleConditionReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploadingReport(true);
    // Simulate photo processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updatedTenant = {
      ...activeTenant,
      conditionReportSubmitted: true,
      conditionReportDate: new Date().toISOString().split('T')[0],
      moveInReportPhotos: {
        'Living Room': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=400',
        'Kitchen': 'https://images.unsplash.com/photo-1556911220-e152433bc39c?auto=format&fit=crop&q=80&w=400',
        'Bedroom': 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400',
        'Bathroom': 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&q=80&w=400'
      }
    };

    setTenants(prev => prev.map(t => t.id === activeTenant.id ? updatedTenant : t));
    localStorage.setItem('zenflow_tenants', JSON.stringify(tenants.map(t => t.id === activeTenant.id ? updatedTenant : t)));
    setIsUploadingReport(false);
    alert("Condition Report Submitted! Your security deposit is now shielded by photographic evidence.");
  };

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white border border-slate-100 p-4 rounded-[1.5rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={18} /></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Viewing As</span>
            <select value={activeTenantId} onChange={(e) => setActiveTenantId(e.target.value)} className="bg-transparent font-black text-slate-900 outline-none cursor-pointer">
              {tenants.map(t => (<option key={t.id} value={t.id}>{t.name} (Unit {t.unit})</option>))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSubView('add-tenant')} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center gap-2"><UserPlus size={14} /> Add Profile</button>
          <button onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"><LogOut size={14} /> Exit Portal</button>
        </div>
      </div>

      {/* MOVE-IN CONDITION REPORT CARD */}
      {isNewTenant && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-emerald-200 relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
                <ShieldAlert size={14} className="text-amber-300" /> High Priority Move-In Task
              </div>
              <h3 className="text-3xl font-black tracking-tight leading-none">🛡️ Shield Your Deposit</h3>
              <p className="text-emerald-50 text-sm font-medium leading-relaxed max-w-lg">
                Submit your Move-In Condition Report within 7 days. High-resolution photos of your unit prevent unfair deductions when you vacate.
              </p>
            </div>
            <button 
              onClick={() => setIsUploadingReport(true)}
              className="px-8 py-5 bg-white text-emerald-700 font-black rounded-2xl shadow-xl hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-xs whitespace-nowrap"
            >
              Document Condition Now
            </button>
          </div>
          <ShieldCheck size={200} className="absolute -right-16 -bottom-16 text-white/10 rotate-12 pointer-events-none group-hover:rotate-6 transition-transform duration-700" />
        </motion.div>
      )}

      {/* LATE FEE ALERT BANNER */}
      {lateFeeEntry && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-600 rounded-[2rem] p-6 text-white shadow-xl shadow-rose-200 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden"
        >
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={24} className="animate-pulse" />
            </div>
            <div>
              <h4 className="font-black text-lg tracking-tight">Late Fee Applied</h4>
              <p className="text-rose-100 text-xs font-bold uppercase tracking-widest">
                A penalty of KES {lateFeeEntry.amount.toLocaleString()} has been applied due to overdue rent.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setSubView('vault')}
            className="px-8 py-3 bg-white text-rose-600 font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:bg-rose-50 transition-all relative z-10"
          >
            View Ledger
          </button>
          <AlertTriangle size={150} className="absolute -right-10 -bottom-10 opacity-10 rotate-12 pointer-events-none" />
        </motion.div>
      )}

      <div className="flex items-center justify-between px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenant Portal</h1>
          <p className="text-slate-500 font-medium">Hello, {activeTenant.name}. Your unit is secure.</p>
        </div>
        <div className="flex items-center gap-3">
          {hasPackage && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-emerald-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg shadow-emerald-200 animate-pulse cursor-pointer" onClick={() => { alert("📦 Delivery Ref: ZN-882 is at the lobby."); setHasPackage(false); }}>
              <Package size={18} /><span className="text-[10px] font-black uppercase tracking-widest">Package arrived</span>
            </motion.div>
          )}
          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black">{activeTenant.name.split(' ').map(n => n[0]).join('')}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div whileHover={{ y: -5 }} className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Next Payment</p>
          <h3 className="text-4xl font-black tracking-tighter mb-1">KES {activeTenant.rentAmount.toLocaleString()}</h3>
          <p className="text-xs font-bold text-slate-400 mb-8 tracking-wide">Due by March {activeTenant.dueDate}, 2026</p>
          <button onClick={() => setSubView('checkout')} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"><Smartphone size={18} /> Pay Rent Now</button>
          <Zap size={140} className="absolute -right-10 -bottom-10 opacity-5 text-emerald-400 rotate-12" />
        </motion.div>

        <motion.div whileHover={{ y: -5 }} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 w-full text-left">My Zenflow Score</p>
          <div className="relative flex items-center justify-center mb-4">
             <svg className="w-32 h-32 transform -rotate-90">
               <circle cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
               <motion.circle initial={{ strokeDashoffset: 340 }} animate={{ strokeDashoffset: 340 - (340 * (tenantScore / 100)) }} cx="64" cy="64" r="54" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="340" className="text-emerald-500" />
             </svg>
             <span className="absolute text-3xl font-black text-slate-900">{tenantScore}</span>
          </div>
          <p className={`text-xs font-black uppercase tracking-widest ${tenantScore > 80 ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50'} px-4 py-1.5 rounded-full`}>{tenantScore > 80 ? 'Elite Payer' : 'On Track'}</p>
        </motion.div>

        <motion.div whileHover={{ y: -5 }} onClick={() => setSubView('guest-access')} className="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100 shadow-sm cursor-pointer group relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-8">Access Control</p>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-emerald-600 shadow-lg"><Key size={48} className="group-hover:rotate-45 transition-transform" /></div>
              <div><h4 className="text-2xl font-black text-slate-900">Guest Key</h4><p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Generate PIN</p></div>
            </div>
            <div className="mt-8 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-emerald-700"><span>Grant temporary entry</span><ChevronRight size={14} /></div>
          </div>
          <QrCode size={140} className="absolute -right-10 -bottom-10 opacity-[0.03] text-emerald-900 -rotate-12" />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">Lifestyle & Fun</h3>
          <div className="space-y-3">
             <PortalCard title="Book Amenities" desc="Gym, Pool, Common Area." icon={Dumbbell} onClick={() => setSubView('amenities')} variant="emerald" />
             <PortalCard title="Community Hub" desc="Lost keys & Items for sale." icon={MessageSquare} onClick={() => setSubView('community')} />
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">Maintenance</h3>
          <div className="space-y-3">
             <PortalCard title="Fix Something" desc="Report an issue in your unit." icon={Wrench} onClick={() => setSubView('fix')} />
             <PortalCard title="Track Repair" desc="Uber-style progress tracking." icon={MapPin} onClick={() => setSubView('track')} />
          </div>
        </section>
        <section className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-4">Financials</h3>
          <div className="space-y-3">
             <PortalCard title="Financial Ledger" desc="Statement of all payments." icon={Receipt} onClick={() => setSubView('vault')} />
             <PortalCard title="Notice Board" desc="Messages from management." icon={Bell} onClick={() => setSubView('notices')} />
          </div>
        </section>
      </div>

      <div className="pt-8">
         <button onClick={handlePanic} className="w-full py-8 bg-rose-600 text-white rounded-[3rem] shadow-2xl shadow-rose-200 border-b-[8px] border-rose-800 active:border-b-0 active:translate-y-2 transition-all group flex flex-col items-center justify-center gap-2">
           <Flame size={40} className="group-hover:animate-bounce" />
           <span className="text-3xl font-black uppercase tracking-tighter">Panic Button</span>
           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Alert Caretaker & Security Instantly</p>
         </button>
      </div>
    </div>
  );

  const renderCheckout = () => (
    <div className="max-w-xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Pay Rent</h2>
        <p className="text-slate-500 font-medium">Fast, secure, and automatically updated in your ledger.</p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Select Payment Method</label>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => setPaymentMethod('mpesa')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'mpesa' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
              <Smartphone size={32} />
              <span className="font-black text-xs uppercase tracking-widest">M-Pesa</span>
            </button>
            <button onClick={() => setPaymentMethod('card')} className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${paymentMethod === 'card' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
              <CreditCard size={32} />
              <span className="font-black text-xs uppercase tracking-widest">Card</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Enter Amount (KES)</label>
          <div className="relative">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400">KES</span>
            <input 
              type="number" 
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
              placeholder={activeTenant.rentAmount.toString()}
              className="w-full pl-16 pr-8 py-6 bg-slate-50 border-none rounded-2xl font-black text-2xl focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
            />
          </div>
        </div>

        <button 
          onClick={handleConfirmPayment}
          disabled={isProcessingPayment || !paymentAmount}
          className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
        >
          {isProcessingPayment ? (
            <div className="flex items-center gap-3">
              <Loader2 className="animate-spin" size={24} />
              <span>
                {paymentStatus === 'sending_stk' ? 'Sending STK Push...' : 
                 paymentStatus === 'awaiting_pin' ? 'Enter M-Pesa PIN on Phone' : 
                 'Processing...'}
              </span>
            </div>
          ) : (
            <><ShieldCheck size={20} /> Confirm & Pay Now</>
          )}
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="max-w-xl mx-auto text-center space-y-8 animate-in zoom-in-95 duration-500 py-12">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-100">
        <Check size={48} />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Payment Received!</h2>
        <p className="text-slate-500 font-medium">Your ledger has been updated automatically.</p>
      </div>
      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl">
        <div className="flex justify-between items-center py-4 border-b border-slate-50">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid</span>
          <span className="text-xl font-black text-slate-900">KES {Number(paymentAmount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reference</span>
          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">ZF-{Math.random().toString(36).substring(7).toUpperCase()}</span>
        </div>
      </div>
      <button onClick={() => { setSubView('dashboard'); setPaymentAmount(''); }} className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-xs">Back to Dashboard</button>
    </div>
  );

  const renderReceiptVault = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div><h2 className="text-3xl font-black text-slate-900 tracking-tight">Financial Ledger</h2><p className="text-slate-500 font-medium">Verified statement of all rent and service charge activity.</p></div>
      </div>
      <section className="bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl border-b-[8px] border-emerald-600/30">
         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-2">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-500/20"><ShieldCheck size={12} /> Liability Shield</div>
               <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Security Deposit Held</p>
                 {activeTenant.conditionReportSubmitted && (
                   <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-900/40">
                     <CheckCircle2 size={8} /> Condition Documented
                   </span>
                 )}
               </div>
               <h3 className="text-4xl font-black tracking-tighter text-emerald-400">KES {(activeTenant.depositHeld || 0).toLocaleString()}</h3>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-md">
               <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Conditions Log</p>
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-white/10 rounded-xl"><Camera size={20} className="text-emerald-400" /></div>
                 <span className="text-xs font-bold">{activeTenant.conditionReportSubmitted ? 'Move-in Condition Photos Verified' : 'Photos Outstanding - Submit Today'}</span>
               </div>
            </div>
         </div>
         <Shield size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
      </section>
      <FinancialLedger entries={ledgerData} onDownloadReceipt={(e) => setReceiptEntry({tenant: activeTenant, entry: e})} />
      <div className="flex justify-center pt-4"><button className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs"><Download size={18} /> Download Statement PDF</button></div>
    </div>
  );

  const renderFixForm = () => (
    <div className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-bottom-8 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Fix Something</h2>
        <p className="text-slate-500 font-medium">Report any issues in your unit for immediate attention.</p>
      </div>

      <form onSubmit={handleMaintenanceSubmit} className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Issue Title</label>
          <input 
            name="title"
            required
            placeholder="e.g., Leaking Kitchen Sink"
            className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Description</label>
          <textarea 
            name="description"
            required
            rows={4}
            placeholder="Describe the issue in detail..."
            className="w-full px-8 py-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
          />
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Upload Photo (Optional)</label>
          <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
            <Camera className="text-slate-300 group-hover:text-emerald-600 transition-colors" size={48} />
            <span className="text-[10px] font-black uppercase text-slate-400">Click to upload evidence</span>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
        >
          <Send size={20} /> Submit Request
        </button>
      </form>
    </div>
  );

  const renderRepairTracking = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Track Repair</h2>
          <p className="text-slate-500 font-medium">Real-time progress of your maintenance requests.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {maintenanceTickets.filter(t => t.unit === activeTenant.unit).length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Wrench size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-900">No Active Repairs</h3>
            <p className="text-slate-400 font-medium">Everything in your unit seems to be in order.</p>
          </div>
        ) : (
          maintenanceTickets.filter(t => t.unit === activeTenant.unit).map(ticket => (
            <div key={ticket.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${ticket.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                  {ticket.status === 'Completed' ? <CheckCircle2 size={32} /> : <Clock size={32} className="animate-spin-slow" />}
                </div>
                <div>
                  <h4 className="text-xl font-black text-slate-900">{ticket.title}</h4>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reported on {ticket.createdAt}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden md:block">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <p className={`font-black uppercase tracking-widest text-xs ${ticket.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'}`}>{ticket.status}</p>
                </div>
                <div className="px-6 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600">
                  {ticket.status === 'Pending' ? 'Awaiting Manager' : ticket.status === 'In Progress' ? 'Contractor Assigned' : 'Work Verified'}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderNoticeBoard = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Notice Board</h2>
          <p className="text-slate-500 font-medium">Important announcements from building management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements.map(notice => (
          <div key={notice.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex flex-col md:flex-row gap-8 relative z-10">
              <div className="shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${notice.priority === 'High' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  <Megaphone size={32} />
                </div>
              </div>
              <div className="space-y-4 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h4 className="text-2xl font-black text-slate-900">{notice.title}</h4>
                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${notice.priority === 'High' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-white'}`}>{notice.priority} Priority</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notice.date}</span>
                </div>
                <p className="text-slate-600 font-medium leading-relaxed">{notice.content}</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[5rem] -mr-16 -mt-16 group-hover:bg-emerald-50 transition-colors duration-500" />
          </div>
        ))}
      </div>
    </div>
  );

  const [bookings, setBookings] = useState<any[]>(() => {
    const saved = localStorage.getItem('zenflow_amenity_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  const amenities = [
    { 
      id: 'gym', 
      name: 'Elite Fitness Gym', 
      desc: 'State-of-the-art equipment with panoramic city views.', 
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
      price: 0,
      rules: ['Max capacity: 15 people', 'Wipe down equipment after use', 'Proper gym attire required']
    },
    { 
      id: 'pool', 
      name: 'Infinity Pool', 
      desc: 'Temperature-controlled rooftop pool with sunset deck.', 
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=800',
      price: 500,
      rules: ['No glass containers', 'Shower before entry', 'No diving', 'Max capacity: 20']
    },
    { 
      id: 'lounge', 
      name: 'Skyline Lounge', 
      desc: 'Perfect for private events or quiet evening relaxation.', 
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
      price: 1500,
      rules: ['Booking required for private events', 'Quiet hours after 10 PM', 'Clean up after use']
    },
    { 
      id: 'meeting', 
      name: 'Business Hub', 
      desc: 'High-speed Wi-Fi, 4K display, and soundproof walls.', 
      image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800',
      price: 1000,
      rules: ['Max capacity: 8', 'No food inside', 'Reset equipment after use']
    }
  ];

  const [selectedAmenity, setSelectedAmenity] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');
  const [isBooking, setIsBooking] = useState(false);

  const handleBookAmenity = async () => {
    if (!selectedAmenity) return;
    
    // Check for conflicts
    const isConflict = bookings.some(b => 
      b.amenityId === selectedAmenity.id && 
      b.date === bookingDate && 
      b.time === bookingTime &&
      b.status !== 'Cancelled'
    );

    if (isConflict) {
      alert("This time slot is already reserved. Please choose another.");
      return;
    }

    setIsBooking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newBooking = {
      id: `b-${Date.now()}`,
      amenityId: selectedAmenity.id,
      amenityName: selectedAmenity.name,
      date: bookingDate,
      time: bookingTime,
      price: selectedAmenity.price,
      tenantName: activeTenant.name,
      unit: activeTenant.unit,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    const updatedBookings = [newBooking, ...bookings];
    setBookings(updatedBookings);
    localStorage.setItem('zenflow_amenity_bookings', JSON.stringify(updatedBookings));
    
    // Automated Notification Simulation
    const newNotification = {
      id: `book-${Date.now()}`,
      title: '📅 Booking Confirmed',
      message: `Your reservation for ${selectedAmenity.name} on ${bookingDate} at ${bookingTime} is confirmed.`,
      type: 'info',
      timestamp: new Date().toISOString(),
      isRead: false,
      link: '/tenant-portal'
    };
    const savedNotifications = JSON.parse(localStorage.getItem('zenflow_notifications') || '[]');
    localStorage.setItem('zenflow_notifications', JSON.stringify([newNotification, ...savedNotifications]));

    setIsBooking(false);
    setSelectedAmenity(null);
    alert("Booking Successful! A confirmation has been sent to your notifications.");
  };

  const cancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b);
    setBookings(updated);
    localStorage.setItem('zenflow_amenity_bookings', JSON.stringify(updated));
  };

  const amenityPopularity = useMemo(() => {
    const counts: Record<string, number> = {};
    bookings.forEach(b => {
      if (b.status !== 'Cancelled') {
        counts[b.amenityId] = (counts[b.amenityId] || 0) + 1;
      }
    });
    return counts;
  }, [bookings]);

  const totalRevenue = useMemo(() => {
    return bookings
      .filter(b => b.status !== 'Cancelled')
      .reduce((sum, b) => sum + (b.price || 0), 0);
  }, [bookings]);

  const renderAmenities = () => (
    <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Amenity Catalog</h2>
          <p className="text-slate-500 font-medium">Premium spaces designed for your lifestyle.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100">
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Bookings</p>
            <p className="text-lg font-black text-slate-900">{bookings.filter(b => b.status !== 'Cancelled').length}</p>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl text-white">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Revenue Generated</p>
            <p className="text-lg font-black">KES {totalRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {amenities.map((amenity) => (
          <motion.div 
            key={amenity.id}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden group flex flex-col"
          >
            <div className="h-64 relative overflow-hidden">
              <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-6 right-6 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20">
                <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                  {amenity.price === 0 ? 'Free Access' : `KES ${amenity.price.toLocaleString()}`}
                </span>
              </div>
              {amenityPopularity[amenity.id] > 5 && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-emerald-600 text-white rounded-2xl shadow-lg flex items-center gap-2">
                  <Sparkles size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Trending</span>
                </div>
              )}
            </div>
            <div className="p-8 space-y-4 flex-1 flex flex-col">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{amenity.name}</h3>
                <p className="text-sm font-medium text-slate-500 leading-relaxed">{amenity.desc}</p>
              </div>
              
              <div className="pt-4 flex flex-wrap gap-2">
                {amenity.rules.slice(0, 2).map((rule, i) => (
                  <span key={i} className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-bold border border-slate-100">
                    {rule}
                  </span>
                ))}
              </div>

              <div className="pt-6 mt-auto">
                <button 
                  onClick={() => setSelectedAmenity(amenity)}
                  className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all shadow-xl active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                >
                  Reserve Space <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <Clock size={20} className="text-slate-400" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">My Booking History</h3>
        </div>
        
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
          {bookings.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                <Calendar size={32} />
              </div>
              <p className="text-slate-400 font-medium">No bookings found. Start by reserving an amenity above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amenity</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cost</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-6">
                        <p className="font-black text-slate-900">{booking.amenityName}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ref: {booking.id.split('-')[1]}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-700">{booking.date}</p>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{booking.time}</p>
                      </td>
                      <td className="px-8 py-6 font-bold text-slate-900">
                        {booking.price === 0 ? 'Free' : `KES ${booking.price.toLocaleString()}`}
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                          booking.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        {booking.status === 'Confirmed' && (
                          <button 
                            onClick={() => cancelBooking(booking.id)}
                            className="p-2 text-slate-300 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {selectedAmenity && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedAmenity(null)} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden z-[610] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Calendar size={24} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Reserve {selectedAmenity.name}</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">One-Click Reservation</p>
                  </div>
                </div>
                <button onClick={() => setSelectedAmenity(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Select Date</label>
                    <input 
                      type="date" 
                      value={bookingDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setBookingDate(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Select Time</label>
                    <select 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all cursor-pointer"
                    >
                      {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Info size={18} className="text-amber-600" />
                    <h4 className="font-black text-xs uppercase tracking-widest">Rules & Regulations</h4>
                  </div>
                  <ul className="space-y-2">
                    {selectedAmenity.rules.map((rule: string, i: number) => (
                      <li key={i} className="text-xs text-amber-800 font-medium flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-900 rounded-[2rem] text-white">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Due</p>
                    <p className="text-2xl font-black text-emerald-400">KES {selectedAmenity.price.toLocaleString()}</p>
                  </div>
                  <button 
                    onClick={handleBookAmenity}
                    disabled={isBooking}
                    className="px-8 py-4 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all shadow-lg active:scale-95 flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-50"
                  >
                    {isBooking ? <Loader2 className="animate-spin" size={18} /> : <><Check size={18} /> Confirm Booking</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
  
  const renderCommunity = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <BackButton onClick={() => setSubView('dashboard')} />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Community Hub</h2>
          <p className="text-slate-500 font-medium">Connect with your neighbors and explore the marketplace.</p>
        </div>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-100">
          <Plus size={16} /> Create Post
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Recent Activity</h3>
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post.id} className="flex gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-emerald-200 transition-all">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 font-black shrink-0 shadow-sm">{post.user[0]}</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-slate-900">{post.user}</span>
                      <span className="px-2 py-0.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest">{post.type}</span>
                    </div>
                    <p className="text-sm text-slate-600 font-medium">{post.text}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 flex items-center gap-1"><Heart size={14} /> Like</button>
                      <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 flex items-center gap-1"><MessageSquare size={14} /> Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-400 mb-6">Marketplace</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="aspect-square bg-slate-800 rounded-xl mb-3 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=200" alt="Item" className="w-full h-full object-cover opacity-50" />
                </div>
                <h4 className="font-black text-sm">Sony Headphones</h4>
                <p className="text-emerald-400 font-black text-xs">KES 4,500</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                <div className="aspect-square bg-slate-800 rounded-xl mb-3 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=200" alt="Item" className="w-full h-full object-cover opacity-50" />
                </div>
                <h4 className="font-black text-sm">Clean Desk Lamp</h4>
                <p className="text-emerald-400 font-black text-xs">KES 1,200</p>
              </div>
            </div>
            <Sparkles size={100} className="absolute -right-10 -bottom-10 opacity-10 text-emerald-400 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );

  const currentView = () => {
    switch(subView) {
      case 'vault': return renderReceiptVault();
      case 'checkout': return renderCheckout();
      case 'success': return renderSuccess();
      case 'fix': return renderFixForm();
      case 'track': return renderRepairTracking();
      case 'notices': return renderNoticeBoard();
      case 'community': return renderCommunity();
      case 'amenities': return renderAmenities();
      default: return renderDashboard();
    }
  };

  return (
    <div className="pb-20">
      {currentView()}
      
      {/* CONDITION REPORT MODAL */}
      <AnimatePresence>
        {isUploadingReport && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsUploadingReport(false)} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden z-[610] flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner"><ShieldCheck size={24} /></div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Deposit Protection Survey</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submit your move-in evidence</p>
                  </div>
                </div>
                <button onClick={() => setIsUploadingReport(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleConditionReportSubmit} className="p-10 space-y-10 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {['Living Room', 'Kitchen', 'Bedroom', 'Bathroom'].map(room => (
                    <div key={room} className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-1">{room} Condition</label>
                      <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                         <Camera className="text-slate-300 group-hover:text-emerald-600 transition-colors" size={32} />
                         <span className="text-[9px] font-black uppercase text-slate-400">Click to upload room photos</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900">
                    <ShieldAlert size={18} className="text-emerald-600" />
                    <h4 className="font-black text-xs uppercase tracking-widest">Evidence Verification</h4>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    By submitting these photos, you acknowledge they represent the state of the unit as of <strong>{new Date().toLocaleDateString('en-KE')}</strong>. Zenflow will store these in a non-editable vault for lease duration.
                  </p>
                </div>

                <button 
                  type="submit" 
                  className="w-full py-6 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                >
                  {false ? <Loader2 className="animate-spin" size={24} /> : <><Cloud size={20} /> Secure My Deposit</>}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {receiptEntry && (
          <ReceiptModal tenant={receiptEntry.tenant} entry={receiptEntry.entry} onClose={() => setReceiptEntry(null)} />
        )}
      </AnimatePresence>

      {/* PANIC MODAL */}
      <AnimatePresence>
        {isPanicActive && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-rose-900/95 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[4rem] shadow-2xl p-12 text-center space-y-8 overflow-hidden">
              <div className="w-32 h-32 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow-2xl shadow-rose-200">
                <ShieldAlert size={64} />
              </div>
              <div className="space-y-4">
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">EMERGENCY ALERT SENT</h2>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Security & Management have been notified of your location.</p>
              </div>
              <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                <p className="text-rose-600 font-black text-xs uppercase tracking-widest">Unit {activeTenant.unit} • {activeTenant.name}</p>
              </div>
              <button onClick={() => setIsPanicActive(false)} className="w-full py-6 bg-slate-900 text-white font-black rounded-2xl uppercase tracking-widest text-xs hover:bg-slate-800 transition-all">Dismiss Alert</button>
              <Flame size={200} className="absolute -right-20 -bottom-20 opacity-[0.03] text-rose-900 rotate-12 pointer-events-none" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PortalCard: React.FC<{ title: string, desc: string, icon: any, onClick: () => void, variant?: 'default' | 'emerald' }> = ({ title, desc, icon: Icon, onClick, variant = 'default' }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-6 p-6 rounded-[2rem] border transition-all hover:scale-[1.02] active:scale-95 text-left group ${variant === 'emerald' ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-100' : 'bg-white border-slate-100 shadow-sm hover:border-emerald-200'}`}><div className={`p-4 rounded-2xl transition-colors ${variant === 'emerald' ? 'bg-white/10 group-hover:bg-white/20' : 'bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600'}`}><Icon size={28} /></div><div className="flex-1"><h4 className="font-black text-lg tracking-tight leading-none mb-1">{title}</h4><p className={`text-xs font-medium leading-none ${variant === 'emerald' ? 'text-emerald-50' : 'text-slate-400'}`}>{desc}</p></div><ChevronRight size={18} className={variant === 'emerald' ? 'text-emerald-200' : 'text-slate-300'} /></button>
);

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button onClick={onClick} className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-all shadow-sm mb-6"><ArrowLeft size={16} /> Back to Dashboard</button>
);

export default TenantPortal;
