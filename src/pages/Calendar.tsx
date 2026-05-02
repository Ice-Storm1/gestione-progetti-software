import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar: React.FC = () => {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // Ottobre 2024
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

  const monthNames = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const days = [];
  // Prev month filler
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDay - i, current: false, monthOffset: -1 });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, current: true, monthOffset: 0 });
  }
  // Next month filler
  const totalSlots = 42;
  const nextMonthFiller = totalSlots - days.length;
  for (let i = 1; i <= nextMonthFiller; i++) {
    days.push({ day: i, current: false, monthOffset: 1 });
  }

  const handleDayClick = (day: number, current: boolean, monthOffset: number) => {
    if (!current) return;
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, day);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500 max-w-[1600px] mx-auto">
      <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white dark:bg-slate-800/50 p-6 rounded-[2rem] border border-outline-variant/10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight leading-none">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <p className="text-on-surface-variant mt-1 text-sm font-bold uppercase tracking-widest opacity-60">Visualizzazione Mensile</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-surface-container-low dark:bg-slate-900/50 p-1 rounded-xl border border-outline-variant/5">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all text-on-surface-variant hover:text-primary active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-6 py-2 font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all"
            >
              Oggi
            </button>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-all text-on-surface-variant hover:text-primary active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <button
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 active:scale-95 transition-all"
          >
            <Plus size={16} />
            Nuovo Task
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-800/20 rounded-[2.5rem] overflow-hidden border border-outline-variant/10 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-7 border-b border-outline-variant/10 bg-slate-50/50 dark:bg-slate-900/50">
          {['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'].map(d => (
            <div key={d} className="py-4 text-center text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em]">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 min-h-[750px] bg-outline-variant/5">
          {days.map((d, i) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + d.monthOffset, d.day);
            const dayStr = date.toISOString().split('T')[0];
            const isToday = dayStr === new Date().toISOString().split('T')[0];
            const dayTasks = tasks.filter(t => t.due_date === dayStr);

            return (
              <div
                key={i}
                onClick={() => handleDayClick(d.day, d.current, d.monthOffset)}
                className={`group border-r border-b border-outline-variant/10 p-3 transition-all relative min-h-[120px] ${
                  !d.current ? 'opacity-20 grayscale bg-slate-100/10' : 'hover:bg-indigo-50/20 dark:hover:bg-indigo-900/5 cursor-pointer'
                } ${isToday ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-black transition-all ${
                    isToday ? 'bg-indigo-600 text-white shadow-lg' : d.current ? 'text-on-surface group-hover:text-primary' : 'text-on-surface-variant'
                  }`}>
                    {d.day}
                  </span>

                  {d.current && (
                    <div className="w-6 h-6 rounded-lg bg-surface/50 border border-outline-variant/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-white">
                      <Plus size={14} />
                    </div>
                  )}
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-1">
                  {dayTasks.map(t => (
                    <motion.div
                      layoutId={t.id}
                      key={t.id}
                      className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black truncate shadow-sm border border-black/5 flex items-center gap-2 group/task transition-all hover:scale-[1.02] active:scale-95 ${
                        t.priority === 'Alta' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                        t.priority === 'Media' ? 'bg-indigo-500 text-white shadow-indigo-500/20' :
                        'bg-emerald-500 text-white shadow-emerald-500/20'
                      }`}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />
                      {t.title}
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedDate && (
          <Modal
            isOpen={true}
            onClose={() => setSelectedDate(null)}
            title="Nuova Task"
            description={`Pianificazione per il ${selectedDate}`}
          >
            <TaskForm
              onCancel={() => setSelectedDate(null)}
              taskToEdit={{ due_date: selectedDate }}
            />
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;
