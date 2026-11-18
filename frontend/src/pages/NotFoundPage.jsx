import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-md">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The healthcare resource or page you are looking for doesn't exist or has been moved.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition"
          >
            <Home className="w-4 h-4" />
            <span>Return to SehatSaathi Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
