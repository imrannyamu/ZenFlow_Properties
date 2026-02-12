
import React, { useState } from 'react';
import { Search, Plus, Filter, Wallet, Receipt, Wrench, Lightbulb, UserCog, Scale } from 'lucide-react';
import { Expense } from '../types';

const Expenses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const expenses: Expense[] = [
    { id: '1', category: 'Maintenance', description: 'Plumbing fix in Unit B2', amount: 3500, date: 'Mar 12, 2024', recipient: 'Nairobi Plumbers Ltd' },
    { id: '2', category: 'Utilities', description: 'Electricity (Common Area)', amount: 12400, date: 'Mar 10, 2024', recipient: 'Kenya Power' },
    { id: '3', category: 'Staff', description: 'Caretaker Wages', amount: 45000, date: 'Mar 05, 2024', recipient: 'Samuel Mwaniki' },
    { id: '4', category: 'Taxes', description: 'Quarterly Land Rates', amount: 119600, date: 'Feb 28, 2024', recipient: 'County Government' },
  ];

  const categoryIcons = {
    Maintenance: Wrench,
    Utilities: Lightbulb,
    Staff: UserCog,
    Taxes: Scale,
  };

  const filteredExpenses = expenses.filter(e => 
    e.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expense Tracking</h1>
          <p className="text-slate-500">Monitor your property costs and overheads.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-600 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-rose-100">
          <Plus size={20} />
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(categoryIcons).map(([cat, Icon]) => (
          <div key={cat} className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center gap-4">
            <div className="p-3 bg-slate-50 text-slate-400 rounded-xl">
              <Icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{cat}</p>
              <p className="font-bold text-slate-900">
                KES {expenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search expenses by category or description..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-slate-50 text-slate-600 font-semibold rounded-2xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
            Category
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Expense Details</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Recipient</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.map((expense) => {
                const Icon = categoryIcons[expense.category];
                return (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                          <Icon size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{expense.description}</p>
                          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{expense.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-slate-500 text-sm font-medium">{expense.date}</td>
                    <td className="px-6 py-5 text-slate-600 font-bold">{expense.recipient}</td>
                    <td className="px-6 py-5 font-black text-rose-600">KES {expense.amount.toLocaleString()}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                        <Receipt size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredExpenses.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No expenses found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
