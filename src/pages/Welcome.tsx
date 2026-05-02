import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-mesh min-h-screen flex flex-col text-on-background items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-2xl w-full text-center">
        <div className="glass-panel p-12 md:p-20 rounded-[3rem] border border-white/40 shadow-2xl bg-white/60 backdrop-blur-xl">
          <div className="mb-8 inline-flex items-center justify-center p-4 bg-indigo-50 rounded-3xl text-indigo-600 shadow-inner">
            <span className="material-symbols-outlined text-5xl">dashboard</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter">
            Benvenuto in <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Protype</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 font-medium mb-12 max-w-md mx-auto leading-relaxed">
            Il tuo workspace d'élite per la gestione progetti. Semplifica il flusso di lavoro del tuo team con eleganza e precisione.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 text-lg"
            >
              Inizia Ora
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-95 text-lg shadow-sm"
            >
              Crea account
            </button>
          </div>

          <div className="mt-16 pt-10 border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Scelto dai team leader di</p>
            <div className="flex justify-center gap-8 md:gap-12 opacity-40 grayscale">
              <span className="font-black text-lg tracking-tighter">TECHCORE</span>
              <span className="font-black text-lg tracking-tighter">LUMINA</span>
              <span className="font-black text-lg tracking-tighter">SYNERGY</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-12 text-slate-400 text-xs font-bold tracking-widest uppercase opacity-60">
        © 2024 Protype Elite Workspace • Tutti i diritti riservati
      </footer>
    </div>
  );
};

export default Welcome;
