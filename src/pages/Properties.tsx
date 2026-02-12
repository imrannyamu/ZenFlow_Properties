
import React, { useState } from 'react';
import { Building2, Plus, MapPin, Search, ChevronRight, User, MoreVertical, LayoutGrid, Info, Landmark } from 'lucide-react';
import { Property, Unit } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Properties: React.FC = () => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('p1');
  const [searchTerm, setSearchTerm] = useState('');

  const properties: Property[] = [
    {
      id: 'p1',
      name: 'Zen Plaza',
      location: 'Westlands, Nairobi',
      units: [
        { id: 'u1', name: 'A1', type: 'Shop', status: 'Occupied', tenantName: 'James Kamau', monthlyRent: 25000, dueDate: 5 },
        { id: 'u2', name: 'A2', type: 'Shop', status: 'Vacant', monthlyRent: 22000, dueDate: 5 },
        { id: 'u3', name: 'B1', type: '1BR', status: 'Occupied', tenantName: 'Sarah Hassan', monthlyRent: 30000, dueDate: 5 },
        { id: 'u4', name: 'B2', type: '1BR', status: 'Vacant', monthlyRent: 28000, dueDate: 5 },
        { id: 'u5', name: 'B3', type: '1BR', status: 'Vacant', monthlyRent: 28000, dueDate: 5 },
        { id: 'u6', name: 'C1', type: '2BR', status: 'Occupied', tenantName: 'Moses Otieno', monthlyRent: 45000, dueDate: 5 },
      ],
    },
    {
      id: 'p2',
      name: 'Emerald Heights',
      location: 'Kilimani, Nairobi',
      units: [
        { id: 'u7', name: '101', type: 'Bedsitter', status: 'Occupied', tenantName: 'Jane Doe', monthlyRent: 15000, dueDate: 1 },
        { id: 'u8', name: '102', type: 'Bedsitter', status: 'Vacant', monthlyRent: 15000, dueDate: 1 },
      ],
    },
  ];

  const selectedProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];

  const filteredUnits = selectedProperty.units.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Property Portfolio</h1>
          <p className="text-slate-500 font-medium">Manage your buildings and inventory with financial precision.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-100">
          <Plus size={20} />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Your Buildings</h3>
          {properties.map((property) => (
            <button
              key={property.id}
              onClick={() => setSelectedPropertyId(property.id)}
              className={`w-full text-left p-6 rounded-[2.5rem] border transition-all ${
                selectedPropertyId === property.id
                  ? 'bg-white border-emerald-500 shadow-xl shadow-emerald-50 ring-1 ring-emerald-500'
                  : 'bg-white border-slate-100 hover:border-emerald-200 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2.5 rounded-xl ${selectedPropertyId === property.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>
                  <Building2 size={20} />
                </div>
                <span className={`font-black tracking-tight text-lg ${selectedPropertyId === property.id ? 'text-slate-900' : 'text-slate-500'}`}>
                  {property.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <MapPin size={12} />
                {property.location}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-full text-slate-500 border border-slate-100">
                  {property.units.length} Units
                </span>
                <ChevronRight size={14} className={selectedPropertyId === property.id ? 'text-emerald-600' : 'text-slate-300'} />
              </div>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-inner">
                  <LayoutGrid size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedProperty.name} Units</h2>
                  <p className="text-sm text-slate-500 font-medium">Monitoring collection schedules and occupancy.</p>
                </div>
              </div>

              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text"
                  placeholder="Filter by name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all font-bold placeholder:text-slate-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredUnits.map((unit) => (
                  <motion.div
                    layout
                    key={unit.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`relative p-8 rounded-[2.5rem] border transition-all group ${
                      unit.status === 'Occupied'
                        ? 'bg-white border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50'
                        : 'bg-slate-50 border-slate-200/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="text-3xl font-black text-slate-900 tracking-tighter">{unit.name}</span>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{unit.type}</span>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        unit.status === 'Occupied' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-200 text-slate-500 border-slate-300'
                      }`}>
                        {unit.status}
                      </span>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-50">
                       <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expected Rent</span>
                          <span className="text-sm font-black text-slate-900">KES {unit.monthlyRent.toLocaleString()}</span>
                       </div>
                    </div>

                    {unit.status === 'Occupied' ? (
                      <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 leading-tight">{unit.tenantName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due on {unit.dueDate}th</p>
                          </div>
                        </div>
                        <Link 
                          to="/tenants" 
                          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all active:scale-95"
                        >
                          Collection Portal <ChevronRight size={14} />
                        </Link>
                      </div>
                    ) : (
                      <div className="mt-6 flex flex-col items-center justify-center py-4 text-center space-y-3">
                        <div className="p-4 bg-white rounded-2xl text-slate-200 border border-slate-100 border-dashed shadow-sm">
                          <Landmark size={24} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[120px]">Market ready for prospective tenants</p>
                        <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:text-emerald-800 transition-colors">
                          Assign Unit
                        </button>
                      </div>
                    )}

                    <button className="absolute top-8 right-8 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600">
                      <MoreVertical size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredUnits.length === 0 && (
              <div className="py-24 text-center flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
                  <Info size={40} />
                </div>
                <h4 className="text-xl font-black text-slate-900 tracking-tight">Zero matches found</h4>
                <p className="text-slate-500 font-medium">Adjust your search parameters and try again.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Properties;
