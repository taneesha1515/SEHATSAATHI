import React from 'react';
import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  if (!message) return null;

  const typeConfig = {
    info: {
      bg: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />,
    },
    warning: {
      bg: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />,
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`flex items-start justify-between p-4 rounded-xl border ${config.bg} ${className} transition-all duration-200`}
    >
      <div className="flex items-start space-x-3">
        {config.icon}
        <div className="text-sm font-medium">{message}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 ml-4 focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
