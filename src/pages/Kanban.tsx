import React from 'react';
import { useAppContext } from '../context/AppContext';

const Kanban: React.FC = () => {
  const { tasks, updateTaskStatus } = useAppContext();

  const columns = [
    { id: 'Da fare', label: 'Da fare', color: 'bg-primary' },
    { id: 'In corso', label: 'In corso', color: 'bg-secondary' },
    { id: 'Completato', label: 'Completati', color: 'bg-emerald-500' },
    { id: 'Bloccato', label: 'Bloccati', color: 'bg-error' },
  ];

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: string) => {
    const id = e.dataTransfer.getData('taskId');
    updateTaskStatus(id, status);
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-on-background tracking-tight">Kanban Board</h1>
        <p className="text-lg text-slate-500 mt-1">Gestisci il flusso di lavoro del tuo team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col gap-4 min-h-[500px]"
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
                <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">{col.label}</h3>
                <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
                  {tasks.filter(t => t.status === col.id).length}
                </span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 p-2 rounded-2xl bg-slate-50/50 border border-dashed border-slate-200">
              {tasks.filter(t => t.status === col.id).map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, task.id)}
                  className="glass-panel inner-glow rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border border-white/40 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-tighter ${
                      task.priority === 'Alta' ? 'bg-red-100 text-red-600' :
                      task.priority === 'Media' ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {task.priority}
                    </span>
                    <span className="material-symbols-outlined text-slate-300 text-sm group-hover:text-slate-500 transition-colors">drag_indicator</span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface mb-2">{task.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{task.description}</p>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="material-symbols-outlined text-xs">calendar_today</span>
                    <span className="text-[11px] font-medium">{task.due_date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Kanban;
