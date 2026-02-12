
import React, { useState } from 'react';
import { Search, Plus, MoreHorizontal, Smartphone, Filter, Calendar, AlertTriangle, FileText, User } from 'lucide-react';
import { Tenant } from '../types';
import STKPushModal from '../components/STKPushModal';
import ReceiptModal from '../components/ReceiptModal';
import TenantProfileModal from '../components/TenantProfileModal';

const Tenants: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenantForPush, setSelectedTenantForPush] = useState<Tenant | null>(null);
  const [selectedTenantForReceipt, setSelectedTenantForReceipt] = useState<Tenant | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);

  // Helper to check if date is within 60 days
  const isExpiringSoon = (dateStr: string) => {
    const expiryDate = new Date(dateStr);
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays > 0;
  };

  // Improved status calculation logic
  const tenants: Tenant[] = [
    { id: '1', name: 'James Kamau', unit: 'A1', phone: '254712345678', amount: 25000, totalPaid: 0, lateFees: 500, status: 'Overdue', leaseExpiryDate: '2024-04-15', dueDate: 5 },
    { id: '2', name: 'Sarah Hassan', unit: 'B4', phone: '254722000000', amount: 30000, totalPaid: 15000, lateFees: 0, status: 'Arrears', leaseExpiryDate: '2024-05-20', dueDate: 5 },
    { id: '3', name: 'Moses Otieno', unit: 'C2', phone: '254733111222', amount: 18500, totalPaid: 18500, lateFees: 0, status: 'Paid', leaseExpiryDate: '2025-01-10', dueDate: 5 },
  ];

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.unit.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tenant Management</h1>
          <p className="text-slate-500 font-medium">Overview of active leases and detailed payment history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-slate-200">
          <Plus size={20} />
          Add Tenant
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text"
              placeholder="Search by name, unit or phone..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="px-6 py-3 bg-slate-50 text-slate-600 font-semibold rounded-2xl border border-slate-200 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
            <Filter size={18} />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit & Due</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rent</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTenants.map((tenant) => {
                const expiring = isExpiringSoon(tenant.leaseExpiryDate);
                const statusConfig = {
                  'Paid': 'bg-emerald-50 text-emerald-600 border-emerald-100',
                  'Unpaid': 'bg-slate-50 text-slate-500 border-slate-200',
                  'Overdue': 'bg-rose-50 text-rose-600 border-rose-100',
                  'Arrears': 'bg-amber-50 text-amber-600 border-amber-100',
                };

                return (
                  <tr key={tenant.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setViewingTenant(tenant)}
                          className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all overflow-hidden"
                        >
                          {tenant.name.charAt(0)}
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setViewingTenant(tenant)}
                              className="font-bold text-slate-900 leading-tight hover:text-emerald-600 transition-colors"
                            >
                              {tenant.name}
                            </button>
                            {expiring && (
                              <div className="group/exp relative">
                                <Calendar size={14} className="text-amber-500 animate-pulse" />
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover/exp:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                                  Lease expires {new Date(tenant.leaseExpiryDate).toLocaleDateString()}
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{tenant.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm font-black text-slate-900 leading-none mb-1">{tenant.unit}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due on {tenant.dueDate}th</p>
                    </td>
                    <td className="px-6 py-5 font-black text-slate-900">
                      KES {tenant.amount.toLocaleString()}
                      {tenant.lateFees > 0 && <span className="block text-[10px] text-rose-500 font-bold">+ KES {tenant.lateFees.toLocaleString()} Fee</span>}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusConfig[tenant.status]}`}>
                        {tenant.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {tenant.status === 'Paid' ? (
                          <button 
                            onClick={() => setSelectedTenantForReceipt(tenant)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-slate-200"
                          >
                            <FileText size={14} />
                            Receipt
                          </button>
                        ) : (
                          <button 
                            onClick={() => setSelectedTenantForPush(tenant)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-md shadow-emerald-50"
                          >
                            <Smartphone size={14} />
                            Request
                          </button>
                        )}
                        <button 
                          onClick={() => setViewingTenant(tenant)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <User size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredTenants.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              No tenants found matching your search.
            </div>
          )}
        </div>
      </div>

      <STKPushModal 
        tenant={selectedTenantForPush} 
        onClose={() => setSelectedTenantForPush(null)} 
      />

      <ReceiptModal 
        tenant={selectedTenantForReceipt}
        onClose={() => setSelectedTenantForReceipt(null)}
      />

      <TenantProfileModal 
        tenant={viewingTenant}
        onClose={() => setViewingTenant(null)}
      />
    </div>
  );
};

export default Tenants;
