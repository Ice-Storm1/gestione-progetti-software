import React from 'react';

const Calendar: React.FC = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const weekDays = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="font-h1-display text-4xl font-bold text-on-background">Ottobre 2023</h1>
          <div className="flex bg-white/50 p-1 rounded-xl border border-white/40">
            <button className="p-2 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
            <button className="px-4 py-2 font-bold hover:bg-white rounded-lg transition-colors">Oggi</button>
            <button className="p-2 hover:bg-white rounded-lg transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
        <div className="flex bg-white/50 p-1 rounded-xl border border-white/40 shadow-sm">
          <button className="px-6 py-2 bg-white shadow-sm rounded-lg text-primary font-bold">Mese</button>
          <button className="px-6 py-2 hover:bg-white/60 rounded-lg text-slate-500 transition-colors">Settimana</button>
          <button className="px-6 py-2 hover:bg-white/60 rounded-lg text-slate-500 transition-colors">Giorno</button>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden border border-white/40 shadow-lg">
        <div className="grid grid-cols-7 border-b border-white/30 bg-white/30">
          {weekDays.map((day) => (
            <div key={day} className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 grid-rows-5 min-h-[600px]">
          {/* Mock previous month days */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`prev-${i}`} className="border-r border-b border-white/30 p-2 text-slate-400 opacity-50 bg-slate-50/20">
              {25 + i}
            </div>
          ))}

          {days.map((day) => (
            <div
              key={day}
              className={`border-r border-b border-white/30 p-2 group hover:bg-white/40 transition-colors relative ${
                day === 12 ? 'bg-indigo-50/40 border-indigo-200/50' : ''
              }`}
            >
              <span className={`text-sm font-medium mb-2 block w-7 h-7 flex items-center justify-center rounded-full ${
                day === 12 ? 'bg-primary text-white font-bold' : ''
              }`}>
                {day}
              </span>

              {day === 2 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 bg-primary-container text-white text-[10px] rounded-full truncate">Brainstorming App</div>
                  <div className="px-2 py-1 bg-secondary-container text-white text-[10px] rounded-full truncate">Review Design</div>
                </div>
              )}

              {day === 12 && (
                <div className="space-y-1">
                  <div className="px-2 py-1 bg-tertiary-container text-white text-[10px] rounded-full truncate">Sprint Planning</div>
                  <div className="px-2 py-1 bg-error text-white text-[10px] rounded-full truncate">Fix Critical Bugs</div>
                </div>
              )}

              {day === 17 && (
                <div className="px-2 py-1 bg-primary-fixed-dim text-on-primary-fixed-variant text-[10px] rounded-full truncate border border-primary/10">Kick-off Q4</div>
              )}
            </div>
          ))}

          {/* Fill remaining cells */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`next-${i}`} className="border-r border-white/30 p-2 text-slate-400 opacity-50 bg-slate-50/20">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
