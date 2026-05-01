import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { addTask } = useAppContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Da fare',
    priority: 'Media',
    due_date: '',
    time: '09:00 - 10:00',
    risk: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTask({
      ...formData,
      due_date: formData.due_date || 'Nessuna data',
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div className="col-span-2">
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Titolo*</label>
        <input
          required
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          placeholder="Es. Definizione Wireframes Low-Fi"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Descrizione</label>
        <textarea
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          placeholder="Aggiungi dettagli sull'attività..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Stato</label>
        <select
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option>Da fare</option>
          <option>In corso</option>
          <option>Completato</option>
          <option>Bloccato</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Priorità</label>
        <div className="flex items-center gap-2 mt-1">
          {['Bassa', 'Media', 'Alta'].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setFormData({ ...formData, priority: p })}
              className={`px-3 py-1.5 rounded-full border text-[11px] font-bold uppercase transition-all ${
                formData.priority === p
                ? 'bg-primary text-white border-primary'
                : 'border-slate-200 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Data Scadenza</label>
        <input
          type="date"
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          value={formData.due_date}
          onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Orario</label>
        <input
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
        />
      </div>
      <div className="col-span-2 flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-200/50 transition-all"
        >
          Annulla
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 rounded-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          Crea Task
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
