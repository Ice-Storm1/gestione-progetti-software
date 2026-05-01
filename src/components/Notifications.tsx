import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    return n.status === filter;
  });

  return (
    <div className="fixed top-8 right-8 z-[60] flex flex-col gap-4 w-96 pointer-events-none">
      {/* Filter Tabs (Functional UI Element) */}
      {notifications.length > 0 && (
        <div className="pointer-events-auto glass-panel p-1 rounded-2xl border border-white/40 shadow-xl self-end flex gap-1 mb-2 bg-white/60 backdrop-blur-3xl">
          {(['all', 'active', 'completed'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f === 'all' ? 'Tutti' : f === 'active' ? 'Attivi' : 'Completati'}
            </button>
          ))}
        </div>
      )}

      {filteredNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`pointer-events-auto glass-panel p-5 rounded-[1.5rem] shadow-2xl flex gap-4 items-center transform transition-all duration-500 border-l-4 animate-in slide-in-from-right ${
            notification.type === 'success' ? 'border-l-emerald-500 bg-white/95' :
            notification.type === 'error' ? 'border-l-error bg-white/95' : 'border-l-indigo-500 bg-white/95'
          } ${notification.status === 'completed' ? 'opacity-50 grayscale' : ''}`}
        >
          <div className={`p-2 rounded-xl ${
            notification.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
            notification.type === 'error' ? 'bg-rose-50 text-error' : 'bg-indigo-50 text-indigo-600'
          }`}>
            <span className="material-symbols-outlined text-2xl">
              {notification.type === 'success' ? 'check_circle' : notification.type === 'error' ? 'error' : 'info'}
            </span>
          </div>
          <div className="flex-1">
            <p className="font-black text-slate-900 text-sm">{notification.type.toUpperCase()}</p>
            <p className="text-slate-500 text-xs font-medium leading-relaxed">{notification.message}</p>
          </div>
          <button
            onClick={() => removeNotification(notification.id)}
            className="text-slate-300 hover:text-slate-600 transition-colors p-1"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
