
import React, { useState } from 'react';
import { X, User, FileText, Landmark, Clock, Calendar, ShieldCheck, Download, Trash2, Plus, ArrowUpRight, Zap } from 'lucide-react';
import { Tenant, TenantDocument } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import GenerateLeaseModal from './GenerateLeaseModal';

interface TenantProfileModalProps {
  tenant: Tenant | null;
  onClose: () => void;
}

const TenantProfileModal: React.FC<TenantProfileModalProps> = ({ tenant, onClose }) => {
  const [activeTab, setActiveTab] = useState<'lease' | 'billing'>('lease');
  const [showGenerator, setShowGenerator] = useState(false);

  if (!tenant) return null;

  // Mock document history
  const documents: TenantDocument[] = tenant.documents || [
    { id: 'd1', name: 'Lease_Agreement_2024.pdf', type: 'Lease', date: 'Mar 1, 2024', size: '1.2 MB' },
    { id: 'd2', name: 'KRA_PIN_Copy.pdf', type: 'ID', date: 'Feb 15, 2024', size: '450 KB' },
  ];

  const billingHistory = [
    { id: 'b1', month: 'March 2024', amount: tenant.amount, status: 'Paid', date: 'Mar 5, 2024' },
    { id: 'b2', month: 'February 2024', amount: tenant.amount, status: 'Paid', date: 'Feb 4, 2024' },
    { id: 'b3', month: 'January 2024', amount: tenant.amount, status: 'Paid', date: 'Jan 6, 2024' },
  ];

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in" onClick={onClose} />
        
        <div className="relative bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl flex flex-col md:flex-row overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
          {/* Sidebar / Profile Summary */}
          <div className="w-full md:w-80 bg-slate-50 p-8 border-r border-slate-100 flex flex-col">
            <button onClick={onClose} className="md:hidden absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400">
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl font-black text-emerald-600 mb-6 border border-slate-100">
                {tenant.name.charAt(0)}
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{tenant.name}</h3>
              <p className="text-slate-500 font-bold text-sm">Unit {tenant.unit} • {tenant.phone}</p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rent Status</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                    tenant.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>{tenant.status}</span>
                  <span className="font-black text-slate-900">KES {tenant.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lease Expiry</p>
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Calendar size={14} className="text-slate-400" />
                  {new Date(tenant.leaseExpiryDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <button className="mt-auto w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95">
              Edit Details <ArrowUpRight size={18} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-[80vh] md:h-auto">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex gap-1 p-1 bg-slate-50 rounded-2xl border border-slate-100">
                <button 
                  onClick={() => setActiveTab('lease')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'lease' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Lease & Docs
                </button>
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'billing' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Billing History
                </button>
              </div>
              <button onClick={onClose} className="hidden md:block p-2 text-slate-300 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'lease' ? (
                  <motion.div 
                    key="lease"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Lease Agreement</h4>
                      <button 
                        onClick={() => setShowGenerator(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-emerald-100 transition-all border border-emerald-100"
                      >
                        <Zap size={14} className="fill-emerald-600" />
                        Generate Lease
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Upload Slot */}
                      <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 group-hover:bg-white transition-all mb-3">
                          <Plus size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 group-hover:text-emerald-700">Upload New File</p>
                      </div>

                      {/* PDF Preview Slot */}
                      <div className="bg-slate-900 rounded-3xl p-6 flex flex-col justify-between text-white relative overflow-hidden group shadow-xl">
                        <div className="relative z-10">
                          <FileText size={32} className="text-emerald-400 mb-4" />
                          <h5 className="font-black text-lg leading-tight">Current Lease</h5>
                          <p className="text-xs text-slate-400 font-bold">Expires: {new Date(tenant.leaseExpiryDate).toLocaleDateString()}</p>
                        </div>
                        <div className="mt-6 flex gap-2 relative z-10">
                          <button className="flex-1 py-2.5 bg-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">Preview</button>
                          <button className="p-2.5 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Download size={14} /></button>
                        </div>
                        <FileText size={120} className="absolute -right-8 -bottom-8 text-white/5 rotate-12" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Other Documents</h5>
                      <div className="space-y-2">
                        {documents.map((doc) => (
                          <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 group transition-all">
                            <div className="flex items-center gap-4">
                              <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                                <FileText size={18} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 leading-none mb-1">{doc.name}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.date} • {doc.size}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg"><Download size={16} /></button>
                              <button className="p-2 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xl font-black text-slate-900 tracking-tight">Invoice History</h4>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                        <ShieldCheck size={12} /> Verified Payments
                      </div>
                    </div>

                    <div className="space-y-4">
                      {billingHistory.map((bill) => (
                        <div key={bill.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-lg hover:shadow-slate-50 transition-all group">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                              <Landmark size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-none mb-1">{bill.month}</p>
                              <p className="text-xs text-slate-500 font-medium">Processed on {bill.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-8">
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-900">KES {bill.amount.toLocaleString()}</p>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Success</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                              <Download size={14} /> PDF
                            </button>
                          </div>
                        </div>
                      ))}
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
