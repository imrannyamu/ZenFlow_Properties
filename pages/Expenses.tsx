
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, Wallet, Receipt, Wrench, Lightbulb, 
  UserCog, Scale, X, Loader2, ArrowRight, TrendingDown,
  Megaphone, MoreHorizontal, Calendar, ArrowLeft, CheckCircle2,
  FileText, ShieldCheck, Archive, Scan, Camera, Sparkles, Image as ImageIcon,
  Maximize2, Download, Zap, BarChart3, Gavel,
  // Added Check to fix "Cannot find name 'Check'" error
  Check
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

// Map the new requested categories to the existing type or use them as strings
type SmartCategory = 'Repairs' | 'Utilities' | 'Marketing' | 'Legal' | 'Taxes' | 'Other';

const Expenses: React.FC<ExpensesProps> = ({ expenses, onAddExpense }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showVault, setShowVault] = useState(false);

  // SMART ENTRY STATE
  const [smartDesc, setSmartDesc] = useState('');
  const [smartAmount, setSmartAmount] = useState('');
  const [isSmartCategorizing, setIsSmartCategorizing] = useState(false);

  // AI SCANNER STATES
  const [showScanner, setShowScanner] = useState(false);
  const [isProcessingScan, setIsProcessingScan] = useState(false);
  const [scannedData, setScannedData] = useState<Omit<Expense, 'id'> | null>(null);
  const [selectedReceiptUrl, setSelectedReceiptUrl] = useState<string | null>(null);

  const MOCK_INCOME = 1240000;

  const categoryConfigs: Record<string, { icon: any, color: string, bg: string, border: string }> = {
    Repairs: { icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    Maintenance: { icon: Wrench, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' },
    Utilities: { icon: Lightbulb, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    Marketing: { icon: Megaphone, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
    Legal: { icon: Gavel, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    Taxes: { icon: Scale, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
    'Staff Wages': { icon: UserCog, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
    Other: { icon: MoreHorizontal, color: 'text-slate-400', bg: 'bg-slate-50', border: 'border-slate-100' },
  };

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.recipient.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const totalExpenseAmount = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);

  const categorySummary = useMemo(() => {
    const summary: Record<string, number> = {
      Repairs: 0,
      Utilities: 0,
      Marketing: 0,
      Legal: 0,
      Taxes: 0,
      Other: 0
    };
    expenses.forEach(e => {
      const cat = (e.category === 'Maintenance' ? 'Repairs' : e.category) as string;
      if (summary[cat] !== undefined) summary[cat] += e.amount;
      else summary['Other'] += e.amount;
    });
    return summary;
  }, [expenses]);

  const handleSmartSave = async () => {
    if (!smartDesc || !smartAmount) return;
    setIsSmartCategorizing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional accountant. Categorize this property expense: "${smartDesc}". 
        The only allowed categories are: Repairs, Utilities, Marketing, Legal, Taxes. 
        Respond with exactly ONE word from that list. If unsure, respond "Other".`,
      });

      const detectedCategory = response.text.trim() as ExpenseCategory;
      
      const newExpense: Omit<Expense, 'id'> = {
        category: detectedCategory,
        amount: Number(smartAmount),
        recipient: "Auto-Logged via Smart Entry",
        date: new Date().toISOString().split('T')[0],
        description: smartDesc,
      };

      onAddExpense(newExpense);
      setSmartDesc('');
      setSmartAmount('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (error) {
      console.error("Categorization error:", error);
      // Fallback
      onAddExpense({
        category: 'Other',
        amount: Number(smartAmount),
        recipient: "Smart Entry",
        date: new Date().toISOString().split('T')[0],
        description: smartDesc,
      });
    } finally {
      setIsSmartCategorizing(false);
    }
  };

  const handleSaveExpense = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const newExpense: Omit<Expense, 'id'> = {
      category: formData.get('category') as ExpenseCategory,
      amount: Number(formData.get('amount')),
      recipient: formData.get('recipient') as string,
      date: formData.get('date') as string,
      description: formData.get('description') as string,
      receiptUrl: scannedData ? 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=400' : undefined
    };

    await new Promise(resolve => setTimeout(resolve, 600));
    
    onAddExpense(newExpense);
    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setScannedData(null);
    
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const startSmartScan = () => setShowScanner(true);

  const simulateCapture = () => {
    setIsProcessingScan(true);
    setTimeout(() => {
      setScannedData({
        recipient: "Nairobi Hardware & Tools",
        amount: 3450,
        date: new Date().toISOString().split('T')[0],
        category: "Maintenance",
        description: "Purchased replacement copper piping for Unit A1 repairs."
      });
      setIsProcessingScan(false);
      setShowScanner(false);
      setIsAddModalOpen(true);
    }, 2500);
  };

  const ScannerView = () => (
    <div className="fixed inset-0 z-[600] bg-black flex flex-col items-center justify-center p-6">
      <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
        <button onClick={() => setShowScanner(false)} className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all"><ArrowLeft size={24} /></button>
        <div className="text-white">
          <h2 className="text-xl font-black tracking-tight">Smart AI Scanner</h2>
          <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Expense Digitization</p>
        </div>
      </div>
      <div className="relative w-full max-w-sm aspect-[3/4] border-2 border-white/20 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute top-10 left-10 w-10 h-10 border-t-4 border-l-4 border-emerald-500 rounded-tl-2xl z-20" />
        <div className="absolute top-10 right-10 w-10 h-10 border-t-4 border-r-4 border-emerald-500 rounded-tr-2xl z-20" />
        <div className="absolute bottom-10 left-10 w-10 h-10 border-b-4 border-l-4 border-emerald-500 rounded-bl-2xl z-20" />
        <div className="absolute bottom-10 right-10 w-10 h-10 border-b-4 border-r-4 border-emerald-500 rounded-br-2xl z-20" />
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
           <Camera size={80} className="text-white/10" />
           {isProcessingScan && <motion.div initial={{ top: '0%' }} animate={{ top: '100%' }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)] z-30" />}
        </div>
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
          <p className="text-white font-black text-xs uppercase tracking-[0.2em] animate-pulse">{isProcessingScan ? 'Analyzing & Reading...' : 'Align receipt within the frame'}</p>
        </div>
      </div>
      {!isProcessingScan && <button onClick={simulateCapture} className="mt-12 w-20 h-20 bg-white rounded-full border-8 border-white/20 shadow-2xl active:scale-90 transition-all flex items-center justify-center group"><div className="w-14 h-14 bg-white border-2 border-slate-900 rounded-full group-hover:scale-95 transition-transform" /></button>}
    </div>
  );

  const ReceiptViewer = ({ url, onClose }: { url: string, onClose: () => void }) => (
    <div className="fixed inset-0 z-[700] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl" />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative max-w-2xl w-full bg-white rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ImageIcon size={20} /></div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Receipt Preview</h3>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
        </div>
        <div className="bg-slate-100 aspect-[3/4] flex items-center justify-center p-8"><img src={url} alt="Receipt" className="max-h-full rounded-2xl shadow-xl border-4 border-white" /></div>
        <div className="p-6 bg-slate-50 flex justify-between items-center">
           <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={16} /><span className="text-[10px] font-black uppercase tracking-widest">Verified Digital Audit Copy</span></div>
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all"><Download size={14} /> Download</button>
        </div>
      </motion.div>
    </div>
  );

  if (showVault) {
    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-4">
            <button onClick={() => setShowVault(false)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><ArrowLeft size={20} /></button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Digital Vault</h1>
              <div className="flex items-center gap-2 text-emerald-600"><ShieldCheck size={14} /><span className="text-[10px] font-black uppercase tracking-widest">KRA Audit Readiness Active</span></div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"><Archive size={14} className="text-emerald-400" />{expenses.length} Documents Archived</div>
        </div>
        {expenses.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 px-1">
            {expenses.map((expense) => (
              <motion.div key={expense.id} whileHover={{ y: -5 }} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col group relative">
                <div onClick={() => expense.receiptUrl && setSelectedReceiptUrl(expense.receiptUrl)} className="aspect-[4/5] bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden cursor-pointer">
                  <FileText size={48} className="text-slate-200 group-hover:text-emerald-100 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent" />
                  <div className="absolute top-4 right-4 p-1.5 bg-white/80 backdrop-blur-md rounded-lg shadow-sm"><CheckCircle2 size={12} className="text-emerald-500" /></div>
                  {expense.receiptUrl && <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-600/20 backdrop-blur-[2px]"><div className="p-3 bg-white rounded-full text-emerald-600 shadow-xl"><Maximize2 size={24} /></div></div>}
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-start"><span className="text-[9px] font-black uppercase tracking-widest text-slate-400 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">{expense.category}</span><span className="text-[9px] font-bold text-slate-400">{expense.date}</span></div>
                  <div><p className="text-xs font-black text-slate-900 truncate">{expense.recipient}</p><p className="text-[11px] font-black text-rose-500 mt-1">KES {expense.amount.toLocaleString()}</p></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : <div className="flex flex-col items-center justify-center py-32 text-center space-y-4"><div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200"><Archive size={40} /></div><div><h4 className="text-xl font-black text-slate-900">Your digital vault is empty</h4><p className="text-slate-500 font-medium">Record an expense to start your digital filing cabinet.</p></div><button onClick={() => { setShowVault(false); setIsAddModalOpen(true); }} className="mt-4 px-8 py-3 bg-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all">Add First Record</button></div>}
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-24 max-w-full">
      <AnimatePresence>
        {showScanner && <ScannerView />}
        {selectedReceiptUrl && <ReceiptViewer url={selectedReceiptUrl} onClose={() => setSelectedReceiptUrl(null)} />}
      </AnimatePresence>

      {/* Floating Action Button */}
      <button onClick={() => setIsAddModalOpen(true)} className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-emerald-700 transition-all active:scale-90 z-[100] sm:hidden" title="Quick Add Expense"><Plus size={28} /></button>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-50/20"><div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center"><CheckCircle2 size={16} /></div><span className="font-black text-xs uppercase tracking-widest">Expense Recorded Successfully</span></motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Expense Hub</h1>
            <p className="text-slate-500 text-sm font-medium">Monitor costs with AI-driven categorization.</p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button onClick={startSmartScan} className="flex items-center justify-center gap-2 px-6 py-4 bg-emerald-50 text-emerald-700 border-2 border-emerald-100 font-black rounded-2xl hover:bg-emerald-100 active:scale-95 transition-all shadow-sm"><Scan size={20} />Smart Scan</button>
          <button onClick={() => setIsAddModalOpen(true)} className="hidden sm:flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 text-white font-black rounded-2xl hover:bg-rose-700 active:scale-95 transition-all shadow-lg shadow-rose-100"><Plus size={20} />Record Expense</button>
        </div>
      </div>

      {/* --- SMART SUMMARY CHART SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-1">
        <div className="lg:col-span-8 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col gap-8">
           <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><BarChart3 size={20} /></div>
              <h3 className="text-xl font-black text-slate-900">Expense Allocation</h3>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              {Object.entries(categorySummary).map(([cat, amount]) => {
                const config = categoryConfigs[cat] || categoryConfigs['Other'];
                // Fixed: Explicitly cast amount to number to fix arithmetic type error on line 291
                const percentage = totalExpenseAmount > 0 ? Math.round(((amount as number) / totalExpenseAmount) * 100) : 0;
                return (
                  <div key={cat} className="space-y-2">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <config.icon size={14} className={config.color} />
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{cat}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-900">KES {(amount as number).toLocaleString()} ({percentage}%)</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full rounded-full ${config.bg.replace('bg-', 'bg-').replace('-50', '-500')}`}
                       />
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 rounded-[3rem] p-8 text-white relative overflow-hidden flex flex-col justify-between shadow-2xl group">
           <div className="relative z-10">
              <div className="flex items-center gap-2 text-emerald-400 mb-6">
                 <Zap size={20} fill="currentColor" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Smart AI Entry</span>
              </div>
              <h4 className="text-xl font-black mb-4">Quick Log</h4>
              <div className="space-y-4">
                 <input 
                  type="text" 
                  placeholder="What did you spend on?"
                  value={smartDesc}
                  onChange={(e) => setSmartDesc(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none font-bold text-sm placeholder:text-white/30 focus:border-emerald-500 transition-all"
                 />
                 <input 
                  type="number" 
                  placeholder="Amount (KES)"
                  value={smartAmount}
                  onChange={(e) => setSmartAmount(e.target.value)}
                  className="w-full p-4 bg-white/10 border border-white/10 rounded-2xl outline-none font-bold text-sm placeholder:text-white/30 focus:border-emerald-500 transition-all"
                 />
                 <button 
                  onClick={handleSmartSave}
                  disabled={isSmartCategorizing || !smartDesc || !smartAmount}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
                 >
                    {/* Fixed: Re-using the Check icon here (now imported correctly) */}
                    {isSmartCategorizing ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} strokeWidth={3} /> Auto-Categorize & Save</>}
                 </button>
              </div>
           </div>
           <BarChart3 size={150} className="absolute -right-12 -bottom-12 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mx-1">
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search payee or category..." className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all text-sm font-bold" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <button className="px-5 py-3.5 bg-slate-50 text-slate-600 font-black rounded-2xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors shrink-0 text-[10px] uppercase tracking-widest"><Filter size={16} />Filter</button>
        </div>

        <div className="md:hidden p-4 space-y-4 bg-slate-50/30">
          {filteredExpenses.map((expense) => {
            const config = categoryConfigs[expense.category] || categoryConfigs['Other'];
            const Icon = config.icon;
            return (
              <motion.div key={expense.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-6 space-y-4 group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${config.bg} ${config.color}`}><Icon size={20} /></div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">{expense.recipient}</h4>
                      <span className={`text-[9px] font-black uppercase tracking-widest ${config.color}`}>{expense.category}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{expense.date}</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Description</p>
                  <p className="text-xs font-bold text-slate-700 leading-relaxed">{expense.description}</p>
                </div>
                <div className="flex justify-between items-end pt-2">
                   <div className="flex items-center gap-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">Amount Paid</p>
                        <span className={`px-3 py-1 rounded-full font-black text-xs ${config.bg} ${config.color}`}>- KES {expense.amount.toLocaleString()}</span>
                      </div>
                      {expense.receiptUrl && <button onClick={() => setSelectedReceiptUrl(expense.receiptUrl || null)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm"><ImageIcon size={18} /></button>}
                   </div>
                   <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:border-rose-200 transition-all shadow-sm"><Receipt size={18} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Payee & Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => {
                const config = categoryConfigs[expense.category] || categoryConfigs['Other'];
                const Icon = config.icon;
                return (
                  <tr key={expense.id} className="odd:bg-white even:bg-slate-50/50 hover:bg-slate-100/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border ${config.border} ${config.bg} ${config.color} group-hover:bg-white transition-colors`}><Icon size={20} /></div>
                        <div className="min-w-0"><p className="font-black text-slate-900 leading-none mb-1.5 truncate">{expense.recipient}</p><span className={`text-[10px] font-black uppercase tracking-widest ${config.color}`}>{expense.category}</span></div>
                      </div>
                    </td>
                    <td className="px-8 py-6"><p className="text-sm font-medium text-slate-600 max-w-xs truncate">{expense.description}</p></td>
                    <td className="px-8 py-6 text-slate-500 text-sm font-bold whitespace-nowrap">{expense.date}</td>
                    <td className="px-8 py-6 whitespace-nowrap"><span className={`px-4 py-2 rounded-full font-black text-sm border ${config.border} ${config.bg} ${config.color}`}>- KES {expense.amount.toLocaleString()}</span></td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-2">{expense.receiptUrl && <button onClick={() => setSelectedReceiptUrl(expense.receiptUrl || null)} className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all shadow-sm" title="View Scanned Receipt"><ImageIcon size={18} /></button>}<button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm"><Receipt size={18} /></button></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredExpenses.length === 0 && <div className="p-20 text-center space-y-4"><div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mx-auto"><X size={40} /></div><div><h4 className="text-xl font-black text-slate-900 tracking-tight">Zero matching expenses</h4><p className="text-slate-500 font-medium">Try refining your search terms.</p></div></div>}
      </div>

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => !isSubmitting && setIsAddModalOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-xl rounded-[3.5rem] shadow-2xl overflow-hidden z-20 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-4"><div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-inner"><Wallet size={24} /></div><div><h3 className="text-2xl font-black text-slate-900 tracking-tight">{scannedData ? 'Review Scanned Data' : 'Record Expense'}</h3><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scannedData ? 'AI Assisted Extraction' : 'Financial Outflow Entry'}</p></div></div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              {scannedData && <div className="mx-8 mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3"><div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><Sparkles size={16} /></div><p className="text-[11px] font-bold text-emerald-800">Smart extraction complete. Please verify auto-filled fields below.</p></div>}
              <form onSubmit={handleSaveExpense} className="p-8 sm:p-10 space-y-6 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Category</label><select name="category" required defaultValue={scannedData?.category || "Maintenance"} className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:border-rose-500 outline-none appearance-none cursor-pointer"><option value="Maintenance">Maintenance 🛠️</option><option value="Utilities">Utilities 💡</option><option value="Taxes">Taxes ⚖️</option><option value="Staff Wages">Staff Wages 👥</option><option value="Marketing">Marketing 📢</option><option value="Legal">Legal ⚖️</option><option value="Other">Other 📦</option></select></div>
                  <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Date</label><div className="relative"><Calendar className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input name="date" type="date" required defaultValue={scannedData?.date || new Date().toISOString().split('T')[0]} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:border-rose-500 outline-none" /></div></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Payee (Vendor)</label><input name="recipient" required defaultValue={scannedData?.recipient} placeholder="Who did you pay?" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black focus:border-rose-500 outline-none" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Total Amount (KES)</label><input name="amount" type="number" required defaultValue={scannedData?.amount} placeholder="0.00" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-rose-600 focus:border-rose-500 outline-none text-xl" /></div>
                <div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Description / Note</label><textarea name="description" required rows={3} defaultValue={scannedData?.description} placeholder="e.g. Repaired burst pipe in Unit A1" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-rose-500 outline-none transition-all resize-none" /></div>
                <div className="flex gap-4 pt-4 shrink-0"><button type="button" onClick={() => { setIsAddModalOpen(false); setScannedData(null); }} className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-[10px] transition-colors hover:bg-slate-200 flex items-center justify-center gap-2"><ArrowLeft size={16} /> Cancel</button><button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-[10px]">{isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <><ShieldCheck size={18} /> Verify & Save to Cloud</>}</button></div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Expenses;
