
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, HelpCircle, Smartphone, ShieldCheck, 
  Zap, ArrowLeft, Plus, Users, Landmark, Wrench, 
  ShieldAlert, Briefcase, Minus, Search, CreditCard,
  FileText, History
} from 'lucide-react';
import { UserRole } from '../types';

interface FAQData {
  question: string;
  answer: React.ReactNode;
  role: 'LANDLORD' | 'MANAGER' | 'TENANT';
}

const AccordionItem: React.FC<{ faq: FAQData; isOpen: boolean; onClick: () => void }> = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-slate-100 last:border-0">
    <button 
      onClick={onClick}
      className="w-full py-6 px-4 md:px-8 flex items-center justify-between text-left transition-all hover:bg-slate-50 group"
    >
      <span className={`text-lg md:text-xl font-black transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-900 group-hover:text-emerald-600'}`}>
        {faq.question}
      </span>
      <div className={`shrink-0 p-2 rounded-xl transition-all ${isOpen ? 'bg-emerald-600 text-white rotate-180' : 'bg-slate-100 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}>
        {isOpen ? <Minus size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={3} />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="overflow-hidden bg-emerald-50/20"
        >
          <div className="px-4 md:px-8 pb-10 pt-2 text-slate-600 font-medium leading-relaxed text-base md:text-lg border-l-4 border-emerald-500 ml-4 md:ml-8">
            {faq.answer}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

interface HelpProps {
  userRole?: UserRole | null;
}

const Help: React.FC<HelpProps> = ({ userRole }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Set initial tab based on user role or default to Landlord
  const [activeTab, setActiveTab] = useState<'LANDLORD' | 'MANAGER' | 'TENANT'>(() => {
    if (userRole === 'MANAGER') return 'MANAGER';
    if (userRole === 'TENANT') return 'TENANT';
    return 'LANDLORD';
  });

  const faqs: FAQData[] = [
    // --- LANDLORD FAQS ---
    {
      role: 'LANDLORD',
      question: "How do I monitor my Manager’s performance?",
      answer: (
        <div className="space-y-4">
          <p>ZenFlow provides full transparency into operations. You can monitor performance via the <strong>Maintenance Logs</strong> and <strong>Expense Audit Trails</strong>. By checking the <strong>'Resolution Time'</strong> on maintenance tickets, you can see how fast your manager is responding to tenant issues.</p>
          <p>Additionally, the <strong>Expense Scans</strong> in the Digital Vault allow you to verify every shilling spent with actual photographic evidence of receipts, ensuring your manager remains accountable for every procurement.</p>
        </div>
      )
    },
    {
      role: 'LANDLORD',
      question: "How does Zenflow help with KRA/Tax compliance?",
      answer: (
        <p>The <strong>Report Center</strong> is engineered for Kenyan tax laws. It automatically isolates your gross residential rent to calculate the <strong>7.5% Monthly Rental Income (MRI) Tax</strong>. You can generate a <strong>KRA-Ready Schedule</strong> that matches the iTax upload template, reducing your monthly filing time from hours to seconds while ensuring <strong>100% mathematical accuracy</strong>.</p>
      )
    },
    {
      role: 'LANDLORD',
      question: "What is the Executive Overview?",
      answer: (
        <div className="space-y-4">
          <p>The Executive Overview is your high-level financial command center. It features <strong>4 Key Performance Indicator (KPI) cards</strong>:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Monthly Collection:</strong> Real-time tally of all rent received vs the current week's growth.</li>
            <li><strong>Portfolio Occupancy:</strong> A percentage breakdown of leased vs vacant units across all buildings.</li>
            <li><strong>Outstanding Debt:</strong> A total KES value of all arrears currently held by tenants.</li>
            <li><strong>Est. Income Tax:</strong> A live calculation of your upcoming MRI tax obligation.</li>
          </ul>
        </div>
      )
    },
    {
      role: 'LANDLORD',
      question: "Is the Document Vault truly secure for Title Deeds?",
      answer: (
        <p>Security is our absolute priority. Sensitive property documents—including <strong>Title Deeds, Floor Plans, and Signed Leases</strong>—are encrypted using <strong>bank-grade AES-256 protocols</strong>. These files are stored in a <strong>hardened digital vault</strong>. Even ZenFlow system administrators cannot view your private attachments; your encryption keys remain tied strictly to your authenticated session.</p>
      )
    },
    // --- MANAGER FAQS ---
    {
      role: 'MANAGER',
      question: "How exactly happens in the 'Mark as Paid' SMS flow?",
      answer: (
        <div className="space-y-4">
          <p>When you click <strong>'Mark as Paid'</strong> on a tenant record, the system performs a three-step action:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><strong>Ledger Update:</strong> Instantly clears the balance and updates the status to 'Paid'.</li>
            <li><strong>REF Generation:</strong> A unique 10-digit <strong>ZNF alphanumeric reference</strong> (e.g., ZF7892K10L) is generated for audit purposes.</li>
            <li><strong>SMS Trigger:</strong> The system prepares a formal confirmation message including the amount, unit number, and balance. It then triggers your device's SMS app to send this to the tenant immediately.</li>
          </ol>
        </div>
      )
    },
    {
      role: 'MANAGER',
      question: "What are the steps for Smart Expense Tracking?",
      answer: (
        <div className="space-y-4">
          <p>To record a business expense:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Navigate to the <strong>Expenses</strong> section.</li>
            <li>Click <strong>'Smart Scan'</strong> and point your camera at the physical receipt.</li>
            <li>The <strong>AI Scanner</strong> will auto-extract the <strong>Vendor Name, Total Amount, and Date</strong>.</li>
            <li>Review the extracted data, assign a <strong>Category</strong> (e.g., Maintenance or Utilities), and click <strong>'Verify & Save'</strong>.</li>
          </ol>
          <p>The record is then permanently archived in the <strong>Digital Vault</strong> for end-of-year audits.</p>
        </div>
      )
    },
    {
      role: 'MANAGER',
      question: "How can I use Advertising to reduce vacancy?",
      answer: (
        <p>The moment a tenant vacates, create a listing in the <strong>Advertising</strong> section. ZenFlow generates a <strong>Public Marketing Link</strong> that you can share on WhatsApp, Facebook, or Instagram. These listings highlight <strong>Verified Amenities</strong> (WiFi, Security, Parking) and include a direct <strong>'Apply Now'</strong> button, allowing leads to submit their KYC documents digitally before they even step foot in the building.</p>
      )
    },
    // --- TENANT FAQS ---
    {
      role: 'TENANT',
      question: "What is the step-by-step M-Pesa payment process?",
      answer: (
        <div className="space-y-4">
          <p>Paying your rent via <strong>Integrated STK Push</strong> is the safest method:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Log into your <strong>Tenant Portal</strong>.</li>
            <li>Navigate to <strong>'My Home'</strong> and click <strong>'Pay Rent Now'</strong>.</li>
            <li>Select <strong>M-Pesa</strong> and confirm the amount.</li>
            <li>Wait for the <strong>STK Push Popup</strong> to appear on your phone screen.</li>
            <li><strong>Enter your M-Pesa PIN</strong> and press OK.</li>
            <li>Your <strong>Digital Receipt</strong> will be generated instantly in the <strong>Receipt Vault</strong>.</li>
          </ol>
        </div>
      )
    },
    {
      role: 'TENANT',
      question: "How does my Zenflow Credit Score help me get future loans?",
      answer: (
        <p>Your <strong>Zenflow Credit Score</strong> is a live metric of your financial reliability. By paying your rent consistently and on time, you build a <strong>"Good Tenancy" history</strong>. You can download a <strong>Verified Tenancy Certificate</strong> at any time, which acts as <strong>formal proof of creditworthiness</strong> for Kenyan banks or saccos when you apply for personal loans or future home ownership schemes.</p>
      )
    },
    {
      role: 'TENANT',
      question: "How do I track the progress of a repair I reported?",
      answer: (
        <p>After reporting an issue via the <strong>'Fix Something'</strong> form, you can monitor progress in real-time under <strong>'Track Repair'</strong>. You will see an <strong>Uber-style status bar</strong> indicating when your manager has reviewed the request, which <strong>Professional Fundi</strong> has been assigned, and a live update when they are <strong>'En Route'</strong> to your unit. This eliminates the need for repeated follow-up calls.</p>
      )
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.role === activeTab && 
    (faq.question.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-1">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Support Center</h1>
            <p className="text-slate-500 font-medium">Clear, detailed answers for the ZenFlow ecosystem.</p>
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-2 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-100">
          <ShieldCheck size={16} /> 2026 Audit Ready
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="max-w-4xl mx-auto px-1">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={24} />
          <input 
            type="text"
            placeholder="Search for instructions, compliance, or payment steps..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-6 py-6 bg-white border-2 border-slate-100 rounded-[2.5rem] font-bold text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none shadow-xl shadow-slate-100 transition-all placeholder:text-slate-300"
          />
        </div>
      </div>

      {/* ROLE TABS */}
      <div className="max-w-4xl mx-auto px-1 flex justify-center">
        <div className="inline-flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm gap-2">
          {[
            { id: 'LANDLORD', label: 'Owner / Landlord', icon: Landmark },
            { id: 'MANAGER', label: 'Property Manager', icon: Briefcase },
            { id: 'TENANT', label: 'Resident / Tenant', icon: Smartphone },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setOpenIndex(null); }}
              className={`flex items-center gap-3 px-6 py-4 rounded-3xl text-sm font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-900 text-white shadow-xl scale-105' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ ACCORDION LIST */}
      <div className="max-w-4xl mx-auto px-1">
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          {filteredFaqs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {filteredFaqs.map((faq, index) => (
                <AccordionItem 
                  key={index}
                  faq={faq}
                  isOpen={openIndex === index}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 px-8">
              <div className="w-20 h-20 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Search size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">No matching results</h3>
              <p className="text-slate-500 font-medium">Try searching for keywords like "M-Pesa", "KRA", or "Fundi".</p>
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED SUPPORT CTA */}
      <div className="max-w-4xl mx-auto px-1">
        <div className="bg-slate-900 p-10 md:p-14 rounded-[4rem] text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h4 className="text-3xl md:text-4xl font-black mb-4 tracking-tight">Still need assistance?</h4>
            <p className="text-slate-400 font-medium mb-12 text-lg max-w-2xl mx-auto leading-relaxed">
              Our <strong>Nairobi-based engineers</strong> are standing by to help with technical setup or billing disputes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://wa.me/254793710082" 
                target="_blank" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-12 py-6 bg-emerald-600 text-white font-black rounded-3xl hover:bg-emerald-500 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.4)] active:scale-95 text-lg"
              >
                Chat via WhatsApp <Zap size={24} fill="white" />
              </a>
              <button className="w-full sm:w-auto px-12 py-6 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black rounded-3xl transition-all flex items-center justify-center gap-3 text-lg">
                <ShieldAlert size={24} /> Report Security Issue
              </button>
            </div>
          </div>
          <HelpCircle size={300} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default Help;
