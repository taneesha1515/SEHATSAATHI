import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block shrink-0">
          <div className="sticky top-28 rounded-2xl overflow-hidden shadow-sm border border-slate-100">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar Modal/Drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="relative z-10 w-72 bg-white h-full shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <span className="font-bold text-slate-800">Menu Navigation</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <Sidebar />
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          {/* Mobile Sidebar Trigger Pill */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-semibold shadow-sm"
            >
              <Menu className="w-4 h-4 text-teal-600" />
              <span>Open Dashboard Menu</span>
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
