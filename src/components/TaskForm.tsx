import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface TaskFormProps {
  onCancel: () => void;
  initialDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, initialDate }) => {
  const { addTask, projects } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Da fare',
    priority: 'Media',
    due_date: initialDate || new Date().toISOString().split('T')[0],
    time: '12:00',
    risk: 10,
    project_id: projects[0]?.id || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_id) {
       alert("Seleziona un progetto prima di creare un task.");
       return;
    }
    setIsSubmitting(true);
    try {
      await addTask(formData);
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Titolo Task</label>
          <input
            required
            autoFocus
            placeholder="es. Implementazione API"
            className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Descrizione</label>
          <textarea
            placeholder="Dettagli sull'attività..."
            className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
            rows={3}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Progetto</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white cursor-pointer"
              value={formData.project_id}
              onChange={e => setFormData({...formData, project_id: e.target.value})}
            >
              {projects.length === 0 && <option value="">Nessun progetto</option>}
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Priorità</label>
            <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              {(['Bassa', 'Media', 'Alta'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setFormData({...formData, priority: p})}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    formData.priority === p
                      ? 'bg-white dark:bg-slate-600 shadow-sm text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Scadenza</label>
            <input
              type="date"
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white"
              value={formData.due_date}
              onChange={e => setFormData({...formData, due_date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Rischio (%)</label>
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4">
               <input
                 type="range"
                 min="0" max="100"
                 className="flex-1 accent-indigo-600"
                 value={formData.risk}
                 onChange={e => setFormData({...formData, risk: parseInt(e.target.value)})}
               />
               <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 w-10">{formData.risk}%</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-4 pt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl border-2 border-slate-100 dark:border-slate-700 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all active:scale-95"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvataggio...' : 'Crea Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
