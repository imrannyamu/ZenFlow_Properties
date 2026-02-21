
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, ArrowRight, ShieldCheck, TrendingUp, CheckCircle2, Wrench, 
  FileSpreadsheet, Bell, Smartphone, Shield, Plus,
  Phone, Instagram, MessageSquare, Receipt, Users, Landmark, Lock, Cloud,
  Settings2, UserCheck, BarChart3, Building2, ClipboardList, Gem, LogIn
} from 'lucide-react';
import Footer from '../components/Footer';
import { UserRole } from '../types';

interface WelcomeProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onDemoClick: () => void;
  isAuthenticated: boolean;
  userRole?: UserRole | null;
}

const FAQItem: React.FC<{ question: string, answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-emerald-50 last:border-0 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 px-4 flex items-center justify-between gap-6 text-left group transition-all"
      >
        <span className={`text-xl md:text-2xl font-black transition-colors ${isOpen ? 'text-emerald-600' : 'text-slate-900 group-hover:text-emerald-500'}`}>
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          className={`shrink-0 p-2 rounded-full border-2 transition-colors ${isOpen ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-emerald-50 text-emerald-600'}`}
        >
          <Plus size={24} strokeWidth={2.5} />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <div className="px-4 pb-10 text-lg text-slate-500 font-medium leading-relaxed max-w-3xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Welcome: React.FC<WelcomeProps> = ({ onGetStarted, onLogin, onDemoClick, isAuthenticated, userRole }) => {
  const navigate = useNavigate();

  const handleActionClick = () => {
    if (!isAuthenticated) {
      onGetStarted();
    }
  };

  const getRoleButtonText = () => {
    if (userRole === 'LANDLORD' || userRole === 'FOUNDER') return 'Go to Executive Summary';
    if (userRole === 'MANAGER') return 'Go to Operations Center';
    if (userRole === 'TENANT') return 'Go to My Home';
    return 'Go to Dashboard';
  };

  const faqs = [
    {
      question: "What is Strategic Property Management?",
      answer: "Strategic Property Management is the integration of high-performance digital tools to automate critical administrative tasks. ZenFlow provides a unified platform where landlords and tenants can interact seamlessly, offering real-time visibility into financial health, automated lease compliance, and predictive maintenance tracking."
    },
    {
      question: "How do I start the Free Trial?",
      answer: "Starting your trial is immediate. Click any 'Get Started' button to open the secure login gateway. Once authenticated, you will be granted a full 1-month Pro trial, allowing you to explore the dashboard, import properties, and test our M-Pesa integration with zero upfront cost."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We utilize 2026-standard security protocols, including AES-256 bank-level encryption for all sensitive records. Our infrastructure is hosted on geographically redundant cloud servers with hourly backups, ensuring your data remains private, persistent, and fully compliant with Kenyan data protection laws."
    },
    {
      question: "How do I contact support?",
      answer: "Our Nairobi-based expert team is ready to assist you. For instant help, you can use the WhatsApp link or Phone contact found in our footer. Additionally, our dedicated Help Center provides a wealth of step-by-step guides and documentation to help you master the ZenFlow ecosystem."
    }
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-white selection:bg-emerald-100 selection:text-emerald-900">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-slate-900 overflow-hidden px-6 text-center">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:40px_40px]" />
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] bg-emerald-600/30 rounded-full blur-[120px] animate-pulse" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-5xl"
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-emerald-600 p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-900/50">
              <Zap size={32} fill="white" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">ZenFlow</span>
          </div>
          
          <h1 className="text-6xl md:text-[7rem] font-black text-white tracking-tighter leading-[0.85] mb-8">
            Manage with <span className="text-emerald-50">Absolute</span> Clarity.
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
            The next generation of property management. Automated, secure, and designed for high-performance portfolios in Kenya.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {!isAuthenticated ? (
              <>
                <button 
                  onClick={handleActionClick}
                  className="group relative w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white text-xl font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 overflow-hidden"
                >
                  <span className="relative z-10">Get Started Now</span>
                  <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/0 via-white/10 to-emerald-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>

                <button 
                  onClick={onDemoClick}
                  className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 text-xl font-black rounded-3xl shadow-2xl hover:bg-emerald-50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  <Smartphone size={24} className="text-emerald-600" />
                  Get a Free Demo
                </button>
              </>
            ) : (
              <div className="space-y-6 w-full max-w-md">
                 <button 
                  onClick={() => navigate('/home')}
                  className="w-full px-12 py-6 bg-emerald-600 text-white text-xl font-black rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.4)] hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  {getRoleButtonText()}
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-black uppercase tracking-widest text-xs">
                    <CheckCircle2 size={16} /> Authenticated Secure Session
                 </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      {/* 2. TAILORED SOLUTIONS FOR MANAGERS */}
      <section className="py-24 max-w-7xl mx-auto px-6 scroll-mt-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Tailored Solutions for Property Leaders</h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto mb-12">
            We streamline every facet of your business—from tenant onboarding and real-time rent collection to predictive maintenance tracking.
          </p>
          <div className="h-1.5 w-20 bg-emerald-600 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {[
            { 
              icon: Receipt, 
              title: "Automated Billing", 
              desc: "Eliminate manual bookkeeping. Generate professional digital receipts instantly after every M-Pesa transaction." 
            },
            { 
              icon: Users, 
              title: "Tenant Screening", 
              desc: "Onboard high-quality tenants with our integrated background check and behavioral tracking tools." 
            },
            { 
              icon: Landmark, 
              title: "Financial Clarity", 
              desc: "Access real-time expense vs. income reports. Know your net profit at any second of the day." 
            },
            { 
              icon: TrendingUp, 
              title: "Occupancy Growth", 
              desc: "Predict vacancies before they happen and use automated alerts to keep your units 100% occupied." 
            }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 bg-white border-2 border-slate-50 rounded-[3rem] hover:border-emerald-100 hover:shadow-2xl hover:shadow-emerald-50/50 transition-all duration-500 flex items-start gap-8"
            >
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-sm">
                <item.icon size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{item.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. GROWTH STRATEGY SECTION */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
              Strategic Scaling: How ZenFlow Propels Your Growth
            </h2>
            <p className="text-xl text-slate-500 font-medium leading-relaxed">
              <strong>Growth isn’t just about adding properties; it’s about maintaining quality while increasing volume.</strong> Most property managers hit a ceiling when manual chaos overtakes their capacity. ZenFlow provides the <strong>Digital Infrastructure</strong> that allows you to break through.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                icon: Settings2,
                title: "Operational Excellence",
                content: "Centralized data reduces human error and frees up 40% of administrative time. By automating the mundane, your team can focus on high-impact acquisition and strategy rather than chasing paper trails."
              },
              {
                icon: UserCheck,
                title: "Tenant Retention",
                content: "Professional portals and instant communication build profound trust. Tenants who feel heard and have access to seamless payment tools are 35% more likely to renew their leases."
              },
              {
                icon: BarChart3,
                title: "Financial Intelligence",
                content: "Real-time analytics allow you to see where your money is going before the month ends. Our financial engine tracks every shilling, providing predictive insights that help you optimize cash flow."
              }
            ].map((pillar, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col gap-6"
              >
                <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
                  <pillar.icon size={28} />
                </div>
                <div>
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{pillar.title}</h4>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {pillar.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. UNIFIED EXPERIENCE & ROLE CLARITY */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">A Unified Experience for Everyone</h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
              ZenFlow serves the entire property ecosystem, connecting stakeholders through one seamless digital thread.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Building2,
                title: "The Landlord Suite",
                focus: "High-level oversight.",
                role: "Subscription Covered",
                content: "Track your entire portfolio performance from a single emerald dashboard. Monitor cash flow, tax readiness, and long-term growth metrics."
              },
              {
                icon: ClipboardList,
                title: "The Property Manager Hub",
                focus: "Daily Operations.",
                role: "Workspace Included",
                content: "Streamline your workflow. Manage maintenance tickets, screen tenants, and generate professional owner reports in seconds. Built for speed and precision."
              },
              {
                icon: Smartphone,
                title: "The Tenant Portal",
                focus: "Convenience & Modernity.",
                role: "Always Free",
                content: "Give your tenants a 2026 digital experience. Easy rent payments, instant maintenance reporting, and access to lease documents—all from their mobile devices."
              }
            ].map((block, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-10 bg-slate-50 border-2 border-transparent hover:border-emerald-500 hover:bg-white hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 rounded-[3rem] flex flex-col items-center text-center relative"
              >
                 <div className="absolute top-6 right-8 text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    {block.role}
                 </div>
                <div className="w-20 h-20 bg-emerald-600 text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-emerald-100 group-hover:scale-110 transition-transform">
                  <block.icon size={36} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{block.title}</h3>
                <div className="text-emerald-600 font-black text-xs uppercase tracking-widest mb-6 px-3 py-1 bg-emerald-50 rounded-full">
                  {block.focus}
                </div>
                <p className="text-slate-500 font-medium leading-relaxed">
                  {block.content}
                </p>
              </motion.div>
            ))}
          </div>

          {/* User Roles Clarity Block */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900 rounded-[4rem] p-12 md:p-16 text-white overflow-hidden relative">
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Users size={14} /> Ecosystem Transparency
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-black text-emerald-400 mb-2">For Landlords & Managers</h4>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    <strong>One simple subscription of KES 3,000/month covers your entire workspace, portfolio tools, and management dashboard.</strong> There are no per-unit fees or hidden user costs. Scale as much as you want within one unified account.
                  </p>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div>
                  <h4 className="text-xl font-black text-emerald-400 mb-2">For Tenants</h4>
                  <p className="text-slate-300 font-medium leading-relaxed">
                    <strong>Always Free. Tenants can download the portal, pay rent via integrated STK Push, and reporting at zero cost.</strong> We believe removing friction for tenants is the fastest way to ensure 100% collection rates.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative z-10 flex flex-col justify-center gap-6">
              <div className="bg-white/5 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/10 group">
                <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <Gem size={24} />
                </div>
                <h4 className="text-2xl font-black mb-4">The Growth Benefit</h4>
                <p className="text-slate-400 font-medium leading-relaxed">
                  By providing a premium service to your tenants, you justify higher yields and drive long-term retention. <strong>You aren't just buying software; you're upgrading your property's total market value.</strong>
                </p>
              </div>
            </div>
            
            <Users size={300} className="absolute -left-20 -bottom-20 text-white/5 rotate-12 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* 5. EVERYTHING YOU NEED */}
      <section className="py-24 bg-slate-50 border-y border-slate-100 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Everything You Need</h2>
            <p className="text-slate-500 mt-4 font-medium">Powering the next generation of property moguls.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Wrench, title: "Maintenance", desc: "Automated ticket routing to your preferred contractors." },
              { icon: FileSpreadsheet, title: "Tax Reports", desc: "Export compliant reports for KRA in one click." },
              { icon: Bell, title: "SMS Alerts", desc: "Notify tenants automatically about water or power cuts." },
              { icon: Smartphone, title: "Mobile Ready", desc: "A perfectly responsive dashboard for your phone." }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-white rounded-3xl border border-slate-100 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm mb-6">
                  <feature.icon size={24} />
                </div>
                <h4 className="text-lg font-black text-slate-900 mb-2 tracking-tight">{feature.title}</h4>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SECURITY & PROTECTION */}
      <section className="bg-slate-900 py-24 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 relative z-10">
          <div className="md:w-1/2">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/20 text-emerald-400 rounded-full text-xs font-black uppercase tracking-widest mb-6">
              <Shield size={14} /> Bank-Level Encryption
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8 leading-tight">Your Data, Protected.</h2>
            <p className="text-slate-400 text-lg font-medium mb-10 leading-relaxed">
              We utilize AES-256 encryption and multi-region cloud backups to ensure your records are secure, compliant, and always available.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Lock className="text-emerald-500" size={20} />
                <span className="text-white font-bold">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <Cloud className="text-emerald-500" size={20} />
                <span className="text-white font-bold">Hourly Backups</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="text-white font-bold">KRA Compliant Audit Logs</span>
              </div>
              <div className="flex items-center gap-3">
                <Smartphone className="text-emerald-500" size={20} />
                <span className="text-white font-bold">Two-Factor Authentication</span>
              </div>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative bg-emerald-600/10 p-20 rounded-full border border-emerald-600/20"
            >
              <ShieldCheck size={180} className="text-emerald-600 drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. TRANSPARENT PRICING */}
      <section id="pricing" className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-4xl md:text-5 font-black text-slate-900 tracking-tight mb-8">
              A Simple Investment for Exponential Returns
            </h2>
            <div className="space-y-8 text-lg text-slate-500 font-medium leading-relaxed">
              <p>
                <strong>Elite Features, Accessible Price:</strong> We believe every landlord deserves 2026-standard tools, regardless of their portfolio size. World-class management shouldn't be a luxury.
              </p>
              <p>
                <strong>Value Comparison:</strong> KES 3,000 per month is less than the cost of a single 'Missing Receipt' or just one day of a vacant unit. It’s the smartest insurance your portfolio will ever have.
              </p>
              <p>
                <strong>The Growth Guarantee:</strong> We’ve priced ZenFlow to be your partner. As you grow to more properties, our price stays simple and transparent—no hidden percentages of your rent, ever.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex justify-center">
            <motion.div 
              whileHover={{ y: -10 }}
              className="w-full max-w-lg bg-white p-1 rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border-2 border-emerald-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8">
                <Zap size={48} className="text-emerald-100/50" />
              </div>
              
              <div className="p-12 bg-white rounded-[3.4rem]">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 border border-emerald-100">
                  Market Entry Special
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">The Digital Package</h3>
                <div className="flex items-baseline gap-2 mb-10">
                  <span className="text-slate-400 font-bold text-lg">KES</span>
                  <span className="text-6xl font-black tracking-tighter text-slate-900">3,000</span>
                  <span className="text-slate-400 font-bold text-lg">/month</span>
                </div>

                <div className="space-y-5 mb-12">
                  {[
                    "Unlimited Portfolio Management",
                    "Advanced Tenant Management",
                    "Bank-Grade AES-256 Security",
                    "24/7 Priority Support",
                    "Automated Hourly Cloud Backups",
                    "Real-Time Financial Intelligence"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center text-white shrink-0">
                        <CheckCircle2 size={12} strokeWidth={4} />
                      </div>
                      <span className="font-bold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={onDemoClick}
                  className="w-full py-6 bg-slate-900 text-white text-xl font-black rounded-3xl shadow-2xl hover:bg-emerald-600 transition-all active:scale-95 flex items-center justify-center gap-4 group"
                >
                  Contact for Demo
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 8. READY TO TRANSFORM WORKFLOW (CTA) */}
      <section className="py-24 bg-white text-center px-6">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Ready to Transform Your Workflow?</h2>
            <p className="text-slate-500 mb-12 font-medium text-lg">Join hundreds of managers in Nairobi simplifying their day-to-day.</p>
            <div className="flex flex-wrap justify-center gap-6">
                <a href="tel:0793710082" className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all font-bold group">
                    <Phone size={22} className="group-hover:scale-110 transition-transform" /> Call Us
                </a>
                <a href="https://wa.me/254793710082" target="_blank" className="flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white rounded-2xl shadow-xl hover:bg-emerald-700 transition-all font-bold group">
                    <MessageSquare size={22} className="group-hover:scale-110 transition-transform" /> WhatsApp
                </a>
                <a href="https://www.instagram.com/_.imuu.vvs._" target="_blank" className="flex items-center gap-3 px-10 py-5 bg-white text-slate-900 border-2 border-slate-100 rounded-2xl shadow-lg hover:border-emerald-200 transition-all font-bold group">
                    <Instagram size={22} className="group-hover:text-emerald-600 transition-colors" /> Instagram
                </a>
            </div>
          </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 bg-slate-50 border-t border-slate-100 px-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-500 mt-4 font-medium">Clear answers for modern property leaders.</p>
          </div>

          <div className="bg-white rounded-[3rem] shadow-sm border border-emerald-50 overflow-hidden px-4 md:px-8">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Welcome;
