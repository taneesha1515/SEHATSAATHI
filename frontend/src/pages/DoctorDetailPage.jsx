import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import BookingModal from '../components/appointments/BookingModal';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  Award,
  BookOpen,
  ArrowLeft,
  Shield,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successBanner, setSuccessBanner] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        setLoading(true);
        const res = await doctorService.getDoctorById(id);
        if (res.success) {
          setDoctor(res.data);
        }
      } catch (err) {
        setError('Doctor details could not be loaded.');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return <Loader size="lg" text="Loading doctor credentials..." />;
  }

  if (error || !doctor) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <Alert type="error" message={error || 'Doctor not found'} />
        <Link
          to="/doctors"
          className="inline-flex items-center space-x-2 text-sm font-bold text-teal-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Doctors</span>
        </Link>
      </div>
    );
  }

  const doctorName = doctor.user?.name || doctor.name || 'Specialist Doctor';
  const doctorAvatar =
    doctor.user?.avatar ||
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      doctorName
    )}&backgroundColor=0d9488`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/doctors"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Doctor Directory</span>
        </Link>
      </div>

      {successBanner && (
        <Alert
          type="success"
          message={successBanner}
          onClose={() => setSuccessBanner('')}
        />
      )}

      {/* Main Doctor Bio Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-start sm:items-center space-x-5">
            <img
              src={doctorAvatar}
              alt={doctorName}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-teal-500/20 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Dr. {doctorName}
                </h1>
                {doctor.isVerified && (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-teal-700">
                {doctor.specialization}
              </p>
              <p className="text-xs text-slate-500">
                {doctor.qualification} • {doctor.experience} Years of Clinical Practice
              </p>
              <div className="flex items-center space-x-3 pt-1 text-xs">
                <span className="flex items-center space-x-1 font-bold text-amber-600">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>
                    {doctor.rating} ({doctor.reviewsCount || 10} Patient Reviews)
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Book button banner */}
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-teal-50/70 border border-teal-100 text-center sm:text-right space-y-2">
            <span className="block text-xs text-slate-500 font-medium">
              Consultation Fee
            </span>
            <span className="text-2xl font-extrabold text-slate-900">
              ₹{doctor.consultationFee}
            </span>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  window.location.href = '/login';
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-1.5"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            About Doctor
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {doctor.bio || 'Dedicated medical professional with vast clinical experience.'}
          </p>
        </div>

        {/* Practice & Clinic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-800 font-bold">
              <Building className="w-4 h-4 text-teal-600" />
              <span>Clinic / Hospital</span>
            </div>
            <p className="text-slate-600">{doctor.clinicName || 'City Health Center'}</p>
            <p className="text-slate-500 flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>{doctor.clinicAddress || 'Main Road'}</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center space-x-2 text-slate-800 font-bold">
              <Clock className="w-4 h-4 text-teal-600" />
              <span>Visiting Days</span>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {doctor.availableDays?.map((d) => (
                <span
                  key={d}
                  className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 font-semibold text-[11px]"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Available Hours */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Typical Daily Time Slots
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {doctor.availableTimeSlots?.map((slot) => (
              <div
                key={slot}
                className="py-2 text-center rounded-xl bg-teal-50/60 border border-teal-100 text-teal-800 text-xs font-semibold"
              >
                {slot}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={doctor}
        onBookingSuccess={(bookedData) => {
          setSuccessBanner(
            `Appointment scheduled with Dr. ${doctorName} on ${new Date(
              bookedData.appointmentDate
            ).toLocaleDateString()} at ${bookedData.timeSlot}!`
          );
        }}
      />
    </div>
  );
};

export default DoctorDetailPage;
