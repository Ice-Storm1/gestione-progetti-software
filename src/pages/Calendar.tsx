import React from 'react';
import { useAppContext } from '../context/AppContext';

const Calendar: React.FC = () => {
  useAppContext();

  // Static for Oct 2023 to match design
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const startOffset = 6; // Starts on Sunday for layout balance in design

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-on-background tracking-tight">Ottobre 2023</h1>
          <p className="text-lg text-slate-500 mt-1">Benvenuto nella tua pianificazione mensile.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-white/40 rounded-full border border-white/20">
          <button className="p-2 hover:bg-white/60 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
          <button className="px-4 py-1 font-bold text-sm hover:bg-white/60 rounded-full">Oggi</button>
          <button className="p-2 hover:bg-white/60 rounded-full transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>

      <div className="flex-1 glass-panel rounded-[2rem] p-6 shadow-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-7 border-b border-white/20 mb-4 pb-4">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
            <div key={d} className="text-center font-bold text-slate-400 text-[10px] uppercase tracking-widest">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 flex-1 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
          {Array.from({ length: startOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-white/10 p-3 opacity-30">
              <span className="text-sm font-semibold text-slate-400">{25 + i}</span>
            </div>
          ))}
          {days.map(d => {
            const isToday = d === 12;

            return (
              <div
                key={d}
                className={`p-3 transition-all flex flex-col gap-2 relative group cursor-pointer ${
                  isToday ? 'bg-blue-50/50 ring-2 ring-inset ring-blue-500/20' : 'bg-white/30 hover:bg-white/50'
                }`}
              >
                <span className={`text-sm font-bold ${isToday ? 'text-blue-600' : 'text-slate-600'}`}>{d}</span>
                {isToday && <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full"></span>}
                <div className="space-y-1">
                  {d === 2 && <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold rounded-full border border-blue-200 truncate">Sprint Planning</div>}
                  {d === 4 && <div className="px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-bold rounded-full border border-red-200 truncate">Deadline Progetto X</div>}
                  {d === 6 && (
                    <>
                      <div className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full truncate">Meeting Team</div>
                      <div className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[9px] font-bold rounded-full border border-yellow-200 truncate">Review Codice</div>
                    </>
                  )}
                  {d === 12 && (
                    <div className="px-2 py-0.5 bg-indigo-600 text-white text-[9px] font-bold rounded-full truncate">Lancio Beta</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
