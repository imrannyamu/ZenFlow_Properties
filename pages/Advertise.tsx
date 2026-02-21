import React, { useState, useMemo } from 'react';
import { 
  Megaphone, Plus, Share2, Eye, Copy, 
  CheckCircle2, X, LayoutGrid, Building2, 
  MapPin, Wifi, Shield, Car, Camera, 
  ChevronRight, ArrowLeft, MessageCircle, 
  Facebook, Twitter, ExternalLink, Sparkles,
  // Added missing Check icon import
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Property, Unit } from '../types';

interface AdvertiseProps {
  properties: Property[];
}

interface AdListing {
  unitId: string;
  headline: string;
  amenities: string[];
  isPublished: boolean;
}

const Advertise: React.FC<AdvertiseProps> = ({ properties }) => {
  const navigate = useNavigate();
  const [activeAds, setActiveAds] = useState<AdListing[]>(() => {
    const saved = localStorage.getItem('zenflow_ads');
    return saved ? JSON.parse(saved) : [];
  });

  const [creatingAdFor, setCreatingAdFor] = useState<Unit | null>(null);
  const [sharingAd, setSharingAd] = useState<AdListing | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Filter for vacant units across portfolio
  const vacantUnits = useMemo(() => {
    const list: { property: Property; unit: Unit }[] = [];
    properties.forEach(p => {
      p.units.filter(u => u.status === 'Vacant').forEach(u => {
        list.push({ property: p, unit: u });
      });
    });
    return list;
  }, [properties]);

  const handleCreateAd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!creatingAdFor) return;

    const formData = new FormData(e.currentTarget);
    const amenities = Array.from(formData.getAll('amenities')) as string[];
    
    const newAd: AdListing = {
      unitId: creatingAdFor.id,
      headline: formData.get('headline') as string,
      amenities,
      isPublished: true
    };

    const updated = [newAd, ...activeAds.filter(a => a.unitId !== newAd.unitId)];
    setActiveAds(updated);
    localStorage.setItem('zenflow_ads', JSON.stringify(updated));
    
    setCreatingAdFor(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyListingLink = (unitId: string) => {
    const url = `${window.location.origin}/#/listing/${unitId}`;
    navigator.clipboard.writeText(url);
    alert("Listing Link Copied to Clipboard!");
  };

  const renderAdBuilder = () => (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCreatingAdFor(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden z-20">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <Megaphone size={24} />
             </div>
             <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Create Listing</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit {creatingAdFor?.name} • Market Builder</p>
             </div>
          </div>
          <button onClick={() => setCreatingAdFor(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
        </div>

        <form onSubmit={handleCreateAd} className="p-10 space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Marketing Headline</label>
              <input 
                name="headline" 
                required 
                placeholder="e.g. Modern 1BR in Westlands - Near Sarit Centre" 
                className="w-full p-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:border-emerald-500 outline-none" 
              />
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Key Amenities</label>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   { id: 'wifi', label: 'Fiber WiFi', icon: Wifi },
                   { id: 'security', label: '24/7 Security', icon: Shield },
                   { id: 'parking', label: 'Free Parking', icon: Car },
                   { id: 'backup', label: 'Generator Backup', icon: Sparkles },
                 ].map(item => (
                   <label key={item.id} className="cursor-pointer group">
                      <input type="checkbox" name="amenities" value={item.id} className="peer hidden" />
                      <div className="p-4 rounded-2xl border-2 border-slate-50 flex items-center gap-3 peer-checked:bg-emerald-50 peer-checked:border-emerald-500 transition-all">
                         <item.icon size={18} className="text-slate-400 peer-checked:text-emerald-600" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                      </div>
                   </label>
                 ))}
              </div>
           </div>

           <div className="pt-4 flex gap-4">
              <button type="button" onClick={() => setCreatingAdFor(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-xs">Cancel</button>
              <button type="submit" className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all uppercase tracking-widest text-sm">
                 Publish Public Listing
              </button>
           </div>
        </form>
      </motion.div>
    </div>
  );

  const renderShareModal = () => (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSharingAd(null)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white w-full max-w-sm rounded-[3rem] shadow-2xl p-10 z-20">
         <div className="text-center mb-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Share2 size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Share Listing</h3>
            <p className="text-slate-500 font-medium">Recruit tenants via social media.</p>
         </div>

         <div className="space-y-3">
            <button onClick={() => copyListingLink(sharingAd!.unitId)} className="w-full py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white hover:border-emerald-500 transition-all">
               <Copy size={18} /> Copy Listing Link
            </button>
            <div className="grid grid-cols-3 gap-3">
               <button className="p-4 bg-emerald-500 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg"><MessageCircle size={24} /></button>
               <button className="p-4 bg-blue-600 text-white rounded-2xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg"><Facebook size={24} /></button>
               <button className="p-4 bg-sky-400 text-white rounded-2xl flex items-center justify-center hover:bg-sky-500 transition-all shadow-lg"><Twitter size={24} /></button>
            </div>
         </div>
         <button onClick={() => setSharingAd(null)} className="w-full py-4 text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mt-8">Close</button>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed top-24 left-1/2 -translate-x-1/2 z-[300] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-emerald-50/20">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="font-black text-xs uppercase tracking-widest">Ad Published Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Market & Advertise</h1>
          <p className="text-slate-500 font-medium">Turn vacant units into high-performing revenue streams.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
          <Sparkles size={16} /> {vacantUnits.length} Units Vacant
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* VACANT UNITS LIST */}
        <div className="lg:col-span-2 space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Available Inventory</h3>
           <div className="space-y-4">
              {vacantUnits.map(({ property, unit }) => {
                const existingAd = activeAds.find(a => a.unitId === unit.id);
                return (
                  <motion.div key={unit.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-lg transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                           <Camera size={40} />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className="text-xl font-black text-slate-900">Unit {unit.name}</span>
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-lg text-[9px] font-black uppercase tracking-widest">{unit.type}</span>
                           </div>
                           <p className="text-xs font-bold text-slate-400 flex items-center gap-1"><MapPin size={12} /> {property.name} • {property.location}</p>
                           <p className="mt-2 text-lg font-black text-emerald-600">KES {unit.monthlyRent.toLocaleString()}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        {existingAd ? (
                           <>
                              <button onClick={() => setSharingAd(existingAd)} className="p-4 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all active:scale-95"><Share2 size={20} /></button>
                              <button onClick={() => navigate(`/listing/${unit.id}`)} className="px-6 py-4 bg-emerald-50 text-emerald-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all flex items-center gap-2">
                                 <Eye size={18} /> View Public Ad
                              </button>
                           </>
                        ) : (
                           <button onClick={() => setCreatingAdFor(unit)} className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 flex items-center gap-2">
                              <Plus size={18} /> Create Ad
                           </button>
                        )}
                     </div>
                  </motion.div>
                );
              })}
           </div>
        </div>

        {/* ANALYTICS / TIPS */}
        <div className="space-y-6">
           <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-4">Market Stats</h3>
           <div className="bg-slate-900 rounded-[3rem] p-8 text-white space-y-8 relative overflow-hidden shadow-2xl">
              <div className="relative z-10">
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-4">Ad Performance</p>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-400">Total Ad Views</span>
                          <span className="text-2xl font-black">1,204</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 w-[65%]" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <span className="text-xs font-bold text-slate-400">Applications Recieved</span>
                          <span className="text-2xl font-black text-emerald-400">42</span>
                       </div>
                    </div>
                 </div>
              </div>
              <Megaphone size={160} className="absolute -right-12 -bottom-12 text-white/5 rotate-12" />
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <Sparkles size={20} />
                 </div>
                 <h4 className="font-black text-slate-900 tracking-tight">Marketing Tip</h4>
              </div>
              <p className="text-xs font-medium text-slate-500 leading-relaxed italic">"Listings with clear 'Amenity Icons' like High Speed WiFi or 24/7 Security get 3x more interest in the Westlands area."</p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span>Active Ads: {activeAds.length}</span>
                 <Check size={14} className="text-emerald-500" />
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {creatingAdFor && renderAdBuilder()}
        {sharingAd && renderShareModal()}
      </AnimatePresence>
    </div>
  );
};

export default Advertise;