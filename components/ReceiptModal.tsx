
import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Zap, QrCode } from 'lucide-react';
import { Tenant, LedgerEntry } from '../types';
import { motion } from 'framer-motion';

interface ReceiptModalProps {
  tenant: Tenant | null;
  entry: LedgerEntry | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ tenant, entry, onClose }) => {
  if (!tenant || !entry) return null;

  const receiptNumber = entry.id.replace('l-', '').toUpperCase();
  const dateStr = new Date(entry.date).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="relative bg-white w-full max-w-xl rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 my-auto"
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Official Payment Receipt</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><Printer size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><Download size={18} /></button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="p-10 space-y-10 bg-white relative overflow-hidden font-sans">
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-25deg]">
             <span className="text-8xl font-black uppercase whitespace-nowrap">Zenflow Verified</span>
          </div>

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2.5 rounded-xl text-amber-400 shadow-lg">
                <Zap size={24} fill="currentColor" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter text-slate-900">ZenFlow</span>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Premium Management</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
              <p className="text-lg font-black text-slate-900 font-mono tracking-tighter">#{receiptNumber}</p>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-8 py-8 border-y border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tenant Details</p>
              <p className="text-lg font-black text-slate-900">{tenant.name}</p>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Unit {tenant.unit}</p>
              <p className="text-xs text-slate-500 font-medium">{tenant.phone}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Date of Payment</p>
              <p className="text-lg font-black text-slate-900">{dateStr}</p>
              <p className="text-xs text-emerald-600 font-black uppercase tracking-widest flex items-center justify-end gap-1.5">
                <CheckCircle2 size={12} /> Status: Confirmed
              </p>
            </div>
          </div>

          <div className="relative z-10 space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Audit</p>
            <div className="bg-slate-50 rounded-3xl p-8 space-y-6 border border-slate-100">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Description</span>
                <span className="text-sm font-black text-slate-900">{entry.description}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Amount Paid</span>
                <span className="text-xl font-black text-emerald-600">KES {entry.amount.toLocaleString()}</span>
              </div>
              <div className="pt-6 border-t border-slate-200 flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Balance Remaining</span>
                <span className={`text-lg font-black ${entry.balance > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                  KES {entry.balance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 pt-4">
            <div className="flex flex-col items-center gap-2">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner group">
                  <QrCode size={64} className="text-slate-900 opacity-80 group-hover:opacity-100 transition-opacity" />
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Verify Transaction</p>
            </div>
            <div className="flex items-center gap-3 px-6 py-2.5 bg-slate-900 text-amber-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-xl">
               <ShieldCheck size={14} /> Zenflow Authenticated Secure Receipt
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center">
          <button 
            onClick={onClose} 
            className="px-12 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg text-xs uppercase tracking-widest"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReceiptModal;
