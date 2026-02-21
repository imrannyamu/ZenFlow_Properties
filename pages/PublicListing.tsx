import React, { useMemo } from 'react';
import { 
  Building2, MapPin, Zap, Shield, Wifi, Car, 
  ArrowLeft, Share2, Camera, UserCheck, 
  CheckCircle2, Smartphone, Home, Sparkles, Send
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Property } from '../types';

interface PublicListingProps {
  properties: Property[];
}

const PublicListing: React.FC<PublicListingProps> = ({ properties }) => {
  const { unitId } = useParams();
  const navigate = useNavigate();

  const data = useMemo(() => {
    for (const p of properties) {
      const u = p.units.find(unit => unit.id === unitId);
      if (u) return { property: p, unit: u };
    }
    return null;
  }, [properties, unitId]);

  const adData = useMemo(() => {
    const saved = localStorage.getItem('zenflow_ads');
    if (!saved) return null;
    const ads = JSON.parse(saved);
    return ads.find((a: any) => a.unitId === unitId);
  }, [unitId]);

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-10">
      <div className="text-center">
         <h2 className="text-2xl font-black text-slate-900 mb-4">Listing Not Found</h2>
         <button onClick={() => navigate('/')} className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold">Return Home</button>
      </div>
    </div>
  );

  const { property, unit } = data;
  const headline = adData?.headline || `Modern ${unit.type} in ${property.location}`;
  const amenities = adData?.amenities || ['wifi', 'security', 'parking'];

  const amenityConfig: any = {
    wifi: { label: 'Fiber WiFi', icon: Wifi },
    security: { label: '24/7 Security', icon: Shield },
    parking: { label: 'Free Parking', icon: Car },
    backup: { label: 'Generator Backup', icon: Sparkles },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER NAV */}
      <nav className="fixed top-0 left-0 right-0 h-[73px] bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 flex items-center">
         <div className="max-w-6xl mx-auto px-6 w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="bg-emerald-600 p-2 rounded-xl text-white">
                  <Zap size={20} fill="white" />
               </div>
               <span className="text-xl font-black tracking-tight text-slate-900">ZenFlow <span className="text-emerald-600">Listings</span></span>
            </div>
            <div className="flex items-center gap-3">
               <button onClick={() => alert("Share UI would open here")} className="p-3 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all"><Share2 size={20} /></button>
               <button onClick={() => navigate('/apply')} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-600 transition-all">Apply Now</button>
            </div>
         </div>
      </nav>

      {/* CONTENT */}
      <main className="pt-[110px] pb-24 max-w-6xl mx-auto px-6">
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* LEFT: GALLERY & INFO */}
            <div className="lg:col-span-3 space-y-10">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">{headline}</h1>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 font-medium">
                     <div className="flex items-center gap-1.5"><MapPin size={18} className="text-emerald-600" /> {property.location}</div>
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                     <div className="flex items-center gap-1.5"><Building2 size={18} className="text-emerald-600" /> {property.name}</div>
                  </div>
               </motion.div>

               {/* MOCK GALLERY */}
               <div className="grid grid-cols-4 gap-4 aspect-[16/9]">
                  <div className="col-span-3 bg-slate-100 rounded-[3rem] overflow-hidden flex items-center justify-center text-slate-300 relative group">
                     <Camera size={80} className="group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-emerald-600/5 group-hover:bg-emerald-600/10 transition-colors" />
                     <div className="absolute bottom-10 left-10 p-6 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20 text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Primary View</p>
                        <h4 className="text-xl font-black">Main Living Area</h4>
                     </div>
                  </div>
                  <div className="flex flex-col gap-4">
                     <div className="flex-1 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border-2 border-slate-100"><Camera size={32} /></div>
                     <div className="flex-1 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border-2 border-slate-100"><Camera size={32} /></div>
                  </div>
               </div>

               <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b-2 border-slate-100 pb-4">About this unit</h3>
                  <p className="text-lg text-slate-500 leading-relaxed font-medium">
                     Experience premium living in the heart of the city. This unit is professionally managed by ZenFlow, ensuring 24/7 maintenance support and seamless digital rent collection. Designed for modern comfort with high-quality finishes and ample natural light.
                  </p>
               </section>

               <section className="space-y-6">
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight border-b-2 border-slate-100 pb-4">Standard Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                     {amenities.map((key: string) => {
                        const config = amenityConfig[key];
                        if (!config) return null;
                        return (
                           <div key={key} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col items-center text-center gap-3 hover:border-emerald-200 transition-all group">
                              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all">
                                 <config.icon size={24} />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{config.label}</span>
                           </div>
                        );
                     })}
                  </div>
               </section>
            </div>

            {/* RIGHT: PRICING CARD */}
            <div className="lg:col-span-2">
               <div className="sticky top-[110px] space-y-6">
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group">
                     <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-500/20">
                           <UserCheck size={12} /> Unit Available Now
                        </div>
                        <div className="mb-10">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Monthly Rent</p>
                           <div className="flex items-baseline gap-2">
                              <span className="text-6xl font-black tracking-tighter">KES {unit.monthlyRent.toLocaleString()}</span>
                              <span className="text-slate-400 font-bold">/mo</span>
                           </div>
                        </div>

                        <div className="space-y-4 mb-10">
                           <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12} strokeWidth={4} /></div>
                              <span className="text-sm font-bold">No Hidden Fees</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12} strokeWidth={4} /></div>
                              <span className="text-sm font-bold">Transparent Metering</span>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-white"><CheckCircle2 size={12} strokeWidth={4} /></div>
                              <span className="text-sm font-bold">ZenFlow Verified Listing</span>
                           </div>
                        </div>

                        <button 
                           onClick={() => navigate('/apply')}
                           className="w-full py-6 bg-emerald-600 text-white rounded-3xl font-black text-lg uppercase tracking-widest shadow-xl shadow-emerald-900/40 hover:bg-emerald-500 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                        >
                           <Send size={24} /> Secure this Unit
                        </button>
                     </div>
                     <Building2 size={240} className="absolute -right-20 -bottom-20 text-white/5 rotate-12 group-hover:rotate-6 transition-transform duration-1000" />
                  </div>

                  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 space-y-6">
                     <div className="flex items-center gap-3">
                        <Smartphone size={24} className="text-emerald-600" />
                        <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Modern Tenant Services</h4>
                     </div>
                     <p className="text-xs font-medium text-slate-500 leading-relaxed">
                        Rent this unit and gain access to the ZenFlow Tenant Portal: M-Pesa STK rent payments, instant receipting, and 24/7 maintenance reporting.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
};

export default PublicListing;