
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  User, 
  Building2, 
  ArrowRight,
  Filter,
  Check,
  ArrowLeft,
  Briefcase,
  Phone,
  MessageSquare,
  Search,
  ExternalLink,
  ShieldCheck,
  Zap,
  Users,
  Trash2,
  X,
  MapPin,
  FileText,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { MaintenanceTicket, Contractor, ProviderApplication } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface MaintenanceProps {
  tickets: MaintenanceTicket[];
  contractors: Contractor[];
  providerApps: ProviderApplication[];
  setProviderApps: React.Dispatch<React.SetStateAction<ProviderApplication[]>>;
  setContractors: React.Dispatch<React.SetStateAction<Contractor[]>>;
  onAddRequest: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt'>) => void;
  onAssign: (ticketId: string, contractorId: string) => void;
}

const Maintenance: React.FC<MaintenanceProps> = ({ 
  tickets, 
  contractors, 
  providerApps = [], 
  setProviderApps,
  setContractors,
  onAddRequest, 
  onAssign 
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialView = searchParams.get('view') as 'manager' | 'tenant' | 'apps' || 'manager';
  const highlightId = searchParams.get('highlight');
  
  const [view, setView] = useState<'manager' | 'tenant' | 'apps'>(initialView);
  const [assigningTicket, setAssigningTicket] = useState<MaintenanceTicket | null>(null);

  const getPriorityStyles = (p: MaintenanceTicket['priority']) => {
    switch(p) {
      case 'Emergency': return 'text-rose-600 bg-rose-50 border-rose-100 animate-pulse ring-4 ring-rose-500/10';
      case 'Urgent': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getStatusDot = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-amber-500';
      case 'In Progress': return 'bg-blue-500';
      case 'Completed': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  };

  const handleApprove = (app: ProviderApplication) => {
    const newContractor: Contractor = {
      id: `c-${Date.now()}`,
      name: app.name,
      trade: app.skill,
      phone: app.phone
    };
    setContractors(prev => [...prev, newContractor]);
    setProviderApps(prev => prev.filter(a => a.id !== app.id));
    alert(`${app.name} has been vetted and approved. Their portal is now active.`);
  };

  const handleRequestInfo = (name: string) => {
    alert(`Instructions sent to ${name} to provide additional clarification.`);
  };

  const handleReject = (id: string) => {
    if (confirm("Reject this application permanently?")) {
      setProviderApps(prev => prev.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20 max-w-[100vw] overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Hub</h1>
            <p className="text-slate-500 font-medium">Manage jobs and local service providers.</p>
          </div>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start overflow-x-auto no-scrollbar max-w-full">
          <button 
            onClick={() => setView('manager')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'manager' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Portfolio View
          </button>
          <button 
            onClick={() => setView('apps')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap relative ${view === 'apps' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
          >
            New Vetting Requests
            {providerApps.length > 0 && <span className="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white shadow-lg animate-in zoom-in duration-300">{providerApps.length}</span>}
          </button>
          <button 
            onClick={() => setView('tenant')}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'tenant' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Report Issue
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'manager' ? (
          <motion.div key="manager" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={20} /></div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Saved Professionals</h3>
                  </div>
                  <button onClick={() => navigate('/join-network')} className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:underline">Public Onboarding Link</button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                 {contractors.map(c => (
                   <div key={c.id} className="p-5 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-between group hover:bg-white hover:border-emerald-200 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 font-black text-lg group-hover:bg-emerald-600 group-hover:text-white transition-all">
                          {(c.name || '?').charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{c.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{c.trade}</p>
                        </div>
                      </div>
                      <a href={`tel:${c.phone}`} className="p-3 bg-white text-emerald-600 rounded-xl shadow-sm hover:scale-110 active:scale-95 transition-all">
                        <Phone size={18} />
                      </a>
                   </div>
                 ))}
               </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${getStatusDot(status)} ${status === 'Pending' ? 'animate-pulse' : ''}`} />
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{status}</h3>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {tickets.filter(t => t.status === status).map((ticket) => (
                      <motion.div key={ticket.id} className={`bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group relative ${highlightId === ticket.id ? 'ring-2 ring-emerald-500 ring-offset-4' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityStyles(ticket.priority)}`}>{ticket.priority}</span>
                          <span className="text-[10px] font-bold text-slate-400">{ticket.createdAt.split(' ')[0]}</span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 mb-2 leading-tight group-hover:text-emerald-600 transition-colors">{ticket.title}</h4>
                        <p className="text-xs font-medium text-slate-500 mb-6 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-3 py-4 border-t border-slate-50 mb-2">
                          <Building2 size={14} className="text-slate-400" />
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Unit {ticket.unit}</span>
                        </div>
                        {ticket.status === 'Pending' && (
                          <button onClick={() => setAssigningTicket(ticket)} className="w-full py-3 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95">Assign Pro</button>
                        )}
                        {ticket.status === 'Completed' && (
                           <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest px-1">
                             <CheckCircle2 size={14} /> Resolved & Audited
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : view === 'apps' ? (
          <motion.div key="apps" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
             <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Vetting Queue (New Fundis)</h3>
                <span className="text-[10px] font-bold text-slate-400">Showing {providerApps.length} pending review(s)</span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {providerApps.map(app => (
                  <motion.div key={app.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm space-y-6 flex flex-col relative group">
                     <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 font-black text-2xl border border-blue-100">
                           {(app.name || '?').charAt(0)}
                        </div>
                        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] font-black uppercase tracking-widest border border-amber-100">Vetting: {app.skill}</span>
                     </div>
                     <div className="flex-1 space-y-4">
                        <div>
                           <h4 className="text-xl font-black text-slate-900">{app.name}</h4>
                           <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                              <MapPin size={12} className="text-blue-500" /> {app.location}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[9px] font-black uppercase text-slate-400 mb-1 leading-none">KRA PIN</p>
                              <p className="text-xs font-black text-slate-900 font-mono">{app.kraPin}</p>
                           </div>
                           <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <p className="text-[9px] font-black uppercase text-slate-400 mb-1 leading-none">ID Number</p>
                              <p className="text-xs font-black text-slate-900 font-mono">{app.idNumber}</p>
                           </div>
                        </div>

                        <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience Bio</p>
                           <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-3">"{app.bio}"</p>
                        </div>
                     </div>
                     <div className="pt-6 border-t border-slate-50 space-y-2">
                        <button 
                          onClick={() => handleApprove(app)}
                          className="w-full py-4 bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                           <ShieldCheck size={14} /> Approve & Activate
                        </button>
                        <div className="grid grid-cols-2 gap-2">
                           <button 
                             onClick={() => handleRequestInfo(app.name)}
                             className="py-3 bg-white border border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-1.5"
                           >
                              <HelpCircle size={12} /> Request Info
                           </button>
                           <button 
                             onClick={() => handleReject(app.id)}
                             className="py-3 bg-white border border-slate-100 text-slate-400 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all flex items-center justify-center gap-1.5"
                           >
                              <Trash2 size={12} /> Reject
                           </button>
                        </div>
                     </div>
                     <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <AlertTriangle size={16} className="text-amber-500" />
                     </div>
                  </motion.div>
                ))}
                {providerApps.length === 0 && (
                   <div className="col-span-full py-24 text-center bg-white rounded-[4rem] border border-dashed border-slate-200 animate-in fade-in duration-700">
                      <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                         <Search size={40} className="text-slate-200" />
                      </div>
                      <h4 className="text-xl font-black text-slate-900">No new applications</h4>
                      <p className="text-slate-400 font-medium">The vetting queue is empty.</p>
                   </div>
                )}
             </div>
          </motion.div>
        ) : (
          <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
             <h2 className="text-2xl font-black text-slate-900 mb-8">Maintenance Request</h2>
             <form onSubmit={(e) => {
               e.preventDefault();
               const fd = new FormData(e.currentTarget);
               onAddRequest({
                 title: fd.get('title') as string,
                 description: fd.get('description') as string,
                 unit: fd.get('unit') as string,
                 priority: fd.get('priority') as any,
                 status: 'Pending'
               });
               setView('manager');
             }} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Unit</label>
                      <input name="unit" required className="w-full p-4 bg-slate-50 rounded-2xl font-bold" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Category</label>
                      <select name="title" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none">
                         <option>Plumbing Issue</option>
                         <option>Electrical Malfunction</option>
                      </select>
                   </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black uppercase text-slate-400">Description</label>
                   <textarea name="description" rows={4} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none" />
                </div>
                <button type="submit" className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl">Send Request</button>
             </form>
          </div>
        )}
      </AnimatePresence>

      {/* ASSIGNMENT MODAL */}
      <AnimatePresence>
        {assigningTicket && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAssigningTicket(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden z-20">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Post Work Order</h3>
                  <button onClick={() => setAssigningTicket(null)}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="p-8 space-y-6">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Price Offered (KES)</label>
                      <input id="jobPrice" type="number" defaultValue="1500" className="w-full p-4 bg-slate-50 rounded-2xl font-black text-2xl text-emerald-600 outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Deadline</label>
                      <input id="jobDeadline" defaultValue="Today, 5 PM" className="w-full p-4 bg-slate-50 rounded-2xl font-black outline-none" />
                   </div>
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pt-4 border-t border-slate-50">Assign to approved Fundi</p>
                   <div className="space-y-3">
                      {contractors.map(c => (
                        <button 
                          key={c.id} 
                          onClick={() => { 
                            const price = Number((document.getElementById('jobPrice') as HTMLInputElement).value);
                            const dead = (document.getElementById('jobDeadline') as HTMLInputElement).value;
                            setProviderApps(prev => prev); // dummy to trigger re-render
                            onAssign(assigningTicket.id, c.id); 
                            setAssigningTicket(null); 
                          }}
                          className="w-full flex items-center justify-between p-4 bg-white border-2 border-slate-50 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                        >
                           <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all font-black">{(c.name || '?').charAt(0)}</div>
                             <div className="text-left">
                               <p className="font-bold text-slate-900">{c.name}</p>
                               <p className="text-[10px] font-black text-slate-400 uppercase">{c.trade}</p>
                             </div>
                           </div>
                           <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600" />
                        </button>
                      ))}
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Maintenance;
