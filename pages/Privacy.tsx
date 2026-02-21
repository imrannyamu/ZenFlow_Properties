import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Privacy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-slate-50 py-12 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="group inline-flex items-center justify-center gap-3 px-8 py-5 border-2 border-emerald-600 text-emerald-600 font-black rounded-2xl hover:bg-emerald-600 hover:text-white transition-all active:scale-95 mb-12 uppercase tracking-widest text-xs w-full sm:w-auto shadow-sm"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Go Back
        </button>

        <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Shield size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
          </div>

          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Lock size={20} className="text-emerald-600" /> 1. Data Protection
              </h2>
              <p>
                ZenFlow Properties ("we", "our", or "us") is committed to protecting the privacy of property managers and their tenants. We employ military-grade AES-256 encryption to ensure all financial and personal records are inaccessible to unauthorized parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Eye size={20} className="text-emerald-600" /> 2. Information We Collect
              </h2>
              <p>
                We collect information necessary to facilitate property management, including building details, tenant contact info, and transaction metadata via M-Pesa. We do not store full bank credentials or Safaricom PINs.
              </p>
            </section>

            <section className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2 uppercase tracking-widest text-xs">
                <CheckCircle2 size={16} className="text-emerald-600" /> Compliance Note
              </h3>
              <p className="text-sm">
                Our data handling practices comply with the Kenyan Data Protection Act 2019. You have the right to request a full dump of your data or its permanent deletion at any time.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4">3. Third-Party Integration</h2>
              <p>
                Our platform connects to Safaricom Daraja API. Data exchanged during payment prompts is governed by both ZenFlow's and Safaricom's respective privacy policies. We never share your data with advertisers or third-party marketing firms.
              </p>
            </section>

            <div className="pt-8 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              Last Updated: March 2024 • ZenFlow Properties Nairobi
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Privacy;