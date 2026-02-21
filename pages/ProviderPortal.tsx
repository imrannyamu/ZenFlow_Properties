
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, Clock, CheckCircle2, Landmark, ChevronRight, Play, Check, Briefcase, History, TrendingUp, AlertTriangle } from 'lucide-react';
import { MaintenanceTicket, Notification } from '../types';

interface ProviderPortalProps {
  tickets: MaintenanceTicket[];
  setTickets: React.Dispatch<React.SetStateAction<MaintenanceTicket[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const ProviderPortal: React.FC<ProviderPortalProps> = ({ tickets, setTickets, setNotifications }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'payments'>('jobs');

  // Filter jobs for current provider (mock provider 'c1')
  const providerJobs = tickets.filter(t => t.contractorId === 'c1');
  const finishedJobs = providerJobs.filter(t => t.status === 'Completed');
  const openJobs = providerJobs.filter(t => t.status !== 'Completed');

  const updateJobStatus = (id: string, newStatus: MaintenanceTicket['status']) => {
    const job = tickets.find(t => t.id === id);
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    
    if (newStatus === 'Completed' && job) {
      setNotifications(prev => [{
        id: `n-${Date.now()}`,
        title: 'Job Finished',
        message: `Provider has finished: ${job.title} at Unit ${job.unit}. Please inspect and pay.`,
        type: 'maintenance',
        timestamp: new Date().toISOString(),
        isRead: false,
        link: `/maintenance?view=manager&highlight=${id}`
      }, ...prev]);
    }
  };

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {openJobs.length > 0 ? openJobs.map(job => (
          <motion.div key={job.id} layout className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6 group">
             <div className="flex justify-between items-start">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${job.priority === 'Emergency' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                   {job.status}
                </span>
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-400 uppercase">Deadline</p>
                   <p className="font-black text-rose-500 text-lg">{job.deadline || 'ASAP'}</p>
                </div>
             </div>

             <div className="space-y-2">
                <h4 className="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">{job.title}</h4>
                <p className="text-sm font-bold text-slate-500">Unit {job.unit} • {job.description}</p>
             </div>

             <div className="p-6 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-100">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase">Price Offered</p>
                   <p className="text-2xl font-black text-slate-900">KES {(job.priceOffered || 0).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                   {job.status === 'In Progress' ? (
                     <button 
                      onClick={() => updateJobStatus(job.id, 'Completed')}
                      className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-100 active:scale-95 transition-all"
                     >
                        <Check size={16} /> Finish Job
                     </button>
                   ) : (
                     <button 
                      onClick={() => updateJobStatus(job.id, 'In Progress')}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase shadow-lg active:scale-95 transition-all"
                     >
                        <Play size={16} fill="white" /> Start Work
                     </button>
                   )}
                </div>
             </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <Briefcase size={40} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase text-xs">No active jobs assigned to you.</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-600 p-8 rounded-[2.5rem] text-white shadow-xl">
           <TrendingUp size={32} className="mb-4 text-emerald-200" />
           <p className="text-[10px] font-black uppercase text-emerald-100">Total Earned</p>
           <h3 className="text-3xl font-black">KES 124,500</h3>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
           <Clock size={32} className="mb-4 text-amber-500" />
           <p className="text-[10px] font-black uppercase text-slate-400">Pending Approval</p>
           <h3 className="text-3xl font-black text-slate-900">KES 4,500</h3>
        </div>
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
           <Landmark size={32} className="mb-4 text-emerald-500" />
           <p className="text-[10px] font-black uppercase text-slate-400">Ready for Payout</p>
           <h3 className="text-3xl font-black">KES 12,000</h3>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-100">
            <h4 className="text-[10px] font-black uppercase text-slate-400">Payment History</h4>
         </div>
         <table className="w-full text-left">
            <thead className="bg-slate-50">
               <tr>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Job Reference</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Date</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Amount</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase text-slate-400">Status</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {finishedJobs.map(job => (
                 <tr key={job.id}>
                    <td className="px-8 py-6 font-bold text-slate-900">{job.title}</td>
                    <td className="px-8 py-6 text-sm text-slate-500">{job.createdAt.split(' ')[0]}</td>
                    <td className="px-8 py-6 font-black text-slate-900">KES {(job.priceOffered || 0).toLocaleString()}</td>
                    <td className="px-8 py-6">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase border border-emerald-100">Paid</span>
                    </td>
                 </tr>
               ))}
               {finishedJobs.length === 0 && (
                 <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-slate-400 font-bold uppercase text-[10px]">No payment records found.</td>
                 </tr>
               )}
            </tbody>
         </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Job Portal</h1>
          <p className="text-slate-500 font-medium tracking-tight">Welcome, ZenFlow Service Partner.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start">
          <button onClick={() => setActiveTab('jobs')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'jobs' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>
            <Briefcase size={16} /> Active Jobs
          </button>
          <button onClick={() => setActiveTab('payments')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'payments' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-400'}`}>
            <History size={16} /> Payments
          </button>
        </div>
      </div>

      {activeTab === 'jobs' ? renderJobs() : renderPayments()}
    </div>
  );
};

export default ProviderPortal;
