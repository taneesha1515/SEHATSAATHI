import React, { useState, useEffect } from 'react';
import { recordService } from '../services/recordService';
import RecordCard from '../components/records/RecordCard';
import RecordModal from '../components/records/RecordModal';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { FileText, Plus, Search, Filter, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const HealthRecordsPage = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [alertMsg, setAlertMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const recordTypes = [
    { label: 'All', value: 'All' },
    { label: 'Prescriptions', value: 'prescription' },
    { label: 'Lab Reports', value: 'lab_report' },
    { label: 'Scans & Imaging', value: 'scan' },
    { label: 'Clinical Notes', value: 'doctor_note' },
    { label: 'Discharge Summaries', value: 'discharge_summary' },
  ];

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedType !== 'All') params.type = selectedType;

      const res = await recordService.getMyRecords(params);
      if (res.success) {
        setRecords(res.data);
      }
    } catch (err) {
      setAlertMsg('Unable to retrieve health records vault.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [selectedType]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this medical record?')) {
      return;
    }
    try {
      const res = await recordService.deleteRecord(id);
      if (res.success) {
        setRecords((prev) => prev.filter((r) => r._id !== id));
        setSuccessMsg('Record removed successfully.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert('Error deleting record');
    }
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setModalOpen(true);
  };

  const filtered = records.filter((r) => {
    if (!search.trim()) return true;
    const s = search.toLowerCase();
    const title = r.title || '';
    const diag = r.diagnosis || '';
    const doc = r.doctorName || '';
    return (
      title.toLowerCase().includes(s) ||
      diag.toLowerCase().includes(s) ||
      doc.toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Digital Health Records Vault
            </h1>
            <span className="p-1 rounded-full bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Encrypted repository of your prescriptions, diagnostic reports, and medical consultations
          </p>
        </div>

        <button
          onClick={handleAddNew}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Log Record</span>
        </button>
      </div>

      {alertMsg && <Alert type="error" message={alertMsg} onClose={() => setAlertMsg('')} />}
      {successMsg && <Alert type="success" message={successMsg} />}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          {recordTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedType(type.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                selectedType === type.value
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search diagnosis or doctor..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
          />
        </div>
      </div>

      {/* Records Grid */}
      {loading ? (
        <Loader size="lg" text="Decrypting health records vault..." />
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You don't have any health documents matching this criteria.
          </p>
          <button
            onClick={handleAddNew}
            className="inline-block px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition"
          >
            Upload First Record
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((record) => (
            <RecordCard
              key={record._id}
              record={record}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Record Modal */}
      <RecordModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        record={editingRecord}
        onSaveSuccess={fetchRecords}
      />
    </div>
  );
};

export default HealthRecordsPage;
