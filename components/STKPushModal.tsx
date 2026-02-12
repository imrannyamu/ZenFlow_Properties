
import React, { useState } from 'react';
import { X, Smartphone, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import { Tenant } from '../types';

interface STKPushModalProps {
  tenant: Tenant | null;
  onClose: () => void;
}

const STKPushModal: React.FC<STKPushModalProps> = ({ tenant, onClose }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!tenant) return null;

  const handleSendPush = () => {
    setStatus('loading');
    // Simulate API delay
    setTimeout(() => {
      setStatus('success');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-10 text-center">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-6 py-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-2xl rounded-full scale-150 animate-pulse" />
                <div className="relative bg-emerald-100 p-6 rounded-full text-emerald-600">
                  <CheckCircle2 size={64} />
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">STK Sent!</h3>
                <p className="text-slate-500 max-w-xs mx-auto">A payment prompt has been sent to <strong>{tenant.phone}</strong>. Tenant must enter their PIN to complete.</p>
              </div>
              <button 
                onClick={onClose}
                className="mt-4 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-transform"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-3">
                <div className="mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-[2rem] mb-4">
                  <Smartphone size={40} />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Request Rent</h3>
                <p className="text-slate-500">Initiate a secure M-Pesa STK Push</p>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-6 text-left border border-slate-100">
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Tenant</span>
                    <span className="text-slate-900 font-bold">{tenant.name}</span>
                  </div>
                  <div className="text-right flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Unit</span>
                    <span className="text-slate-900 font-bold">{tenant.unit}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 uppercase font-black tracking-widest">Amount Due</span>
                    <span className="text-emerald-600 text-3xl font-black">KES {tenant.amount.toLocaleString()}</span>
                  </div>
                  <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600">
                    <ShieldCheck size={24} />
                  </div>
                </div>
              </div>

              <button
                disabled={status === 'loading'}
                onClick={handleSendPush}
                className={`
                  w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg text-white transition-all shadow-xl shadow-emerald-100
                  ${status === 'loading' 
                    ? 'bg-slate-200 cursor-not-allowed text-slate-400' 
                    : 'bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.02] active:scale-95'}
                `}
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>Send M-Pesa STK Push</>
                )}
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                <ShieldCheck size={14} />
                Secured by Safaricom Daraja API
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default STKPushModal;
