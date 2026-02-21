
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, Send, Filter, User, Phone, 
  MessageSquareText, CheckCircle2, 
  MoreHorizontal, Smartphone, UserPlus,
  ArrowLeft, Users, UserCheck, Briefcase, X,
  AlertTriangle, CreditCard, Banknote, Mail, 
  Receipt, Landmark, History, ExternalLink,
  ShieldCheck, Trash2, LogOut, Check, Wallet,
  ArrowUpRight, ArrowDownLeft, FileSpreadsheet,
  Settings2, Download, Calendar, MessageSquare
} from 'lucide-react';
import { Tenant, Property, UserRole, LedgerEntry, Lead } from '../types';
import TenantProfileModal from '../components/TenantProfileModal';
import BillingModal from '../components/BillingModal';
import FinancialLedger from '../components/FinancialLedger';
import ReceiptModal from '../components/ReceiptModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface TenantsProps {
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  onOpenSupport: () => void;
  onContextUpdate: (ctx: { name?: string, ref?: string }) => void;
  userRole?: UserRole | null;
}

const Tenants: React.FC<TenantsProps> = ({ 
  tenants = [], 
  setTenants, 
  leads = [], 
  setLeads, 
  properties = [], 
  setProperties, 
  onOpenSupport, 
  onContextUpdate,
  userRole
}) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'active' | 'prospective') || 'active';

  const [activeTab, setActiveTab] = useState<'active' | 'prospective'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [billingTenant, setBillingTenant] = useState<Tenant | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [viewingLedgerTenant, setViewingLedgerTenant] = useState<Tenant | null>(null);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [receiptEntry, setReceiptEntry] = useState<{tenant: Tenant, entry: LedgerEntry} | null>(null);
  const [showReceiptConfirm, setShowReceiptConfirm] = useState<Tenant | null>(null);
  const [paidTenantId, setPaidTenantId] = useState<string | null>(null);
  const [showSuccessOnboard, setShowSuccessOnboard] = useState(false);

  // Fix Scroll Leak
  useEffect(() => {
    const isModalOpen = isAddModalOpen || !!viewingTenant || !!billingTenant || !!viewingLedgerTenant || !!receiptEntry || !!showReceiptConfirm;
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isAddModalOpen, viewingTenant, billingTenant, viewingLedgerTenant, receiptEntry, showReceiptConfirm]);

  useEffect(() => {
    if (searchParams.get('onboard') === 'true') {
      setIsAddModalOpen(true);
    }
  }, [searchParams]);

  const SYSTEM_DATE = new Date(2026, 1, 15);

  const processedTenants = useMemo(() => {
    const data = Array.isArray(tenants) ? tenants : [];
    return data.map(t => {
      let computedStatus: Tenant['status'] = t.status || 'Active';
      let daysLate = 0;
      const dueDateDay = Number(t.dueDate) || 5;
      
      if (t.status !== 'Paid' && SYSTEM_DATE.getDate() > dueDateDay) { 
        computedStatus = 'Late';
        daysLate = Math.max(0, SYSTEM_DATE.getDate() - dueDateDay);
      }
      
      return { ...t, computedStatus, daysLate };
    });
  }, [tenants, SYSTEM_DATE]);

  const filteredTenants = processedTenants.filter(t => 
    (t.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.unit || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (l.interestedUnit || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendConfirmation = (tenant: Tenant) => {
    const ledger = tenant.ledger || [];
    const latestCredit = [...ledger].reverse().find(e => e.type === 'CREDIT');
    const latestEntry = ledger.length > 0 ? ledger[ledger.length - 1] : null;
    
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
    
    // Logic for Unique Account Number
    const accNo = `ZF-${tenant.unit || '000'}`.toUpperCase().replace(/\s+/g, '');
    const amountStr = (latestCredit?.amount || 0).toLocaleString();
    const balanceStr = (latestEntry?.balance || 0).toLocaleString();
    const refNo = (latestCredit?.id || 'PENDING').replace('l-', '').toUpperCase();
    
    const message = `Confirmed. Your account ${accNo}, ${tenant.name || 'Tenant'}, Unit ${tenant.unit || '---'}, has been credited with KES ${amountStr} on ${dateStr} at ${timeStr}. Ref: ${refNo}. Your total balance is KES ${balanceStr}.`;
    
    window.location.href = `sms:${tenant.phone}?body=${encodeURIComponent(message)}`;
  };

  const handleMarkAsPaid = (tenant: Tenant) => {
    if (userRole === 'TENANT') return;
    const amount = tenant.rentAmount || 0;
    const now = new Date();
    const refChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomRef = 'ZF';
    for (let i = 0; i < 8; i++) {
      randomRef += refChars.charAt(Math.floor(Math.random() * refChars.length));
    }

    const currentLedger = tenant.ledger || [
      { id: `l-init-${tenant.id}`, date: '2026-02-01', description: 'Monthly Rent - February', type: 'DEBIT', amount: tenant.rentAmount, balance: tenant.rentAmount }
    ];
    
    const newEntry: LedgerEntry = {
      id: `l-${randomRef}`,
      date: now.toISOString().split('T')[0],
      description: 'M-Pesa Payment (Ref: ' + randomRef + ')',
      type: 'CREDIT',
      amount: amount,
      balance: 0
    };

    setPaidTenantId(tenant.id);
    setTenants(prev => prev.map(t => t.id === tenant.id ? { ...t, status: 'Paid', ledger: [...currentLedger, newEntry] } : t));

    setTimeout(() => {
      setShowReceiptConfirm(tenant);
      setPaidTenantId(null);
    }, 1000);
  };

  const handleApproveProspect = (lead: Lead) => {
    const tenantId = `t-${Date.now()}`;
    const newTenant: Tenant = {
      id: tenantId,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      idNumber: lead.idNumber,
      unit: lead.interestedUnit,
      rentAmount: lead.unitRent,
      depositHeld: lead.unitRent,
      dueDate: 5,
      leaseStart: new Date().toISOString().split('T')[0],
      leaseEnd: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      status: 'Active',
      payments: [],
      ledger: [
        { id: `l-init-${tenantId}`, date: new Date().toISOString().split('T')[0], description: 'Initial Rent & Deposit Charge', type: 'DEBIT', amount: lead.unitRent * 2, balance: lead.unitRent * 2 }
      ]
    };

    setTenants(prev => [newTenant, ...prev]);
    setLeads(prev => prev.filter(l => l.id !== lead.id));
    setActiveTab('active');
    setShowSuccessOnboard(true);
    setTimeout(() => setShowSuccessOnboard(false), 3000);
  };

  const handleSaveNewTenant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const unit = formData.get('unit') as string;
    const rentAmount = Number(formData.get('rentAmount'));
    const leaseStart = formData.get('leaseStart') as string;
    const tenantId = `t-${Date.now()}`;

    const newTenant: Tenant = {
      id: tenantId,
      name,
      email: '',
      phone,
      idNumber: '',
      unit,
      rentAmount,
      depositHeld: rentAmount,
      dueDate: 5,
      leaseStart,
      leaseEnd: new Date(new Date(leaseStart).getTime() + 31536000000).toISOString().split('T')[0],
      status: 'Active',
      payments: [],
      ledger: [
        { id: `l-init-${tenantId}`, date: leaseStart, description: 'Opening Balance: Rent + Security Deposit', type: 'DEBIT', amount: rentAmount * 2, balance: rentAmount * 2 }
      ]
    };

    setTenants(prev => [newTenant, ...prev]);
    setIsAddModalOpen(false);
    setShowSuccessOnboard(true);
    setTimeout(() => setShowSuccessOnboard(false), 3000);
  };

  const getStatusBadge = (status: string, daysLate: number) => {
    if (status === 'Late') {
      return (
        <div className="flex flex-col items-end">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-600 text-white shadow-lg">
            <AlertTriangle size={12} /> Late
          </span>
          <span className="text-[10px] font-bold text-rose-400 mt-1">+{daysLate} days late</span>
        </div>
      );
    }
    if (status === 'Paid') {
      return (
        <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
          Paid
        </span>
      );
    }
    return (
      <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-100 bg-slate-50 text-slate-500">
        {status}
      </span>
    );
  };

  const renderLedgerView = (tenant: Tenant) => {
    const ledger = tenant.ledger || [];
    const totalPaid = ledger.filter(e => e.type === 'CREDIT').reduce((sum, e) => sum + e.amount, 0);
    const outstanding = ledger.length > 0 ? ledger[ledger.length - 1].balance : 0;

    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewingLedgerTenant(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><ArrowLeft size={20} /></button>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Audit Ledger</h2>
              <p className="text-slate-500 font-medium">{tenant.name} • Unit {tenant.unit}</p>
            </div>
          </div>
          <button onClick={() => setShowAdjustmentModal(true)} className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg active:scale-95"><Settings2 size={16} /> Manual Adjustment</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Paid to Date</p>
            <h4 className="text-3xl font-black text-emerald-600">KES {totalPaid.toLocaleString()}</h4>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Outstanding Balance</p>
            <h4 className={`text-3xl font-black ${outstanding > 0 ? 'text-rose-600' : 'text-slate-900'}`}>KES {outstanding.toLocaleString()}</h4>
          </div>
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Security Deposit Status</p>
                 {tenant.conditionReportSubmitted && (
                   <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-emerald-900/40 mb-2">
                     <CheckCircle2 size={8} /> Condition Documented
                   </span>
                 )}
              </div>
              <h4 className="text-3xl font-black">KES {(tenant.depositHeld || 0).toLocaleString()}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Status: Locked in ESCROW</p>
            </div>
            <ShieldCheck size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
          </div>
        </div>

        <FinancialLedger entries={ledger} onDownloadReceipt={(e) => setReceiptEntry({tenant, entry: e})} />
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 pb-20 max-w-full relative">
      <AnimatePresence>
        {showSuccessOnboard && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20">
            <CheckCircle2 size={20} />
            <span className="font-black text-sm uppercase tracking-widest">Tenant Activated Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {viewingLedgerTenant ? (
        renderLedgerView(viewingLedgerTenant)
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenants & Prospects</h1>
              <p className="text-slate-500 font-medium">Manage lease compliance and real-time financial states.</p>
            </div>
            <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start">
              <button onClick={() => setActiveTab('active')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'active' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Active</button>
              <button onClick={() => setActiveTab('prospective')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'prospective' ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400'}`}>Prospects</button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mx-1">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or unit..." 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:outline-none" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
              {activeTab === 'active' && (
                <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest text-xs"><UserPlus size={18} /> Onboard Tenant</button>
              )}
            </div>

            <div className="overflow-x-auto">
              {activeTab === 'active' ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit & Resident</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rent Allocation</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredTenants.length > 0 ? filteredTenants.map(t => (
                      <tr key={t.id} className="hover:bg-slate-50/30 transition-all group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">{t.unit || '??'}</div>
                              <div>
                                 <button onClick={() => setViewingTenant(t)} className="font-black text-slate-900 text-lg hover:text-emerald-600 block">{t.name || 'Unnamed'}</button>
                                 <button onClick={() => setViewingLedgerTenant(t)} className="flex items-center gap-1.5 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline mt-1"><FileSpreadsheet size={12} /> View Ledger</button>
                              </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <p className="text-sm font-black text-slate-900">KES {(t.rentAmount || 0).toLocaleString()}</p>
                           <p className="text-[10px] font-black text-slate-400 uppercase">Deposit: KES {(t.depositHeld || 0).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-6">{getStatusBadge(t.computedStatus || 'Active', t.daysLate || 0)}</td>
                        <td className="px-8 py-6 text-right">
                           <div className="flex items-center justify-end gap-3">
                              <button 
                                onClick={() => handleSendConfirmation(t)}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm active:scale-90"
                                title="Send SMS/WA Confirmation"
                              >
                                <MessageSquare size={18} />
                              </button>
                              <button onClick={() => setBillingTenant(t)} className="px-5 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:border-emerald-600 transition-all">Request</button>
                              <button 
                                onClick={() => handleMarkAsPaid(t)}
                                disabled={paidTenantId === t.id}
                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase shadow-sm transition-all ${paidTenantId === t.id ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                              >
                                {paidTenantId === t.id ? 'Paid' : 'Mark Paid'}
                              </button>
                           </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs">No active tenants found.</td></tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Prospect Name</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit Interest</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress State</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Decision</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredLeads.length > 0 ? filteredLeads.map(lead => (
                        <tr key={lead.id} className="hover:bg-slate-50/30 transition-all">
                          <td className="px-8 py-6">
                            <p className="font-black text-slate-900 text-lg">{lead.name}</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{lead.phone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="text-sm font-black text-slate-900">Unit {lead.interestedUnit}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget: KES {lead.unitRent.toLocaleString()}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[9px] font-black uppercase tracking-widest rounded-full border border-amber-100">
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex items-center justify-end gap-3">
                                <button 
                                  onClick={() => {
                                    const msg = `Hello ${lead.name}, thank you for your interest in Unit ${lead.interestedUnit}. Please let us know when you'd like to proceed with the next steps. Regards, Zenflow.`;
                                    window.location.href = `sms:${lead.phone}?body=${encodeURIComponent(msg)}`;
                                  }}
                                  className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm active:scale-90"
                                  title="Send SMS"
                                >
                                  <MessageSquare size={18} />
                                </button>
                                <button 
                                  onClick={() => {
                                    const mockTenant: any = {
                                      id: lead.id,
                                      name: lead.name,
                                      unit: lead.interestedUnit,
                                      rentAmount: lead.unitRent,
                                      phone: lead.phone,
                                      status: 'Prospectus'
                                    };
                                    setBillingTenant(mockTenant);
                                  }} 
                                  className="px-5 py-2.5 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:border-emerald-600 transition-all"
                                >
                                  Request
                                </button>
                                <button 
                                  onClick={() => handleApproveProspect(lead)}
                                  className="px-6 py-2.5 bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
                                >
                                   <Check size={14} strokeWidth={3} /> Approve
                                </button>
                             </div>
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} className="px-8 py-20 text-center text-slate-400 font-bold uppercase text-xs">No prospects in queue.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden z-[510] flex flex-col">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <UserPlus size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Manual Onboard</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instant Activation</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSaveNewTenant} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 px-1">Full Name</label>
                   <input name="name" required placeholder="Legal Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 px-1">Phone Number</label>
                   <input name="phone" required placeholder="254..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 px-1">Unit Number</label>
                      <input name="unit" required placeholder="e.g. A1" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500 uppercase" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 px-1">Monthly Rent (KES)</label>
                      <input name="rentAmount" type="number" required placeholder="0.00" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-emerald-600 outline-none focus:border-emerald-500" />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 px-1">Lease Start Date</label>
                   <div className="relative">
                      <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input name="leaseStart" type="date" required className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold outline-none focus:border-emerald-500" />
                   </div>
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest text-sm mt-4">
                   Submit & Activate
                </button>
              </form>
            </motion.div>
          </div>
        )}

        {receiptEntry && <ReceiptModal tenant={receiptEntry.tenant} entry={receiptEntry.entry} onClose={() => setReceiptEntry(null)} />}
        {showReceiptConfirm && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowReceiptConfirm(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 text-center z-[610]">
                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 size={48} /></div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Recorded</h3>
                <p className="text-slate-500 font-medium mb-8">Generate and send an official receipt to {showReceiptConfirm.name}?</p>
                <div className="space-y-3">
                   <button onClick={() => { const ledger = showReceiptConfirm.ledger || []; const lastEntry = ledger[ledger.length - 1]; if(lastEntry) setReceiptEntry({tenant: showReceiptConfirm, entry: lastEntry}); setShowReceiptConfirm(null); }} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"><Download size={16} /> Get Receipt</button>
                   <button onClick={() => setShowReceiptConfirm(null)} className="w-full py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs">Not Now</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {billingTenant && <BillingModal isOpen={!!billingTenant} tenant={billingTenant} onClose={() => setBillingTenant(null)} />}
      {viewingTenant && <TenantProfileModal tenant={viewingTenant} onClose={() => setViewingTenant(null)} onOpenSupport={onOpenSupport} onContextUpdate={onContextUpdate} />}
    </div>
  );
};

export default Tenants;
