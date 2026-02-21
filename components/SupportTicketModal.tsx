
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LifeBuoy, Send, CheckCircle2, Loader2, Smartphone, Hash } from 'lucide-react';
import { SupportIssueType, Tenant } from '../types';

interface SupportTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: SupportIssueType, code: string, description: string }) => void;
  prefill?: { name?: string, ref?: string };
  tenants: Tenant[];
}

const SupportTicketModal: React.FC<SupportTicketModalProps> = ({ isOpen, onClose, onSubmit, prefill }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [issueType, setIssueType] = useState<SupportIssueType>('Payment not reflecting');
  const [code, setCode] = useState(prefill?.ref || '');
  const [description, setDescription] = useState(prefill?.name ? `Inquiry regarding payment for ${prefill.name}. ` : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    onSubmit({ type: issueType, code, description });
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center">
                    <CheckCircle2 size={40} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Ticket Received</h3>
                <p className="text-slate-500 font-medium">Our Nairobi support team will resolve this shortly.</p>
              </div>
            ) : (
              <>
                <div className="bg-[#74B72E] p-8 text-white relative overflow-hidden shrink-0">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <LifeBuoy size={24} />
                      <h3 className="text-2xl font-black tracking-tight">Support Desk</h3>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Direct line to M-Pesa Experts</p>
                  </div>
                  <LifeBuoy size={120} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
                  <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-10 space-y-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Issue Category</label>
                      <select 
                        value={issueType}
                        onChange={(e) => setIssueType(e.target.value as SupportIssueType)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:border-[#74B72E] outline-none transition-all appearance-none"
                      >
                        <option>Payment not reflecting</option>
                        <option>STK Push failed</option>
                        <option>Wrong Amount</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Transaction Ref</label>
                      <input 
                        type="text"
                        placeholder="e.g. RFV8899JK"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:border-[#74B72E] outline-none transition-all uppercase"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Details</label>
                      <textarea 
                        rows={3}
                        placeholder="Describe your issue..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-900 focus:border-[#74B72E] outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button type="button" onClick={onClose} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">Cancel</button>
                      <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-[#74B72E] text-white font-black rounded-2xl shadow-xl hover:bg-[#66a128] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><Send size={16} /> Submit Ticket</>}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SupportTicketModal;
