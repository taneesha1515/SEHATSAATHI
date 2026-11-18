import React, { useState } from 'react';
import {
  FileText,
  Calendar,
  User,
  Tag,
  Download,
  Trash2,
  Edit2,
  Activity,
  FileCheck2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

const RecordCard = ({ record, onEdit, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const typeConfig = {
    prescription: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Prescription',
      icon: FileCheck2,
    },
    lab_report: {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      label: 'Lab Report',
      icon: Activity,
    },
    scan: {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Scan / Imaging',
      icon: FileText,
    },
    doctor_note: {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      label: 'Clinical Note',
      icon: FileText,
    },
    discharge_summary: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Discharge Summary',
      icon: FileText,
    },
  };

  const config = typeConfig[record.recordType] || typeConfig.prescription;
  const Icon = config.icon;
  const formattedDate = new Date(record.recordDate).toLocaleDateString(
    undefined,
    { year: 'numeric', month: 'short', day: 'numeric' }
  );

  const handlePrintOrDownload = () => {
    // Elegant simulated medical record print preview
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>SehatSaathi Medical Record - ${record.title}</title>
          <style>
            body { font-family: sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #0d9488; padding-bottom: 20px; margin-bottom: 24px; }
            .logo { font-size: 24px; font-weight: bold; color: #0d9488; }
            .badge { display: inline-block; padding: 4px 12px; background: #ccfbf1; color: #0f766e; border-radius: 9999px; font-size: 12px; font-weight: bold; }
            .row { margin: 12px 0; }
            .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; }
            .value { font-size: 15px; margin-top: 4px; }
            .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">SEHATSAATHI HEALTHCARE ECOSYSTEM</div>
            <p>Official Patient Health Record Summary</p>
          </div>
          <span class="badge">${config.label}</span>
          <h2>${record.title}</h2>
          <div class="row">
            <div class="label">Date of Consultation / Record</div>
            <div class="value">${formattedDate}</div>
          </div>
          <div class="row">
            <div class="label">Attending Doctor / Lab</div>
            <div class="value">${record.doctorName || 'Not specified'}</div>
          </div>
          ${
            record.diagnosis
              ? `
          <div class="row">
            <div class="label">Diagnosis / Key Findings</div>
            <div class="value">${record.diagnosis}</div>
          </div>`
              : ''
          }
          <div class="box">
            <div class="label">Clinical Notes & Observations</div>
            <p>${record.description || 'No detailed remarks recorded.'}</p>
          </div>
          <div style="margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            Generated electronically via SehatSaathi Platform. Valid without signature.
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${config.bg}`}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span
              className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border mb-1.5 ${config.bg}`}
            >
              {config.label}
            </span>
            <h4 className="text-base font-bold text-slate-800 leading-snug">
              {record.title}
            </h4>
            <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{formattedDate}</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{record.doctorName || 'Self Uploaded'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center space-x-1 shrink-0">
          <button
            onClick={handlePrintOrDownload}
            title="Download / Print Summary"
            className="p-2 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
          >
            <Download className="w-4 h-4" />
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(record)}
              title="Edit Record"
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(record._id)}
              title="Delete Record"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Diagnosis Highlight */}
      {record.diagnosis && (
        <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-2 text-xs">
          <span className="font-bold text-slate-700">Diagnosis:</span>
          <span className="text-teal-800 font-semibold">{record.diagnosis}</span>
        </div>
      )}

      {/* Description / Expanded */}
      {expanded && record.description && (
        <div className="mt-3 p-3 rounded-xl bg-teal-50/40 border border-teal-100/60 text-xs text-slate-700 leading-relaxed">
          <p className="font-semibold text-teal-900 mb-1">Detailed Observations:</p>
          {record.description}
        </div>
      )}

      {/* Tags */}
      {record.tags && record.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {record.tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
            >
              <Tag className="w-2.5 h-2.5" />
              <span>{tag}</span>
            </span>
          ))}
        </div>
      )}

      {record.description && (
        <div className="mt-3 pt-2 border-t border-slate-50 flex justify-end">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-semibold text-slate-400 hover:text-teal-600 flex items-center space-x-1"
          >
            <span>{expanded ? 'Hide Details' : 'View Notes'}</span>
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordCard;
