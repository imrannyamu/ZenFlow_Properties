
import React, { useState, useMemo } from 'react';
import { 
  X, User, FileText, Landmark, Clock, Calendar, 
  ShieldCheck, Download, Trash2, Plus, ArrowUpRight, 
  Zap, Receipt, History, CreditCard, Banknote, Smartphone,
  Shield, Camera, ImageIcon, AlertCircle
} from 'lucide-react';
import { Tenant, TenantDocument, Payment, LedgerEntry } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import GenerateLeaseModal from './GenerateLeaseModal';
import FinancialLedger from './FinancialLedger';

interface TenantProfileModalProps {
  tenant: Tenant | null;
  onClose: () => void;
  onOpenSupport: () => void;
  onContextUpdate: (ctx: { name?: string, ref?: string }) => void;
}

const TenantProfileModal: React.FC<TenantProfileModalProps> = ({ tenant, onClose, onOpenSupport, onContextUpdate }) => {
  const [activeTab, setActiveTab] = useState<'lease' | 'billing' | 'ledger'>('ledger');
  const [showGenerator, setShowGenerator] = useState(false);

  if (!tenant) return null;

  const documents: TenantDocument[] = tenant.documents || [
    { id: 'd1', name: 'Lease_Agreement_2024.pdf', type: 'Lease', date: 'Mar 1, 2024', size: '1.2 MB' },
    { id: 'd2', name: 'KRA_PIN_Copy.pdf', type: 'ID', date: 'Feb 15, 2024', size: '450 KB' },
  ];

  const paymentLog: Payment[] = tenant.payments && tenant.payments.length > 0 
    ? [...tenant.payments].reverse() 
    : [
        { id: 'm1', amount: 25000, month: 'January 2026', method: 'M-Pesa', reference: 'RFV8899JK', date: '2026-01-02' },
        { id: 'm2', amount: 25000, month: 'December 2025', method: 'Bank', reference: 'STK_6621', date: '2025-12-04' }
      ];

  // Derived Ledger based on tenant data
  const ledgerData: LedgerEntry[] = useMemo(() => {
    if (tenant.ledger && tenant.ledger.length > 0) return tenant.ledger;
    
    // Default Mock Ledger for demonstration if none exists
    const rent = tenant.rentAmount || 25000;
    return [
      { id: 'l1', date: '2026-02-01', description: 'Monthly Rent - February', type: 'DEBIT', amount: rent, balance: rent },
      { id: 'l2', date: '2026-02-04', description: 'M-Pesa Payment (Ref: ZF990K)', type: 'CREDIT', amount: rent, balance: 0 },
      { id: 'l3', date: '2026-01-01', description: 'Monthly Rent - January', type: 'DEBIT', amount: rent, balance: rent },
      { id: 'l4', date: '2026-01-02', description: 'Bank Transfer (Ref: TX-882)', type: 'CREDIT', amount: 20000, balance: 5000 },
      { id: 'l5', date: '2026-01-10', description: 'Late Payment Fee', type: 'DEBIT', amount: 500, balance: 5500 },
      { id: 'l6', date: '2026-01-12', description: 'Manual Payment (Cash)', type: 'CREDIT', amount: 5500, balance: 0 },
    ];
  }, [tenant]);

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />
        
        <div className="relative bg-white w-full max-w-6xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-8 duration-500 h-[95vh] sm:h-auto max-h-[95vh]">
          {/* Sidebar / Profile Summary */}
          <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100 flex flex-col overflow-y-auto shrink-0">
            <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-3xl font-black text-emerald-600 mb-6 border border-slate-100 ring-8 ring-emerald-50">
                {(tenant.name || '?').charAt(0)}
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">{tenant.name}</h3>
              <p className="text-slate-500 font-bold text-sm">Unit {tenant.unit} • {tenant.phone}</p>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Portfolio Metrics</p>
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Rent</span>
                      <span className="font-black text-slate-900">KES {tenant.rentAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">ID No.</span>
                      <span className="font-black text-slate-900">{tenant.idNumber}</span>
                   </div>
                </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Lease Duration</p>
                <div className="flex items-center gap-2 font-bold mb-4">
                  <Calendar size={14} className="text-emerald-500" />
                  {new Date(tenant.leaseStart).toLocaleDateString()} — {new Date(tenant.leaseEnd).toLocaleDateString()}
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-500 w-[70%]" />
                </div>
              </div>
            </div>

            <button className="mt-10 w-full py-5 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
              Edit Profile <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 shrink-0">
              <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar">
                <button 
                  onClick={() => setActiveTab('ledger')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'ledger' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <History size={16} />
                  Ledger Statement
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'billing' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <Receipt size={16} />
                  M-Pesa History
                </button>
                <button 
                  onClick={() => setActiveTab('lease')}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'lease' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <FileText size={16} />
                  Docs & Lease
                </button>
              </div>
              <button onClick={onClose} className="hidden md:block p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 sm:p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'ledger' && (
                  <motion.div 
                    key="ledger"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-10"
                  >
                    {/* DEPOSIT SHIELD SECTION */}
                    <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-8 text-white relative overflow-hidden shadow-2xl">
                       <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                          <div className="space-y-4">
                             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/20 text-amber-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-amber-500/30">
                                <Shield size={14} /> Deposit Liability Shield
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Held Security Deposit</p>
                                <h4 className="text-4xl font-black tracking-tighter text-amber-400">KES {(tenant.depositHeld || 0).toLocaleString()}</h4>
                             </div>
                             <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                                <AlertCircle size={14} className="text-amber-500" />
                                This is a liability (money held in trust).
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                             <div className="bg-white/5 border border-white/10 rounded-2xl p-4 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                   <Camera size={20} className="text-slate-400" />
                                   <span className="text-[8px] font-black uppercase text-slate-500">Move-in Log</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300">Condition Photos</p>
                                <p className="text-[9px] font-black text-emerald-400 uppercase mt-1">4 Verified Files</p>
                             </div>
                             <div className="bg-white/5 border border-white/10 rounded-2xl p-4 group cursor-pointer hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                   <ArrowUpRight size={20} className="text-slate-400" />
                                   <span className="text-[8px] font-black uppercase text-slate-500">Liability</span>
                                </div>
                                <p className="text-[10px] font-bold text-slate-300">Refund Status</p>
                                <p className="text-[9px] font-black text-amber-500 uppercase mt-1">Locked in Escrow</p>
                             </div>
                          </div>
                       </div>
                       <Shield size={240} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
                    </section>

                    <FinancialLedger entries={ledgerData} />
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                            <Receipt size={24} />
                         </div>
                         <h4 className="text-2xl font-black text-slate-900 tracking-tight">Financial History</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
                        <ShieldCheck size={14} /> Verified Accounting
                      </div>
                    </div>

                    <div className="space-y-4">
                      {paymentLog.map((payment) => (
                        <div key={payment.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-slate-50 border border-slate-100 rounded-[2rem] hover:bg-white hover:shadow-xl hover:shadow-slate-50 transition-all group">
                          <div className="flex items-center gap-4 mb-4 sm:mb-0">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                              {payment.method === 'M-Pesa' ? <Smartphone size={24} /> : payment.method === 'Bank' ? <Landmark size={24} /> : <Banknote size={24} />}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 text-lg leading-none mb-1">{payment.month}</p>
                              <div className="flex items-center gap-2 flex-wrap">
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{payment.method}</span>
                                 <span className="text-slate-300">•</span>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ref: {payment.reference}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-200">
                            <div className="sm:text-right">
                              <p className="text-xl font-black text-emerald-600">KES {payment.amount.toLocaleString()}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Paid on {new Date(payment.date).toLocaleDateString()}</p>
                            </div>
                            <button className="flex items-center gap-2 p-3 bg-white text-slate-400 hover:text-emerald-600 rounded-xl transition-all shadow-sm active:scale-95">
                              <Download size={20} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'lease' && (
                  <motion.div 
                    key="lease"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">Digital Vault</h4>
                      <button 
                        onClick={() => setShowGenerator(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100"
                      >
                        <Zap size={14} className="fill-emerald-600" />
                        Smart Lease Engine
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white transition-all mb-4">
                          <Plus size={32} />
                        </div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest group-hover:text-emerald-700">Drop files here</p>
                      </div>

                      <div className="bg-slate-900 rounded-[2.5rem] p-8 flex flex-col justify-between text-white relative overflow-hidden group shadow-2xl">
                        <div className="relative z-10">
                          <FileText size={40} className="text-emerald-400 mb-4" />
                          <h5 className="font-black text-xl leading-tight mb-1">Signed Lease</h5>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active until May 2026</p>
                        </div>
                        <div className="mt-8 flex gap-3 relative z-10">
                          <button className="flex-1 py-3.5 bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/40">Open Vault</button>
                          <button className="p-3.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Download size={18} /></button>
                        </div>
                        <ShieldCheck size={180} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Repository</h5>
                      <div className="space-y-3">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 group transition-all">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                <FileText size={20} />
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 leading-none mb-1">{doc.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.date} • {doc.size}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg"><Download size={18} /></button>
                              <button className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={18} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGenerator && (
          <GenerateLeaseModal 
            tenant={tenant} 
            onClose={() => setShowGenerator(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default TenantProfileModal;
