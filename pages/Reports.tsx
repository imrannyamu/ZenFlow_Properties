
import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Download, FileText, FileSpreadsheet, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Building2, Users, Wallet,
  Calendar, ChevronRight, ArrowLeft, Loader2, CheckCircle2,
  Trophy, Filter, LayoutGrid, List, Calculator, Receipt, ShieldCheck, 
  Clock, AlertTriangle, PieChart, Wrench, Search, Banknote, Gem
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

type ReportTab = 'financials' | 'compliance' | 'operations' | 'statements';
type ReportDetail = null | 'rent-roll' | 'arrears' | 'pnl' | 'kra-mri' | 'etims' | 'occupancy' | 'maintenance';

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ReportTab>('financials');
  const [detailView, setDetailView] = useState<ReportDetail>(null);
  
  // GLOBAL FILTERS
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('February');
  const [yearFilter, setYearFilter] = useState('2026');

  const [isExporting, setIsExporting] = useState(false);
  const [unlockedHubs, setUnlockedHubs] = useState<string[]>([]);

  const toggleHubAccess = (id: string) => {
    if (!unlockedHubs.includes(id)) {
      setUnlockedHubs([...unlockedHubs, id]);
    }
  };

  const tabs = [
    { id: 'financials', label: 'Financials', icon: Wallet },
    { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
    { id: 'operations', label: 'Operations', icon: LayoutGrid },
    { id: 'statements', label: 'Statements', icon: FileText },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  const renderLanding = () => (
    <div className="space-y-12 animate-in fade-in duration-500">
      <div className="space-y-8">
        {/* 4-Tab System */}
        <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm self-start overflow-x-auto max-w-full no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ReportTab)}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {activeTab === 'financials' && (
              <>
                <ReportCard 
                  title="Rent Roll Summary" 
                  desc="Comprehensive view of all units and their collection status." 
                  icon={List} 
                  onClick={() => setDetailView('rent-roll')} 
                />
                <ReportCard 
                  title="Arrears Ageing" 
                  desc="Categorized list of overdue rent by duration (0-60+ days)." 
                  icon={Clock} 
                  onClick={() => setDetailView('arrears')} 
                  variant="rose"
                />
                <ReportCard 
                  title="Income vs Expense" 
                  desc="High-level P&L statement with category breakdowns." 
                  icon={PieChart} 
                  onClick={() => setDetailView('pnl')} 
                />
              </>
            )}
            {activeTab === 'compliance' && (
              <>
                <ReportCard 
                  title="KRA MRI Tax (7.5%)" 
                  desc="Automated Monthly Rental Income tax calculation and filing tracker." 
                  icon={Calculator} 
                  onClick={() => setDetailView('kra-mri')} 
                  variant="emerald"
                />
                <ReportCard 
                  title="eTIMS Log" 
                  desc="Historical log of KRA-ready digital receipts generated." 
                  icon={Receipt} 
                  onClick={() => setDetailView('etims')} 
                />
              </>
            )}
            {activeTab === 'operations' && (
              <>
                <ReportCard 
                  title="Occupancy Analytics" 
                  desc="Visualize vacancy trends and portfolio capacity over time." 
                  icon={TrendingUp} 
                  onClick={() => setDetailView('occupancy')} 
                />
                <ReportCard 
                  title="Maintenance Burn-down" 
                  desc="Track efficiency of repair resolution and associated costs." 
                  icon={Wrench} 
                  onClick={() => setDetailView('maintenance')} 
                />
              </>
            )}
            {activeTab === 'statements' && (
              <div className="col-span-full py-16 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                 <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Owner Statements & Raw Exports coming soon.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* STRATEGIC INVESTMENT HUB (Enterprise Exclusive) */}
      <div className="pt-12 border-t border-slate-100 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-emerald-100">
            <Gem size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Strategic Investment Hub</h2>
            <p className="text-slate-500 font-medium">Wealth-building intelligence for expansive portfolios.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ReportCard 
            title="Portfolio ROI & Cap Rate" 
            desc="Automated yield analysis and capital return monitoring across all your holdings." 
            icon={BarChart3} 
            onClick={() => toggleHubAccess('roi')} 
            variant="emerald"
            badge="Enterprise"
            isUnlocked={unlockedHubs.includes('roi')}
          >
            <PortfolioROIContent />
          </ReportCard>
          <ReportCard 
            title="Growth Simulator" 
            desc="Project future cash flows with 'what-if' scenarios for rent hikes and renovations." 
            icon={TrendingUp} 
            onClick={() => toggleHubAccess('growth')} 
            variant="emerald"
            badge="Enterprise"
            isUnlocked={unlockedHubs.includes('growth')}
          >
            <GrowthSimulatorContent />
          </ReportCard>
          <ReportCard 
            title="Equity & Appreciation Tracker" 
            desc="Real-time net worth visualization based on property value trends and debt equity." 
            icon={Trophy} 
            onClick={() => toggleHubAccess('equity')} 
            variant="emerald"
            badge="Enterprise"
            isUnlocked={unlockedHubs.includes('equity')}
          >
            <EquityTrackerContent />
          </ReportCard>
        </div>
      </div>
    </div>
  );

  const renderDetail = () => {
    switch(detailView) {
      case 'rent-roll': return <RentRollDetail onBack={() => setDetailView(null)} property={propertyFilter} month={monthFilter} />;
      case 'arrears': return <ArrearsDetail onBack={() => setDetailView(null)} property={propertyFilter} />;
      case 'pnl': return <PnLDetail onBack={() => setDetailView(null)} month={monthFilter} year={yearFilter} />;
      case 'kra-mri': return <MRITaxDetail onBack={() => setDetailView(null)} month={monthFilter} year={yearFilter} />;
      case 'etims': return <ETIMSDetail onBack={() => setDetailView(null)} />;
      case 'occupancy': return <OccupancyDetail onBack={() => setDetailView(null)} />;
      case 'maintenance': return <MaintenanceReportDetail onBack={() => setDetailView(null)} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20 max-w-full">
      {/* HEADER & GLOBAL FILTERS */}
      {!detailView && (
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 px-1">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Report Center</h1>
            <p className="text-slate-500 font-medium">Enterprise-grade intelligence for your Kenyan portfolio.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 px-3 border-r border-slate-100">
              <Building2 size={16} className="text-emerald-600" />
              <select 
                value={propertyFilter}
                onChange={(e) => setPropertyFilter(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-900"
              >
                <option value="all">All Properties</option>
                <option value="p1">Zen Plaza</option>
                <option value="p2">Emerald Heights</option>
              </select>
            </div>
            <div className="flex items-center gap-2 px-3">
              <Calendar size={16} className="text-slate-400" />
              <select 
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-900"
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select 
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="bg-transparent border-none text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer text-slate-900"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {detailView ? renderDetail() : renderLanding()}

      {/* EXPORT OVERLAY */}
      <AnimatePresence>
        {isExporting && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/80 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-sm">
              <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 mb-8">
                <Loader2 size={40} className="animate-spin" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Generating Report</h3>
              <p className="text-slate-500 font-medium mb-8">Securing records and compiling data for {monthFilter} {yearFilter}...</p>
              <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-emerald-600" />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- SUB-COMPONENTS ---

const PortfolioROIContent = () => {
  const noi = 1059500;
  const marketValue = 15000000;
  const capRate = (noi / marketValue) * 100;
  const cashOnCash = 8.4;

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>Net Operating Income</span>
        <span className="text-slate-900 font-bold">KES {noi.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>Cap Rate (NOI/Value)</span>
        <span className="text-emerald-600 font-black">{capRate.toFixed(2)}%</span>
      </div>
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span>Cash-on-Cash Return</span>
        <span className="text-slate-900 font-bold">{cashOnCash}%</span>
      </div>
    </div>
  );
};

const GrowthSimulatorContent = () => {
  const [rentIncrease, setRentIncrease] = useState(5);
  const [vacancy, setVacancy] = useState(1);
  const currentCashFlow = 1059500;
  
  const projectedCashFlow = currentCashFlow * (1 + rentIncrease / 100) * (1 - vacancy / 12);

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Annual Rent Increase (%)</span>
          <span className="text-slate-900 font-bold">{rentIncrease}%</span>
        </div>
        <input 
          type="range" min="0" max="20" value={rentIncrease} 
          onChange={(e) => setRentIncrease(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span>Vacancy (Months)</span>
          <span className="text-slate-900 font-bold">{vacancy} Mo</span>
        </div>
        <input 
          type="range" min="0" max="12" value={vacancy} 
          onChange={(e) => setVacancy(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
      </div>
      <div className="pt-2 border-t border-slate-200">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Projected Cash Flow</p>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-slate-400">KES</span>
          <span className="text-lg font-black text-emerald-600">{Math.round(projectedCashFlow).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

const EquityTrackerContent = () => {
  const appreciation = 1200000;
  const paydown = 450000;
  const totalGrowth = appreciation + paydown;
  const maxGrowth = 2000000;
  const percentage = (totalGrowth / maxGrowth) * 100;

  return (
    <div className="mt-4 p-4 bg-slate-50 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Market Appreciation</p>
          <p className="text-xs font-black text-slate-900">KES {appreciation.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Loan Paydown</p>
          <p className="text-xs font-black text-slate-900">KES {paydown.toLocaleString()}</p>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Equity Growth</p>
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            className="h-full bg-emerald-600"
          />
        </div>
        <p className="text-right text-[10px] font-black text-emerald-600">KES {totalGrowth.toLocaleString()}</p>
      </div>
    </div>
  );
};

const ReportCard: React.FC<{ 
  title: string, 
  desc: string, 
  icon: any, 
  onClick: () => void, 
  variant?: 'default' | 'rose' | 'emerald', 
  badge?: string,
  isUnlocked?: boolean,
  children?: React.ReactNode
}> = ({ title, desc, icon: Icon, onClick, variant = 'default', badge, isUnlocked, children }) => {
  const bgColors = {
    default: 'bg-slate-50 text-slate-400 group-hover:bg-slate-900 group-hover:text-white',
    rose: 'bg-rose-50 text-rose-400 group-hover:bg-rose-600 group-hover:text-white',
    emerald: 'bg-emerald-50 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group hover:shadow-xl hover:shadow-emerald-50/50 transition-all flex flex-col h-full relative overflow-hidden"
    >
      {badge && (
        <div className="absolute top-0 right-0 p-4">
          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-emerald-400 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg">
            <Gem size={10} /> {badge}
          </span>
        </div>
      )}
      
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 ${bgColors[variant]}`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">{title}</h3>
      <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 flex-1">{desc}</p>
      {!isUnlocked ? (
        <button 
          onClick={onClick}
          className="w-full flex items-center justify-between px-6 py-3.5 bg-slate-50 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-all text-[10px] font-black uppercase tracking-widest active:scale-[0.98]"
        >
          {badge ? 'Request Access' : 'View Detailed Report'} <ChevronRight size={14} />
        </button>
      ) : (
        children
      )}
    </motion.div>
  );
};

const DetailHeader: React.FC<{ title: string, onBack: () => void, onExport?: () => void }> = ({ title, onBack, onExport }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 px-1">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm transition-all"><ArrowLeft size={20} /></button>
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Detailed Analytics & Ledger View</p>
      </div>
    </div>
    <div className="flex gap-3">
      <button className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-600 transition-all">
        <FileSpreadsheet size={16} /> Export CSV
      </button>
      <button onClick={onExport} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100 active:scale-95 transition-all">
        <FileText size={16} /> Export PDF
      </button>
    </div>
  </div>
);

// --- SPECIFIC REPORT VIEWS ---

const RentRollDetail: React.FC<{ onBack: () => void, property: string, month: string }> = ({ onBack, property, month }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title={`Rent Roll: ${property === 'all' ? 'Portfolio' : property === 'p1' ? 'Zen Plaza' : 'Emerald Heights'}`} onBack={onBack} />
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Monthly Rent</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paid</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Balance</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[
              { unit: 'A1', tenant: 'James Kamau', rent: 25000, paid: 25000, bal: 0, status: 'Paid' },
              { unit: 'B4', tenant: 'Sarah Hassan', rent: 30000, paid: 15000, bal: 15000, status: 'Partial' },
              { unit: 'C2', tenant: 'Moses Otieno', rent: 18500, paid: 0, bal: 18500, status: 'Overdue' },
              { unit: 'D1', tenant: 'Alice Wambui', rent: 22000, paid: 22000, bal: 0, status: 'Paid' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-8 py-6 font-black text-slate-900">{row.unit}</td>
                <td className="px-8 py-6 font-bold text-slate-600">{row.tenant}</td>
                <td className="px-8 py-6 font-bold text-slate-900">KES {row.rent.toLocaleString()}</td>
                <td className="px-8 py-6 font-bold text-emerald-600">KES {row.paid.toLocaleString()}</td>
                <td className="px-8 py-6 font-bold text-rose-500">KES {row.bal.toLocaleString()}</td>
                <td className="px-8 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                    row.status === 'Partial' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </motion.div>
);

const ArrearsDetail: React.FC<{ onBack: () => void, property: string }> = ({ onBack, property }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title="Arrears Ageing Report" onBack={onBack} />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[
        { label: '0-30 Days', color: 'text-amber-600', bg: 'bg-amber-50', amount: 125400, count: 4 },
        { label: '31-60 Days', color: 'text-orange-600', bg: 'bg-orange-50', amount: 84200, count: 2 },
        { label: '60+ Days', color: 'text-rose-600', bg: 'bg-rose-50', amount: 45000, count: 1 },
      ].map((age, i) => (
        <div key={i} className={`p-8 rounded-[2.5rem] ${age.bg} border-2 border-white shadow-sm`}>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{age.label}</p>
          <h3 className={`text-3xl font-black tracking-tighter ${age.color}`}>KES {age.amount.toLocaleString()}</h3>
          <p className="text-xs font-bold text-slate-500 mt-2">{age.count} Tenants Outstanding</p>
        </div>
      ))}
    </div>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
       <div className="p-6 border-b border-slate-100">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detailed Debtor List</h4>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tenant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ageing Category</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Amount Owed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { name: 'Sarah Hassan', unit: 'B4', age: '31-60 Days', amount: 15000 },
                { name: 'Moses Otieno', unit: 'C2', age: '0-30 Days', amount: 18500 },
                { name: 'David Omondi', unit: 'G1', age: '60+ Days', amount: 45000 },
              ].map((row, i) => (
                <tr key={i}>
                  <td className="px-8 py-6 font-bold text-slate-900">{row.name}</td>
                  <td className="px-8 py-6 font-black text-slate-400">{row.unit}</td>
                  <td className="px-8 py-6 text-xs font-black uppercase tracking-widest text-orange-600">{row.age}</td>
                  <td className="px-8 py-6 text-right font-black text-rose-500">KES {row.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
       </div>
    </div>
  </motion.div>
);

const PnLDetail: React.FC<{ onBack: () => void, month: string, year: string }> = ({ onBack, month, year }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title={`Income vs Expense: ${month} ${year}`} onBack={onBack} />
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
       <div className="max-w-3xl mx-auto space-y-12">
          {/* INCOME SECTION */}
          <section>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Income</h3>
               <span className="text-xl font-black text-emerald-600">KES 1,240,000</span>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Gross Rent Collected', val: 1180000 },
                 { label: 'Service Charges', val: 45000 },
                 { label: 'Other (Parking/Water)', val: 15000 },
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-sm font-bold text-slate-600">
                    <span>{item.label}</span>
                    <span className="text-slate-900">KES {item.val.toLocaleString()}</span>
                 </div>
               ))}
            </div>
          </section>

          {/* EXPENSE SECTION */}
          <section>
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-4 mb-6">
               <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Operating Expenses</h3>
               <span className="text-xl font-black text-rose-500">KES (180,500)</span>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Staff Wages & Caretaker', val: 45000 },
                 { label: 'Repairs & Maintenance', val: 32000 },
                 { label: 'Utilities (Common Area)', val: 12500 },
                 { label: 'Property Marketing', val: 8000 },
                 { label: 'Taxes & Compliance', val: 83000 },
               ].map((item, i) => (
                 <div key={i} className="flex justify-between items-center text-sm font-bold text-slate-600">
                    <button className="hover:text-emerald-600 transition-colors">{item.label}</button>
                    <span className="text-slate-900">KES ({item.val.toLocaleString()})</span>
                 </div>
               ))}
            </div>
          </section>

          <div className="p-8 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between">
             <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-1">Net Operating Income</p>
               <h4 className="text-4xl font-black tracking-tighter">KES 1,059,500</h4>
             </div>
             <TrendingUp size={48} className="text-emerald-500/20" />
          </div>
       </div>
    </div>
  </motion.div>
);

const MRITaxDetail: React.FC<{ onBack: () => void, month: string, year: string }> = ({ onBack, month, year }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title="KRA MRI Tax Calculator" onBack={onBack} />
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-10 flex flex-col items-center">
       <div className="w-full max-w-xl space-y-10">
          <div className="text-center">
             <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Calculator size={40} />
             </div>
             <h3 className="text-2xl font-black text-slate-900">MRI Tax Estimation</h3>
             <p className="text-slate-500 font-medium">{month} {year} Fiscal Period</p>
          </div>

          <div className="space-y-6">
             <div className="flex justify-between items-center p-6 bg-slate-50 rounded-2xl">
                <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">Total Gross Rent</span>
                <span className="text-xl font-black text-slate-900">KES 1,180,000</span>
             </div>
             <div className="flex justify-between items-center p-6 bg-rose-50 rounded-2xl border border-rose-100">
                <div>
                   <span className="font-bold text-rose-900 uppercase tracking-widest text-xs">Monthly Rental Income Tax (7.5%)</span>
                   <p className="text-[10px] font-bold text-rose-400 mt-1">Calculated on gross residential rent</p>
                </div>
                <span className="text-2xl font-black text-rose-600">KES 88,500</span>
             </div>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 py-5 bg-slate-100 text-slate-500 font-black rounded-2xl uppercase tracking-widest text-xs">Download KRA Schedule</button>
             <button className="flex-[2] py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> Mark as Filed with iTax
             </button>
          </div>

          <div className="p-6 bg-amber-50 rounded-2xl flex items-start gap-4 border border-amber-100">
             <AlertTriangle className="text-amber-500 shrink-0" size={20} />
             <p className="text-xs font-bold text-amber-900 leading-relaxed">
                Disclaimer: This is an estimation based on records in ZenFlow. Please verify final amounts on the iTax portal as per your specific KRA PIN obligations.
             </p>
          </div>
       </div>
    </div>
  </motion.div>
);

const ETIMSDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title="eTIMS Log: Generated Receipts" onBack={onBack} />
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
       <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
             <input placeholder="Search eTIMS ID..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none" />
          </div>
          <span className="text-[10px] font-black uppercase text-slate-400">Total Validated: 142</span>
       </div>
       <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
               <tr>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">eTIMS ID / CU Serial</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
                 <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {[
                 { id: 'CU-S010-00192837', date: 'Feb 15, 2026', client: 'James Kamau', val: 25000 },
                 { id: 'CU-S010-00192838', date: 'Feb 14, 2026', client: 'Sarah Hassan', val: 30000 },
                 { id: 'CU-S010-00192842', date: 'Feb 12, 2026', client: 'Moses Otieno', val: 18500 },
               ].map((row, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 group">
                   <td className="px-8 py-5 font-mono text-xs text-emerald-600 font-black">{row.id}</td>
                   <td className="px-8 py-5 text-sm text-slate-500">{row.date}</td>
                   <td className="px-8 py-5 font-bold text-slate-900">{row.client}</td>
                   <td className="px-8 py-5 text-right font-black text-slate-900">KES {row.val.toLocaleString()}</td>
                   <td className="px-8 py-5 text-right">
                      <button className="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-lg group-hover:bg-white transition-all shadow-sm">
                        <Download size={14} />
                      </button>
                   </td>
                 </tr>
               ))}
            </tbody>
          </table>
       </div>
    </div>
  </motion.div>
);

const OccupancyDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title="Occupancy Analytics" onBack={onBack} />
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
       <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-10 flex flex-col">
          <div className="flex items-center justify-between mb-10">
             <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Portfolio Capacity (12 Months)</h3>
             <div className="flex gap-4">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] font-black uppercase text-slate-400">Occupied</span></div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[10px] font-black uppercase text-slate-400">Vacant</span></div>
             </div>
          </div>
          <div className="flex-1 min-h-[300px] flex items-end justify-between gap-4">
             {[85, 88, 92, 90, 94, 94, 92, 95, 96, 94, 94, 98].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-4 group cursor-help">
                  <div className="w-full bg-slate-50 rounded-t-xl relative overflow-hidden h-[240px]">
                     <motion.div initial={{ height: 0 }} animate={{ height: `${h}%` }} className="absolute bottom-0 w-full bg-emerald-600 rounded-t-lg shadow-lg group-hover:bg-emerald-50 transition-colors" />
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
               </div>
             ))}
          </div>
       </div>
       <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mb-2">Current Status</p>
             <h4 className="text-5xl font-black tracking-tighter">94.2%</h4>
             <p className="text-xs font-bold text-slate-400 mt-4 leading-relaxed">32 of 34 units currently lease-locked. Vacancy: 5.8% (2 Units)</p>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Upcoming Expiries</h4>
             <div className="space-y-3">
                {[
                  { unit: 'A4', date: 'Mar 15' },
                  { unit: 'C1', date: 'Apr 02' },
                ].map((ex, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                     <span className="font-black text-slate-900 text-xs">Unit {ex.unit}</span>
                     <span className="text-[10px] font-bold text-rose-500 uppercase">{ex.date}</span>
                  </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  </motion.div>
);

const MaintenanceReportDetail: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
    <DetailHeader title="Maintenance Burn-down" onBack={onBack} />
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden p-8">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
             <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Total Tickets</p>
             <h4 className="text-3xl font-black text-slate-900">42</h4>
          </div>
          <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
             <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Resolution Rate</p>
             <h4 className="text-3xl font-black text-emerald-700">92%</h4>
          </div>
          <div className="p-6 bg-slate-900 rounded-3xl text-white">
             <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Total Maint. Spend</p>
             <h4 className="text-3xl font-black">KES 84,200</h4>
          </div>
          <div className="p-6 bg-rose-50 rounded-3xl border border-rose-100">
             <p className="text-[10px] font-black uppercase text-rose-600 mb-2">Average Cost/Ticket</p>
             <h4 className="text-3xl font-black text-rose-700">KES 2,004</h4>
          </div>
       </div>

       <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 px-1">Ticket Cost Breakdown</h4>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead className="bg-slate-50/50">
                   <tr>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Issue / Ticket</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendor</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Final Cost</th>
                     <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {[
                     { title: 'Burst Pipe Replacement', unit: 'A1', type: 'Plumbing', vendor: 'Nairobi Plumbers', cost: 12500, state: 'Resolved' },
                     { title: 'Common Area Lighting', unit: 'Hall', type: 'Electrical', vendor: 'Sparks KE', cost: 4200, state: 'Resolved' },
                     { title: 'Roof Leakage Patch', unit: 'B4', type: 'Structural', vendor: 'Fixers Ltd', cost: 18000, state: 'Resolved' },
                   ].map((row, i) => (
                     <tr key={i} className="hover:bg-slate-50/30">
                       <td className="px-8 py-6">
                          <p className="font-bold text-slate-900">{row.title}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unit {row.unit}</p>
                       </td>
                       <td className="px-8 py-6 text-sm text-slate-600 font-bold">{row.type}</td>
                       <td className="px-8 py-6 text-sm text-slate-500 font-medium">{row.vendor}</td>
                       <td className="px-8 py-6 text-right font-black text-slate-900">KES {row.cost.toLocaleString()}</td>
                       <td className="px-8 py-6 text-right">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-emerald-100">Resolved</span>
                       </td>
                     </tr>
                   ))}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  </motion.div>
);

export default Reports;
