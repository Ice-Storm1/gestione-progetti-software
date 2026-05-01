import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[15%] w-64 h-64 glass-panel rounded-full opacity-40 mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 glass-panel rounded-[4rem] rotate-12 opacity-30"></div>
        <div className="absolute top-[40%] right-[20%] w-32 h-32 glass-panel rounded-xl -rotate-12 opacity-50"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="glass-panel p-12 rounded-[2.5rem] w-full border border-white/40 shadow-2xl backdrop-blur-3xl">
          <div className="mb-8 inline-flex items-center justify-center p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full shadow-inner">
            <span className="material-symbols-outlined text-indigo-600 text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-slate-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Benvenuto in Protype
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-md mx-auto leading-relaxed">
            Il tuo workspace d'élite per la gestione progetti. Semplifica il flusso di lavoro del tuo team con eleganza e precisione.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-full shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1 transition-all active:scale-95"
            >
              Inizia Ora
            </button>
            <button
              onClick={() => navigate('/register')}
              className="w-full sm:w-auto px-12 py-4 bg-white/40 backdrop-blur-md border border-white/50 text-slate-700 font-bold text-lg rounded-full hover:bg-white/60 transition-all active:scale-95 shadow-sm"
            >
              Crea account
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Scelto dai team leader di</p>
            <div className="flex justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
              <span className="font-black text-xl tracking-tighter">TECHCORE</span>
              <span className="font-black text-xl tracking-tighter">LUMINA</span>
              <span className="font-black text-xl tracking-tighter">SYNERGY</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute bottom-8 w-full text-slate-400 text-sm">
        &copy; 2024 Protype Elite Workspace. Tutti i diritti riservati.
      </footer>
    </div>
  );
};

export default Welcome;
