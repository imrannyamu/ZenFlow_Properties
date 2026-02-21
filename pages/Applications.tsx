
import React, { useState, useMemo } from 'react';
import { 
  FileSearch, Search, Filter, ChevronRight, User, 
  CheckCircle2, XCircle, Clock, ArrowLeft, Download, 
  FileText, Briefcase, Wallet, Building2, MapPin, 
  UserCheck, ShieldCheck, Mail, Phone, ExternalLink,
  Loader2, Check
} from 'lucide-react';
import { Lead, Tenant, Property } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ApplicationsProps {
  leads: Lead[];
  setLeads: React.Dispatch<React.SetStateAction<Lead[]>>;
  tenants: Tenant[];
  setTenants: React.Dispatch<React.SetStateAction<Tenant[]>>;
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

type AppStatus = 'Pending Review' | 'Waitlisted' | 'Approved' | 'Rejected';

const Applications: React.FC<ApplicationsProps> = ({ 
  leads = [], 
  setLeads, 
  tenants, 
  setTenants, 
  properties, 
  setProperties 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedApp, setSelectedApp] = useState<Lead | null>(null);
  const [isApproving, setIsApproving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) return [];
    return leads.filter(l => {
      const matchesSearch = (l.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                           (l.idNumber || '').includes(searchTerm);
      const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, filterStatus]);

  const handleStatusChange = (id: string, status: AppStatus) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: status as any } : l));
    if (selectedApp?.id === id) setSelectedApp(prev => prev ? { ...prev, status: status as any } : null);
  };

  const handleApproveAndOnboard = async () => {
    if (!selectedApp) return;
    setIsApproving(true);

    // Simulated onboarding delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newTenant: Tenant = {
      id: `t-app-${Date.now()}`,
      name: selectedApp.name,
      email: selectedApp.email,
      phone: selectedApp.phone,
      idNumber: selectedApp.idNumber,
      unit: selectedApp.interestedUnit || 'A1',
      rentAmount: selectedApp.unitRent || 25000,
      depositHeld: selectedApp.unitRent || 25000,
      dueDate: 5,
      leaseStart: new Date().toISOString(),
      leaseEnd: new Date(Date.now() + 31536000000).toISOString(),
      status: 'Active',
      payments: []
    };

    // Update global state
    setTenants(prev => [newTenant, ...prev]);
    setLeads(prev => prev.filter(l => l.id !== selectedApp.id));
    
    // Sync property inventory
    setProperties(prev => prev.map(p => ({
      ...p,
      units: p.units.map(u => u.name === newTenant.unit ? { ...u, status: 'Occupied' as const, tenantName: newTenant.name } : u)
    })));

    setIsApproving(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedApp(null);
    }, 2500);
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'Rejected': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'Waitlisted': return 'bg-amber-50 text-amber-600 border-amber-100';
      default: return 'bg-blue-50 text-blue-600 border-blue-100';
    }
  };

  const renderTable = () => (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:outline-none"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
           {['All', 'Pending Review', 'Waitlisted', 'Approved', 'Rejected'].map(s => (
             <button 
               key={s} 
               onClick={() => setFilterStatus(s)}
               className={`px-5 py-2 border rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                 filterStatus === s 
                   ? 'bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-200' 
                   : 'bg-white border-slate-100 text-slate-400 hover:text-slate-900'
               }`}
             >
               {s}
             </button>
           ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Applicant</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredLeads.map(lead => (
              <tr key={lead.id} className="hover:bg-slate-50/30 transition-all group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-lg">
                      {(lead.name || '?').charAt(0)}
                    </div>
                    <div>
                      <p className="font-black text-slate-900 leading-none mb-1">{lead.name}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase">ID: {lead.idNumber}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <p className="text-sm font-black text-slate-900">Unit {lead.interestedUnit} • {lead.interestedProperty}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Source: {lead.source}</p>
                </td>
                <td className="px-8 py-6">
                   <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(lead.status || 'Pending Review')}`}>
                      {lead.status || 'Pending Review'}
                   </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedApp(lead)}
                    className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"
                  >
                    <ChevronRight size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredLeads.length === 0 && (
        <div className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No matching applications found.</div>
      )}
    </div>
  );

  const renderDetail = (lead: Lead) => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedApp(null)}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Applicant Review</h2>
          <p className="text-slate-500 font-medium">Internal verification for {lead.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm space-y-10">
              <div className="flex items-start justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-emerald-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl font-black shadow-xl shadow-emerald-100">
                       {(lead.name || '?').charAt(0)}
                    </div>
                    <div>
                       <h3 className="text-3xl font-black text-slate-900">{lead.name}</h3>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase"><Phone size={12} /> {lead.phone}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-200" />
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase"><Mail size={12} /> {lead.email}</span>
                       </div>
                    </div>
                 </div>
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => handleStatusChange(lead.id, 'Waitlisted')}
                      className="px-6 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100"
                    >
                      Waitlist
                    </button>
                    <button 
                      onClick={() => handleStatusChange(lead.id, 'Rejected')}
                      className="px-6 py-2 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-rose-100"
                    >
                      Reject
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Employment & Income</p>
                    <div className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Current Employer</span>
                          <span className="font-black text-slate-900">Digital Solutions KE</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-500">Net Monthly Income</span>
                          <span className="font-black text-emerald-600">KES 145,000</span>
                       </div>
                    </div>
                 </div>
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Background Notes</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed italic">
                       "Moving closer to work in Westlands. Looking for a long-term lease. Currently living in Kilimani."
                    </p>
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Uploaded Evidence</h4>
                 <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'Keny_ID_Front.jpg', type: 'Identity Document' },
                      { name: 'PaySlip_Jan_2026.pdf', type: 'Proof of Income' },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-emerald-200 group transition-all cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-50 text-slate-400 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                               <FileText size={20} />
                            </div>
                            <div>
                               <p className="text-xs font-black text-slate-900">{doc.name}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase">{doc.type}</p>
                            </div>
                         </div>
                         <Download size={14} className="text-slate-300" />
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
           <div className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Onboarding Flow</p>
                 <h4 className="text-2xl font-black mb-6 leading-tight">Ready to Activate Tenancy?</h4>
                 <div className="space-y-4 mb-10">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500" />
                       <span className="text-xs font-bold text-slate-400">Inventory Sync OK</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500" />
                       <span className="text-xs font-bold text-slate-400">KYC Verified</span>
                    </div>
                 </div>
                 
                 {showSuccess ? (
                    <div className="bg-emerald-500 py-5 rounded-2xl flex items-center justify-center gap-2 animate-in zoom-in duration-300">
                       <Check size={24} strokeWidth={4} />
                       <span className="font-black uppercase tracking-widest text-xs">Onboarded!</span>
                    </div>
                 ) : (
                    <button 
                      onClick={handleApproveAndOnboard}
                      disabled={isApproving}
                      className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
                    >
                      {isApproving ? <Loader2 size={24} className="animate-spin" /> : <><UserCheck size={24} /> Approve & Onboard</>}
                    </button>
                 )}
                 <p className="text-[9px] font-bold text-slate-500 text-center mt-6 leading-relaxed">
                    Activated profiles will immediately receive their first bill via SMS/Email.
                 </p>
              </div>
              <ShieldCheck size={180} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
           </div>

           <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Internal Scorecard</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Rent-to-Income Ratio</span>
                    <span className="font-black text-emerald-600">17.2%</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Document Authenticity</span>
                    <span className="font-black text-emerald-600">High</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">Security Clearance</span>
                    <span className="font-black text-emerald-600">Pass</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24">
      <AnimatePresence mode="wait">
        {!selectedApp ? (
          <motion.div 
            key="table"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Leads & Applications</h1>
                <p className="text-slate-500 font-medium">Manage prospective tenants and automate onboarding.</p>
              </div>
              <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                <FileSearch size={16} /> {(leads?.length || 0)} Active Applicants
              </div>
            </div>
            {renderTable()}
          </motion.div>
        ) : (
          <motion.div 
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {renderDetail(selectedApp)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Applications;
