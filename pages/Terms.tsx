import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, FileText, Wallet, AlertCircle, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms: React.FC = () => {
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
              <Scale size={32} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
          </div>

          <div className="space-y-8 text-slate-600 font-medium leading-relaxed">
            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <FileText size={20} className="text-emerald-600" /> 1. Acceptance of Terms
              </h2>
              <p>
                By accessing ZenFlow Properties, you agree to be bound by these terms. Our software is provided as-is to assist with administrative property tasks. Property managers remain legally responsible for their own lease compliance and tax filings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Wallet size={20} className="text-emerald-600" /> 2. Subscription & Payments
              </h2>
              <p>
                Subscriptions are billed monthly at the rate of KES 3,000. Failure to pay will result in a 7-day grace period before account features are restricted. Refund requests are handled on a case-by-case basis within the first 14 days of a billing cycle.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-emerald-600" /> 3. Prohibited Use
              </h2>
              <p>
                Users may not use ZenFlow for money laundering, fraudulent rent collection, or any activity that violates the laws of Kenya. We reserve the right to terminate accounts that misuse our M-Pesa API integrations.
              </p>
            </section>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-amber-900 text-sm font-bold">
              Note: ZenFlow is an administrative tool and does not provide legal or financial advice. Always consult a qualified professional for legal disputes with tenants.
            </div>

            <div className="pt-8 border-t border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">
              Last Updated: March 2024 • Nairobi, Kenya
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Terms;