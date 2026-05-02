import React from 'react';
import { useAppContext } from '../context/AppContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();

  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Notifiche</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Rimani aggiornato sulle attività del tuo team.</p>
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="glass-panel p-12 rounded-[2rem] text-center border border-white/40 bg-white/40 dark:bg-slate-800/40">
            <span className="material-symbols-outlined text-6xl text-slate-200 dark:text-slate-700 mb-4 transition-colors">notifications_off</span>
            <p className="text-slate-500 dark:text-slate-400 font-bold transition-colors">Nessuna nuova notifica</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`glass-panel p-6 rounded-3xl shadow-lg flex gap-4 items-center border-l-4 transition-all ${
                n.type === 'success' ? 'border-l-green-500' : n.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'
              } bg-white/60 dark:bg-slate-800/60`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                n.type === 'success' ? 'bg-green-50 text-green-600' : n.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
              }`}>
                <span className="material-symbols-outlined">
                  {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'report' : 'info'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-slate-900 dark:text-white font-bold transition-colors">{n.message}</p>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-widest mt-1">Appena ora</p>
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="p-2 text-slate-300 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
