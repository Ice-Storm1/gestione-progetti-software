import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface KanbanProps {
  projectId?: string;
}

const Kanban: React.FC<KanbanProps> = ({ projectId }) => {
  const { tasks, updateTaskStatus } = useAppContext();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const columns = [
    { id: 'Da fare', label: 'Da fare', color: 'bg-primary' },
    { id: 'In corso', label: 'In corso', color: 'bg-secondary' },
    { id: 'Completati', label: 'Completati', color: 'bg-emerald-500' },
    { id: 'Bloccati', label: 'Bloccati', color: 'bg-error' },
  ];

  // Filter tasks if projectId is provided
  const filteredTasks = projectId ? tasks.filter(t => t.project_id === projectId) : tasks;

  const handleDragStart = (id: string) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (draggedTaskId) {
      await updateTaskStatus(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[600px]">
      {columns.map((column) => (
        <div
          key={column.id}
          className="flex flex-col gap-4"
          onDragOver={handleDragOver}
          onDrop={() => handleDrop(column.id)}
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${column.color}`}></span>
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-500">{column.label}</h3>
              <span className="bg-white/50 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600 shadow-sm border border-white/40">
                {filteredTasks.filter((t) => t.status === column.id).length}
              </span>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-4 bg-slate-50/30 rounded-3xl p-2 border border-white/10 backdrop-blur-sm">
            {filteredTasks
              .filter((task) => task.status === column.id)
              .map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={() => handleDragStart(task.id)}
                  className="glass-panel rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-grab active:cursor-grabbing border border-white/40 bg-white/60 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className={`text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest border ${
                      task.priority === 'Alta' ? 'bg-rose-50 text-error border-rose-100' :
                      task.priority === 'Media' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' :
                      'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>
                      {task.priority}
                    </span>
                    <button className="text-slate-300 group-hover:text-slate-500">
                      <span className="material-symbols-outlined text-lg">more_horiz</span>
                    </button>
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2 leading-snug">{task.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium mb-4 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="material-symbols-outlined text-sm">calendar_today</span>
                      <span className="text-[10px] font-bold">{task.due_date}</span>
                    </div>
                    {task.risk > 0 && (
                       <div className="flex items-center gap-1 text-amber-500">
                         <span className="material-symbols-outlined text-xs">warning</span>
                         <span className="text-[9px] font-black">{task.risk}%</span>
                       </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Kanban;
