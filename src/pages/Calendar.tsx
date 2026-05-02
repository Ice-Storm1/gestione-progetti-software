import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const Calendar: React.FC = () => {
  const { tasks } = useAppContext();
  const [currentDate] = useState(new Date(2024, 9, 1)); // Ottobre 2024

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const days = [];
  // Prev month filler
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, current: false });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true });
  }
  // Next month filler
  const totalSlots = 35;
  const nextMonthFiller = totalSlots - days.length;
  for (let i = 1; i <= nextMonthFiller; i++) {
    days.push({ day: i, current: false });
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <p className="text-on-surface-variant mt-1 font-medium text-lg">Pianificazione mensile delle attività.</p>
        </div>
        <div className="flex bg-surface/50 p-1 rounded-2xl border border-outline-variant/10 shadow-inner">
          <button className="p-2 hover:bg-surface rounded-xl transition-all text-on-surface"><span className="material-symbols-outlined">chevron_left</span></button>
          <button className="px-6 py-2 font-black text-xs uppercase tracking-widest text-primary hover:bg-surface rounded-xl transition-all">Oggi</button>
          <button className="p-2 hover:bg-surface rounded-xl transition-all text-on-surface"><span className="material-symbols-outlined">chevron_right</span></button>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl">
        <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-surface/30">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
            <div key={d} className="p-6 text-center text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-[700px] bg-outline-variant/5">
          {days.map((d, i) => {
            const dayStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${d.day.toString().padStart(2, '0')}`;
            const dayTasks = tasks.filter(t => t.due_date === dayStr);

            return (
              <div
                key={i}
                className={`border-r border-b border-outline-variant/10 p-4 transition-all hover:bg-surface/40 group relative ${!d.current ? 'opacity-30 bg-outline-variant/5' : ''}`}
              >
                <span className={`text-sm font-black mb-3 block ${d.current ? 'text-on-surface' : 'text-on-surface-variant'}`}>{d.day}</span>
                <div className="space-y-2">
                  {dayTasks.map(t => (
                    <div
                      key={t.id}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black truncate shadow-sm transition-transform hover:scale-105 cursor-pointer ${
                        t.priority === 'Alta' ? 'bg-rose-500 text-white' :
                        t.priority === 'Media' ? 'bg-indigo-500 text-white' :
                        'bg-emerald-500 text-white'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
                {d.current && (
                  <button className="absolute bottom-4 right-4 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                    <span className="material-symbols-outlined text-sm">add</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
