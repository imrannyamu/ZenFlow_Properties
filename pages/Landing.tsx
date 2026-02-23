
import React, { useMemo, useState } from 'react';
import { 
  CheckCircle, ShieldCheck, Zap, ArrowRight, Smartphone, Cloud, 
  BellRing, Wallet, Check, Clock, Landmark, ShieldEllipsis, 
  MessageSquare, Activity as ActivityIcon, Home as HomeIcon, 
  FileSearch, User, Shield, FileText, ChevronRight, Sparkles,
  CreditCard, Building2, Receipt, Wrench, AlertTriangle, Scan,
  Users, BarChart3, TrendingUp, PieChart, ShieldAlert,
  ChevronDown, ChevronUp, Star, Award, Heart
} from 'lucide-react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { UserRole, Tenant, MaintenanceTicket, Expense, Property } from '../types';
import { LANDING_STATS } from '../config/constants';

interface LandingProps {
  setIsLoginOpen: (val: boolean) => void;
  isAuthenticated: boolean;
  userRole?: UserRole | null;
  tenants?: Tenant[];
  maintenanceTickets?: MaintenanceTicket[];
  expenses?: Expense[];
  properties?: Property[];
}

const Landing: React.FC<LandingProps> = ({ 
  setIsLoginOpen, 
  isAuthenticated, 
  userRole
}) => {
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
    } else {
      if (userRole === 'SERVICE_PROVIDER') {
        navigate('/provider-portal');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const getRoleButtonText = () => {
    if (userRole === 'LANDLORD' || userRole === 'FOUNDER') return 'Go to Executive Overview';
    if (userRole === 'MANAGER') return 'Go to Operations Center';
    if (userRole === 'TENANT') return 'Go to My Home';
    if (userRole === 'SERVICE_PROVIDER') return 'Go to Job Portal';
    return 'Go to Dashboard';
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] } 
    },
  };

  const floatingVariants = (delay: number): Variants => ({
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
        delay: delay,
      },
    },
  });

  const headline = "Modern Management for";
  const headlineHighlight = "Zen-like Properties.";

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How does M-Pesa integration work?",
      answer: "Zenflow integrates directly with M-Pesa Paybills and Till Numbers. When a tenant pays, the system automatically matches the transaction to their unit and updates your ledger in real-time."
    },
    {
      question: "Is my data secure?",
      answer: "We use bank-grade AES-256 encryption for all sensitive data. Your information is stored in secure cloud environments compliant with the Kenya Data Protection Act 2019."
    },
    {
      question: "Can I manage multiple properties?",
      answer: "Yes! Zenflow is designed for portfolios of all sizes. You can manage multiple buildings, hundreds of units, and various staff roles from a single executive dashboard."
    },
    {
      question: "What happens if a tenant is late with rent?",
      answer: "The system automatically detects late payments based on your set due dates. It can apply automated late fees and send polite SMS reminders to the tenant until the balance is cleared."
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Grid Background Texture for Hero */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-8 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 text-sm font-bold mb-10 border border-emerald-100 shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            The #1 Property Management App in Kenya
          </motion.div>

          <h1 className="text-5xl md:text-[5.5rem] font-black text-slate-900 mb-8 tracking-tighter leading-[0.95] max-w-5xl mx-auto flex flex-wrap justify-center gap-x-4">
            {headline.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block origin-bottom">
                {word}
              </motion.span>
            ))}
            <span className="w-full h-0 md:h-2" />
            {headlineHighlight.split(" ").map((word, i) => (
              <motion.span key={i} variants={wordVariants} className="inline-block origin-bottom text-emerald-600">
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p 
            variants={itemVariants}
            className="max-w-2xl mx-auto text-xl text-slate-500 mb-14 leading-relaxed font-medium"
          >
            Streamline rent collection, automate M-Pesa tracking, and manage your properties with peace of mind. Built for modern property managers.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
          >
            {!isAuthenticated ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full sm:w-auto"
                >
                  <button 
                    onClick={handleActionClick}
                    className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white text-lg font-black rounded-[1.25rem] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                  >
                    Start 1-Month Free Trial <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
                <Link 
                  to="/apply"
                  className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 text-slate-700 text-lg font-bold rounded-[1.25rem] hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <FileSearch size={20} className="text-emerald-600" /> Apply for a Unit
                </Link>
              </>
            ) : (
              <div className="w-full sm:w-auto">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white text-lg font-black rounded-[1.25rem] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  {getRoleButtonText()} <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </motion.div>

          {/* Trust Bar */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col items-center gap-6 grayscale opacity-40 hover:opacity-70 transition-opacity duration-500"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Securely Integrated With</span>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-black text-xs">M</div>
                <span className="text-lg font-black tracking-tighter text-slate-900">M-PESA</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldEllipsis size={24} className="text-slate-900" />
                <span className="text-lg font-black tracking-tighter text-slate-900">KRA COMPLIANT</span>
              </div>
              <div className="flex items-center gap-2">
                <Landmark size={24} className="text-slate-900" />
                <span className="text-lg font-black tracking-tighter text-slate-900">KENYAN BANKS</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Why Choose Us Section */}
      <section className="py-24 relative z-10 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">The Zenflow Advantage</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Why Property Managers Trust Us</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                icon: Zap, 
                title: "Instant Automation", 
                desc: "Automate rent receipts, late fees, and reminders so you can focus on growth.",
                color: "bg-emerald-50 text-emerald-600"
              },
              { 
                icon: ShieldCheck, 
                title: "Legal Compliance", 
                desc: "Stay aligned with KRA and Kenyan Housing Acts with automated reporting.",
                color: "bg-blue-50 text-blue-600"
              },
              { 
                icon: Smartphone, 
                title: "M-Pesa Native", 
                desc: "Direct integration with Safaricom for seamless, error-free collections.",
                color: "bg-emerald-50 text-emerald-600"
              },
              { 
                icon: Users, 
                title: "Tenant Happiness", 
                desc: "A dedicated portal for tenants to pay, book amenities, and report issues.",
                color: "bg-purple-50 text-purple-600"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-24 relative z-10 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-xs font-black text-emerald-600 uppercase tracking-[0.3em] mb-4">Common Questions</h2>
            <h3 className="text-4xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div 
                key={i} 
                className="bg-slate-50 rounded-[2rem] border border-slate-100 overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-8 py-6 flex items-center justify-between text-left group"
                >
                  <span className="font-black text-slate-900 tracking-tight">{faq.question}</span>
                  <div className={`p-2 rounded-full transition-all ${openFaq === i ? 'bg-slate-900 text-white rotate-180' : 'bg-white text-slate-400 group-hover:text-slate-900'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-slate-500 font-medium leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Stats Section */}
      <section id="proof" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {LANDING_STATS.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="space-y-2"
              >
                <p className="text-emerald-600 text-6xl font-black tracking-tighter">
                  <span className="text-3xl align-middle mr-1">{stat.prefix}</span>
                  {stat.value}
                </p>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
