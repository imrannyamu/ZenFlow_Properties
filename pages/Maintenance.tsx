
import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { MaintenanceTicket, Contractor } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const Maintenance: React.FC = () => {
  const [view, setView] = useState<'manager' | 'tenant'>('manager');
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([
    { id: '1', unit: 'A1', title: 'Leaking Sink', description: 'Major water leakage under the kitchen sink area.', priority: 'High', status: 'Pending', createdAt: '2 hours ago' },
    { id: '2', unit: 'B4', title: 'Faulty AC', description: 'AC unit makes loud noise and doesn\'t cool properly.', priority: 'Medium', status: 'In Progress', createdAt: '1 day ago', contractorId: 'c1' },
    { id: '3', unit: 'C2', title: 'Broken Light Switch', description: 'The light switch in the bedroom is loose.', priority: 'Low', status: 'Completed', createdAt: '3 days ago', contractorId: 'c2' },
  ]);

  const contractors: Contractor[] = [
    { id: 'c1', name: 'James Plumber', trade: 'Plumbing' },
    { id: 'c2', name: 'Electric Pros', trade: 'Electrical' },
    { id: 'c3', name: 'FixIt Co.', trade: 'General Repair' },
  ];

  const handleUpdateStatus = (id: string, newStatus: MaintenanceTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleAssignContractor = (ticketId: string, contractorId: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { ...t, contractorId, status: 'In Progress' } 
        : t
    ));
  };

  const getPriorityColor = (p: MaintenanceTicket['priority']) => {
    switch(p) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  const getStatusColor = (s: MaintenanceTicket['status']) => {
    switch(s) {
      case 'Pending': return 'text-amber-600 bg-amber-50';
      case 'In Progress': return 'text-blue-600 bg-blue-50';
      case 'Completed': return 'text-emerald-600 bg-emerald-50';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Maintenance Tickets</h1>
          <p className="text-slate-500 font-medium">Manage property repairs and contractor assignments.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button 
            onClick={() => setView('manager')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'manager' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Manager View
          </button>
          <button 
            onClick={() => setView('tenant')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${view === 'tenant' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-500 hover:text-slate-900'}`}
          >
            Tenant Portal
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'manager' ? (
          <motion.div 
            key="manager"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Status Kanban Board Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <div key={status} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        status === 'Pending' ? 'bg-amber-500' : status === 'In Progress' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`} />
                      <h3 className="font-black text-slate-900 uppercase tracking-widest text-[10px]">{status}</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      {tickets.filter(t => t.status === status).length}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {tickets.filter(t => t.status === status).map((ticket) => (
                      <div key={ticket.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority} Priority
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">{ticket.createdAt}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">{ticket.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">{ticket.description}</p>
                        
                        <div className="flex items-center gap-3 py-3 border-y border-slate-50 mb-4">
                          <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                            <Building2 size={14} />
                          </div>
                          <span className="text-xs font-black text-slate-900">Unit {ticket.unit}</span>
                        </div>

                        {ticket.status === 'Pending' && (
                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block px-1">Assign Contractor</label>
                            <select 
                              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                              onChange={(e) => handleAssignContractor(ticket.id, e.target.value)}
                              defaultValue=""
                            >
                              <option value="" disabled>Select Professional</option>
                              {contractors.map(c => <option key={c.id} value={c.id}>{c.name} ({c.trade})</option>)}
                            </select>
                          </div>
                        )}

                        {ticket.status === 'In Progress' && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <User size={12} />
                              </div>
                              <span className="text-[10px] font-bold text-slate-600">
                                {contractors.find(c => c.id === ticket.contractorId)?.name}
                              </span>
                            </div>
                            <button 
                              onClick={() => handleUpdateStatus(ticket.id, 'Completed')}
                              className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all"
                            >
                              <Check size={14} />
                            </button>
                          </div>
                        )}
                        
                        {ticket.status === 'Completed' && (
                          <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-widest">
                            <CheckCircle2 size={14} />
                            Repair Finished
                          </div>
                        )}
                      </div>
                    ))}
                    {tickets.filter(t => t.status === status).length === 0 && (
                      <div className="py-12 border-2 border-dashed border-slate-100 rounded-[2.5rem] flex flex-col items-center justify-center text-slate-300">
                        <Wrench size={32} className="opacity-20 mb-2" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Empty Lane</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="tenant"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 p-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Plus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Submit Repair Request</h2>
                  <p className="text-slate-500 font-medium">We'll assign a professional immediately.</p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">What's the issue?</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kitchen tap leaking" 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Unit Number</label>
                    <input 
                      type="text" 
                      defaultValue="A1" 
                      className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold text-slate-400"
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Urgency</label>
                    <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High (Emergency)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Describe the problem</label>
                  <textarea 
                    rows={4}
                    placeholder="Provide as much detail as possible to help the contractor..."
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-slate-300"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setView('manager')}
                  className="w-full py-5 bg-emerald-600 text-white text-lg font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 group"
                >
                  Send Request <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Maintenance;
