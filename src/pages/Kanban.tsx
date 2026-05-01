import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MOCK_TASKS } from '../mockData';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  time: string;
  risk: number;
}

const Kanban: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);

  useEffect(() => {
    invoke<Task[]>('get_tasks')
      .then(setTasks)
      .catch((err) => {
        console.error("Backend not available, using mock data", err);
      });
  }, []);

  const columns = ['Da fare', 'In corso', 'Completati', 'Bloccati'];

  const getTasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'bg-error/10 text-error';
      case 'Media': return 'bg-primary/10 text-primary';
      case 'Bassa': return 'bg-emerald-500/10 text-emerald-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-h1-display text-4xl font-bold text-on-background">Kanban Board</h1>
        <div className="flex items-center bg-surface-container-low rounded-full px-4 py-1.5 border border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-sm mr-2">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm w-48" placeholder="Cerca task..." type="text"/>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1">
        {columns.map((col) => (
          <div key={col} className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  col === 'Da fare' ? 'bg-primary' :
                  col === 'In corso' ? 'bg-secondary' :
                  col === 'Completati' ? 'bg-emerald-500' : 'bg-error'
                }`}></span>
                <h3 className="font-bold text-xs uppercase text-slate-500 tracking-wider">{col}</h3>
                <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant">
                  {getTasksByStatus(col).length}
                </span>
              </div>
              <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">add_circle</button>
            </div>

            <div className="flex-1 flex flex-col gap-4">
              {getTasksByStatus(col).map((task) => (
                <div key={task.id} className="glass-panel inner-glow rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border border-white/40">
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 text-sm">more_horiz</span>
                  </div>
                  <h4 className="font-semibold text-on-surface mb-2">{task.title}</h4>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    <span className="text-[11px] font-medium">{task.due_date}</span>
                  </div>
                  {task.status === 'In corso' && (
                    <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-secondary w-3/4 h-full rounded-full"></div>
                    </div>
                  )}
                </div>
              ))}
              {getTasksByStatus(col).length === 0 && (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400">
                   <p className="text-xs font-medium">Nessuna task</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
