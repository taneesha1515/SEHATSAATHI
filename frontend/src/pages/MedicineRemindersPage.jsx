import React, { useState, useEffect } from 'react';
import { reminderService } from '../services/reminderService';
import ReminderCard from '../components/reminders/ReminderCard';
import ReminderModal from '../components/reminders/ReminderModal';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { Pill, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const MedicineRemindersPage = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchReminders = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;

      const res = await reminderService.getReminders(params);
      if (res.success) {
        setReminders(res.data);
      }
    } catch (err) {
      setAlertMsg('Unable to fetch medicine reminders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [statusFilter]);

  const handleLogIntake = async (id, time, status) => {
    try {
      const res = await reminderService.logIntake(id, { time, status });
      if (res.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === id ? res.data : r))
        );
        setSuccessMsg(`Dosage for ${time} logged as '${status}'.`);
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Error updating dosage record');
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      const res = await reminderService.updateReminder(id, { status: newStatus });
      if (res.success) {
        setReminders((prev) =>
          prev.map((r) => (r._id === id ? res.data : r))
        );
      }
    } catch (err) {
      alert('Error updating reminder status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medication reminder?')) return;
    try {
      const res = await reminderService.deleteReminder(id);
      if (res.success) {
        setReminders((prev) => prev.filter((r) => r._id !== id));
        setSuccessMsg('Medication removed from reminder queue.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Error deleting reminder');
    }
  };

  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingReminder(null);
    setModalOpen(true);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const dosesTakenToday = reminders.filter((r) =>
    r.logs?.some((l) => l.date === todayStr && l.status === 'taken')
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart Medication Reminders
            </h1>
            <span className="p-1 rounded-full bg-teal-50 text-teal-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated alerts for daily prescriptions with 1-tap adherence tracking
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Medication</span>
        </button>
      </div>

      {/* Compliance Mini Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 font-bold">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Active Prescriptions</p>
            <h4 className="text-xl font-bold text-slate-900">
              {reminders.filter((r) => r.status === 'active').length}
            </h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Doses Taken Today</p>
            <h4 className="text-xl font-bold text-emerald-700">{dosesTakenToday}</h4>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Adherence Status</p>
            <h4 className="text-xl font-bold text-slate-900">On Track</h4>
          </div>
        </div>
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}
      {successMsg && <Alert type="success" message={successMsg} />}

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['All', 'Active', 'Paused'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              statusFilter === tab
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reminders Grid */}
      {loading ? (
        <Loader size="lg" text="Syncing medicine schedules..." />
      ) : reminders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <Pill className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Medication Reminders</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Add your daily or weekly prescription schedules to get alerts and monitor intake.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
          >
            Add First Medicine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reminders.map((reminder) => (
            <ReminderCard
              key={reminder._id}
              reminder={reminder}
              onLogIntake={handleLogIntake}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ReminderModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        reminder={editingReminder}
        onSaveSuccess={fetchReminders}
      />
    </div>
  );
};

export default MedicineRemindersPage;
