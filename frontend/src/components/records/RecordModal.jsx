import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { recordService } from '../../services/recordService';

const RecordModal = ({ isOpen, onClose, record, onSaveSuccess }) => {
  const [title, setTitle] = useState('');
  const [recordType, setRecordType] = useState('prescription');
  const [recordDate, setRecordDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [diagnosis, setDiagnosis] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (record) {
      setTitle(record.title || '');
      setRecordType(record.recordType || 'prescription');
      setRecordDate(
        record.recordDate
          ? new Date(record.recordDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0]
      );
      setDiagnosis(record.diagnosis || '');
      setDoctorName(record.doctorName || '');
      setDescription(record.description || '');
      setTagsInput(record.tags ? record.tags.join(', ') : '');
    } else {
      setTitle('');
      setRecordType('prescription');
      setRecordDate(new Date().toISOString().split('T')[0]);
      setDiagnosis('');
      setDoctorName('');
      setDescription('');
      setTagsInput('');
    }
  }, [record, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a descriptive title for this health record.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      recordType,
      recordDate,
      diagnosis,
      doctorName: doctorName || 'Personal / Self Uploaded',
      description,
      tags: tagsArray,
    };

    try {
      setLoading(true);
      if (record && record._id) {
        await recordService.updateRecord(record._id, payload);
      } else {
        await recordService.createRecord(payload);
      }
      onClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save medical record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={record ? 'Edit Health Record' : 'Upload & Log New Health Record'}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Record Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Annual Blood Chemistry & Lipid Profile, Dr. Sharma Prescription"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Record Type *
              </label>
              <select
                value={recordType}
                onChange={(e) => setRecordType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="prescription">Prescription</option>
                <option value="lab_report">Lab & Blood Test Report</option>
                <option value="scan">Radiology Scan (X-Ray, MRI, CT)</option>
                <option value="doctor_note">Doctor Clinical Note</option>
                <option value="discharge_summary">Discharge Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Date of Record *
              </label>
              <input
                type="date"
                value={recordDate}
                onChange={(e) => setRecordDate(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Attending Doctor / Lab Name
              </label>
              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="e.g. Dr. Rajesh Sharma, Apollo Diagnostics"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Clinical Diagnosis / Finding
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Mild Hypertension, Vitamin D Deficiency"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Medical Notes & Observations
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Summary of recommendations, medicine instructions, or key findings..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. Cholesterol, Cardiology, Follow-up"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
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
              {loading ? 'Saving Record...' : record ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RecordModal;
