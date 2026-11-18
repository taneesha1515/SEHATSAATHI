import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import Loader from '../components/common/Loader';
import {
  Bell,
  CheckCheck,
  Calendar,
  Clock,
  BookOpen,
  Info,
  Trash2,
  CheckCircle,
} from 'lucide-react';

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const navigate = useNavigate();

  const getIcon = (type) => {
    switch (type) {
      case 'appointment':
        return <Calendar className="w-5 h-5 text-teal-600" />;
      case 'reminder':
        return <Clock className="w-5 h-5 text-emerald-600" />;
      case 'article':
        return <BookOpen className="w-5 h-5 text-purple-600" />;
      default:
        return <Info className="w-5 h-5 text-sky-600" />;
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Activity & Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                {unreadCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates regarding appointment statuses, medicine timings, and clinician notes
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-bold transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" />
            <span>Mark All As Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      {loading ? (
        <Loader size="lg" text="Loading notifications..." />
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You're completely caught up. New updates about your consultations and medication alerts will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-100 shadow-sm overflow-hidden">
          {notifications.map((notif) => (
            <div
              key={notif._id}
              className={`p-5 flex items-start justify-between gap-4 transition hover:bg-slate-50/70 ${
                !notif.isRead ? 'bg-teal-50/30' : ''
              }`}
            >
              <div
                className="flex items-start space-x-3.5 flex-1 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="p-2.5 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center space-x-2">
                    <h4
                      className={`text-sm ${
                        !notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'
                      }`}
                    >
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 block pt-1">
                    {new Date(notif.createdAt).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-1 shrink-0">
                {!notif.isRead && (
                  <button
                    onClick={() => markAsRead(notif._id)}
                    title="Mark as read"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 hover:bg-teal-50 transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteNotification(notif._id)}
                  title="Remove notification"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
