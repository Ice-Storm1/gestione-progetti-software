import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomSelect from '../components/CustomSelect';

const Calendar: React.FC = () => {
  const { tasks, updateTask } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date());
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
    // Use local date string to avoid timezone shifts
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    setSelectedDate(`${year}-${month}-${d}`);
  };

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const oldDue = new Date(task.due_date);
      const oldStart = new Date(task.start_date || task.due_date);
      const diffTime = Math.max(0, oldDue.getTime() - oldStart.getTime());

      const newDue = new Date(targetDateStr);
      const newStart = new Date(newDue.getTime() - diffTime);

      const formatDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
      };

      await updateTask({
        ...task,
        start_date: formatDate(newStart),
        due_date: targetDateStr
      });
    }
  };

  const formatDateLocal = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
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

        <div className="flex items-center gap-6 relative z-50">
          <div className="flex items-center gap-2">
            <CustomSelect
              value={currentDate.getMonth().toString()}
              onChange={val => setCurrentDate(new Date(currentDate.getFullYear(), parseInt(val), 1))}
              options={monthNames.map((name, i) => ({ value: i.toString(), label: name }))}
              className="w-48"
            />
            <CustomSelect
              value={currentDate.getFullYear().toString()}
              onChange={val => setCurrentDate(new Date(parseInt(val), currentDate.getMonth(), 1))}
              options={[...Array(11)].map((_, i) => {
                const year = new Date().getFullYear() - 5 + i;
                return { value: year.toString(), label: year.toString() };
              })}
              className="w-32"
            />
          </div>

          <div className="flex bg-surface-container-low dark:bg-slate-900/50 p-1 rounded-xl border border-outline-variant/5 shadow-inner">
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
            onClick={() => {
              const now = new Date();
              const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
              setSelectedDate(dateStr);
            }}
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
            const dayStr = formatDateLocal(date);
            const isToday = dayStr === formatDateLocal(new Date());

            // Filter tasks active on this day
            const dayTasks = tasks.filter(t => {
              const start = t.start_date || t.due_date;
              return dayStr >= start && dayStr <= t.due_date;
            });

            return (
              <div
                key={i}
                onClick={() => handleDayClick(d.day, d.current, d.monthOffset)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, dayStr)}
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
                </div>

                <div className="space-y-1.5 overflow-y-auto max-h-[120px] custom-scrollbar pr-1">
                  {dayTasks.map(t => {
                    const isStart = dayStr === (t.start_date || t.due_date);
                    const isEnd = dayStr === t.due_date;
                    const isMultiDay = (t.start_date || t.due_date) !== t.due_date;

                    return (
                      <motion.div
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                        layoutId={`${t.id}-${dayStr}`}
                        key={t.id}
                        className={`px-2.5 py-1.5 text-[9px] font-black truncate shadow-sm border border-black/5 flex items-center gap-2 group/task transition-all hover:scale-[1.02] active:scale-95 cursor-grab active:cursor-grabbing ${
                          isMultiDay
                            ? `${isStart ? 'rounded-l-lg' : ''} ${isEnd ? 'rounded-r-lg' : ''} ${!isStart && !isEnd ? '' : ''} border-x-0`
                            : 'rounded-lg'
                        } ${
                          t.priority === 'Alta' ? 'bg-rose-500 text-white shadow-rose-500/20' :
                          t.priority === 'Media' ? 'bg-indigo-500 text-white shadow-indigo-500/20' :
                          'bg-emerald-500 text-white shadow-emerald-500/20'
                        }`}
                      >
                        {isStart && <div className="w-1.5 h-1.5 rounded-full bg-white/40 shrink-0" />}
                        {(isStart || !isMultiDay) ? t.title : <span className="opacity-0">.</span>}
                      </motion.div>
                    );
                  })}
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
