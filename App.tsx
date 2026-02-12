
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import Tenants from './pages/Tenants';
import Documents from './pages/Documents';
import Expenses from './pages/Expenses';
import Maintenance from './pages/Maintenance';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import TrialBanner from './components/TrialBanner';
import ScrollToTop from './components/ScrollToTop';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 lg:pl-64 flex flex-col">
        <TrialBanner />
        <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Landing Page Route */}
        <Route path="/" element={<Landing />} />

        {/* Dashboard Routes wrapped in layout */}
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/properties" element={<DashboardLayout><Properties /></DashboardLayout>} />
        <Route path="/tenants" element={<DashboardLayout><Tenants /></DashboardLayout>} />
        <Route path="/documents" element={<DashboardLayout><Documents /></DashboardLayout>} />
        <Route path="/maintenance" element={<DashboardLayout><Maintenance /></DashboardLayout>} />
        <Route path="/expenses" element={<DashboardLayout><Expenses /></DashboardLayout>} />
        <Route path="/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
      </Routes>
    </Router>
  );
};

export default App;
