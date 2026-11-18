import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, ShieldCheck, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
                <Heart className="w-5 h-5 fill-white stroke-teal-700 stroke-2" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Sehat<span className="text-emerald-400">Saathi</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              SehatSaathi is an integrated, patient-first digital healthcare ecosystem 
              bridging patients with verified specialists, automated dosage alerts, and 
              lifetime digital health records.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <div className="inline-flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-teal-950/80 border border-teal-800 text-teal-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Medical Ecosystem</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition">
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-teal-400 transition">
                  Health Articles
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-400 transition">
                  Sign In Portal
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-400 transition">
                  Join as Doctor / Patient
                </Link>
              </li>
            </ul>
          </div>

          {/* Patient Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Patient Services
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/appointments" className="hover:text-teal-400 transition">
                  Online Appointments
                </Link>
              </li>
              <li>
                <Link to="/records" className="hover:text-teal-400 transition">
                  Health Record Vault
                </Link>
              </li>
              <li>
                <Link to="/reminders" className="hover:text-teal-400 transition">
                  Medication Reminders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-teal-400 transition">
                  Emergency Profiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Emergency & Support
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Helpline: 1800-SEHAT-CARE</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-emerald-400" />
                <span>support@sehatsaathi.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>National Health Tech Center, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Credits & Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} SehatSaathi Healthcare Technologies. All rights reserved.</p>
          <p className="text-slate-400 text-center">
            Final Year B.Tech Computer Science Project Demonstration • Developed with React, Node.js & MongoDB
          </p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
