import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'teal',
  trend,
}) => {
  const colorMap = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    blue: 'bg-sky-50 text-sky-600 border-sky-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
  };

  const badgeColor = colorMap[color] || colorMap.teal;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl border ${badgeColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
      {(subtitle || trend) && (
        <div className="mt-4 flex items-center text-xs">
          {trend && (
            <span
              className={`font-semibold mr-1.5 ${
                trend.startsWith('+') ? 'text-emerald-600' : 'text-slate-600'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};

export default StatCard;
