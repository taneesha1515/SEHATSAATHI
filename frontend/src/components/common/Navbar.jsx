import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Heart,
  Bell,
  User,
  LogOut,
  Calendar,
  FileText,
  Clock,
  Menu,
  X,
  ChevronDown,
  ShieldAlert,
  Stethoscope,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const Navbar = () => {
  const { user, isAuthenticated, logout, role } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardRoute = () => {
    if (role === 'admin') return '/admin-dashboard';
    if (role === 'doctor') return '/doctor-dashboard';
    return '/patient-dashboard';
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Heart className="w-6 h-6 fill-white stroke-teal-600 stroke-2" />
            </div>
            <div>
              <span className="text-2xl font-black bg-gradient-to-r from-teal-700 via-teal-800 to-emerald-700 bg-clip-text text-transparent tracking-tight">
                Sehat<span className="text-emerald-600 font-extrabold">Saathi</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-teal-600/80 -mt-1">
                Your Health Companion
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                location.pathname === '/'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                location.pathname === '/doctors'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Find Doctors
            </Link>
            <Link
              to="/articles"
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                location.pathname === '/articles'
                  ? 'text-teal-700 bg-teal-50'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              Health Articles
            </Link>

            {/* Authenticated Links */}
            {isAuthenticated && (
              <>
                <Link
                  to={getDashboardRoute()}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                    location.pathname.includes('dashboard')
                      ? 'text-teal-700 bg-teal-50'
                      : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>

                {role === 'patient' && (
                  <>
                    <Link
                      to="/appointments"
                      className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                        location.pathname === '/appointments'
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                      }`}
                    >
                      Appointments
                    </Link>
                    <Link
                      to="/records"
                      className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                        location.pathname === '/records'
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                      }`}
                    >
                      Health Records
                    </Link>
                    <Link
                      to="/reminders"
                      className={`px-3 py-2 text-sm font-semibold rounded-lg transition ${
                        location.pathname === '/reminders'
                          ? 'text-teal-700 bg-teal-50'
                          : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                      }`}
                    >
                      Reminders
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Right Action Buttons / Notifications / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2.5 rounded-xl text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 py-3 z-50">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-800 text-sm">
                          Notifications ({unreadCount} new)
                        </span>
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-teal-600 hover:underline font-medium"
                        >
                          View All
                        </Link>
                      </div>

                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif._id}
                              onClick={() => {
                                if (!notif.isRead) markAsRead(notif._id);
                                if (notif.link) {
                                  navigate(notif.link);
                                  setNotificationsOpen(false);
                                }
                              }}
                              className={`p-3.5 hover:bg-slate-50 transition cursor-pointer ${
                                !notif.isRead ? 'bg-teal-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <h4 className="text-xs font-semibold text-slate-800">
                                  {notif.title}
                                </h4>
                                {!notif.isRead && (
                                  <span className="w-2 h-2 rounded-full bg-teal-500 mt-1"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-400 mt-1.5 block">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar & Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 transition focus:outline-none"
                  >
                    <img
                      src={
                        user?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          user?.name || 'User'
                        )}&backgroundColor=0d9488`
                      }
                      alt={user?.name}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/20"
                    />
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate capitalize">
                          {user?.role} • {user?.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          to={getDashboardRoute()}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Stethoscope className="w-4 h-4 text-slate-400" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>My Profile</span>
                        </Link>
                        <Link
                          to="/notifications"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Bell className="w-4 h-4 text-slate-400" />
                          <span>Notifications</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-teal-700 hover:bg-teal-50 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 rounded-xl shadow-md shadow-teal-600/20 transition-all hover:shadow-lg"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <Link
                to="/notifications"
                className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-3.5 w-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Home
          </Link>
          <Link
            to="/doctors"
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Find Doctors
          </Link>
          <Link
            to="/articles"
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Health Articles
          </Link>

          {isAuthenticated ? (
            <>
              <div className="border-t border-slate-100 my-2 pt-2">
                <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  My Account ({role})
                </div>
                <Link
                  to={getDashboardRoute()}
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  Dashboard
                </Link>
                {role === 'patient' && (
                  <>
                    <Link
                      to="/appointments"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      Appointments
                    </Link>
                    <Link
                      to="/records"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      Health Records
                    </Link>
                    <Link
                      to="/reminders"
                      className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                    >
                      Medicine Reminders
                    </Link>
                  </>
                )}
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-teal-50 hover:text-teal-700"
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                className="block text-center w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="block text-center w-full py-2.5 px-4 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
