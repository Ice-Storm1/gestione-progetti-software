import React from 'react';
import { useAppContext } from '../context/AppContext';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();

  return (
    <div className="fixed top-8 right-8 z-[60] flex flex-col gap-4 w-80">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`glass-panel p-4 rounded-2xl shadow-xl flex gap-3 items-center transform translate-x-0 animate-in fade-in slide-in-from-right duration-500 border-l-4 ${
            n.type === 'success' ? 'border-l-green-500' :
            n.type === 'error' ? 'border-l-error' : 'border-l-blue-500'
          }`}
        >
          <div className={
            n.type === 'success' ? 'text-green-500' :
            n.type === 'error' ? 'text-error' : 'text-blue-500'
          }>
            <span className="material-symbols-outlined">
              {n.type === 'success' ? 'task_alt' : n.type === 'error' ? 'error' : 'info'}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900">
              {n.type === 'success' ? 'Successo' : n.type === 'error' ? 'Errore' : 'Info'}
            </p>
            <p className="text-slate-500 text-xs">{n.message}</p>
          </div>
          <button
            onClick={() => removeNotification(n.id)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
