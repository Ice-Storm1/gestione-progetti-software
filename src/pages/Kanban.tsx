import React, { useState } from 'react';
import { useAppContext, Task } from '../context/AppContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

interface KanbanProps {
  projectId?: string;
}

const Kanban: React.FC<KanbanProps> = ({ projectId }) => {
  const { tasks, updateTaskStatus } = useAppContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns = [
    { id: 'Idea', label: 'Idea', color: 'bg-slate-400' },
    { id: 'Pianificazione', label: 'Pianificazione', color: 'bg-indigo-400' },
    { id: 'In corso', label: 'In corso', color: 'bg-amber-500' },
    { id: 'In revisione', label: 'In revisione', color: 'bg-purple-500' },
    { id: 'Completati', label: 'Completati', color: 'bg-emerald-500' },
  ];

  const projectTasks = projectId
    ? tasks.filter(t => t.project_id === projectId)
    : tasks;

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('taskId', id);
  };

  const handleDrop = async (e: React.DragEvent, status: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    await updateTaskStatus(taskId, status);
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className={`flex gap-6 overflow-x-auto pb-6 min-h-[600px] ${!projectId ? 'p-8' : ''} animate-in fade-in duration-500`}>
      {columns.map(col => (
        <div
          key={col.id}
          onDrop={(e) => handleDrop(e, col.id)}
          onDragOver={allowDrop}
          className="flex-shrink-0 w-80 flex flex-col gap-4 bg-surface/30 dark:bg-slate-800/30 p-4 rounded-3xl border border-outline-variant/10 shadow-inner"
        >
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${col.color}`}></span>
              <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{col.label}</h3>
              <span className="bg-surface shadow-sm px-2 py-0.5 rounded text-[10px] font-black text-primary">
                {projectTasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            <button className="material-symbols-outlined text-outline hover:text-primary transition-colors text-sm">more_horiz</button>
          </div>

          <div className="flex-1 flex flex-col gap-4">
            {projectTasks.filter(t => t.status === col.id).map(task => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, task.id)}
                onClick={() => setEditingTask(task)}
                className="glass-panel inner-glow rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all cursor-grab active:cursor-grabbing border border-outline-variant/10 bg-surface dark:bg-slate-800 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-tighter border ${
                    task.priority === 'Alta' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/30' :
                    task.priority === 'Media' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <h4 className="text-base font-black text-on-surface mb-3 line-clamp-2">{task.title}</h4>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                    <span className="text-[10px] font-bold">{task.due_date}</span>
                  </div>
                  {task.risk > 0 && (
                     <div className="w-12 h-1 bg-outline-variant/20 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${task.risk}%` }}></div>
                     </div>
                  )}
                </div>
              </div>
            ))}

            {projectTasks.filter(t => t.status === col.id).length === 0 && (
              <div className="flex-1 border-2 border-dashed border-outline-variant/10 rounded-2xl flex items-center justify-center py-10">
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest">Trascina qui</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {editingTask && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="Modifica Task"
        >
          <TaskForm
            onCancel={() => setEditingTask(null)}
            taskToEdit={editingTask}
          />
        </Modal>
      )}
    </div>
  );
};

export default Kanban;
