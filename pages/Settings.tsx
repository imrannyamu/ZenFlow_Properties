
import React, { useState, useEffect } from 'react';
/* Added missing Calendar icon to the lucide-react import list */
import { User, CreditCard, Bell, Shield, Smartphone, Zap, CheckCircle2, ExternalLink, Scale, Landmark, Sparkles, ShieldCheck, Mail, Zap as ZapIcon, Building2, Camera, MapPin, Phone, Edit2, AlertCircle, Users as UsersIcon, LayoutPanelLeft, BarChart3, LifeBuoy, Clock, Settings2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../config/constants';

interface SettingsProps {
  isFounder: boolean;
  isNewUser: boolean;
  userEmail: string;
}

const Settings: React.FC<SettingsProps> = ({ isFounder, isNewUser, userEmail }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'profile' | 'automations' | 'subscription') || 'profile';
  
  const [activeTab, setActiveTab] = useState<'profile' | 'automations' | 'subscription'>(initialTab);
  const [isEditing, setIsEditing] = useState(isNewUser && !isFounder);
  
  const [automations, setAutomations] = useState(() => {
    const saved = localStorage.getItem('zenflow_automations');
    return saved ? JSON.parse(saved) : {
      sendSmsReminder: true,
      alertOnLateRent: true,
      sendLeaseExpiryNotice: true,
      lateFeeAmount: 500,
      gracePeriod: 2,
      dueDate: 5,
      feeType: 'Flat Fee',
      paybillNumber: '400400',
      accountReference: 'TENANT-ID'
    };
  });

  const [profileData, setProfileData] = useState({
    businessName: isFounder ? 'ZenFlow Founder HQ' : (isNewUser ? '' : 'Property Manager Admin'),
    phone: isFounder ? '254700000000' : (isNewUser ? '' : '254712345678'),
    location: isFounder ? 'ZenFlow Towers, Nairobi' : (isNewUser ? '' : 'Nairobi, Kenya'),
  });

  useEffect(() => {
    localStorage.setItem('zenflow_automations', JSON.stringify(automations));
  }, [automations]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'subscription') setActiveTab('subscription');
    else if (tabParam === 'automations') setActiveTab('automations');
    else setActiveTab('profile');
  }, [searchParams]);

  const toggleAutomation = (key: keyof typeof automations) => {
    if (typeof automations[key] === 'boolean') {
      setAutomations(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const updateField = (key: string, val: any) => {
    setAutomations(prev => ({ ...prev, [key]: val }));
  };

  const setTab = (tab: 'profile' | 'automations' | 'subscription') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">System Settings</h1>
          <p className="text-slate-500 font-medium">Manage your profile and platform preferences.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start overflow-x-auto max-w-full no-scrollbar">
          <button 
            onClick={() => setTab('profile')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'profile' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Profile
            {isNewUser && !isFounder && (
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
            )}
          </button>
          <button 
            onClick={() => setTab('automations')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'automations' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Zap size={16} />
            Automations
          </button>
          <button 
            onClick={() => setTab('subscription')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'subscription' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <CreditCard size={16} />
            Subscription
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 md:p-10 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-5">
                      <div className="relative group">
                        {isFounder ? (
                          <div className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center border-4 border-emerald-50 shadow-xl overflow-hidden">
                            <Zap size={40} fill="white" />
                          </div>
                        ) : (
                          <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200 group-hover:border-emerald-500 group-hover:bg-emerald-50 transition-all cursor-pointer">
                            <Camera size={32} />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 text-white rounded-xl shadow-lg border-2 border-white">
                          <Edit2 size={12} strokeWidth={3} />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                          {isFounder ? 'Welcome Back, Founder' : (isNewUser ? 'Welcome to Zenflow' : 'Welcome Back')}
                        </h2>
                        <p className="text-sm font-medium text-slate-500">
                          {isFounder ? 'The ZenFlow ecosystem is under your control.' : (isNewUser ? 'Let\'s set up your business identity.' : 'Your global management profile.')}
                        </p>
                      </div>
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 bg-slate-100 text-slate-900 font-black rounded-xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit Profile
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Business / Full Name</label>
                      <div className="relative group">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                        <input 
                          type="text" 
                          readOnly={!isEditing}
                          value={profileData.businessName}
                          onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                          placeholder="e.g. Acme Properties"
                          className={`w-full pl-12 pr-4 py-4 border-2 rounded-[1.5rem] outline-none transition-all font-bold ${
                            isEditing 
                              ? 'bg-white border-slate-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 text-slate-900' 
                              : 'bg-slate-50/50 border-transparent text-slate-500 cursor-default'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
                        <input 
                          type="email" 
                          readOnly
                          value={userEmail} 
                          className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border-2 border-transparent rounded-[1.5rem] outline-none font-bold text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>
                  </div>

                  {isEditing && (
                    <div className="mt-10 flex gap-4">
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl hover:bg-slate-200 transition-all text-xs uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-[2] py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg text-sm uppercase tracking-widest"
                      >
                        Save Updates
                      </button>
                    </div>
                  )}

                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                    <User size={300} strokeWidth={1} />
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'automations' && (
              <motion.div
                key="automations"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* LATE FEE CONFIGURATION CARD */}
                <section className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden group">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl shadow-sm">
                      <Settings2 size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Late Fee Configuration</h2>
                      <p className="text-sm text-slate-500 font-medium">Automatic penalty enforcement rules.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Global Due Date (Day)</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="number"
                          min="1" max="31"
                          value={automations.dueDate}
                          onChange={(e) => updateField('dueDate', Number(e.target.value))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:border-rose-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Grace Period (Days)</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                          type="number"
                          min="0"
                          value={automations.gracePeriod}
                          onChange={(e) => updateField('gracePeriod', Number(e.target.value))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:border-rose-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Late Fee Amount (KES)</label>
                      <div className="relative">
                        < Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-600" size={18} />
                        <input 
                          type="number"
                          value={automations.lateFeeAmount}
                          onChange={(e) => updateField('lateFeeAmount', Number(e.target.value))}
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-rose-600 focus:border-rose-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Fee Enforcement Type</label>
                      <select 
                        value={automations.feeType}
                        onChange={(e) => updateField('feeType', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 focus:border-rose-500 outline-none transition-all appearance-none cursor-pointer"
                      >
                        <option value="Flat Fee">Flat Fee (Once Per Month)</option>
                        <option value="Daily Fee">Daily Fee (Until Balance Cleared)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                    <AlertCircle size={20} className="text-rose-500 shrink-0" />
                    <p className="text-[11px] font-bold text-rose-900 leading-relaxed">
                      Rule: If a unit has a balance &gt; 0 after Day {automations.dueDate + automations.gracePeriod} of the month, a KES {automations.lateFeeAmount} '{automations.feeType}' will be auto-posted to their ledger.
                    </p>
                  </div>
                  <Scale size={180} className="absolute -right-12 -bottom-12 text-slate-50/50 rotate-12 pointer-events-none group-hover:rotate-6 transition-transform duration-700" />
                </section>

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
                      { id: 'sendSmsReminder', title: 'Send SMS Reminder', desc: 'Auto-send payment links 2 days before due date.', enabled: automations.sendSmsReminder },
                      { id: 'alertOnLateRent', title: 'Late Rent Alerts', desc: 'Notify me immediately if rent is overdue.', enabled: automations.alertOnLateRent },
                      { id: 'sendLeaseExpiryNotice', title: 'Lease Expiry Notices', desc: 'Send renewal notice 1 month prior to expiry.', enabled: automations.sendLeaseExpiryNotice },
                    ].map((auto) => (
                      <div 
                        key={auto.id}
                        onClick={() => toggleAutomation(auto.id as any)}
                        className={`flex items-center justify-between p-6 rounded-[1.5rem] border transition-all cursor-pointer group ${
                          auto.enabled ? 'border-emerald-100 bg-emerald-50/30' : 'border-slate-100 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl transition-colors ${auto.enabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'}`}>
                            <Zap size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{auto.title}</p>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{auto.desc}</p>
                          </div>
                        </div>
                        <div className={`w-14 h-8 rounded-full relative transition-colors duration-300 flex items-center px-1 ${auto.enabled ? 'bg-emerald-600' : 'bg-slate-200'}`}>
                          <motion.div animate={{ x: auto.enabled ? 24 : 0 }} className="w-6 h-6 bg-white rounded-full shadow-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'subscription' && (
              <motion.div
                key="subscription"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-12 overflow-hidden relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 relative z-10">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Upgrade Your Portfolio</h2>
                      <p className="text-slate-500 font-medium">Unlock the full power of the ZenFlow financial engine.</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                       <Sparkles size={16} /> Active Trial: 28 Days Left
                    </div>
                  </div>
                  <div className="flex justify-center relative z-10 mb-12">
                    <motion.div whileHover={{ y: -5 }} className="w-full max-w-lg bg-white p-1 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(16,185,129,0.15)] border-2 border-emerald-50 relative ring-4 ring-emerald-500/5 group">
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-emerald-200 z-20">Most Popular</div>
                      <div className="p-10 bg-white rounded-[3.4rem] h-full flex flex-col">
                        <div className="mb-8">
                          <h3 className="text-2xl font-black text-slate-900 mb-2">{SUBSCRIPTION_PLANS[0].name}</h3>
                          <div className="flex items-baseline gap-1 mb-4">
                            <span className="text-slate-400 font-bold text-sm">{SUBSCRIPTION_PLANS[0].currency}</span>
                            <span className="text-5xl font-black tracking-tighter text-slate-900">{SUBSCRIPTION_PLANS[0].price.toLocaleString()}</span>
                            <span className="text-slate-400 font-bold text-sm">/{SUBSCRIPTION_PLANS[0].period}</span>
                          </div>
                        </div>
                        <div className="space-y-4 mb-10 flex-1">
                          {SUBSCRIPTION_PLANS[0].features.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0 shadow-sm"><CheckCircle2 size={12} strokeWidth={4} /></div>
                              <span className="font-bold text-slate-700 text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                        <button className="w-full py-5 bg-emerald-600 text-white font-black rounded-[2rem] shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-95 transition-all text-sm uppercase tracking-widest">Start Pro Subscription</button>
                      </div>
                    </motion.div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-emerald-500/5 blur-[120px] pointer-events-none" />
                </section>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <section className="bg-emerald-600 p-8 rounded-[2rem] text-white shadow-xl shadow-emerald-200 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">Subscription</h3>
              <div className="flex items-baseline gap-2 mb-6"><span className="text-4xl font-black tracking-tighter">Trial Mode</span></div>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-300" /><span className="text-sm font-bold uppercase tracking-widest text-[10px]">28 Days Remaining</span></div>
                <div className="flex items-center gap-3"><CheckCircle2 size={18} className="text-emerald-300" /><span className="text-sm font-bold uppercase tracking-widest text-[10px]">Full Financial Engine</span></div>
              </div>
              <button onClick={() => setTab('subscription')} className="w-full py-5 bg-white text-emerald-700 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg text-lg uppercase tracking-widest">Upgrade Now</button>
            </div>
            <div className="absolute -bottom-10 -right-10 opacity-10"><CreditCard size={180} /></div>
          </section>

          <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">Billing History <ExternalLink size={14} className="text-slate-400" /></h4>
            <div className="space-y-3"><p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.2em] text-center py-4">No previous invoices.</p></div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Settings;
