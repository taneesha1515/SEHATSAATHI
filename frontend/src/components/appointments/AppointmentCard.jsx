import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  FileCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AppointmentCard = ({ appointment, onUpdateStatus }) => {
  const { role } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [prescriptionNote, setPrescriptionNote] = useState('');

  const statusConfig = {
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Pending Confirmation',
    },
    confirmed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Confirmed',
    },
    completed: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      label: 'Completed',
    },
    cancelled: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      label: 'Cancelled',
    },
  };

  const status = statusConfig[appointment.status] || statusConfig.pending;
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin';

  const doctorName =
    appointment.doctor?.user?.name || appointment.doctor?.name || 'Assigned Doctor';
  const doctorSpecialization =
    appointment.doctor?.specialization || 'Medical Specialist';
  const patientName = appointment.patient?.name || 'Patient';
  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString(
    undefined,
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-50">
        <div className="flex items-start space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 shrink-0 font-bold">
            {isDoctor ? <User className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">
              {isDoctor ? `Patient: ${patientName}` : `Dr. ${doctorName}`}
            </h4>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {isDoctor
                ? `Phone: ${appointment.patient?.phone || 'Not provided'} • Blood Group: ${
                    appointment.patient?.bloodGroup || 'N/A'
                  }`
                : `${doctorSpecialization} • SehatSaathi Partner`}
            </p>
          </div>
        </div>

        {/* Status Pill */}
        <div className="flex items-center space-x-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${status.bg}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Date & Slot Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center space-x-2 text-slate-700">
          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-semibold">{formattedDate}</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-700">
          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="font-semibold">{appointment.timeSlot}</span>
        </div>
      </div>

      {/* Chief Complaint / Reason */}
      <div className="text-xs text-slate-600">
        <span className="font-bold text-slate-700">Reason: </span>
        <span>{appointment.reason}</span>
      </div>

      {/* Collapsible Details */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-2 text-slate-600">
          {appointment.notes && (
            <div>
              <span className="font-bold text-slate-700">Patient Notes: </span>
              {appointment.notes}
            </div>
          )}
          {appointment.prescriptionSummary && (
            <div className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-teal-900">
              <span className="font-bold">Doctor Prescription & Advice: </span>
              <p className="mt-1">{appointment.prescriptionSummary}</p>
            </div>
          )}
          {appointment.cancelledReason && (
            <div className="p-3 bg-rose-50/50 rounded-xl border border-rose-100 text-rose-800">
              <span className="font-bold">Cancellation Reason: </span>
              <p className="mt-1">{appointment.cancelledReason}</p>
            </div>
          )}
        </div>
      )}

      {/* Doctor Complete Consultation Form */}
      {showCompleteModal && (
        <div className="mt-4 p-4 rounded-xl bg-teal-50 border border-teal-100 space-y-3">
          <h5 className="text-xs font-bold text-teal-900">
            Provide Clinical Summary & Prescription
          </h5>
          <textarea
            rows={2}
            value={prescriptionNote}
            onChange={(e) => setPrescriptionNote(e.target.value)}
            placeholder="e.g. Tab Paracetamol 650mg TDS, complete 5-day course, follow up in 1 week..."
            className="w-full text-xs p-2.5 rounded-lg border border-teal-200 bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowCompleteModal(false)}
              className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onUpdateStatus(appointment._id, 'completed', {
                  prescriptionSummary: prescriptionNote,
                });
                setShowCompleteModal(false);
              }}
              className="px-4 py-1.5 text-xs bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700"
            >
              Finish Consultation
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Input Box */}
      {cancelling && (
        <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-100 space-y-3">
          <h5 className="text-xs font-bold text-rose-900">Reason for Cancellation</h5>
          <input
            type="text"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please specify why you are cancelling..."
            className="w-full text-xs p-2.5 rounded-lg border border-rose-200 bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setCancelling(false)}
              className="px-3 py-1.5 text-xs text-slate-600 font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => {
                onUpdateStatus(appointment._id, 'cancelled', {
                  cancelledReason: cancelReason || 'Cancelled by user',
                });
                setCancelling(false);
              }}
              className="px-4 py-1.5 text-xs bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700"
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      )}

      {/* Card Actions Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-slate-500 hover:text-teal-600 flex items-center space-x-1"
        >
          <span>{expanded ? 'Less Details' : 'More Details'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center space-x-2">
          {/* Doctor / Admin Actions */}
          {(isDoctor || isAdmin) && appointment.status === 'pending' && (
            <button
              onClick={() => onUpdateStatus(appointment._id, 'confirmed')}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
            >
              Accept & Confirm
            </button>
          )}

          {(isDoctor || isAdmin) && appointment.status === 'confirmed' && (
            <button
              onClick={() => setShowCompleteModal(true)}
              className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm transition flex items-center space-x-1"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Mark Complete</span>
            </button>
          )}

          {/* Cancel button if pending or confirmed */}
          {['pending', 'confirmed'].includes(appointment.status) && !cancelling && (
            <button
              onClick={() => setCancelling(true)}
              className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
