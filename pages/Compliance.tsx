
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  Scale, 
  Loader2, 
  Zap, 
  Info,
  Download,
  Calendar,
  Lock,
  ArrowRight,
  X,
  Terminal,
  Globe,
  Cpu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AuditModal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden z-20 flex flex-col max-h-[85vh]"
        >
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
              <X size={24} />
            </button>
          </div>
          <div className="p-8 overflow-y-auto">
            {children}
          </div>
          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button onClick={onClose} className="px-8 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all">
              Close Audit
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const Compliance: React.FC = () => {
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const complianceScore = 92;

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert("Compliance Report (PDF) has been generated and saved to Documents.");
    }, 2000);
  };

   const checklistItems = [
    { 
      id: 1, 
      title: 'KRA Tax Ready', 
      desc: 'Monthly Rental Income (MRI) reports for February 2026 are compiled and verified.', 
      status: 'success',
      icon: Calendar,
      modalId: 'kra'
    },
    { 
      id: 2, 
      title: 'Lease Legal Check', 
      desc: 'AI Audit Pro has verified 100% of active unit contracts against current Housing Act standards.', 
      status: 'success',
      icon: Scale,
      modalId: 'lease'
    },
    { 
      id: 3, 
      title: 'Data Privacy Policy', 
      desc: 'Tenant PII data is AES-256 encrypted. Compliant with Kenya Data Protection Act 2019.', 
      status: 'success',
      icon: Lock,
      modalId: 'privacy'
    }
  ];

  const renderModalContent = () => {
    switch(activeModal) {
      case 'kra':
        return (
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs">
                <thead>
                  <tr className="text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="pb-4">Tax Period</th>
                    <th className="pb-4">Gross Income</th>
                    <th className="pb-4">Expenses</th>
                    <th className="pb-4 text-right">Net Taxable</th>
                  </tr>
                </thead>
                <tbody className="text-slate-600">
                  {[
                    { period: 'Feb 2026', gross: 1240000, exp: 180500, net: 1059500 },
                    { period: 'Jan 2026', gross: 1180000, exp: 165000, net: 1015000 },
                    { period: 'Dec 2025', gross: 1320000, exp: 210000, net: 1110000 },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-slate-50 last:border-0">
                      <td className="py-4 font-black text-slate-900">{row.period}</td>
                      <td className="py-4">KES {row.gross.toLocaleString()}</td>
                      <td className="py-4">KES {row.exp.toLocaleString()}</td>
                      <td className="py-4 text-right font-black text-emerald-600">KES {row.net.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="w-full py-4 bg-emerald-50 text-emerald-600 font-black rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] hover:bg-emerald-100 transition-all">
              <Download size={16} /> Download Full Tax Audit PDF
            </button>
          </div>
        );
      case 'lease':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Compliance Score</p>
                <p className="text-3xl font-black text-emerald-700">100%</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Units</p>
                <p className="text-3xl font-black text-slate-900">34 / 34</p>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Timestamped Audit Log</h4>
              <div className="space-y-3">
                {[
                  { time: '2026-02-20 14:32', event: 'Housing Act 2024 Sync Completed', status: 'Success' },
                  { time: '2026-02-18 09:15', event: 'Lease Renewal Clause Verification', status: 'Success' },
                  { time: '2026-02-15 11:45', event: 'Digital Signature Integrity Check', status: 'Success' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{log.event}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{log.time}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">{log.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-slate-900 rounded-3xl text-white flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl text-emerald-400">
                  <Cpu size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encryption</p>
                  <p className="text-sm font-black">AES-256-GCM</p>
                </div>
              </div>
              <div className="p-6 bg-blue-600 rounded-3xl text-white flex items-center gap-4">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Globe size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Regulatory</p>
                  <p className="text-sm font-black">KDPA 2019</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Data Access Logs</h4>
              <div className="bg-slate-900 rounded-[2rem] border border-slate-800 p-4 overflow-hidden">
                <div className="space-y-3 font-mono text-[10px]">
                  {[
                    { ip: '197.232.14.88', user: 'Manager_James', action: 'READ_PII', time: '2 mins ago' },
                    { ip: '41.215.160.12', user: 'System_Audit', action: 'ENCRYPT_SYNC', time: '15 mins ago' },
                    { ip: '197.232.14.88', user: 'Manager_James', action: 'LOGIN_SUCCESS', time: '1 hour ago' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <Terminal size={12} className="text-emerald-500" />
                        <span>{log.ip}</span>
                        <span className="text-slate-600">|</span>
                        <span className="text-slate-300">{log.user}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400">{log.action}</span>
                        <span className="text-slate-600">{log.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-24">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Regulatory Compliance Monitor</h1>
          <p className="text-slate-500 font-medium">Automated oversight for Kenyan property regulations.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2 shadow-sm">
          <ShieldCheck size={16} /> 2026 Legal Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* SAFETY GAUGE */}
        <div className="lg:col-span-1">
           <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center text-center h-full">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Safety Rating</h3>
              
              <div className="relative flex items-center justify-center">
                <svg className="w-64 h-64 transform -rotate-90">
                  <circle cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="transparent" className="text-slate-50" />
                  <motion.circle 
                    initial={{ strokeDashoffset: 690 }}
                    animate={{ strokeDashoffset: 690 - (690 * (complianceScore / 100)) }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="128" cy="128" r="110" stroke="currentColor" strokeWidth="20" fill="transparent" strokeDasharray="690" className="text-emerald-500" 
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-black text-slate-900 tracking-tighter">{complianceScore}%</span>
                  <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">Excellent</span>
                </div>
              </div>

              <div className="mt-12 space-y-4 w-full">
                 <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 leading-relaxed italic">
                      "Your portfolio is currently exceeding the regional average for tax and lease compliance."
                    </p>
                 </div>
                 <button 
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-xs"
                 >
                    {isExporting ? <Loader2 size={18} className="animate-spin" /> : <><FileText size={18} /> Generate Compliance Report</>}
                 </button>
              </div>
           </div>
        </div>

        {/* COMPLIANCE CHECKLIST */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between px-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Active Monitor Logs</h3>
              <span className="text-[10px] font-bold text-slate-400">Refreshed: 2 minutes ago</span>
           </div>

           <div className="grid grid-cols-1 gap-4">
              {checklistItems.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ x: 10 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-start gap-6 group transition-all"
                >
                  <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <item.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                       <h4 className="text-xl font-black text-slate-900">{item.title}</h4>
                       <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                          <CheckCircle2 size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                       </div>
                    </div>
                    <p className="text-sm font-medium text-slate-500 leading-relaxed">{item.desc}</p>
                    <button 
                      onClick={() => setActiveModal(item.modalId || null)}
                      className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 cursor-pointer hover:underline"
                    >
                       Review Detailed Audit Trail <ArrowRight size={12} />
                    </button>
                  </div>
                </motion.div>
              ))}
           </div>

           <div className="bg-blue-900 p-8 rounded-[3rem] text-white relative overflow-hidden shadow-2xl group">
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="space-y-2">
                    <h4 className="text-2xl font-black tracking-tight">Need a customized audit?</h4>
                    <p className="text-blue-100 font-medium max-w-md">Our Enterprise experts can provide localized legal reviews for commercial portfolios across East Africa.</p>
                 </div>
                 <button className="px-8 py-4 bg-white text-blue-900 font-black rounded-2xl shadow-xl hover:bg-emerald-50 transition-all uppercase tracking-widest text-xs whitespace-nowrap">
                    Contact Specialist
                 </button>
              </div>
              <ShieldAlert size={180} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
           </div>
        </div>
      </div>

      <AuditModal 
        isOpen={activeModal !== null} 
        onClose={() => setActiveModal(null)} 
        title={
          activeModal === 'kra' ? 'KRA Tax Audit Trail' : 
          activeModal === 'lease' ? 'Lease Compliance Audit' : 
          'Data Privacy & Security Audit'
        }
      >
        {renderModalContent()}
      </AuditModal>

      <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 flex items-start gap-6">
         <div className="p-3 bg-white rounded-xl shadow-sm text-amber-500 shrink-0 border border-slate-100">
            <Info size={24} />
         </div>
         <div className="space-y-2">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">About Zenflow Compliance</h4>
            <p className="text-xs font-bold text-slate-400 leading-relaxed">
              ZenFlow monitors updates from the Kenya Revenue Authority (KRA), the Ministry of Lands, and Physical Planning to ensure your dashboard reflects the latest statutory requirements. Data accuracy depends on the inputs provided in the Tenants and Expenses modules.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Compliance;
