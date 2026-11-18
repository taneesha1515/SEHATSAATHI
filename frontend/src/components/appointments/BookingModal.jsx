import React, { useState } from 'react';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, Stethoscope, AlertCircle, CheckCircle2 } from 'lucide-react';

const BookingModal = ({ isOpen, onClose, doctor, onBookingSuccess }) => {
  const [appointmentDate, setAppointmentDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!doctor) return null;

  const defaultSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const availableSlots =
    doctor.availableTimeSlots && doctor.availableTimeSlots.length > 0
      ? doctor.availableTimeSlots
      : defaultSlots;

  const doctorName = doctor.user?.name || doctor.name || 'Specialist Doctor';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedSlot) {
      setError('Please choose an available appointment time slot.');
      return;
    }

    if (!reason.trim()) {
      setError('Please briefly describe your medical reason or symptoms.');
      return;
    }

    try {
      setLoading(true);
      const res = await appointmentService.createAppointment({
        doctorId: doctor._id,
        appointmentDate,
        timeSlot: selectedSlot,
        reason,
        notes,
      });

      if (res.success) {
        setSuccess('Appointment booked successfully! Redirecting...');
        setTimeout(() => {
          setSuccess('');
          onClose();
          if (onBookingSuccess) onBookingSuccess(res.data);
        }, 1200);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to book appointment at this time. Please try another slot.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Book Doctor Consultation"
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        {/* Doctor Summary Header */}
        <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100">
          <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center text-white shrink-0 font-bold">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Dr. {doctorName}</h4>
            <p className="text-xs text-teal-700 font-medium">
              {doctor.specialization} • {doctor.qualification || 'MBBS'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Consultation Fee: <span className="font-semibold text-slate-700">₹{doctor.consultationFee || 500}</span>
            </p>
          </div>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Appointment Date
            </label>
            <div className="relative">
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Preferred Time Slot
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((slot) => {
                const isSelected = selectedSlot === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 px-2 text-xs font-semibold rounded-xl border transition text-center ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-teal-400 hover:bg-teal-50/50'
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reason / Symptoms */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Reason for Visit / Symptoms *
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Mild chest discomfort after exercise, persistent cough, routine follow-up..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
            />
          </div>

          {/* Optional Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Additional Notes for Doctor (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Previously allergic to penicillin"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder:text-slate-400"
            />
          </div>

          {/* Action Buttons */}
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
              {loading ? 'Confirming...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default BookingModal;
