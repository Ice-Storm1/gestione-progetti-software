import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { user, updateUser, logout } = useAppContext();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState(user?.password || '');
  const [theme, setTheme] = useState<'light' | 'dark'>(user?.preferences.theme || 'light');
  const [notifications, setNotifications] = useState(user?.preferences.notifications_enabled ?? true);

  const handleSave = async () => {
    if (user) {
      await updateUser({
        ...user,
        name,
        password,
        preferences: {
          theme,
          notifications_enabled: notifications
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Impostazioni</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Personalizza il tuo workspace elite.</p>
        </div>
        <button
          onClick={logout}
          className="px-6 py-2 rounded-xl bg-error/10 text-error font-bold border border-error/20 hover:bg-error/20 transition-all active:scale-95"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="glass-panel p-8 rounded-3xl border border-white/40 shadow-lg bg-white/40 dark:bg-slate-800/40 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">person</span>
              Profilo Utente
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors">Nome Completo</label>
                <input
                  type="text"
                  className="w-full bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 transition-colors">Password</label>
                <input
                  type="password"
                  className="w-full bg-white/60 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nuova password"
                />
              </div>
            </div>
          </section>

          <section className="glass-panel p-8 rounded-3xl border border-white/40 shadow-lg bg-white/40 dark:bg-slate-800/40 transition-colors">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
              <span className="material-symbols-outlined">palette</span>
              Aspetto & UI
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-2xl border-2 transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-3xl mb-2">light_mode</span>
                <p className="font-bold transition-colors">Light</p>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-2xl border-2 transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 dark:text-slate-400'}`}
              >
                <span className="material-symbols-outlined text-3xl mb-2">dark_mode</span>
                <p className="font-bold transition-colors">Dark</p>
              </button>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="glass-panel p-6 rounded-3xl border border-white/40 shadow-lg bg-white/40 dark:bg-slate-800/40 transition-colors">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4 transition-colors">Notifiche</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
                <div className="w-12 h-6 bg-slate-200 dark:bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6 shadow-sm"></div>
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">Abilita notifiche push</span>
            </label>
          </section>

          <button
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95"
          >
            Salva Preferenze
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
