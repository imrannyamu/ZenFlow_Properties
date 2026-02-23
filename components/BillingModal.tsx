
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calculator, Droplets, ShieldCheck, Zap } from 'lucide-react';
import { Tenant } from '../types';
import { smsService } from '../services/smsService';
import { MPESA_CONFIG } from '../config/constants';

interface BillingModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
}

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, tenant, onClose }) => {
  const [water, setWater] = useState<number>(0);
  const [service, setService] = useState<number>(500);

  const total = useMemo(() => {
    if (!tenant) return 0;
    const rentAmount = Number(tenant.rentAmount) || 0;
    const waterAmount = Number(water) || 0;
    const serviceAmount = Number(service) || 0;
    return rentAmount + waterAmount + serviceAmount;
  }, [tenant, water, service]);

  if (!tenant) return null;

  const handleSendSMS = async () => {
    const now = new Date();
    const monthName = now.toLocaleString('en-KE', { month: 'long' });
    const year = now.getFullYear();
    
    const dueDate = new Date(now);
    dueDate.setDate(now.getDate() + 5); // Default 5 days from now
    const dueDateStr = dueDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const unitSafe = (tenant.unit || '').replace(/\s+/g, '');
    const account = `ZF-${unitSafe}`.toUpperCase();
    const generatedOn = now.toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

    // REQUIRES ENV VARIABLE (SMS API)
    const smsBody = smsService.formatBillingSMS({
      clientName: tenant.name || 'Client',
      unit: tenant.unit || 'N/A',
      account: account,
      month: monthName,
      year: year,
      rent: tenant.rentAmount || 0,
      water: water || 0,
      service: service || 0,
      total: total || 0,
      paybill: MPESA_CONFIG.PAYBILL,
      dueDate: dueDateStr,
      generatedOn: generatedOn
    });

    // TODO: Replace with backend API call for production
    // REQUIRES BACKEND API ROUTE
    await smsService.sendSMS(tenant.phone || '', smsBody);
    window.location.href = `sms:${tenant.phone}?body=${encodeURIComponent(smsBody)}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
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
            className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden z-[310]"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-lg">
                  <Zap size={20} fill="white" />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Billing Engine</h3>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={20} /></button>
            </div>

            <div className="p-8 space-y-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Invoicing Tenant</p>
                <p className="text-lg font-black text-slate-900">{tenant.name || 'Unnamed'}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Unit {tenant.unit || '---'} • {tenant.phone || 'No phone'}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Base Rent</label>
                     <div className="w-full px-5 py-3 bg-slate-50 border-2 border-slate-50 rounded-2xl font-black text-slate-900">
                        {(tenant.rentAmount || 0).toLocaleString()}
                     </div>
                   </div>
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Service Charge</label>
                     <input 
                       type="number" 
                       value={service} 
                       onChange={(e) => setService(Number(e.target.value) || 0)}
                       className="w-full px-5 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900 focus:border-emerald-500 outline-none transition-all" 
                     />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Water Bill (KES)</label>
                  <div className="relative">
                    <Droplets className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" size={18} />
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={water || ''}
                      onChange={(e) => setWater(Number(e.target.value) || 0)}
                      className="w-full pl-12 pr-6 py-4 bg-white border-2 border-slate-100 rounded-2xl font-black text-slate-900 focus:border-emerald-500 outline-none transition-all" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-black uppercase tracking-widest opacity-80">Total Due Today</span>
                  <Calculator size={16} className="opacity-80" />
                </div>
                <h4 className="text-4xl font-black tracking-tighter">KES {(total || 0).toLocaleString()}</h4>
              </div>

              <button 
                onClick={handleSendSMS}
                className="w-full py-5 bg-slate-900 text-white font-black rounded-[1.5rem] shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Send size={20} />
                SEND SMS
              </button>
              
              <div className="flex items-center justify-center gap-2 pt-2">
                <ShieldCheck size={14} className="text-slate-300" />
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Formal Billing Record Verified</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BillingModal;
