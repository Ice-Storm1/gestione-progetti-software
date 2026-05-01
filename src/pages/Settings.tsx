import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header className="flex flex-col gap-2">
        <h1 className="font-h1-display text-4xl font-bold text-on-background">Impostazioni Account</h1>
        <p className="text-slate-500 text-lg">Gestisci le tue informazioni personali e le preferenze del profilo.</p>
      </header>

      <div className="glass-panel rounded-[2rem] p-8 flex flex-col gap-8">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/40 inner-glow shadow-xl">
              <img
                alt="Profile"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuARt6-hKbQvQiTAAEgwUN-wbhX02Vk2Zja2ODcln5vC6Iv_UtQrbUywbtGQQWm-u4wvfBfwPouq0wjD1lcOifPWZmtyT7DJ5ZDfj4AzfSWGHWlMuTcFXeQSEmh2TIbXs5W1am3sRBv5UsGT3RuSzxJyP7wZGvNzfkwZU3soVlHR979hl9W5aJC2gm1qFCfL_KcJvOBPlzGBkIK_YlSFOLZKXoGuIQwA6XgQW6Lb4kPZfqAJk0EWIoF31HcM65LpJv7pqTg8g7l5ZW-l"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary-container text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">edit</span>
            </button>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-on-background">Foto Profilo</h3>
            <p className="text-slate-500 text-sm">PNG o JPG, massimo 5MB.</p>
            <button className="mt-2 text-indigo-600 font-bold hover:underline text-left">Modifica</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
            <input
              className="bg-white/40 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-on-surface inner-glow"
              type="text"
              defaultValue="Alessandro Rossi"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email</label>
            <input
              className="bg-white/40 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-on-surface inner-glow"
              type="email"
              defaultValue="alessandro.rossi@protype.com"
            />
          </div>
        </div>

        <div className="flex justify-start">
          <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-indigo-500/25 active:scale-95 transition-all duration-200">
            Salva Modifiche
          </button>
        </div>
      </div>

      <div className="mt-12 space-y-4">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-error">warning</span>
          <h2 className="text-2xl font-bold text-error">Zona Pericolo</h2>
        </div>
        <div className="glass-panel border-error/20 bg-error/5 rounded-[2rem] p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-on-background">Elimina Account</h3>
            <p className="text-slate-500 text-sm max-w-md">Questa azione è permanente e comporterà la perdita di tutti i dati, progetti e configurazioni.</p>
          </div>
          <button className="bg-error/10 hover:bg-error/20 text-error border border-error/30 backdrop-blur-xl px-6 py-3 rounded-xl font-bold active:scale-95 transition-all duration-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">delete_forever</span>
            Elimina Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
