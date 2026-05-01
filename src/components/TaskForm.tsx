import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface TaskFormProps {
  onClose: () => void;
  initialDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose, initialDate }) => {
  const { addTask, projects } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [dueDate, setDueDate] = useState(initialDate || '');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;

    setIsSubmitting(true);
    try {
      await addTask({
        title,
        description,
        status: 'Da fare',
        priority,
        due_date: dueDate,
        time: '12:00',
        risk: 0,
        project_id: projectId
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-6">
      <div className="glass-panel rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col border border-white/40 bg-white/95 animate-in zoom-in duration-300">
        <div className="p-10 pb-6 flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nuova Task</h2>
            <p className="text-slate-500 font-medium">Compila i dettagli per pianificare l'attività.</p>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-slate-100 text-slate-400 transition-all">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 pt-0 overflow-y-auto">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Titolo Attività</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-bold shadow-inner"
                placeholder="es. Revisione interfaccia utente"
                required
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Descrizione</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-medium shadow-inner"
                placeholder="Aggiungi note sull'attività..."
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Progetto</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-bold shadow-inner appearance-none"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Data Scadenza</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 font-bold shadow-inner"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 px-1">Priorità</label>
              <div className="flex gap-4">
                {['Bassa', 'Media', 'Alta'].map(p => (
                  <label key={p} className="flex-1 cursor-pointer">
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={() => setPriority(p)}
                      className="hidden peer"
                    />
                    <div className={`py-4 rounded-2xl text-center font-black text-xs uppercase tracking-widest border transition-all peer-checked:shadow-lg ${
                      p === 'Alta' ? 'border-rose-100 text-rose-500 peer-checked:bg-rose-500 peer-checked:text-white peer-checked:border-rose-500' :
                      p === 'Media' ? 'border-indigo-100 text-indigo-500 peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600' :
                      'border-emerald-100 text-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500'
                    }`}>
                      {p}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all"
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Salvataggio...' : 'Pianifica Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
