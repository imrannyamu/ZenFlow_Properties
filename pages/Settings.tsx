
import React, { useState } from 'react';
import { User, CreditCard, Bell, Shield, Smartphone, Zap, CheckCircle2, ExternalLink, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'automations'>('profile');
  const [automations, setAutomations] = useState({
    sendSmsReminder: true,
    alertOnLateRent: true,
    sendLeaseExpiryNotice: true,
    lateFeeAmount: 500,
  });

  const toggleAutomation = (key: keyof typeof automations) => {
    if (typeof automations[key] === 'boolean') {
      setAutomations(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const updateLateFee = (val: string) => {
    const num = parseInt(val) || 0;
    setAutomations(prev => ({ ...prev, lateFeeAmount: num }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile and platform preferences.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('automations')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'automations' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Zap size={16} />
            Automations
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' ? (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl">
                      <User size={24} />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">Manager Profile</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Full Name</label>
                      <input 
                        type="text" 
                        defaultValue="Property Manager Admin" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue="admin@zenflow.co.ke" 
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg">
                      Save Changes
                    </button>
                  </div>
                </section>

                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                  <h3 className="text-lg font-black mb-6 tracking-tight">System Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Bell, title: "Email Notifications", desc: "Receive weekly reports on collection status." },
                      { icon: Smartphone, title: "M-Pesa Alerts", desc: "Real-time push notifications for payments." },
                    ].map((pref, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-xl group-hover:text-emerald-600 transition-colors">
                            <pref.icon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 leading-none mb-1">{pref.title}</p>
                            <p className="text-xs text-slate-500 font-medium">{pref.desc}</p>
                          </div>
                        </div>
                        <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer">
                          <div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="automations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Workflow Automations</h2>
                      <p className="text-sm text-slate-500 font-medium">Streamline your collection process.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { 
                        id: 'sendSmsReminder', 
                        title: 'Send SMS Reminder', 
                        desc: 'Auto-send payment links 2 days before due date.',
                        enabled: automations.sendSmsReminder 
                      },
                      { 
                        id: 'alertOnLateRent', 
                        title: 'Late Rent Alerts', 
                        desc: 'Notify me immediately if rent is 3 days overdue.',
                        enabled: automations.alertOnLateRent 
                      },
                      { 
                        id: 'sendLeaseExpiryNotice', 
                        title: 'Lease Expiry Notices', 
                        desc: 'Send renewal notice 1 month prior to expiry.',
                        enabled: automations.sendLeaseExpiryNotice 
                      },
                    ].map((auto) => (
                      <div 
                        key={auto.id}
                        onClick={() => toggleAutomation(auto.id as any)}
                        className={`flex items-center justify-between p-6 rounded-[1.5rem] border transition-all cursor-pointer group ${
                          auto.enabled ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl transition-colors ${
                            auto.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
                          }`}>
                            <Zap size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{auto.title}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{auto.desc}</p>
                          </div>
                        </div>
                        
                        <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 flex items-center px-1 ${
                          auto.enabled ? 'bg-emerald-600' : 'bg-slate-200'
                        }`}>
                          <motion.div 
                            animate={{ x: auto.enabled ? 24 : 0 }}
                            className="w-6 h-6 bg-white rounded-full shadow-md"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 p-8 rounded-[2rem] border border-slate-100 bg-slate-50 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-900 text-white rounded-xl">
                        <Scale size={20} />
                      </div>
                      <h3 className="text-lg font-black text-slate-900 tracking-tight">Penalty Management</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Late Fee Amount (KES)</label>
                      <div className="flex gap-4">
                        <input 
                          type="number"
                          value={automations.lateFeeAmount}
                          onChange={(e) => updateLateFee(e.target.value)}
                          className="flex-1 px-5 py-4 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                        />
                        <button className="px-8 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all">
                          Update Policy
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-400 font-bold px-1">Applied automatically to tenants who are marked as 'Overdue'.</p>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <section className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Subscription</h3>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black tracking-tighter">Trial Mode</span>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">28 Days Remaining</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-300" />
                  <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Full Financial Engine</span>
                </div>
              </div>
              <button className="w-full py-5 bg-white text-emerald-700 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-lg uppercase tracking-widest">
                Upgrade Now
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <CreditCard size={180} />
            </div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
              Billing History <ExternalLink size={14} className="text-slate-400" />
            </h4>
            <div className="space-y-3">
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] text-center py-4">No previous invoices.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
