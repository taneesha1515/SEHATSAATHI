import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { reminderService } from '../../services/reminderService';
import { Plus, Trash2, Clock } from 'lucide-react';

const ReminderModal = ({ isOpen, onClose, reminder, onSaveSuccess }) => {
  const [medicineName, setMedicineName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Once Daily');
  const [times, setTimes] = useState(['09:00 AM']);
  const [newTimeInput, setNewTimeInput] = useState('');
  const [instructions, setInstructions] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (reminder) {
      setMedicineName(reminder.medicineName || '');
      setDosage(reminder.dosage || '');
      setFrequency(reminder.frequency || 'Once Daily');
      setTimes(reminder.times || ['09:00 AM']);
      setInstructions(reminder.instructions || '');
      setStartDate(
        reminder.startDate
          ? new Date(reminder.startDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setEndDate(
        reminder.endDate
          ? new Date(reminder.endDate).toISOString().split('T')[0]
          : ''
      );
      setStatus(reminder.status || 'active');
    } else {
      setMedicineName('');
      setDosage('');
      setFrequency('Once Daily');
      setTimes(['09:00 AM']);
      setInstructions('Take after food with water');
      setStartDate(new Date().toISOString().split('T')[0]);
      setEndDate('');
      setStatus('active');
    }
  }, [reminder, isOpen]);

  const handleAddTime = () => {
    if (!newTimeInput.trim()) return;
    if (!times.includes(newTimeInput.trim())) {
      setTimes([...times, newTimeInput.trim()]);
      setNewTimeInput('');
    }
  };

  const handleRemoveTime = (index) => {
    if (times.length <= 1) {
      setError('At least one reminder time slot is required.');
      return;
    }
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!medicineName.trim() || !dosage.trim()) {
      setError('Please provide both medicine name and dosage.');
      return;
    }

    if (times.length === 0) {
      setError('Please specify at least one time slot for your medicine reminder.');
      return;
    }

    const payload = {
      medicineName,
      dosage,
      frequency,
      times,
      instructions,
      startDate,
      endDate: endDate || null,
      status,
    };

    try {
      setLoading(true);
      if (reminder && reminder._id) {
        await reminderService.updateReminder(reminder._id, payload);
      } else {
        await reminderService.createReminder(payload);
      }
      onClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medicine reminder.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={reminder ? 'Edit Medicine Schedule' : 'Schedule New Medication'}
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Medicine / Drug Name *
            </label>
            <input
              type="text"
              value={medicineName}
              onChange={(e) => setMedicineName(e.target.value)}
              placeholder="e.g. Metformin, Atorvastatin, Amoxicillin"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dosage & Strength *
              </label>
              <input
                type="text"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                placeholder="e.g. 500mg - 1 Tablet, 5ml Syrup"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Frequency
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
              >
                <option value="Once Daily">Once Daily</option>
                <option value="Twice Daily">Twice Daily</option>
                <option value="Three Times Daily">Three Times Daily</option>
                <option value="Every 8 Hours">Every 8 Hours</option>
                <option value="Weekly">Weekly</option>
                <option value="As Needed (SOS)">As Needed (SOS)</option>
              </select>
            </div>
          </div>

          {/* Time Slots Management */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reminder Times *
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {times.map((time, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold shadow-sm"
                >
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>{time}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTime(idx)}
                    className="hover:text-rose-600 ml-1 p-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTimeInput}
                onChange={(e) => setNewTimeInput(e.target.value)}
                placeholder="e.g. 02:00 PM, 08:30 PM"
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <button
                type="button"
                onClick={handleAddTime}
                className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 text-xs font-bold hover:bg-teal-100 transition flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Doctor Instructions / Food Guidance
            </label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Take 15 minutes before breakfast with warm water"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Saving Schedule...' : reminder ? 'Update Schedule' : 'Activate Reminder'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ReminderModal;
