
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Building2, Plus, MapPin, Search, ChevronRight, User, 
  MoreVertical, LayoutGrid, Info, Landmark, Folder, 
  Edit3, FileText, CheckCircle2, AlertCircle, X, Loader2,
  ArrowLeft, Home, Building, LayoutDashboard, ShieldCheck,
  Camera, ArrowRight, ShieldAlert, History
} from 'lucide-react';
import { Property, Unit, Tenant } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';

interface PropertiesProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
}

const Properties: React.FC<PropertiesProps> = ({ properties = [], setProperties }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const paramId = searchParams.get('id');
  const [viewMode, setViewMode] = useState<'grid' | 'detail'>(paramId ? 'detail' : 'grid');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(paramId);
  const [activeDetailTab, setActiveDetailTab] = useState<'inventory' | 'reports'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');

  const allTenants: Tenant[] = useMemo(() => {
    try {
      const saved = localStorage.getItem('zenflow_tenants');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setSelectedPropertyId(id);
      setViewMode('detail');
    } else {
      setViewMode('grid');
    }
  }, [searchParams]);

  const selectedProperty = useMemo(() => 
    properties.find(p => p.id === selectedPropertyId) || properties[0],
    [properties, selectedPropertyId]
  );

  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-[2.5rem] flex items-center justify-center text-slate-300 mb-6"><Building2 size={40} /></div>
        <h2 className="text-2xl font-black text-slate-900">No properties found.</h2>
        <p className="text-slate-500 font-medium">Add your first building to start managing inventory.</p>
        <button className="mt-8 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg">Add Property</button>
      </div>
    );
  }

  const filteredUnits = (selectedProperty?.units || []).filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const calculateOccupancy = (property: Property) => {
    const occupied = (property.units || []).filter(u => u.status === 'Occupied').length;
    const total = (property.units || []).length;
    return { 
      percentage: total > 0 ? Math.round((occupied / total) * 100) : 0,
      text: `${occupied}/${total} Units Full`
    };
  };

  const renderConditionReports = () => {
    const occupiedUnits = (selectedProperty?.units || []).filter(u => u.status === 'Occupied');
    
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tight mb-1">Condition Audit</h3>
              <p className="text-slate-400 text-sm font-medium">Verify move-in evidence to prevent deposit disputes.</p>
            </div>
            <div className="flex gap-4">
               <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                  <p className="text-2xl font-black text-emerald-400">92%</p>
                  <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Compliance</p>
               </div>
            </div>
          </div>
          <ShieldCheck size={200} className="absolute -right-16 -bottom-16 text-white/5 rotate-12" />
        </div>

        <div className="grid grid-cols-1 gap-6">
          {occupiedUnits.map(unit => {
            const tenant = allTenants.find(t => t.unit === unit.name);
            const hasReport = tenant?.conditionReportSubmitted;
            
            return (
              <div key={unit.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:border-emerald-200 transition-all">
                <div className="flex items-center gap-6">
                  <div className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-inner ${hasReport ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`}>
                    <Camera size={40} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-black text-slate-900">Unit {unit.name}</h4>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${hasReport ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                        {hasReport ? 'Evidence Logged' : 'Missing Evidence'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tenant: {unit.tenantName || 'N/A'}</p>
                  </div>
                </div>
                <button 
                  disabled={!hasReport}
                  onClick={() => hasReport && alert("Displaying side-by-side comparison...")}
                  className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${hasReport ? 'bg-slate-900 text-white hover:bg-emerald-600' : 'bg-slate-100 text-slate-300'}`}
                >
                  View Report <ArrowRight size={14} className="ml-2 inline" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {properties.map(property => {
        const stats = calculateOccupancy(property);
        return (
          <motion.div 
            key={property.id} 
            whileHover={{ y: -10 }} 
            onClick={() => setSearchParams({ id: property.id })}
            className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm cursor-pointer hover:shadow-xl hover:shadow-emerald-50/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-10">
               <div className="p-5 bg-emerald-50 text-emerald-600 rounded-[1.5rem] group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                  <Building2 size={32} />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1 leading-none">Occupancy</p>
                  <p className={`text-2xl font-black ${stats.percentage > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>{stats.percentage}%</p>
               </div>
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">{property.name}</h3>
            <p className="text-slate-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest mb-10"><MapPin size={14} /> {property.location}</p>
            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stats.text}</span>
               <ChevronRight size={20} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-4">
          {viewMode === 'detail' && (
            <button onClick={() => { setSearchParams({}); setViewMode('grid'); }} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><ArrowLeft size={20} /></button>
          )}
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{viewMode === 'grid' ? 'Portfolio' : selectedProperty?.name}</h1>
            <p className="text-slate-500 font-medium">{viewMode === 'grid' ? 'Buildings and strategic asset overview.' : `Location: ${selectedProperty?.location}`}</p>
          </div>
        </div>
        {viewMode === 'detail' && (
           <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start">
             <button onClick={() => setActiveDetailTab('inventory')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDetailTab === 'inventory' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Inventory</button>
             <button onClick={() => setActiveDetailTab('reports')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeDetailTab === 'reports' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100' : 'text-slate-400'}`}>Conditions</button>
           </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          renderGrid()
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 min-h-[500px]">
            {activeDetailTab === 'inventory' ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3"><LayoutGrid className="text-emerald-600" /> Unit Inventory</h2>
                  <div className="relative flex-1 max-w-sm"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Filter unit..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl font-bold" /></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUnits.length > 0 ? filteredUnits.map((unit) => (
                    <div key={unit.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex flex-col justify-between group hover:border-emerald-500 transition-all">
                       <div className="mb-6">
                          <div className="flex justify-between items-start mb-4">
                             <span className="text-2xl font-black text-slate-900">{unit.name}</span>
                             <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${unit.status === 'Vacant' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{unit.status}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{unit.type}</p>
                          <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Monthly Rent</p>
                             <p className="text-xl font-black text-slate-900">KES {unit.monthlyRent.toLocaleString()}</p>
                          </div>
                       </div>
                       {unit.status === 'Occupied' && (
                         <div className="pt-4 border-t border-slate-200">
                            <p className="text-[9px] font-black text-slate-400 uppercase">Current Resident</p>
                            <p className="font-black text-slate-900">{unit.tenantName}</p>
                         </div>
                       )}
                    </div>
                  )) : <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase text-xs">No matching units.</div>}
                </div>
              </>
            ) : renderConditionReports()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Properties;
