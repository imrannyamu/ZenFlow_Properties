
import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { Tenant } from '../types';

interface ReceiptModalProps {
  tenant: Tenant | null;
  onClose: () => void;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({ tenant, onClose }) => {
  if (!tenant) return null;

  const receiptNumber = `ZNF-${Math.floor(100000 + Math.random() * 900000)}`;
  const date = new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest">Payment Receipt</h3>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><Printer size={18} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors"><Download size={18} /></button>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-colors"><X size={20} /></button>
          </div>
        </div>

        <div className="p-10 space-y-8 bg-white" id="receipt-content">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-2 rounded-xl text-white">
                <Zap size={24} fill="white" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight text-slate-900">ZenFlow</span>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Properties Management</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Receipt No.</p>
              <p className="text-lg font-black text-emerald-600">{receiptNumber}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8 border-y border-slate-100">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Received From</p>
              <p className="text-xl font-bold text-slate-900">{tenant.name}</p>
              <p className="text-sm text-slate-500 font-medium">{tenant.phone}</p>
              <p className="text-sm text-slate-500 font-medium">Unit: {tenant.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Date of Issue</p>
              <p className="text-xl font-bold text-slate-900">{date}</p>
              <p className="text-sm text-slate-500 font-medium">Status: <span className="text-emerald-600 font-black uppercase">Confirmed</span></p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Transaction Details</p>
            <div className="bg-slate-50 rounded-2xl p-6 space-y-3">
              <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                <span>Monthly Rent (March 2024)</span>
                <span>KES {tenant.amount.toLocaleString()}</span>
              </div>
              {tenant.lateFees > 0 && (
                <div className="flex justify-between items-center text-sm font-medium text-rose-600">
                  <span>Late Penalty Fee</span>
                  <span>KES {tenant.lateFees.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                <span className="text-lg font-black text-slate-900">Total Paid</span>
                <span className="text-2xl font-black text-emerald-600">KES {(tenant.amount + tenant.lateFees).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 rounded-2xl border-2 border-emerald-50 bg-emerald-50/20">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-full text-white">
                <ShieldCheck size={16} />
              </div>
              <p className="text-xs font-bold text-emerald-800">Verified via M-Pesa Business API</p>
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Electronic Receipt</p>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-slate-400 font-medium italic">Thank you for choosing ZenFlow Properties. For queries, contact support@zenflow.co.ke</p>
          </div>
        </div>

        <div className="p-6 bg-slate-900 flex justify-center">
          <button onClick={onClose} className="px-12 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition-all">
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;
