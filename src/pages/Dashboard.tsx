
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar, 
  Wallet, 
  Landmark, 
  Bell, 
  AlertCircle,
  ChevronRight,
  Clock,
  PieChart
} from 'lucide-react';
import { MetricCardProps } from '../types';
import RevenueChart from '../components/RevenueChart';
import AIFinancialInsight from '../components/AIFinancialInsight';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionProgress: React.FC<{ collected: number, total: number }> = ({ collected, total }) => {
  const percentage = Math.round((collected / total) * 100);
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6 group">
      <div className="relative flex items-center justify-center">
        <svg className="w-24 h-24 transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
          <motion.circle 
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={circumference} className="text-emerald-600" />
        </svg>
        <span className="absolute text-lg font-black text-slate-900 tracking-tighter">{percentage}%</span>
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Collection Progress</p>
        <h3 className="text-xl font-black text-slate-900">KES {(collected / 1000000).toFixed(2)}M</h3>
        <p className="text-xs font-bold text-slate-500">of KES {(total / 1000000).toFixed(2)}M expected</p>
      </div>
    </div>
  );
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon, variant = 'emerald' }) => {
  const variantClasses = {
    emerald: 'text-emerald-600 bg-emerald-50 group-hover:bg-emerald-600',
    rose: 'text-rose-600 bg-rose-50 group-hover:bg-rose-600',
    slate: 'text-slate-900 bg-slate-50 group-hover:bg-slate-900',
  };

  const trendClasses = trend?.startsWith('+') 
    ? 'bg-emerald-100 text-emerald-700' 
    : 'bg-rose-100 text-rose-700';

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl group-hover:text-white transition-colors duration-300 ${variantClasses[variant]}`}>
          {icon}
        </div>
        {trend && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${trendClasses}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [showAlerts, setShowAlerts] = useState(true);

  const criticalAlerts = [
    { id: 1, message: "James Kamau (A1) is 3 days overdue.", type: "rent" },
    { id: 2, message: "Lease for Sarah Hassan (B4) expires in 45 days.", type: "lease" },
    { id: 3, message: "Emergency Repair: Leaking Sink in A1 needs assignment.", type: "maintenance" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Portfolio Overview</h1>
          <p className="text-slate-500 font-medium">Welcome back. Your properties are performing at 94% capacity.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group mr-2">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
            <Calendar size={16} />
            March 2024
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 rounded-xl text-sm font-bold text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95">
            Export Report
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAlerts && (
          <motion.section 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 relative group">
                <div className="mt-0.5 bg-white p-1.5 rounded-lg text-rose-500 shadow-sm">
                  <AlertCircle size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-rose-900 leading-tight pr-4">{alert.message}</p>
                  <button className="mt-1 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-800 transition-colors flex items-center gap-1">
                    Take Action <ChevronRight size={10} />
                  </button>
                </div>
              </div>
            ))}
          </motion.section>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <CollectionProgress collected={1240000} total={1325000} />
        <MetricCard 
          title="Net Income" 
          value="KES 1,059,500" 
          trend="+14.1%" 
          icon={<Landmark size={24} />} 
          variant="slate"
        />
        <MetricCard 
          title="Total Expenses" 
          value="KES 180,500" 
          trend="+8.2%" 
          icon={<Wallet size={24} />} 
          variant="rose"
        />
        <MetricCard 
          title="Occupancy Rate" 
          value="94.2%" 
          trend="+2.1%" 
          icon={<Users size={24} />} 
          variant="emerald"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm min-h-[320px] flex flex-col">
          <RevenueChart />
        </div>
        <div className="lg:col-span-2">
          <AIFinancialInsight />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Activity Feed</h3>
            <button className="text-xs font-black text-emerald-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="space-y-6">
            {[
              { type: 'payment', user: 'Moses Otieno', detail: 'Paid KES 18,500 via M-Pesa', time: '2 hours ago', icon: CheckCircleIcon },
              { type: 'alert', user: 'James Kamau', detail: 'Automatic SMS Reminder Sent', time: '5 hours ago', icon: ClockIcon },
              { type: 'expense', user: 'Utility Payment', detail: 'KES 4,200 Electricity (Common Area)', time: 'Yesterday', icon: WalletIcon },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    activity.type === 'payment' ? 'bg-emerald-50 text-emerald-600' : 
                    activity.type === 'alert' ? 'bg-amber-50 text-amber-600' : 
                    'bg-rose-50 text-rose-600'
                  }`}>
                    <activity.icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{activity.user}</p>
                    <p className="text-sm text-slate-500 font-medium">{activity.detail}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-slate-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-900/50">
              <Activity size={24} />
            </div>
            <h3 className="text-2xl font-black mb-3 tracking-tight leading-tight">M-Pesa Business Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Need to integrate a new Paybill or Till number? Our local Nairobi team is online 24/7.
            </p>
          </div>
          <button className="relative z-10 w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-900/20">
            Open Support Ticket
          </button>
          <Activity size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};

// Internal icons for activity feed
const CheckCircleIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const ClockIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const WalletIcon = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>;

export default Dashboard;
