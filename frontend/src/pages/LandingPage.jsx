import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Stethoscope,
  ShieldCheck,
  Calendar,
  Clock,
  FileText,
  Activity,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  Award,
  ChevronDown,
  Sparkles,
  PhoneCall,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const stats = [
    { label: 'Active Registered Patients', value: '45,000+', icon: Users },
    { label: 'Verified Medical Specialists', value: '500+', icon: Stethoscope },
    { label: 'Consultations Completed', value: '120,000+', icon: Calendar },
    { label: 'Patient Satisfaction', value: '99.4%', icon: Award },
  ];

  const features = [
    {
      title: 'Specialist Doctor Appointments',
      description:
        'Browse certified cardiologists, dermatologists, pediatricians and general physicians. Filter by experience, fees, and book guaranteed time slots.',
      icon: Calendar,
      link: '/doctors',
      color: 'bg-teal-50 text-teal-600 border-teal-100',
    },
    {
      title: 'Digital Health Records Vault',
      description:
        'Securely store, organize, and retrieve your prescriptions, diagnostic blood work, scans, and discharge summaries in one encrypted location.',
      icon: FileText,
      link: '/records',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    },
    {
      title: 'Smart Medication Reminders',
      description:
        'Never miss another dosage. Get customized alerts for morning, afternoon, and night medicines with one-tap compliance tracking.',
      icon: Clock,
      link: '/reminders',
      color: 'bg-sky-50 text-sky-600 border-sky-100',
    },
    {
      title: 'Evidence-Based Health Articles',
      description:
        'Read medically verified guides written by registered practitioners covering cardiovascular care, diabetic nutrition, and lifestyle wellness.',
      icon: Activity,
      link: '/articles',
      color: 'bg-purple-50 text-purple-600 border-purple-100',
    },
  ];

  const doctorsSample = [
    {
      name: 'Dr. Rajesh Sharma',
      specialty: 'Cardiologist',
      experience: '14+ Yrs Exp',
      hospital: 'AIIMS & Heart Care Clinic, Delhi',
      fee: '₹800',
      rating: 4.9,
      reviews: 38,
      avatar:
        'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Dr. Ananya Verma',
      specialty: 'Dermatologist',
      experience: '8+ Yrs Exp',
      hospital: 'DermaGlow Skin Clinic, Mumbai',
      fee: '₹600',
      rating: 4.8,
      reviews: 29,
      avatar:
        'https://images.unsplash.com/photo-1594824813515-0b043236e788?auto=format&fit=crop&w=500&q=80',
    },
    {
      name: 'Dr. Vikram Patel',
      specialty: 'General Physician',
      experience: '11+ Yrs Exp',
      hospital: 'Community Health Hospital, Bengaluru',
      fee: '₹450',
      rating: 4.7,
      reviews: 42,
      avatar:
        'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=500&q=80',
    },
  ];

  const faqs = [
    {
      q: 'How does SehatSaathi streamline patient care?',
      a: 'SehatSaathi unifies doctor appointment scheduling, lifetime digital medical records, automated dosage reminders, and doctor-patient communication into a single modern dashboard.',
    },
    {
      q: 'Are all registered doctors on SehatSaathi verified?',
      a: 'Yes, every doctor profile undergoes administrative verification where medical license numbers, board certifications, and degrees are thoroughly vetted before public listing.',
    },
    {
      q: 'Can I upload and manage external lab reports and scans?',
      a: 'Absolutely. Patients can log and categorize prescriptions, pathology reports, MRI/X-ray scans, and notes with automated PDF summary generation.',
    },
    {
      q: 'How do medicine reminders work?',
      a: 'You can configure medications with custom dosages and multiple reminder hours. When a dose is due, you receive immediate dashboard notifications and can log completion with one tap.',
    },
  ];

  const getStartedRoute = () => {
    if (!isAuthenticated) return '/register';
    if (role === 'doctor') return '/doctor-dashboard';
    if (role === 'admin') return '/admin-dashboard';
    return '/patient-dashboard';
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-teal-50/60 via-emerald-50/30 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Next-Gen Digital Healthcare System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
                Your Health, Your Doctors,{' '}
                <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  One Unified Platform
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with verified medical specialists, manage digital prescriptions, 
                track medication routines, and access reliable healthcare guidance 
                anytime, anywhere.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={getStartedRoute()}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-base shadow-lg shadow-teal-600/25 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/doctors"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:shadow transition flex items-center justify-center space-x-2"
                >
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  <span>Find a Doctor</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>100% Verified Clinicians</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Encrypted Health Vault</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Real-time Medication Alerts</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Hero Main Graphic Card */}
                <div className="bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative z-10 space-y-5">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                        <Heart className="w-5 h-5 fill-white stroke-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">SehatSaathi Care</h4>
                        <p className="text-xs text-emerald-600 font-semibold">● Live Patient Sync</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700">
                      Active
                    </span>
                  </div>

                  {/* Sample Appointment Snippet */}
                  <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-teal-900">Upcoming Consultation</span>
                      <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                        Confirmed
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">Dr. Rajesh Sharma (Cardiology)</p>
                    <p className="text-xs text-slate-500">Tomorrow at 10:00 AM • Clinic Suite 402</p>
                  </div>

                  {/* Sample Medication Snippet */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                        💊
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800">Atorvastatin (10mg)</p>
                        <p className="text-[10px] text-slate-500">Night Dose • 09:00 PM</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">✓ Taken</span>
                  </div>
                </div>

                {/* Floating Badge 1 */}
                <div className="absolute -top-6 -left-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 z-20 hidden sm:flex animate-bounce-slow">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-800">100% Medical Privacy</p>
                    <p className="text-[10px] text-slate-500">HIPAA Compliant Standard</p>
                  </div>
                </div>

                {/* Floating Badge 2 */}
                <div className="absolute -bottom-6 -right-6 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3 z-20 hidden sm:flex">
                  <div className="w-9 h-9 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold">
                    <Star className="w-5 h-5 fill-white" />
                  </div>
                  <div className="pr-2">
                    <p className="text-xs font-bold text-slate-800">4.9 / 5.0 Star Rating</p>
                    <p className="text-[10px] text-slate-500">Over 500+ Verified Doctors</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-emerald-900 rounded-3xl p-8 lg:p-12 text-white shadow-xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-teal-700/50">
            {stats.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="pt-4 lg:pt-0 lg:px-4 space-y-2">
                  <div className="inline-flex p-3 rounded-2xl bg-white/10 text-emerald-300 mb-1">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                    {s.value}
                  </h3>
                  <p className="text-xs lg:text-sm text-teal-200 font-medium">
                    {s.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Intelligent Healthcare Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Engineered For Every Step Of Your Care Journey
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            From discovering qualified clinicians to tracking recurring medication and securely 
            storing lifetime medical documents.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${f.color} group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {f.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-50">
                  <Link
                    to={f.link}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 group-hover:translate-x-1 transition"
                  >
                    <span>Explore Feature</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Spotlight */}
      <section className="bg-slate-50/80 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Top Rated Clinicians
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Consult With Board-Certified Specialists
              </h2>
            </div>
            <Link
              to="/doctors"
              className="inline-flex items-center space-x-2 text-sm font-bold text-teal-700 hover:text-teal-800"
            >
              <span>View All Doctors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {doctorsSample.map((doc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition space-y-4"
              >
                <div className="flex items-start space-x-4">
                  <img
                    src={doc.avatar}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/20"
                  />
                  <div>
                    <h4 className="text-base font-bold text-slate-800">{doc.name}</h4>
                    <p className="text-xs font-semibold text-teal-600">{doc.specialty}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doc.experience}</p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 text-xs text-slate-600 space-y-1">
                  <p className="truncate font-medium">{doc.hospital}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-bold text-slate-900">Fee: {doc.fee}</span>
                    <span className="flex items-center space-x-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating} ({doc.reviews})</span>
                    </span>
                  </div>
                </div>

                <Link
                  to="/doctors"
                  className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center justify-center space-x-1 transition shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-extrabold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
            Got Questions?
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm transition"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-800 text-sm hover:text-teal-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-teal-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-600 via-teal-700 to-emerald-700 rounded-3xl p-10 lg:p-16 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto">
            Experience A Smarter, More Compassionate Healthcare Companion
          </h2>
          <p className="text-teal-100 text-sm sm:text-base max-w-xl mx-auto">
            Join thousands of patients and certified doctors taking control of health routines with SehatSaathi today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to={getStartedRoute()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-sm shadow-lg transition"
            >
              Create Free Account
            </Link>
            <Link
              to="/doctors"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-800/60 hover:bg-teal-800 text-white font-bold text-sm border border-teal-500/50 transition"
            >
              Browse Doctor Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
