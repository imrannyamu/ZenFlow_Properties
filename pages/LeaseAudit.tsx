
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ShieldAlert, ShieldCheck, Sparkles, 
  Loader2, ArrowRight, Zap, Scale, Trash2, 
  Plus, AlertTriangle, CheckCircle2, ChevronRight,
  ClipboardList, Info, FileEdit,
  /* Fix: Added missing X icon import from lucide-react */
  X
} from 'lucide-react';

const LeaseAudit: React.FC = () => {
  const [leaseText, setLeaseText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    redFlags: string[];
    safetyGreen: string[];
    amendments: Record<string, string>;
  }>(null);
  const [showAmendment, setShowAmendment] = useState<string | null>(null);

  const handleRunAudit = () => {
    if (!leaseText.trim()) return;
    setIsScanning(true);
    setResult(null);

    // Simulation of AI analyzing complex legal text
    setTimeout(() => {
      setResult({
        score: 68,
        redFlags: [
          "Section 4.2: Distress for Rent clause allows immediate property seizure without a 30-day notice, violating Kenyan Housing Act standards.",
          "Section 9: Security Deposit return timeline is listed as 'At Landlord's Discretion', creating significant litigation risk.",
          "Section 11: Missing explicit 'Right to Quiet Enjoyment' clause, weakening Landlord's defense in harassment claims."
        ],
        safetyGreen: [
          "Standardized MRI Tax (7.5%) allocation is correctly defined.",
          "Termination notice period (3 months) is legally sound for residential long-term leases.",
          "Clear definitions for 'Normal Wear and Tear' vs 'Damage' minimize deposit disputes."
        ],
        amendments: {
          "Section 4.2": "The Landlord shall provide at least 14 days' written notice of arrears before initiating any distress for rent proceedings as per the Distress for Rent Act.",
          "Section 9": "The Security Deposit shall be refunded in full within 30 days of lease termination, subject to inspection and deduction of verified utility arrears only."
        }
      });
      setIsScanning(false);
    }, 2500);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Lease Audit Pro</h1>
          <p className="text-slate-500 font-medium">AI-powered legal risk mitigation for your portfolio.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-100 flex items-center gap-2 shadow-sm">
          <Scale size={16} /> Legal Assistant Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* INPUT ZONE */}
        <div className="space-y-6">
          <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-900 text-white rounded-2xl">
                  <FileText size={24} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Lease Document Data</h3>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Contract Text Input</label>
                <div className={`relative transition-all ${isScanning ? 'opacity-40 grayscale' : ''}`}>
                  <textarea 
                    value={leaseText}
                    onChange={(e) => setLeaseText(e.target.value)}
                    placeholder="Paste lease clauses here or drag document..."
                    className="w-full h-80 p-8 bg-slate-50 border-4 border-dashed border-slate-100 rounded-[2.5rem] font-medium text-slate-600 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-300"
                  />
                  {!leaseText && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-300">
                      <Plus size={48} className="mb-2" />
                      <p className="text-xs font-black uppercase tracking-widest">Drop PDF here</p>
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={handleRunAudit}
                disabled={isScanning || !leaseText.trim()}
                className="w-full py-6 bg-slate-900 text-white font-black rounded-3xl shadow-2xl hover:bg-blue-600 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center justify-center gap-4 text-lg"
              >
                {isScanning ? (
                  <>
                    <Loader2 size={24} className="animate-spin" /> 
                    <span>AI Analysis in Progress...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={24} />
                    <span>Run AI Compliance Audit</span>
                  </>
                )}
              </button>
            </div>
            <Scale size={200} className="absolute -right-20 -bottom-20 text-slate-50 rotate-12 pointer-events-none" />
          </div>

          <div className="bg-amber-50 rounded-[2rem] p-6 border border-amber-100 flex items-start gap-4">
             <Info className="text-amber-500 shrink-0" size={20} />
             <p className="text-xs font-bold text-amber-900 leading-relaxed">
               This tool uses AI to identify patterns based on the Kenyan Housing Act and Landlord-Tenant laws. <strong>Always consult a certified advocate before finalizing legal contracts.</strong>
             </p>
          </div>
        </div>

        {/* RESULTS ZONE */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {!result && !isScanning ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full bg-slate-50 rounded-[3rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-slate-200 mb-6 shadow-sm">
                   <Zap size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-400">Waiting for Data</h3>
                <p className="text-slate-400 font-medium max-w-xs mt-2">Add your lease clauses to the left to see compliance metrics.</p>
              </motion.div>
            ) : isScanning ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-full bg-white rounded-[3rem] border border-slate-100 p-12 flex flex-col items-center justify-center text-center shadow-xl"
              >
                <div className="relative mb-10">
                   <div className="w-32 h-32 border-4 border-slate-100 rounded-full" />
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 w-32 h-32 border-t-4 border-blue-500 rounded-full"
                   />
                   <Sparkles className="absolute inset-0 m-auto text-blue-500 animate-pulse" size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Analyzing Clauses</h3>
                <p className="text-slate-500 font-medium">Cross-referencing with 2026 Kenyan statutes...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="results"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-10"
              >
                {/* Score Gauge */}
                <div className="flex flex-col items-center text-center">
                   <div className="relative flex items-center justify-center">
                      <svg className="w-48 h-24">
                        <path d="M 10 90 A 80 80 0 0 1 182 90" fill="none" stroke="#f1f5f9" strokeWidth="20" strokeLinecap="round" />
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: result.score / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          d="M 10 90 A 80 80 0 0 1 182 90" 
                          fill="none" 
                          stroke={result.score > 80 ? "#10b981" : result.score > 60 ? "#3b82f6" : "#f43f5e"} 
                          strokeWidth="20" 
                          strokeLinecap="round" 
                        />
                      </svg>
                      <div className="absolute bottom-0 text-3xl font-black text-slate-900">{result.score}%</div>
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mt-4">Compliance Rating</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Red Flags */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-rose-600 px-1">
                        <ShieldAlert size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Critical Red Flags</h4>
                     </div>
                     <div className="space-y-3">
                        {result.redFlags.map((flag, i) => (
                          <div key={i} className="p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4">
                             <AlertTriangle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                             <div className="flex-1">
                                <p className="text-sm font-bold text-rose-900 leading-relaxed">{flag}</p>
                                <button 
                                  onClick={() => setShowAmendment(flag.split(':')[0])}
                                  className="mt-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:text-rose-800 transition-colors"
                                >
                                   <FileEdit size={14} /> Suggest Amendment
                                </button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Safety Green */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-emerald-600 px-1">
                        <ShieldCheck size={18} />
                        <h4 className="text-xs font-black uppercase tracking-widest">Safety Green Clauses</h4>
                     </div>
                     <div className="space-y-3">
                        {result.safetyGreen.map((safe, i) => (
                          <div key={i} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-center gap-4">
                             <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                             <p className="text-xs font-bold text-emerald-900 leading-relaxed">{safe}</p>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AMENDMENT MODAL */}
      <AnimatePresence>
        {showAmendment && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAmendment(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden z-[610]">
                <div className="p-8 bg-blue-600 text-white flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Sparkles size={24} />
                      <h3 className="text-xl font-black">AI Legal Amendment</h3>
                   </div>
                   <button onClick={() => setShowAmendment(null)}><X size={24} /></button>
                </div>
                <div className="p-10 space-y-8">
                   <div>
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Target Clause</p>
                      <p className="font-black text-slate-900">{showAmendment}</p>
                   </div>
                   <div className="p-8 bg-slate-50 border-2 border-blue-100 rounded-[2rem] relative">
                      <p className="text-[10px] font-black uppercase text-blue-600 mb-4 tracking-widest">Recommended Wording</p>
                      <p className="text-lg font-bold text-slate-700 leading-relaxed">
                         "{result?.amendments[showAmendment]}"
                      </p>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(result?.amendments[showAmendment] || '');
                          alert("Amendment Copied!");
                        }}
                        className="absolute top-6 right-6 p-2 bg-white text-blue-600 rounded-xl shadow-sm hover:scale-110 transition-all"
                      >
                         <ClipboardList size={18} />
                      </button>
                   </div>
                   <button 
                    onClick={() => setShowAmendment(null)}
                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all"
                   >
                    Apply Fix to Draft
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaseAudit;
