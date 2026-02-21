
import React, { useState } from 'react';
/* Added missing XCircle, ChevronRight, and Loader2 icons to the lucide-react import list */
import { 
  Building2, MapPin, Smartphone, User, Briefcase, 
  Wallet, Camera, FileUp, Send, ArrowLeft, CheckCircle2, 
  Home, Zap, ShieldCheck, XCircle, ChevronRight, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lead, Property } from '../types';

interface PublicApplyProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  properties: Property[];
}

const PublicApply: React.FC<PublicApplyProps> = ({ leads, setLeads, properties }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Simulate upload and processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newLead: Lead = {
      id: `l-pub-${Date.now()}`,
      name: formData.get('name') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      idNumber: formData.get('idNumber') as string,
      interestedProperty: formData.get('property') as string,
      interestedUnit: 'Pending',
      source: 'Website',
      status: 'Interested',
      unitType: 'Residential',
      unitRent: 0,
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [newLead, ...prev]);
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
         <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[4rem] p-12 md:p-20 max-w-xl shadow-2xl">
            <div className="w-24 h-24 bg-emerald-500 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-emerald-200 animate-bounce">
               <CheckCircle2 size={56} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Application Sent!</h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-10">Our property manager has received your documents. We will contact you via SMS within 24 hours.</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
            >
              Exit Portal
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 h-[73px] flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-xl text-white">
              <Zap size={20} fill="white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">ZenFlow <span className="text-emerald-600">Apply</span></span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-rose-600 transition-all"
          >
            <XCircle size={18} /> Exit Form
          </button>
        </div>
      </nav>

      <div className="pt-[110px] max-w-2xl mx-auto px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl space-y-10">
          <div className="text-center">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenancy Application</h1>
             <p className="text-slate-500 font-medium mt-2">Secure your unit in minutes.</p>
             
             {/* Progress Bar */}
             <div className="mt-8 flex gap-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= i ? 'bg-emerald-600' : 'bg-slate-100'}`} />
                ))}
             </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {step === 1 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Full Name (As per ID)</label>
                  <div className="relative">
                     <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input name="name" required placeholder="John Doe Kamau" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Phone Number</label>
                      <input name="phone" required placeholder="2547..." className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-emerald-500 outline-none" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">ID Number</label>
                      <input name="idNumber" required placeholder="National ID" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-emerald-500 outline-none" />
                   </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Target Building</label>
                  <select name="property" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none">
                     {properties.map(p => (
                       <option key={p.id} value={p.name}>{p.name} ({p.location})</option>
                     ))}
                  </select>
                </div>
                <button type="button" onClick={() => setStep(2)} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
                  Next: Financial Verification <ChevronRight size={18} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Current Employer</label>
                  <div className="relative">
                     <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input name="employer" required placeholder="Company Name" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-emerald-500 outline-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Net Monthly Income (KES)</label>
                  <div className="relative">
                     <Wallet className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input name="income" type="number" required placeholder="0.00" className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-emerald-600 focus:border-emerald-500 outline-none text-xl" />
                  </div>
                </div>
                <div className="flex gap-4">
                   <button type="button" onClick={() => setStep(1)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-xs">Back</button>
                   <button type="button" onClick={() => setStep(3)} className="flex-[2] py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest text-xs">Next: Documents</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Upload National ID (Front & Back)</p>
                      <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all">
                         <Camera className="text-slate-300 group-hover:text-emerald-600 transition-colors" size={40} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Click to Snap or Upload</span>
                      </div>
                   </div>
                   <div className="space-y-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Upload 3-Month Bank Statement</p>
                      <div className="border-4 border-dashed border-slate-50 rounded-[2rem] p-10 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/20 transition-all">
                         <FileUp className="text-slate-300 group-hover:text-emerald-600 transition-colors" size={40} />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">PDF or Clear Images Only</span>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-emerald-50 rounded-[2rem] flex items-start gap-4 border border-emerald-100">
                   <ShieldCheck className="text-emerald-600 shrink-0" size={24} />
                   <p className="text-xs font-medium text-emerald-900 leading-relaxed">
                      By submitting, you agree to ZenFlow's Privacy Policy. We use bank-level encryption to secure your sensitive documents during review.
                   </p>
                </div>

                <div className="flex gap-4">
                   <button type="button" onClick={() => setStep(2)} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-xs">Back</button>
                   <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="flex-[3] py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                   >
                     {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> Processing...</> : <><Send size={24} /> Submit Application</>}
                   </button>
                </div>
              </div>
            )}
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicApply;
