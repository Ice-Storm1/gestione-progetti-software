import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';

const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useAppContext();

  return (
    <div className="fixed top-8 right-8 z-[100] flex flex-col gap-4 w-96 pointer-events-none">
      <div className="flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notifications.map((notification) => (
            <motion.div
              layout
              key={notification.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95, transition: { duration: 0.2 } }}
              className={`pointer-events-auto glass-panel p-5 rounded-[1.75rem] shadow-2xl flex gap-4 items-center border border-white/40 dark:border-slate-700/40 relative overflow-hidden group transition-all duration-300 ${
                notification.status === 'completed' ? 'opacity-40 grayscale-[0.5] scale-95' : 'bg-white/95 dark:bg-slate-800/95'
              }`}
            >
              {/* Progress Background */}
              {notification.status === 'active' && (
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 3, ease: "linear" }}
                  style={{ originX: 0 }}
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    notification.type === 'success' ? 'bg-emerald-500/30' :
                    notification.type === 'error' ? 'bg-rose-500/30' : 'bg-indigo-500/30'
                  }`}
                />
              )}

              <div className={`p-3 rounded-2xl shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                notification.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' :
                notification.type === 'error' ? 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' :
                'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 size={24} /> :
                 notification.type === 'error' ? <AlertCircle size={24} /> :
                 <Info size={24} />}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-black text-slate-900 dark:text-white text-sm uppercase tracking-tight">
                  {notification.type === 'success' ? 'Completato' :
                   notification.type === 'error' ? 'Attenzione' : 'Info'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-bold leading-relaxed truncate">
                  {notification.message}
                </p>
              </div>

              <button
                onClick={() => removeNotification(notification.id)}
                className="text-slate-300 dark:text-slate-600 hover:text-slate-900 dark:hover:text-white transition-all p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-90 shrink-0"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;
