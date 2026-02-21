
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, ArrowLeft, CheckCircle2, User, Briefcase, Hash, FileText, Send, Loader2, MapPin, ShieldCheck, Upload } from 'lucide-react';
import { ProviderApplication } from '../types';

interface JoinNetworkProps {
  providerApps: ProviderApplication[];
  setProviderApps: React.Dispatch<React.SetStateAction<ProviderApplication[]>>;
}

const JoinNetwork: React.FC<JoinNetworkProps> = ({ providerApps, setProviderApps }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newApp: ProviderApplication = {
      id: `app-${Date.now()}`,
      name: formData.get('name') as string,
      skill: formData.get('skill') as string,
      idNumber: formData.get('idNumber') as string,
      kraPin: formData.get('kraPin') as string,
      location: formData.get('location') as string,
      phone: formData.get('phone') as string,
      bio: formData.get('bio') as string,
      status: 'Pending',
      appliedAt: new Date().toISOString()
    };

    setProviderApps(prev => [newApp, ...prev]);
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
            <p className="text-slate-500 text-lg leading-relaxed mb-10">Your application has been sent to the Property Manager. You will be notified once you are vetted and approved.</p>
            <button 
              onClick={() => navigate('/')}
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
            >
              Back to Home
            </button>
         </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 h-[73px] flex items-center">
        <div className="max-w-4xl mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Zap size={20} fill="white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900">ZenFlow <span className="text-blue-600">Pros</span></span>
          </div>
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-black uppercase text-slate-400 hover:text-slate-900">
            <ArrowLeft size={18} /> Back
          </button>
        </div>
      </nav>

      <div className="pt-[110px] max-w-2xl mx-auto px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-xl space-y-10">
          <div className="text-center">
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">Become a Verified Provider</h1>
             <p className="text-slate-500 font-medium mt-2">Join our property service network to receive job alerts and manage repairs.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Business or Individual Name</label>
              <div className="relative">
                 <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                 <input name="name" required placeholder="Legal Name" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none text-lg" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Primary Trade</label>
                <div className="relative">
                   <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <select name="skill" required className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none appearance-none text-lg cursor-pointer">
                      <option value="Plumber">Plumber 🪠</option>
                      <option value="Electrician">Electrician ⚡</option>
                      <option value="Carpenter">Carpenter 🔨</option>
                      <option value="Painter">Painter 🎨</option>
                      <option value="Cleaning">Cleaning 🧹</option>
                      <option value="General Handyman">General Handyman 🛠️</option>
                   </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">KRA PIN Number</label>
                <div className="relative">
                   <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input name="kraPin" required placeholder="A00..." className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none uppercase text-lg" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Operating Area / Location</label>
                  <div className="relative">
                     <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input name="location" required placeholder="e.g. Westlands, Kilimani" className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none text-lg" />
                  </div>
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Phone Number (M-Pesa)</label>
                  <input name="phone" required placeholder="2547..." className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none text-lg" />
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Work Experience & Bio</label>
              <textarea name="bio" required rows={4} placeholder="Describe your previous projects and years in the trade..." className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-blue-500 outline-none transition-all resize-none text-lg" />
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Portfolio / ID Documents</label>
               <div className="border-4 border-dashed border-slate-100 rounded-[2rem] p-12 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Upload className="text-slate-300 group-hover:text-blue-600 transition-colors" size={48} />
                  <div className="text-center">
                     <p className="font-bold text-slate-400">Click to upload photos or PDF</p>
                     <p className="text-[10px] font-black uppercase text-slate-300 mt-1">Previous work, certificates, or ID copies</p>
                  </div>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-6 bg-blue-600 text-white font-black rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-base mt-4"
            >
              {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> Processing...</> : <><ShieldCheck size={24} /> Submit Application</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinNetwork;
