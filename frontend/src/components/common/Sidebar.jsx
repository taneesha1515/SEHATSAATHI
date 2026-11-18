import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Clock,
  User,
  Users,
  CheckCircle,
  BookOpen,
  LogOut,
  Stethoscope,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, role, logout } = useAuth();

  const patientLinks = [
    { name: 'Dashboard Overview', path: '/patient-dashboard', icon: LayoutDashboard },
    { name: 'Find Doctors', path: '/doctors', icon: Stethoscope },
    { name: 'My Appointments', path: '/appointments', icon: Calendar },
    { name: 'Health Records', path: '/records', icon: FileText },
    { name: 'Medicine Reminders', path: '/reminders', icon: Clock },
    { name: 'Health Articles', path: '/articles', icon: BookOpen },
    { name: 'Profile & Emergency', path: '/profile', icon: User },
  ];

  const doctorLinks = [
    { name: 'Doctor Dashboard', path: '/doctor-dashboard', icon: LayoutDashboard },
    { name: 'Consultation Queue', path: '/appointments', icon: Calendar },
    { name: 'Patient Records', path: '/records', icon: FileText },
    { name: 'Health Articles', path: '/articles', icon: BookOpen },
    { name: 'Doctor Profile & Hours', path: '/profile', icon: User },
  ];

  const adminLinks = [
    { name: 'Admin Dashboard', path: '/admin-dashboard', icon: LayoutDashboard },
    { name: 'Appointments Hub', path: '/appointments', icon: Calendar },
    { name: 'Articles Management', path: '/articles', icon: BookOpen },
    { name: 'System Profile', path: '/profile', icon: User },
  ];

  const links =
    role === 'doctor' ? doctorLinks : role === 'admin' ? adminLinks : patientLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 flex flex-col justify-between min-h-[calc(100vh-5rem)] shrink-0">
      <div className="p-4">
        {/* User Mini Banner */}
        <div className="flex items-center space-x-3 p-3 mb-6 rounded-2xl bg-gradient-to-r from-teal-50/70 to-emerald-50/70 border border-teal-100/60">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'User'
              )}&backgroundColor=0d9488`
            }
            alt={user?.name}
            className="w-10 h-10 rounded-xl object-cover ring-2 ring-teal-500/20"
          />
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-800 truncate">{user?.name}</h4>
            <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-600 text-white">
              {role}
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
            Main Menu
          </div>
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-semibold'
                      : 'text-slate-600 hover:text-teal-700 hover:bg-slate-50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Bottom Sign Out */}
      <div className="p-4 border-t border-slate-100">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
