
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, Loader2, Zap, ShieldAlert, User, Briefcase, Landmark, ChevronRight, ArrowLeft, Wrench } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { FOUNDER_CREDENTIALS } from '../config/constants';

interface LoginModalProps {
  mode: 'login' | 'signup';
  onClose: () => void;
  onLoginSuccess: (email: string, isNew: boolean, isFounder: boolean, role: UserRole) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ mode, onClose, onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [step, setStep] = useState<'auth' | 'role'>('auth');
  const [tempUserEmail, setTempUserEmail] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // REQUIRES AUTH INTEGRATION
      const result = await authService.login(email, password);
      
      if (result.isFounder) {
        setIsLoading(false);
        onLoginSuccess(result.email, false, true, 'FOUNDER');
        navigate('/home'); 
        return;
      }

      setTempUserEmail(result.email);
      setIsLoading(false);
      setStep('role');
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Restricted Access: Invalid Credentials");
    }
  };

  const handleRoleSelection = (role: UserRole) => {
    onLoginSuccess(tempUserEmail, mode === 'signup', false, role);
    if (role === 'SERVICE_PROVIDER') {
      navigate('/provider-portal');
    } else {
      navigate('/home');
    }
  };

  const renderAuthStep = () => (
    <motion.div 
      key="auth"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="p-8 sm:p-12"
    >
      <div className="text-center mb-10">
        <div className="mx-auto w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-emerald-100">
          <Zap size={32} fill="white" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {mode === 'signup' ? 'Start Your Journey' : 'Access Gateway'}
        </h2>
        <p className="text-slate-500 font-medium mt-2">
          {mode === 'signup' 
            ? 'Create your property manager account' 
            : 'Sign in to manage your Kenyan property portfolio'}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email Address</label>
          <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-emerald-600'}`}>
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              required
              placeholder="admin@zenflow.co.ke"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(null); }}
              className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300 ${
                error ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500 ring-2 ring-rose-500/5' : 'border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500'
              }`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
            {mode === 'login' && <button type="button" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors">Recovery</button>}
          </div>
          <div className="relative group">
            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-emerald-600'}`}>
              <Lock size={18} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} 
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(null); }}
              className={`w-full pl-12 pr-12 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all font-bold placeholder:text-slate-300 ${
                error ? 'border-rose-200 focus:ring-rose-500/10 focus:border-rose-500 ring-2 ring-rose-500/5' : 'border-slate-200 focus:ring-emerald-500/10 focus:border-emerald-500'
              }`}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-black uppercase tracking-widest"
            >
              <ShieldAlert size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          type="submit"
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-3 py-5 text-white text-lg font-black rounded-2xl shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100 ${
            error ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center gap-3">
              <Loader2 size={24} className="animate-spin" />
              Verifying...
            </span>
          ) : (
            mode === 'signup' ? "Initialize Trial" : "Authenticate Account"
          )}
        </button>
      </form>
    </motion.div>
  );

  const renderRoleStep = () => (
    <motion.div 
      key="role"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="p-8 sm:p-12"
    >
      <button 
        onClick={() => setStep('auth')}
        className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Back to Auth
      </button>

      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Check</h2>
        <p className="text-slate-500 font-medium mt-2">Select your role to personalize the workspace.</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar pr-2">
        {[
          { 
            id: 'LANDLORD' as UserRole, 
            label: 'Owner / Landlord', 
            desc: 'Full portfolio oversight & financials.', 
            icon: Landmark,
            color: 'text-emerald-600 bg-emerald-50'
          },
          { 
            id: 'MANAGER' as UserRole, 
            label: 'Property Manager', 
            desc: 'Daily operations & tenant tasks.', 
            icon: Briefcase,
            color: 'text-blue-600 bg-blue-50'
          },
          { 
            id: 'SERVICE_PROVIDER' as UserRole, 
            label: 'Service Partner (Fundi)', 
            desc: 'Accept jobs & track payments.', 
            icon: Wrench,
            color: 'text-amber-600 bg-amber-50'
          },
          { 
            id: 'TENANT' as UserRole, 
            label: 'Tenant / Resident', 
            desc: 'Pay rent & report maintenance.', 
            icon: User,
            color: 'text-purple-600 bg-purple-50'
          },
        ].map((role) => (
          <button
            key={role.id}
            onClick={() => handleRoleSelection(role.id)}
            className="w-full flex items-center gap-4 p-5 bg-white border-2 border-slate-50 rounded-[2rem] hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-50 transition-all group text-left"
          >
            <div className={`p-4 rounded-2xl shrink-0 ${role.color} group-hover:scale-110 transition-transform`}>
              <role.icon size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-slate-900 leading-none mb-1">{role.label}</h4>
              <p className="text-xs font-medium text-slate-400">{role.desc}</p>
            </div>
            <ChevronRight size={18} className="text-slate-200 group-hover:text-emerald-600 transition-colors" />
          </button>
        ))}
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto pt-10 sm:pt-24">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-[4px]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 z-10 mb-10"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {step === 'auth' ? renderAuthStep() : renderRoleStep()}
        </AnimatePresence>

        <div className="pb-8 px-8 space-y-4">
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
              Secured by ZenFlow Identity Engine
            </p>
          </div>
          
          <Link 
            to="/join-network" 
            onClick={onClose}
            className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50 rounded-2xl transition-all group"
          >
            <Wrench size={14} className="text-blue-600" />
            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-tight">
              Are you a Service Provider? <span className="underline decoration-blue-300 group-hover:decoration-blue-500">Apply to join</span>
            </p>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
