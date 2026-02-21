import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center space-y-8 bg-white p-12 rounded-[3rem] shadow-xl border border-slate-100"
      >
        <div className="relative flex justify-center">
          <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative bg-emerald-50 p-6 rounded-[2rem] text-emerald-600">
            <Ghost size={64} />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter">404</h1>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Page Not Found</h2>
          <p className="text-slate-500 font-medium leading-relaxed">
            The page you are looking for doesn't exist or has been moved to a different property.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            to="/dashboard"
            className="flex items-center justify-center gap-2 w-full py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-100"
          >
            <Home size={18} />
            Back to Dashboard
          </Link>
          <Link 
            to="/welcome"
            className="flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all"
          >
            <ArrowLeft size={18} />
            Return to Start
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            ZenFlow Properties • System Check OK
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;