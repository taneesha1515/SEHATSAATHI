import React from 'react';
import {
  Pill,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Trash2,
  Edit2,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

const ReminderCard = ({
  reminder,
  onLogIntake,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Check if today's dose has been marked taken
  const todaysLog = reminder.logs?.find((log) => log.date === todayStr);
  const isTakenToday = todaysLog && todaysLog.status === 'taken';

  const isActive = reminder.status === 'active';

  return (
    <div
      className={`rounded-2xl border p-5 transition shadow-sm hover:shadow-md ${
        isActive ? 'bg-white border-slate-100' : 'bg-slate-50/70 border-slate-200 opacity-75'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
              isTakenToday
                ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                : 'bg-teal-50 text-teal-600 border-teal-200'
            }`}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-bold text-slate-800">
                {reminder.medicineName}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
                {reminder.dosage}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {reminder.frequency} • {reminder.instructions || 'Take with water'}
            </p>
          </div>
        </div>

        {/* Actions top right */}
        <div className="flex items-center space-x-1 shrink-0">
          {onToggleStatus && (
            <button
              onClick={() => onToggleStatus(reminder._id, isActive ? 'paused' : 'active')}
              title={isActive ? 'Pause Reminder' : 'Resume Reminder'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-slate-100 transition"
            >
              {isActive ? (
                <PauseCircle className="w-4 h-4" />
              ) : (
                <PlayCircle className="w-4 h-4 text-emerald-600" />
              )}
            </button>
          )}
          {onEdit && (
            <button
              onClick={() => onEdit(reminder)}
              title="Edit Schedule"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(reminder._id)}
              title="Delete Reminder"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Times Badges */}
      <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Times:
        </span>
        {reminder.times?.map((time, idx) => (
          <span
            key={idx}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold"
          >
            <Clock className="w-3 h-3 text-teal-600" />
            <span>{time}</span>
          </span>
        ))}
      </div>

      {/* Today's Intake Status Banner & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs">
          {isTakenToday ? (
            <span className="inline-flex items-center space-x-1.5 text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Dose taken for today</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1.5 text-amber-700 font-medium bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pending intake today</span>
            </span>
          )}
        </div>

        {isActive && (
          <div className="flex items-center space-x-2">
            {!isTakenToday ? (
              <button
                onClick={() => onLogIntake(reminder._id, reminder.times[0] || '12:00 PM', 'taken')}
                className="w-full sm:w-auto px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm shadow-teal-600/20 transition flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Dose Taken</span>
              </button>
            ) : (
              <button
                onClick={() => onLogIntake(reminder._id, reminder.times[0] || '12:00 PM', 'missed')}
                className="w-full sm:w-auto px-3 py-1.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
              >
                Undo / Mark Missed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReminderCard;
