
import React from 'react';
import { motion } from 'framer-motion';
import { FileSpreadsheet, Info, Download, Receipt } from 'lucide-react';
import { LedgerEntry } from '../types';

interface FinancialLedgerProps {
  entries: LedgerEntry[];
  onDownloadReceipt?: (entry: LedgerEntry) => void;
}

const FinancialLedger: React.FC<FinancialLedgerProps> = ({ entries, onDownloadReceipt }) => {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg">
            <FileSpreadsheet size={18} />
          </div>
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Financial Statement</h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Official Ledger</span>
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Debit (-)</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Credit (+)</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Balance</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {entries.length > 0 ? (
              entries.map((entry, idx) => (
                <motion.tr 
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500 font-mono">{entry.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-slate-900">{entry.description}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-slate-900">
                    {entry.type === 'DEBIT' ? entry.amount.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-black text-emerald-600">
                    {entry.type === 'CREDIT' ? entry.amount.toLocaleString() : '-'}
                  </td>
                  <td className={`px-6 py-4 text-right text-sm font-black ${entry.balance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    KES {entry.balance.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.type === 'CREDIT' && (
                      <button 
                        onClick={() => onDownloadReceipt?.(entry)}
                        className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all active:scale-90"
                        title="Download Receipt"
                      >
                        <Download size={16} />
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-bold uppercase text-[10px]">No entries in ledger.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-2">
         <Info size={14} className="text-slate-400" />
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Balances update in real-time upon receipt verification</p>
      </div>
    </div>
  );
};

export default FinancialLedger;
