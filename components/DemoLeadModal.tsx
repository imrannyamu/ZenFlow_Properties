
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, User, Smartphone, Building2, MessageSquare, Zap } from 'lucide-react';

interface DemoLeadModalProps {
  onClose: () => void;
}

const DemoLeadModal: React.FC<DemoLeadModalProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    units: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Zenflow Team, I would like to schedule a demo.\nName: ${formData.name}\nPhone: ${formData.phone}\nPortfolio Size: ${formData.units} units.`;
    const whatsappUrl = `https://wa.me/254793710082?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  return (
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
        className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden z-10"
      >
        <div className="bg-emerald-600 p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Zap size={24} fill="white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Schedule Your Demo</h3>
            </div>
            <p className="text-emerald-50 text-sm font-medium">Join Nairobi's most efficient landlords.</p>
          </div>
          <Zap size={140} className="absolute -right-8 -bottom-8 text-white/10 rotate-12" />
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Your Full Name</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                required
                type="text"
                placeholder="e.g. Samuel Njenga"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Phone Number</label>
            <div className="relative group">
              <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                required
                type="tel"
                placeholder="254..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Portfolio Size (Units)</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                required
                type="number"
                placeholder="0"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold focus:border-emerald-500 outline-none transition-all"
                value={formData.units}
                onChange={(e) => setFormData({...formData, units: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 text-sm uppercase tracking-widest"
          >
            <MessageSquare size={18} />
            Connect via WhatsApp
          </button>
          
          <p className="text-[10px] font-bold text-slate-400 text-center uppercase tracking-widest">
            Expert response within 10 minutes.
          </p>
        </form>
      </motion.div>
    </div>
  );
};

export default DemoLeadModal;
