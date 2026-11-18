import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import BookingModal from '../components/appointments/BookingModal';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Search,
  Filter,
  Stethoscope,
  Star,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DoctorListingPage = () => {
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [minRating, setMinRating] = useState('');
  const [maxFee, setMaxFee] = useState('');

  // Booking Modal State
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccessBanner, setBookingSuccessBanner] = useState('');

  const specialties = [
    'All',
    'Cardiologist',
    'Dermatologist',
    'General Physician',
    'Pediatrician',
    'Orthopedic Surgeon',
    'Gynecologist',
  ];

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedSpecialty !== 'All') params.specialization = selectedSpecialty;
      if (minRating) params.minRating = minRating;
      if (maxFee) params.maxFee = maxFee;

      const res = await doctorService.getAllDoctors(params);
      if (res.success) {
        setDoctors(res.data);
      }
    } catch (err) {
      setError('Unable to load doctors list. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [selectedSpecialty, minRating, maxFee]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleOpenBooking = (doctor) => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setBookingDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Search Bar */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-8 lg:p-12 text-white space-y-6 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
            Certified Specialist Network
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Find & Consult Trusted Doctors
          </h1>
          <p className="text-sm text-teal-100">
            Book guaranteed appointments with leading medical practitioners in your city.
          </p>
        </div>

        {/* Search input form */}
        <form
          onSubmit={handleSearchSubmit}
          className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-3xl"
        >
          <div className="flex-1 flex items-center px-3 w-full text-slate-800">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by doctor name, symptom, hospital, or clinic..."
              className="w-full text-sm py-2 focus:outline-none placeholder:text-slate-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition shrink-0"
          >
            Search Doctors
          </button>
        </form>
      </div>

      {bookingSuccessBanner && (
        <Alert
          type="success"
          message={bookingSuccessBanner}
          onClose={() => setBookingSuccessBanner('')}
        />
      )}

      {/* Specialty Filter Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {specialties.map((spec) => (
          <button
            key={spec}
            onClick={() => setSelectedSpecialty(spec)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedSpecialty === spec
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50'
            }`}
          >
            {spec}
          </button>
        ))}
      </div>

      {/* Additional Filters row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-xs">
        <span className="font-bold text-slate-700">
          Showing {doctors.length} Verified Clinicians
        </span>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Max Fee:</span>
            <select
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none"
            >
              <option value="">Any Fee</option>
              <option value="500">Under ₹500</option>
              <option value="800">Under ₹800</option>
              <option value="1200">Under ₹1200</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500 font-medium">Min Rating:</span>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white font-medium focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.8">4.8+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <Loader size="lg" text="Searching verified doctor directory..." />
      ) : doctors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Doctors Match Your Search</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search criteria or resetting filters to see more medical practitioners.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedSpecialty('All');
              setMinRating('');
              setMaxFee('');
            }}
            className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doctor) => {
            const userName = doctor.user?.name || doctor.name || 'Medical Specialist';
            const userAvatar =
              doctor.user?.avatar ||
              `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                userName
              )}&backgroundColor=0d9488`;

            return (
              <div
                key={doctor._id}
                className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <img
                      src={userAvatar}
                      alt={userName}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-1.5">
                        <h3 className="text-base font-bold text-slate-800 truncate">
                          Dr. {userName}
                        </h3>
                        {doctor.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-teal-600 truncate">
                        {doctor.specialization}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {doctor.qualification} • {doctor.experience} Yrs Exp
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {doctor.bio}
                  </p>

                  <div className="p-3 bg-slate-50 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{doctor.clinicAddress || 'City Clinic'}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200/50">
                      <span className="font-bold text-slate-900">
                        Consultation: ₹{doctor.consultationFee}
                      </span>
                      <span className="flex items-center space-x-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>
                          {doctor.rating} ({doctor.reviewsCount || 10})
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Available days chips */}
                  {doctor.availableDays && (
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.slice(0, 4).map((d) => (
                        <span
                          key={d}
                          className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[10px] font-semibold"
                        >
                          {d.slice(0, 3)}
                        </span>
                      ))}
                      {doctor.availableDays.length > 4 && (
                        <span className="text-[10px] text-slate-400 self-center">
                          +{doctor.availableDays.length - 4} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-4 border-t border-slate-50 flex items-center space-x-3">
                  <Link
                    to={`/doctors/${doctor._id}`}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold text-center transition"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleOpenBooking(doctor)}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold text-center shadow-md shadow-teal-600/20 transition flex items-center justify-center space-x-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        doctor={bookingDoctor}
        onBookingSuccess={(bookedData) => {
          setBookingSuccessBanner(
            `Appointment scheduled with Dr. ${
              bookingDoctor.user?.name || bookingDoctor.name
            } on ${new Date(bookedData.appointmentDate).toLocaleDateString()} at ${
              bookedData.timeSlot
            }!`
          );
        }}
      />
    </div>
  );
};

export default DoctorListingPage;
