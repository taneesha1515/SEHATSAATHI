import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Alert from '../components/common/Alert';
import { Heart, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const user = await login({ email, password });
      
      // Navigate to destination or role dashboard
      if (from) {
        navigate(from, { replace: true });
      } else if (user.role === 'admin') {
        navigate('/admin-dashboard', { replace: true });
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard', { replace: true });
      } else {
        navigate('/patient-dashboard', { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-teal-50/40 via-white to-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-teal-500/20 group-hover:scale-105 transition">
              <Heart className="w-6 h-6 fill-white stroke-teal-600" />
            </div>
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back to SehatSaathi
          </h2>
          <p className="text-sm text-slate-500">
            Sign in to access your consultations, prescriptions, and health vault
          </p>
        </div>

        {/* Demo Fast-Login Strip for College Evaluation */}
        <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-100 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-teal-900">
            <span>⚡ Quick Demo Credentials (1-Click Fill):</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('patient@sehatsaathi.com', 'Patient@123')}
              className="py-1.5 px-2 rounded-xl bg-white border border-teal-200 text-teal-800 text-[11px] font-bold hover:bg-teal-100/50 transition shadow-xs flex items-center justify-center space-x-1"
            >
              <UserCheck className="w-3 h-3 text-teal-600" />
              <span>Patient</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('dr.rajesh@sehatsaathi.com', 'Doctor@123')}
              className="py-1.5 px-2 rounded-xl bg-white border border-teal-200 text-teal-800 text-[11px] font-bold hover:bg-teal-100/50 transition shadow-xs flex items-center justify-center space-x-1"
            >
              <Stethoscope className="w-3 h-3 text-teal-600" />
              <span>Doctor</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@sehatsaathi.com', 'Admin@123')}
              className="py-1.5 px-2 rounded-xl bg-white border border-teal-200 text-teal-800 text-[11px] font-bold hover:bg-teal-100/50 transition shadow-xs flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3 h-3 text-teal-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl space-y-6">
          {error && <Alert type="error" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 hover:shadow-lg transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-teal-600 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
