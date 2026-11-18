import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import StatCard from '../components/common/StatCard';
import AppointmentCard from '../components/appointments/AppointmentCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Stethoscope,
  Star,
  FileCheck,
  Building,
  ArrowRight,
  PlusCircle,
} from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [alertMsg, setAlertMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, apptRes] = await Promise.all([
        doctorService.getDoctorStats(),
        appointmentService.getMyAppointments(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (apptRes.success) setAppointments(apptRes.data);
    } catch (err) {
      console.error(err);
      setAlertMsg('Unable to fetch doctor metrics. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id, status, extraData = {}) => {
    try {
      const res = await appointmentService.updateStatus(id, { status, ...extraData });
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? res.data : a))
        );
        // Refresh metrics
        const statsRes = await doctorService.getDoctorStats();
        if (statsRes.success) setStats(statsRes.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating appointment status');
    }
  };

  if (loading) {
    return <Loader size="lg" text="Loading doctor clinical workspace..." />;
  }

  const filteredAppointments = appointments.filter((a) => {
    if (filterStatus === 'All') return true;
    return a.status === filterStatus.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'Doctor'
              )}&backgroundColor=0d9488`
            }
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
          />
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Dr. {user?.name}
              </h1>
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>Verified Clinician</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-teal-100">
              {user?.doctorProfile?.specialization || 'Medical Specialist'} •{' '}
              {user?.doctorProfile?.qualification || 'MBBS'} • Consultation Fee:{' '}
              <span className="font-bold">₹{user?.doctorProfile?.consultationFee || 500}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/profile"
            className="px-5 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow-md transition flex items-center space-x-2"
          >
            <Clock className="w-4 h-4 text-teal-600" />
            <span>Availability Hours</span>
          </Link>
          <Link
            to="/articles"
            className="px-5 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-white font-bold text-xs border border-teal-500/50 transition flex items-center space-x-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Publish Article</span>
          </Link>
        </div>
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Consultations"
          value={stats?.todayAppointments ?? 0}
          subtitle="Scheduled for today"
          icon={Calendar}
          color="teal"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingAppointments ?? 0}
          subtitle="Waiting for your confirmation"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Total Patients Treated"
          value={stats?.totalPatients ?? 0}
          subtitle="Unique patient profiles"
          icon={Users}
          color="emerald"
        />
        <StatCard
          title="Patient Rating"
          value={`${stats?.rating || 4.8} / 5`}
          subtitle={`${stats?.reviewsCount || 15} Verified Reviews`}
          icon={Star}
          color="purple"
        />
      </div>

      {/* Appointment Consultation Queue */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Patient Appointment Queue
            </h3>
            <p className="text-xs text-slate-500">
              Confirm appointments, review symptoms, and complete clinical diagnoses
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  filterStatus === tab
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Appointments Found</h4>
            <p className="text-xs text-slate-500">
              There are no {filterStatus !== 'All' ? filterStatus.toLowerCase() : ''}{' '}
              appointments assigned to you at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAppointments.map((appt) => (
              <AppointmentCard
                key={appt._id}
                appointment={appt}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
