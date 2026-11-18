import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { appointmentService } from '../services/appointmentService';
import AppointmentCard from '../components/appointments/AppointmentCard';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { Calendar, Plus, Filter, Search, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AppointmentsPage = () => {
  const { role } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [alertMsg, setAlertMsg] = useState('');

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await appointmentService.getMyAppointments(params);
      if (res.success) {
        setAppointments(res.data);
      }
    } catch (err) {
      setAlertMsg('Unable to fetch appointment list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter]);

  const handleUpdateStatus = async (id, status, extraData = {}) => {
    try {
      const res = await appointmentService.updateStatus(id, { status, ...extraData });
      if (res.success) {
        setAppointments((prev) =>
          prev.map((a) => (a._id === id ? res.data : a))
        );
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating appointment status');
    }
  };

  const filtered = appointments.filter((appt) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    const docName = appt.doctor?.user?.name || appt.doctor?.name || '';
    const patName = appt.patient?.name || '';
    const reason = appt.reason || '';
    return (
      docName.toLowerCase().includes(s) ||
      patName.toLowerCase().includes(s) ||
      reason.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Consultation Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track upcoming doctor visits, follow-up consults, and clinical history
          </p>
        </div>

        {role === 'patient' && (
          <Link
            to="/doctors"
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Appointment</span>
          </Link>
        )}
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}

      {/* Filter Tabs & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                statusFilter === tab
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or reason..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Appointments List */}
      {loading ? (
        <Loader size="lg" text="Loading appointments..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Appointments Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            There are no appointments matching your filter selection.
          </p>
          {role === 'patient' && (
            <Link
              to="/doctors"
              className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
            >
              Browse Doctor Catalog
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((appt) => (
            <AppointmentCard
              key={appt._id}
              appointment={appt}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentsPage;
