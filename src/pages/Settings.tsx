import React from 'react';
import { useAppContext } from '../context/AppContext';

const Settings: React.FC = () => {
  const { user, addNotification } = useAppContext();

  const handleSave = () => {
    addNotification('Impostazioni salvate con successo', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header>
        <h1 className="text-4xl font-bold text-on-background tracking-tight">Impostazioni Account</h1>
        <p className="text-lg text-slate-500 mt-1">Gestisci le tue informazioni personali e le preferenze del profilo.</p>
      </header>

      <div className="glass-panel rounded-[2rem] p-10 flex flex-col gap-10">
        <div className="flex items-center gap-8">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full overflow-hidden glass-panel border-4 border-white/40 shadow-xl">
              <img
                src={user?.avatar_url || "https://lh3.googleusercontent.com/a/default-user"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
          </div>
          <div>
            <h3 className="text-xl font-bold text-on-background">Foto Profilo</h3>
            <p className="text-slate-500 text-sm mt-1">PNG o JPG, massimo 5MB.</p>
            <button className="mt-3 text-blue-600 font-bold text-sm hover:underline">Modifica</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Nome Completo</label>
            <input
              className="w-full bg-white/40 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              defaultValue={user?.name}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Email</label>
            <input
              className="w-full bg-white/40 border border-white/20 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              defaultValue="alessandro.rossi@protype.com"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Salva Modifiche
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-red-600 px-2">
          <span className="material-symbols-outlined text-xl">warning</span>
          <h2 className="text-lg font-bold">Zona Pericolo</h2>
        </div>
        <div className="glass-panel border-red-100 bg-red-50/10 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-xl font-bold text-on-background">Elimina Account</h3>
            <p className="text-slate-500 text-sm mt-2">Questa azione è permanente e comporterà la perdita di tutti i dati. Non è possibile tornare indietro.</p>
          </div>
          <button className="bg-red-50 hover:bg-red-100 text-red-600 px-8 py-3 rounded-xl font-bold border border-red-200 active:scale-95 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">delete_forever</span>
            Elimina Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
