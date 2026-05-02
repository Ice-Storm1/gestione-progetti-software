import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TaskForm from '../components/TaskForm';

const Calendar: React.FC = () => {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  const setToday = () => setCurrentDate(new Date());

  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = [];
    const totalDays = daysInMonth(year, month);
    const firstDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start

    // Padding for prev month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-32 border-r border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 opacity-30"></div>);
    }

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.due_date === dateStr);
      const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();

      days.push(
        <div
          key={d}
          onClick={() => {
            setSelectedDate(dateStr);
            setIsModalOpen(true);
          }}
          className={`h-32 border-r border-b border-slate-100 dark:border-slate-800 p-2 transition-all cursor-pointer hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 group relative ${
            isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''
          }`}
        >
          <div className="flex justify-between items-start">
            <span className={`text-sm font-black ${isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-500 dark:text-slate-400'}`}>
              {d}
            </span>
            {dayTasks.length > 0 && (
               <span className="text-[10px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">
                 {dayTasks.length} Task
               </span>
            )}
          </div>
          <div className="mt-2 space-y-1 overflow-hidden">
            {dayTasks.slice(0, 3).map(t => (
              <div
                key={t.id}
                className={`px-2 py-0.5 text-[9px] font-bold rounded-lg truncate ${
                  t.status === 'Completati' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                }`}
              >
                {t.title}
              </div>
            ))}
            {dayTasks.length > 3 && (
               <p className="text-[9px] text-slate-400 font-bold ml-1">+{dayTasks.length - 3} altri</p>
            )}
          </div>
          <button className="absolute bottom-2 right-2 p-1 bg-indigo-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 shadow-lg">
             <span className="material-symbols-outlined text-sm">add</span>
          </button>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex bg-white/40 dark:bg-slate-800/40 p-1 rounded-2xl border border-white/20 shadow-sm backdrop-blur-md">
            <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><span className="material-symbols-outlined">chevron_left</span></button>
            <button onClick={setToday} className="px-6 py-2 font-bold text-sm hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all">Oggi</button>
            <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
        <div className="flex bg-white/40 dark:bg-slate-800/40 p-1 rounded-2xl border border-white/20 shadow-sm">
           <button className="px-6 py-2 bg-white dark:bg-slate-700 shadow-md rounded-xl font-bold text-indigo-600 dark:text-indigo-400">Mese</button>
           <button className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600">Settimana</button>
           <button className="px-6 py-2 text-slate-400 font-bold hover:text-slate-600">Giorno</button>
        </div>
      </header>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/40 shadow-2xl bg-white/40 dark:bg-slate-800/40 transition-colors">
        <div className="grid grid-cols-7 border-b border-white/20 dark:border-slate-700 bg-white/40 dark:bg-slate-800/60">
          {["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"].map(day => (
            <div key={day} className="p-5 text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderDays()}
        </div>
      </div>

      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Nuova Task per il {selectedDate.split('-').reverse().join('/')}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-all">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <TaskForm
                onCancel={() => setIsModalOpen(false)}
                initialDate={selectedDate}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
