import React, { useState } from 'react';
import { useAppContext, Task } from '../context/AppContext';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

interface TaskListProps {
  projectId?: string;
}

const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const { tasks } = useAppContext();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const projectTasks = projectId
    ? tasks.filter(t => t.project_id === projectId)
    : tasks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Alta': return 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400 border-rose-100 dark:border-rose-800';
      case 'Media': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/30 dark:text-amber-400 border-amber-100 dark:border-amber-800';
      default: return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800';
    }
  };

  return (
    <div className={`space-y-4 ${!projectId ? 'p-8' : ''} animate-in fade-in duration-500`}>
      {!projectId && (
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-3xl font-black text-on-surface tracking-tight">Cronoprogramma Globale</h3>
           <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest text-on-surface-variant bg-surface/40 p-3 rounded-2xl border border-outline-variant/10">
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Completato</span>
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> In Corso</span>
             <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Bloccato</span>
           </div>
        </div>
      )}
      <div className="glass-panel rounded-[2rem] overflow-hidden border border-outline-variant/10 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface/50 border-b border-outline-variant/10">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Titolo Task</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Stato</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Priorità</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Scadenza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {projectTasks.length > 0 ? projectTasks.map(task => (
                <tr
                  key={task.id}
                  onClick={() => setEditingTask(task)}
                  className="hover:bg-surface/50 transition-all cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${
                        task.status === 'Completato' ? 'bg-emerald-500' :
                        task.status === 'In corso' ? 'bg-amber-500' :
                        task.status === 'Bloccato' ? 'bg-rose-500' : 'bg-slate-400'
                      }`}></div>
                      <div>
                        <div className="font-black text-on-surface group-hover:text-primary transition-colors">{task.title}</div>
                        <div className="text-xs text-on-surface-variant font-medium line-clamp-1 max-w-xs">{task.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-outline-variant/20 bg-surface/50 text-on-surface">
                      {task.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter border ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-on-surface-variant">
                    {task.due_date}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-40">
                      <span className="material-symbols-outlined text-6xl">assignment_late</span>
                      <p className="font-black uppercase tracking-widest text-xs">Nessun task trovato</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

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

export default TaskList;
