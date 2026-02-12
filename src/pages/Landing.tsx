
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, Zap, ArrowRight, Users, Smartphone, Cloud, BellRing, Trophy, Activity, Wallet, Check, Clock, Landmark, ShieldEllipsis, MessageSquare } from 'lucide-react';
// Added Variants to import for explicit typing
import { motion, Variants } from 'framer-motion';

const Landing: React.FC = () => {
  // Explicitly typed as Variants to resolve inference issues with complex animation properties
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

  // Explicitly typed as Variants and used literal string for ease
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  // Explicitly typed as Variants and cast custom cubic-bezier array to tuple
  const wordVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.4, ease: [0.33, 1, 0.68, 1] as [number, number, number, number] } 
    },
  };

  // Explicitly typed return value as Variants
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

  const transactions = [
    { unit: 'A1', name: 'James Kamau', amount: '25,000', status: 'Paid', color: 'emerald' },
    { unit: 'B4', name: 'Sarah Hassan', amount: '30,000', status: 'Pending', color: 'amber' },
    { unit: 'C2', name: 'Moses Otieno', amount: '18,500', status: 'Paid', color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden relative selection:bg-emerald-100 selection:text-emerald-900">
      {/* Grid Background Texture for Hero */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `radial-gradient(#10b981 0.5px, transparent 0.5px), radial-gradient(#10b981 0.5px, transparent 0.5px)`, backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}>
      </div>

      {/* Navbar */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-50">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="bg-emerald-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform duration-300">
              <Zap size={24} fill="white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">ZenFlow</span>
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-500"
        >
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="/expenses" className="...">Expenses</a>
          <a href="#proof" className="hover:text-emerald-600 transition-colors">Stats</a>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            to="/dashboard"
            className="px-8 py-3 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-slate-100"
          >
            Login
          </Link>
        </motion.div>
      </nav>

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
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-full sm:w-auto"
            >
              <Link 
                to="/dashboard"
                className="w-full sm:w-auto px-12 py-5 bg-emerald-600 text-white text-lg font-black rounded-[1.25rem] shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] hover:bg-emerald-700 active:scale-95 transition-all flex items-center justify-center gap-3 group"
              >
                Start 1-Month Free Trial <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            
            <button className="w-full sm:w-auto px-12 py-5 bg-white border-2 border-slate-100 text-slate-700 text-lg font-bold rounded-[1.25rem] hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95">
              Book a Demo
            </button>
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

      {/* Product Preview Section */}
      <section className="bg-slate-50 py-24 relative z-10 border-y border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-emerald-50 p-1 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(16,185,129,0.2)]">
              <div className="bg-white rounded-[2.4rem] overflow-hidden border border-emerald-100/50">
                {/* Mock Header */}
                <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 leading-tight">M-Pesa Collections</h4>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Live Feed</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                  </div>
                </div>

                {/* Mock Transaction Feed */}
                <div className="p-8 space-y-4">
                  {transactions.map((tx, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:text-emerald-600 transition-colors">
                          {tx.unit}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{tx.name}</p>
                          <p className="text-xs font-bold text-emerald-600 tracking-wide">M-PESA • KES {tx.amount}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest ${
                        tx.status === 'Paid' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                      }`}>
                        {tx.status === 'Paid' ? <Check size={14} /> : <Clock size={14} />}
                        {tx.status}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-8 text-center text-slate-400 font-bold tracking-tight">Real-time collection tracking at a glance.</p>
          </motion.div>
        </div>
        
        {/* Floating Decorative Elements specifically for this section */}
        <motion.div variants={floatingVariants(0.5)} animate="animate" className="absolute top-10 right-[15%] hidden lg:block">
          <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600"><CheckCircle size={20} /></div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Success</p>
              <p className="text-sm font-bold">Receipt Sent</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Social Proof Stats Section */}
      <section id="proof" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { icon: HomeIcon, label: "Units Managed", value: "500+", suffix: "" },
              { icon: Wallet, label: "Total Collected", value: "2M+", prefix: "KES " },
              { icon: Activity, label: "Uptime", value: "99.9%", suffix: "" },
            ].map((stat, i) => (
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

      {/* Management at your Fingertips Section */}
      <section id="features" className="py-24 bg-slate-50 relative z-10 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Management at your Fingertips</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Everything you need to run your property business from a single high-performance dashboard.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Smartphone, title: "One-click M-Pesa Requests", desc: "Push STK requests directly to tenant phones. No manual receipting or cross-checking bank statements." },
              { icon: BellRing, title: "Automated SMS Reminders", desc: "Keep tenants informed with automated payment reminders and digital receipts via SMS and WhatsApp." },
              { icon: Cloud, title: "Cloud-Based Records", desc: "Access your property data anywhere. Securely encrypted and backed up daily in compliance with local laws." },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -8 }}
                className="p-10 rounded-[2.5rem] bg-white border border-slate-100 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-emerald-50 flex flex-col h-full"
              >
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 flex-shrink-0">
                  <feature.icon size={28} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-medium mb-auto">{feature.desc}</p>
                
                {/* Specific Visual Accent for Automated SMS card */}
                {feature.title === "Automated SMS Reminders" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left relative overflow-hidden group/sms"
                  >
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center text-[8px] text-white font-black">Z</div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ZenFlow SMS • Just now</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-bold leading-relaxed">
                      Dear James, your rent for A1 (KES 25,000) is due. Pay via M-Pesa: <span className="text-emerald-600 underline decoration-emerald-200">zenflow.ke/p/A1</span>
                    </p>
                    <div className="absolute top-2 right-2 opacity-0 group-hover/sms:opacity-100 transition-opacity">
                      <MessageSquare size={12} className="text-emerald-600" />
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Simple, Local Pricing</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium">Get premium property tools without the premium price tag.</p>
          </div>

          <div className="flex justify-center">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="w-full max-w-lg bg-white p-1 pb-1 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-2 border-emerald-500 relative"
            >
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest shadow-lg shadow-emerald-200">
                Most Popular
              </div>
              <div className="p-12 text-center bg-white rounded-[2.9rem]">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Pro Landlord</h3>
                <p className="text-slate-500 font-medium mb-8">Full access for growing portfolios</p>
                <div className="mb-10">
                  <span className="text-slate-400 font-bold align-top mt-2 inline-block">KES</span>
                  <span className="text-7xl font-black tracking-tighter text-slate-900">4,500</span>
                  <span className="text-slate-400 font-bold">/mo</span>
                </div>
                <div className="space-y-5 text-left mb-12">
                  {[
                    "Unlimited Property Units",
                    "Native M-Pesa Integration",
                    "Automated Tenant SMS Alerts",
                    "AI Financial Insights",
                    "Priority 24/7 Support",
                    "Custom Brand Receipts"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle size={14} />
                      </div>
                      <span className="font-semibold text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/dashboard"
                  className="block w-full py-5 bg-emerald-600 text-white text-xl font-black rounded-2xl shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Start 30-Day Free Trial
                </Link>
                <p className="mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">No credit card required</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Decorative Blur Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-emerald-50/60 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-slate-50/80 rounded-full blur-[100px] -z-10" />
      
      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center border-t border-slate-100 text-slate-400 text-sm font-bold bg-white">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <Zap size={18} className="text-emerald-600" />
          <span className="text-slate-900 font-black">ZenFlow Properties</span>
        </div>
        <p>© 2024 ZenFlow Properties. Designed in Nairobi.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a href="#" className="hover:text-slate-900 transition-colors">Privacy</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Terms</a>
          <a href="#" className="hover:text-slate-900 transition-colors">Help</a>
        </div>
      </footer>
    </div>
  );
};

// Internal icon for simplicity
const HomeIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);

export default Landing;
