import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import TaskForm from '../components/TaskForm';

const Calendar: React.FC = () => {
  const { tasks } = useAppContext();
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 12)); // Ottobre 2024
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDateClick = (day: number) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = d.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const renderDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = (firstDayOfMonth(year, month) + 6) % 7; // Adjust for Monday start

    const days = [];
    // Previous month filler
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`prev-${i}`} className="border-r border-b border-white/20 p-2 opacity-20 bg-slate-50/10 h-32"></div>);
    }

    // Current month days
    for (let d = 1; d <= numDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayTasks = tasks.filter(t => t.due_date === dateStr);
      const isToday = d === 12 && month === 9 && year === 2024; // Mock today highlight

      days.push(
        <div
          key={d}
          onClick={() => handleDateClick(d)}
          className={`border-r border-b border-white/20 p-3 h-32 group hover:bg-indigo-50/30 transition-all cursor-pointer relative overflow-hidden ${
            isToday ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-500/20' : ''
          }`}
        >
          <span className={`text-sm font-black mb-2 block ${isToday ? 'bg-indigo-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-lg' : 'text-slate-700'}`}>
            {d}
          </span>
          <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-hide">
            {dayTasks.map(task => (
              <div
                key={task.id}
                className={`px-2.5 py-1 text-[9px] font-black rounded-lg truncate shadow-sm border border-white/40 ${
                  task.priority === 'Alta' ? 'bg-error/80 text-white' :
                  task.priority === 'Media' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-white'
                }`}
              >
                {task.title}
              </div>
            ))}
          </div>
          {isToday && <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-600 rounded-full animate-ping"></span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-8">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
          <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-sm">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white rounded-xl transition-all active:scale-90 text-slate-600">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button onClick={handleToday} className="px-6 py-2.5 font-black text-sm hover:bg-white rounded-xl transition-all text-indigo-600">Oggi</button>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-white rounded-xl transition-all active:scale-90 text-slate-600">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="flex bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-sm">
          <button className="px-8 py-2.5 bg-white shadow-md rounded-xl font-black text-sm text-indigo-600">Mese</button>
          <button className="px-8 py-2.5 hover:bg-white/40 rounded-xl font-bold text-sm text-slate-500 transition-all">Settimana</button>
          <button className="px-8 py-2.5 hover:bg-white/40 rounded-xl font-bold text-sm text-slate-500 transition-all">Giorno</button>
        </div>
      </div>

      <div className="glass-panel rounded-[2.5rem] overflow-hidden border border-white/40 shadow-2xl bg-white/40 backdrop-blur-3xl">
        <div className="grid grid-cols-7 border-b border-white/20 bg-white/40">
          {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(day => (
            <div key={day} className="py-5 text-center text-xs font-black text-slate-400 uppercase tracking-widest">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 min-h-[600px]">
          {renderDays()}
        </div>
      </div>

      {isModalOpen && (
        <TaskForm
          onClose={() => setIsModalOpen(false)}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
};

export default Calendar;
