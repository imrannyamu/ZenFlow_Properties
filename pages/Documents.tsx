
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Folder, Search, FileText, Plus, MoreVertical, Download, 
  ChevronRight, Grid, List, Clock, ShieldCheck, Info, X, 
  Upload, ArrowLeft, Loader2, CheckCircle2, ShieldAlert,
  Terminal, Globe, Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { AuditEntry, UserRole, Tenant } from '../types';

interface DocumentsProps {
  auditLogs: AuditEntry[];
  userRole?: UserRole | null;
  userEmail?: string;
  tenants?: Tenant[];
}

const Documents: React.FC<DocumentsProps> = ({ auditLogs, userRole, userEmail, tenants }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  const unitParam = searchParams.get('unit');
  
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showToast, setShowToast] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Background Scroll Lock
  useEffect(() => {
    if (isUploadOpen || isAuditOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isUploadOpen, isAuditOpen]);

  const [files, setFiles] = useState([
    { id: '1', propertyId: 'p1', name: 'Westlands_Plaza_Deed.pdf', type: 'Property', date: 'Oct 12, 2023', size: '4.5 MB' },
    { id: '2', unit: 'B4', name: 'Lease_Sarah_Hassan_B4.pdf', type: 'Lease', date: 'Mar 15, 2024', size: '120 KB' },
    { id: '3', propertyId: 'p1', unit: 'A1', name: 'Lease_James_Kamau_A1.pdf', type: 'Lease', date: 'Mar 10, 2024', size: '250 KB' },
    { id: '4', unit: 'C2', name: 'Lease_Moses_Otieno_C2.pdf', type: 'Lease', date: 'Jan 05, 2024', size: '85 KB' },
    { id: '5', propertyId: 'p1', name: 'Zen_Plaza_Site_Map.pdf', type: 'Site Plan', date: 'Dec 01, 2023', size: '1.8 MB' },
  ]);

  const activeTenant = useMemo(() => {
    if (userRole !== 'TENANT' || !userEmail || !tenants) return null;
    return tenants.find(t => t.email === userEmail) || tenants[0]; // Fallback to first for demo if email not matched
  }, [userRole, userEmail, tenants]);

  const folders = [
    { id: 'p1', name: 'Zen Plaza Assets', count: 12, color: 'bg-emerald-100 text-emerald-600' },
    { id: 'p2', name: 'Emerald Heights', count: 4, color: 'bg-blue-100 text-blue-600' },
    { id: 'u', name: 'Lease Agreements', count: 15, color: 'bg-amber-100 text-amber-600' },
    { id: 'c', name: 'Compliance', count: 8, color: 'bg-rose-100 text-rose-600' },
  ];

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      // Role-based filtering: Tenants only see their own unit's documents
      if (userRole === 'TENANT' && activeTenant) {
        if (f.unit && f.unit !== activeTenant.unit) return false;
        if (f.type === 'Property' || f.type === 'Site Plan') return false; // Hide property deeds from tenants
      }

      const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProperty = !filterParam || f.propertyId === filterParam;
      const matchesUnit = !unitParam || f.unit === unitParam;
      return matchesSearch && matchesProperty && matchesUnit;
    });
  }, [searchTerm, filterParam, unitParam, files, userRole, activeTenant]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setUploadProgress(100);
        clearInterval(interval);
        
        const newFile = {
          id: Date.now().toString(),
          name: file.name,
          type: 'Manual Upload',
          date: new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' }),
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          propertyId: filterParam || undefined,
          unit: unitParam || undefined
        };
        
        setFiles(prev => [newFile, ...prev]);
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setIsUploadOpen(false);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }, 500);
      } else {
        setUploadProgress(progress);
      }
    }, 400);
  };

  const clearFilters = () => {
    setSearchParams({});
    setSearchTerm('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20"
          >
            <CheckCircle2 size={20} />
            <span className="font-black text-sm uppercase tracking-widest">File Saved Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Document Center</h1>
          <p className="text-slate-500 font-medium">A central vault for all your property assets and agreements.</p>
        </div>
        <button 
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-xl hover:shadow-emerald-200/50 active:scale-95"
        >
          <Plus size={20} /> Upload File
        </button>
      </div>

      {(filterParam || unitParam) && (
        <div className="flex items-center gap-3 animate-in slide-in-from-left-4 duration-300">
          <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-3 shadow-sm">
            <span>Filtered by: {filterParam ? `Property ${filterParam}` : `Unit ${unitParam}`}</span>
            <button onClick={clearFilters} className="p-1 hover:bg-emerald-100 rounded-lg transition-colors">
              <X size={14} />
            </button>
          </div>
          <p className="text-xs text-slate-400 font-bold">Showing {filteredFiles.length} contextual matches</p>
        </div>
      )}

      {!filterParam && !unitParam && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {folders.map((folder, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              onClick={() => setSearchParams({ filter: folder.id })}
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
      )}

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
              <Clock size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {filterParam || unitParam ? 'Filtered Repository' : 'Recent Files'}
            </h2>
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
                  <button className="text-slate-400 hover:text-emerald-600 transition-colors active:scale-90">
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
            <button onClick={clearFilters} className="mt-4 text-emerald-600 font-black text-xs uppercase tracking-widest underline underline-offset-4">Reset All Filters</button>
          </div>
        )}
      </div>

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
        <button 
          onClick={() => setIsAuditOpen(true)}
          className="relative z-10 px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-emerald-50 hover:shadow-emerald-200/20 hover:shadow-xl transition-all active:scale-95 shadow-lg text-sm uppercase tracking-widest whitespace-nowrap"
        >
          View Audit Log
        </button>
        <ShieldCheck size={200} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
      </div>

      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => !isUploading && setIsUploadOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden z-20 flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <button 
                    disabled={isUploading}
                    onClick={() => setIsUploadOpen(false)} 
                    className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"
                   >
                    <ArrowLeft size={24} />
                   </button>
                   <div>
                     <h3 className="text-2xl font-black text-slate-900 tracking-tight">Upload Document</h3>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Repository Expansion</p>
                   </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                {isUploading ? (
                  <div className="text-center py-12 space-y-6">
                    <div className="relative flex justify-center">
                      <Loader2 size={64} className="text-emerald-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xs font-black text-emerald-800">{Math.round(uploadProgress)}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-slate-900">Uploading File...</h4>
                      <p className="text-slate-500 font-medium">Securing to AES-256 encrypted vault</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-4 border-dashed border-slate-100 rounded-[2.5rem] p-16 flex flex-col items-center justify-center gap-6 group cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/30 transition-all"
                    >
                      <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-slate-900 mb-1">Drag & Drop Files</p>
                        <p className="text-sm font-bold text-slate-400">or click to browse local storage</p>
                      </div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        className="hidden" 
                        onChange={handleFileUpload}
                      />
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuditOpen && (
          <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAuditOpen(false)}
              className="fixed inset-0 bg-slate-900/70 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 200 }}
              className="relative bg-white w-full max-w-4xl h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-[3.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden z-20 flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsAuditOpen(false)} 
                    className="p-2 hover:bg-white rounded-full text-slate-400 transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
                      <ShieldAlert size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight">Security Audit Log</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Real-time Watcher Active</p>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setIsAuditOpen(false)} className="hidden sm:block p-2 hover:bg-slate-200 rounded-full text-slate-400">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                     <Terminal size={20} className="text-slate-400 mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Session</p>
                     <p className="text-lg font-black text-slate-900 font-mono">197.232.14.88</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                     <Globe size={20} className="text-slate-400 mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Geo Location</p>
                     <p className="text-lg font-black text-slate-900">Nairobi, KE</p>
                  </div>
                  <div className="p-6 bg-slate-50 border border-slate-100 rounded-3xl">
                     <Cpu size={20} className="text-slate-400 mb-4" />
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</p>
                     <p className="text-lg font-black text-emerald-600 font-mono">AES-256-GCM</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Ledger</h4>
                    <span className="text-[10px] font-bold text-slate-400 italic">Showing last 24 hours</span>
                  </div>
                  
                  <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-2 overflow-x-auto">
                    <table className="w-full text-left font-mono text-[11px] border-separate border-spacing-0">
                      <thead>
                        <tr className="text-slate-500 uppercase tracking-tighter">
                          <th className="px-6 py-4 border-b border-slate-800">Timestamp</th>
                          <th className="px-6 py-4 border-b border-slate-800">Event_ID</th>
                          <th className="px-6 py-4 border-b border-slate-800">User_Context</th>
                          <th className="px-6 py-4 border-b border-slate-800">Remote_IP</th>
                          <th className="px-6 py-4 border-b border-slate-800 text-right">State</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        {auditLogs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/50 transition-colors group">
                            <td className="px-6 py-4 border-b border-slate-800/50 text-emerald-500">[{log.timestamp}]</td>
                            <td className="px-6 py-4 border-b border-slate-800/50 font-black">{log.action}</td>
                            <td className="px-6 py-4 border-b border-slate-800/50 text-slate-400 italic">{log.user}</td>
                            <td className="px-6 py-4 border-b border-slate-800/50">{log.ip}</td>
                            <td className="px-6 py-4 border-b border-slate-800/50 text-right">
                              <span className={`px-2 py-0.5 rounded font-black ${log.status === 'SUCCESS' ? 'text-emerald-500 bg-emerald-500/10' : log.status === 'INFO' ? 'text-blue-400 bg-blue-400/10' : 'text-rose-500 bg-rose-500/10'}`}>
                                {log.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
