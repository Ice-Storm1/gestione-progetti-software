import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-mesh min-h-screen flex flex-col text-on-background items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background shapes */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.5, 1], x: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-400/10 rounded-full blur-[120px]"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10 max-w-4xl w-full text-center"
      >
        <div className="glass-panel p-12 md:p-24 rounded-[4rem] border border-white/40 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] bg-white/65 backdrop-blur-3xl overflow-hidden relative">
          {/* Logo animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
            className="mb-10 inline-flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 flex items-center justify-center bg-white rounded-3xl shadow-xl border border-blue-50">
              <svg viewBox="0 0 57.14 50.4" className="w-12 h-12 fill-[#00B7DD]">
                <path d="M 19.44 41.256 L 28.44 41.256 L 24.12 50.4 L 33.12 50.4 L 56.88 0 L 47.88 0 L 28.44 41.256 L 9 0 L 0 0 Z" />
              </svg>
            </div>
            <span className="text-3xl font-black text-[#00B7DD] tracking-tighter">Velkron</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight"
          >
            L'era della gestione <br />
            <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">D'élite è qui.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-xl md:text-2xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed"
          >
            Semplifica, organizza e potenzia il tuo team con Velkron. <br className="hidden md:block" />
            La precisione incontra l'eleganza nel tuo nuovo workspace.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <button
              onClick={() => navigate('/login')}
              className="group relative px-12 py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all text-lg overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Inizia Ora</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-12 py-5 bg-white border-2 border-slate-100 text-slate-900 font-black rounded-2xl hover:bg-slate-50 hover:border-slate-200 transition-all active:scale-95 text-lg shadow-sm"
            >
              Crea Account
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2, delay: 1.2 }}
            className="mt-20 pt-12 border-t border-slate-100 flex flex-col items-center"
          >
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Ecosystem Partners</p>
            <div className="flex flex-wrap justify-center gap-12 md:gap-20 grayscale opacity-70">
              {['TECHCORE', 'LUMINA', 'SYNERGY', 'NEXUS'].map((brand) => (
                <span key={brand} className="font-black text-xl tracking-tighter hover:grayscale-0 transition-all cursor-default">{brand}</span>
              ))}
            </div>
          </motion.div>

          {/* Decorative floating icon */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-10 p-6 bg-blue-50/50 rounded-full text-blue-500 hidden lg:block"
          >
            <span className="material-symbols-outlined text-4xl">rocket_launch</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-12 flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400/60"
      >
        <span>Privacy</span>
        <span>Terms</span>
        <span>Security</span>
      </motion.div>
    </div>
  );
};

export default Welcome;
