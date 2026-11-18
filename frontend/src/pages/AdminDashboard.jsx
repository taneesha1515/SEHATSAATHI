import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Users,
  Stethoscope,
  Calendar,
  FileText,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  Filter,
  Activity,
  AlertCircle,
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'doctors', 'users'
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [alertMsg, setAlertMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, docsRes, usersRes] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAllDoctorsAdmin(),
        adminService.getAllUsers({ limit: 50 }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (docsRes.success) setDoctors(docsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setAlertMsg('Failed to load administrator telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleVerifyDoctor = async (doctorId) => {
    try {
      const res = await adminService.verifyDoctor(doctorId);
      if (res.success) {
        setDoctors((prev) =>
          prev.map((d) => (d._id === doctorId ? res.data : d))
        );
        setSuccessMsg(res.message);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Error updating doctor verification status');
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.data.isActive } : u))
        );
        setSuccessMsg(res.message);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user status');
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading enterprise admin operations panel..." />;
  }

  const filteredUsers = users.filter((u) => {
    const matchesRole =
      userRoleFilter === 'All' || u.role.toLowerCase() === userRoleFilter.toLowerCase();
    const matchesSearch =
      !userSearch.trim() ||
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-teal-800/40">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Root Administrator Security Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            SehatSaathi Operations Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time platform metrics, user access management, and doctor verification approval
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'overview'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'doctors'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Doctors ({doctors.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl transition ${
              activeTab === 'users'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
        </div>
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}
      {successMsg && <Alert type="success" message={successMsg} />}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Registered Patients"
              value={stats?.totalPatients ?? 0}
              subtitle="Registered patient accounts"
              icon={Users}
              color="teal"
            />
            <StatCard
              title="Registered Doctors"
              value={stats?.totalDoctors ?? 0}
              subtitle={`${stats?.pendingVerifications || 0} Pending Verification`}
              icon={Stethoscope}
              color="emerald"
            />
            <StatCard
              title="Total Consultations"
              value={stats?.totalAppointments ?? 0}
              subtitle={`${stats?.completedAppointments || 0} marked completed`}
              icon={Calendar}
              color="blue"
            />
            <StatCard
              title="Stored Health Records"
              value={stats?.totalRecords ?? 0}
              subtitle="Encrypted medical files"
              icon={FileText}
              color="purple"
            />
          </div>

          {/* Quick Doctor Verifications Pending Table */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Doctor Verification Queue
              </h3>
              <button
                onClick={() => setActiveTab('doctors')}
                className="text-xs font-bold text-teal-600 hover:underline"
              >
                View Full Roster
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-bold">Doctor</th>
                    <th className="pb-3 font-bold">Specialization</th>
                    <th className="pb-3 font-bold">Experience</th>
                    <th className="pb-3 font-bold">Fee</th>
                    <th className="pb-3 font-bold">Verification Status</th>
                    <th className="pb-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {doctors.slice(0, 5).map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/60">
                      <td className="py-3.5 font-bold text-slate-800">
                        {doc.user?.name || 'Doctor'}
                      </td>
                      <td className="py-3.5 text-slate-600">{doc.specialization}</td>
                      <td className="py-3.5 text-slate-600">{doc.experience} Years</td>
                      <td className="py-3.5 font-semibold text-slate-900">
                        ₹{doc.consultationFee}
                      </td>
                      <td className="py-3.5">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            doc.isVerified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {doc.isVerified ? 'Verified' : 'Pending Verification'}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleVerifyDoctor(doc._id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                            doc.isVerified
                              ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {doc.isVerified ? 'Revoke Status' : 'Approve Doctor'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Doctors Tab Content */}
      {activeTab === 'doctors' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                All Medical Practitioners ({doctors.length})
              </h3>
              <p className="text-xs text-slate-500">
                Review qualifications, clinic affiliations, and control verified status
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">Doctor</th>
                  <th className="pb-3 font-bold">Contact</th>
                  <th className="pb-3 font-bold">Specialization & Degree</th>
                  <th className="pb-3 font-bold">Clinic / Location</th>
                  <th className="pb-3 font-bold">Rating</th>
                  <th className="pb-3 font-bold">Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {doctors.map((doc) => (
                  <tr key={doc._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={
                            doc.user?.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              doc.user?.name || 'Doc'
                            )}&backgroundColor=0d9488`
                          }
                          alt="Doc"
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{doc.user?.name}</p>
                          <p className="text-[10px] text-slate-400">{doc.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      {doc.user?.phone || 'Not given'}
                    </td>
                    <td className="py-3.5">
                      <p className="font-semibold text-teal-700">{doc.specialization}</p>
                      <p className="text-[10px] text-slate-400">{doc.qualification}</p>
                    </td>
                    <td className="py-3.5 text-slate-600">
                      <p className="truncate max-w-[150px]">{doc.clinicName}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[150px]">
                        {doc.clinicAddress}
                      </p>
                    </td>
                    <td className="py-3.5 font-bold text-amber-600">
                      ★ {doc.rating} ({doc.reviewsCount || 0})
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          doc.isVerified
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => handleVerifyDoctor(doc._id)}
                        className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                          doc.isVerified
                            ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {doc.isVerified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                User Access & Accounts Directory
              </h3>
              <p className="text-xs text-slate-500">
                Search, inspect user roles, and activate/deactivate accounts
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => setUserRoleFilter(e.target.value)}
                className="py-1.5 px-3 text-xs rounded-xl border border-slate-200 bg-white font-medium focus:outline-none"
              >
                <option value="All">All Roles</option>
                <option value="patient">Patients</option>
                <option value="doctor">Doctors</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 font-bold">User</th>
                  <th className="pb-3 font-bold">Role</th>
                  <th className="pb-3 font-bold">Phone</th>
                  <th className="pb-3 font-bold">Blood Group</th>
                  <th className="pb-3 font-bold">Account Status</th>
                  <th className="pb-3 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60">
                    <td className="py-3.5">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={
                            u.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              u.name
                            )}&backgroundColor=0d9488`
                          }
                          alt={u.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-800">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="capitalize px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-600">{u.phone || 'N/A'}</td>
                    <td className="py-3.5 text-slate-600">{u.bloodGroup || 'N/A'}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleUserStatus(u._id)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold transition ${
                            u.isActive
                              ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
