
import React, { useState } from 'react';
import { Folder, Search, FileText, Plus, MoreVertical, Download, ChevronRight, Grid, List, Clock, ShieldCheck, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Documents: React.FC = () => {
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  const folders = [
    { name: 'Lease Agreements', count: 12, color: 'bg-emerald-100 text-emerald-600' },
    { name: 'Property Deeds', count: 4, color: 'bg-blue-100 text-blue-600' },
    { name: 'Utility Bills', count: 45, color: 'bg-amber-100 text-amber-600' },
    { name: 'Compliance', count: 8, color: 'bg-rose-100 text-rose-600' },
  ];

  const recentFiles = [
    { id: '1', name: 'Westlands_Plaza_Deed.pdf', type: 'Property', date: 'Oct 12, 2023', size: '4.5 MB' },
    { id: '2', name: 'Invoice_ZNF_5521.pdf', type: 'Invoice', date: 'Mar 15, 2024', size: '120 KB' },
    { id: '3', name: 'Maintenance_Receipt_22.pdf', type: 'Receipt', date: 'Mar 10, 2024', size: '250 KB' },
    { id: '4', name: 'Standard_Kenya_Lease_v2.docx', type: 'Template', date: 'Jan 05, 2024', size: '85 KB' },
  ];

  const filteredFiles = recentFiles.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Document Center</h1>
          <p className="text-slate-500 font-medium">A central vault for all your property assets and agreements.</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-2xl hover:scale-[1.02] transition-all shadow-xl active:scale-95">
            <Plus size={20} /> Upload File
          </button>
        </div>
      </div>

      {/* Folder Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {folders.map((folder, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm group cursor-pointer"
          >
            <div className={`w-14 h-14 ${folder.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              <Folder size={28} />
            </div>
            <h3 className="text-lg font-black text-slate-900 leading-tight mb-1">{folder.name}</h3>
            <div className="flex items-center justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
              <span>{folder.count} Items</span>
              <ChevronRight size={14} />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recent Files</h2>
          </div>

          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Search file name..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl font-bold placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setViewType('grid')}
                 className={`p-2 rounded-lg transition-all ${viewType === 'grid' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <Grid size={18} />
               </button>
               <button 
                 onClick={() => setViewType('list')}
                 className={`p-2 rounded-lg transition-all ${viewType === 'list' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <List size={18} />
               </button>
             </div>
          </div>
        </div>

        {viewType === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <motion.div 
                layout
                key={file.id}
                className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:bg-white hover:shadow-xl hover:shadow-emerald-50 transition-all group relative"
              >
                <FileText size={40} className="text-slate-300 group-hover:text-emerald-500 mb-6 transition-colors" />
                <h4 className="font-bold text-slate-900 mb-1 leading-tight line-clamp-2">{file.name}</h4>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{file.date} • {file.size}</p>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white px-2 py-0.5 rounded-full text-slate-500 shadow-sm">
                    {file.type}
                  </span>
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors">
                    <Download size={16} />
                  </button>
                </div>
                <button className="absolute top-6 right-6 p-1 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-600 transition-all">
                  <MoreVertical size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <div key={file.id} className="flex items-center justify-between p-4 bg-white border border-slate-50 rounded-2xl hover:bg-slate-50 transition-all group">
                <div className="flex items-center gap-4">
                  <FileText size={20} className="text-slate-300 group-hover:text-emerald-600 transition-colors" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{file.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{file.type} • {file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-400 font-medium">{file.date}</span>
                  <div className="flex gap-1">
                    <button className="p-2 text-slate-300 hover:text-slate-900 transition-colors"><Download size={16} /></button>
                    <button className="p-2 text-slate-300 hover:text-rose-600 transition-colors"><MoreVertical size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
              <Info size={40} />
            </div>
            <h4 className="text-xl font-black text-slate-900 tracking-tight">No files found</h4>
            <p className="text-slate-500 font-medium">Try refining your search or filter.</p>
          </div>
        )}
      </div>

      {/* Document Security Banner */}
      <div className="bg-slate-900 p-8 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/40">
            <ShieldCheck size={32} />
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight mb-1">Bank-Grade Encryption</h4>
            <p className="text-slate-400 text-sm font-medium">All lease agreements and invoices are encrypted with AES-256 and backed up daily.</p>
          </div>
        </div>
        <button className="relative z-10 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-emerald-50 transition-all active:scale-95 shadow-lg text-sm uppercase tracking-widest whitespace-nowrap">
          View Audit Log
        </button>
        <ShieldCheck size={200} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
      </div>
    </div>
  );
};

export default Documents;
