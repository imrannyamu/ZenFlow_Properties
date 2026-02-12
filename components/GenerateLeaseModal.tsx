
import React from 'react';
import { X, FileText, Download, Printer, CheckCircle, MapPin, User, Calendar } from 'lucide-react';
import { Tenant } from '../types';

interface GenerateLeaseModalProps {
  tenant: Tenant;
  onClose: () => void;
}

const GenerateLeaseModal: React.FC<GenerateLeaseModalProps> = ({ tenant, onClose }) => {
  const today = new Date().toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md animate-in fade-in" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-xl text-white">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-widest leading-none">Lease Generator</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Template: Standard Residential Kenya</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-all font-bold text-xs uppercase tracking-widest">
              <Printer size={16} /> Print
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all font-bold text-xs uppercase tracking-widest shadow-lg shadow-emerald-100">
              <Download size={16} /> Export PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-all ml-2">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-slate-100/50 p-8 sm:p-12">
          <div className="max-w-[210mm] mx-auto bg-white shadow-xl p-16 min-h-[297mm] text-slate-800 font-serif leading-relaxed text-sm">
            {/* Template Header */}
            <div className="text-center mb-12">
              <h1 className="text-3xl font-black tracking-tight mb-2 font-sans text-slate-900 uppercase">Residential Lease Agreement</h1>
              <p className="text-slate-400 font-sans text-xs uppercase tracking-[0.2em]">ZenFlow Managed Properties</p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="font-sans font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200 pb-2 mb-4">1. Parties</h2>
                <p>This lease agreement is made on this <strong>{today}</strong> between:</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Landlord:</strong> ZenFlow Managed Properties (On behalf of Asset owner)</p>
                  <p><strong>Tenant:</strong> {tenant.name} ({tenant.phone})</p>
                </div>
              </section>

              <section>
                <h2 className="font-sans font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200 pb-2 mb-4">2. Premises</h2>
                <p>The Landlord agrees to lease to the Tenant the following property:</p>
                <p className="mt-2"><strong>Unit {tenant.unit}</strong>, located at Zen Plaza, Westlands, Nairobi, Kenya.</p>
              </section>

              <section>
                <h2 className="font-sans font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200 pb-2 mb-4">3. Rent and Term</h2>
                <p>The Monthly Rent is <strong>KES {tenant.amount.toLocaleString()}</strong>, payable in advance on the <strong>{tenant.dueDate}th day</strong> of each calendar month via M-Pesa or Bank Transfer.</p>
                <p className="mt-2">The lease term shall commence on <strong>{today}</strong> and expire on <strong>{new Date(tenant.leaseExpiryDate).toLocaleDateString()}</strong>.</p>
              </section>

              <section>
                <h2 className="font-sans font-black text-slate-900 uppercase tracking-widest text-xs border-b border-slate-200 pb-2 mb-4">4. General Provisions</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>The Tenant shall maintain the unit in clean and sanitary condition.</li>
                  <li>Late payments after the grace period will incur a penalty of KES 500.</li>
                  <li>No unauthorized alterations to the property are permitted without written consent.</li>
                  <li>Notice for termination is required at least one month in advance.</li>
                </ul>
              </section>

              <div className="pt-20 grid grid-cols-2 gap-20">
                <div className="border-t border-slate-300 pt-4">
                  <p className="font-sans font-bold text-xs uppercase tracking-widest mb-1 text-slate-400">Landlord Signature</p>
                  <div className="h-16 flex items-end">
                    <span className="text-2xl font-black font-sans text-emerald-600 opacity-20">ZENFLOW</span>
                  </div>
                </div>
                <div className="border-t border-slate-300 pt-4">
                  <p className="font-sans font-bold text-xs uppercase tracking-widest mb-1 text-slate-400">Tenant Signature</p>
                  <div className="h-16 italic text-slate-300">Electronically Signed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateLeaseModal;
