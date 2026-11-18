import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { appointmentService } from '../services/appointmentService';
import { reminderService } from '../services/reminderService';
import { recordService } from '../services/recordService';
import StatCard from '../components/common/StatCard';
import AppointmentCard from '../components/appointments/AppointmentCard';
import ReminderCard from '../components/reminders/ReminderCard';
import RecordCard from '../components/records/RecordCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Calendar,
  Clock,
  FileText,
  Stethoscope,
  Plus,
  ArrowRight,
  ShieldAlert,
  Heart,
  Pill,
  CheckCircle2,
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState('');

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [apptRes, remRes, recRes] = await Promise.all([
        appointmentService.getMyAppointments(),
        reminderService.getReminders(),
        recordService.getMyRecords(),
      ]);

      if (apptRes.success) setAppointments(apptRes.data);
      if (remRes.success) setReminders(remRes.data);
      if (recRes.success) setRecords(recRes.data);
    } catch (err) {
      console.error(err);
      setAlertMsg('Failed to fetch dashboard data. Please verify backend service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleUpdateAppointment = async (id, status, extraData = {}) => {
    try {
      const res = await appointmentService.updateStatus(id, { status, ...extraData });
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? res.data : a))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating appointment');
    }
  };

  const handleLogIntake = async (id, time, status) => {
    try {
      const res = await reminderService.logIntake(id, { time, status });
      if (res.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === id ? res.data : r))
        );
      }
    } catch (err) {
      alert('Error updating dosage log');
    }
  };

  if (loading) {
    return <Loader size="lg" text="Personalizing your health dashboard..." />;
  }

  const upcomingAppointments = appointments.filter((a) =>
    ['pending', 'confirmed'].includes(a.status)
  );

  const activeReminders = reminders.filter((r) => r.status === 'active');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                user?.name || 'Patient'
              )}&backgroundColor=0d9488`
            }
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
          />
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-teal-100">
              Blood Group: <span className="font-bold">{user?.bloodGroup || 'B+'}</span> • Status:{' '}
              <span className="font-bold text-emerald-300">Healthy & Monitored</span>
            </p>
          </div>
        </div>

        {/* Quick Emergency / Action Button */}
        <div className="flex items-center space-x-3">
          <Link
            to="/doctors"
            className="px-5 py-2.5 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow-md transition flex items-center space-x-2"
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Book Doctor</span>
          </Link>
          <Link
            to="/reminders"
            className="px-5 py-2.5 rounded-xl bg-teal-900/60 hover:bg-teal-900 text-white font-bold text-xs border border-teal-500/50 transition flex items-center space-x-2"
          >
            <Pill className="w-4 h-4" />
            <span>Medications</span>
          </Link>
        </div>
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Appointments"
          value={upcomingAppointments.length}
          subtitle="Scheduled with specialists"
          icon={Calendar}
          color="teal"
        />
        <StatCard
          title="Daily Medicine Reminders"
          value={activeReminders.length}
          subtitle="Active daily schedules"
          icon={Clock}
          color="emerald"
        />
        <StatCard
          title="Stored Health Records"
          value={records.length}
          subtitle="Prescriptions & lab reports"
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Consultations History"
          value={appointments.length}
          subtitle="Total lifetime sessions"
          icon={Stethoscope}
          color="purple"
        />
      </div>

      {/* Today's Medication Checklist Strip */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Today's Medicine Schedule
              </h3>
              <p className="text-xs text-slate-500">
                Track compliance and log your daily prescribed doses
              </p>
            </div>
          </div>

          <Link
            to="/reminders"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
          >
            <span>Manage All ({reminders.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {activeReminders.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No active medicine schedules set. Click{' '}
            <Link to="/reminders" className="text-teal-600 font-bold underline">
              here
            </Link>{' '}
            to add medication alerts.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeReminders.slice(0, 3).map((rem) => (
              <ReminderCard
                key={rem._id}
                reminder={rem}
                onLogIntake={handleLogIntake}
              />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Upcoming Appointments & Recent Health Records */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Appointments Section */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Upcoming Consultations
              </h3>
              <p className="text-xs text-slate-500">
                Confirmed and pending specialist appointments
              </p>
            </div>
            <Link
              to="/appointments"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No pending or confirmed appointments.</p>
              <Link
                to="/doctors"
                className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold"
              >
                Find & Book Doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.slice(0, 3).map((appt) => (
                <AppointmentCard
                  key={appt._id}
                  appointment={appt}
                  onUpdateStatus={handleUpdateAppointment}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Health Records Section */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Health Vault</h3>
              <p className="text-xs text-slate-500">Recent prescriptions & lab reports</p>
            </div>
            <Link
              to="/records"
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>Vault ({records.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {records.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">No medical documents uploaded yet.</p>
              <Link
                to="/records"
                className="inline-block px-4 py-2 rounded-xl bg-teal-50 text-teal-700 text-xs font-bold hover:bg-teal-100"
              >
                + Add First Record
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {records.slice(0, 3).map((rec) => (
                <RecordCard key={rec._id} record={rec} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
