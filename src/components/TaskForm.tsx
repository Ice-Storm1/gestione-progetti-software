import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STATUSES } from '../constants';
import CustomSelect from './CustomSelect';

interface TaskFormProps {
  onCancel: () => void;
  projectId?: string;
  taskToEdit?: any;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, projectId, taskToEdit }) => {
  const { addTask, updateTask, projects } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: taskToEdit?.title || '',
    description: taskToEdit?.description || '',
    status: taskToEdit?.status || 'Idea',
    priority: taskToEdit?.priority || 'Media',
    start_date: taskToEdit?.start_date || taskToEdit?.due_date || (taskToEdit?.id ? '' : new Date().toISOString().split('T')[0]),
    due_date: taskToEdit?.due_date || (taskToEdit?.id ? '' : new Date().toISOString().split('T')[0]),
    time: taskToEdit?.time || '12:00',
    risk: taskToEdit?.risk || 0,
    project_id: taskToEdit?.project_id || projectId || (projects.length > 0 ? projects[0].id : '')
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (taskToEdit && taskToEdit.id) {
        await updateTask({ ...taskToEdit, ...formData });
      } else {
        await addTask(formData);
      }
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4">
      <div className="col-span-2">
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Titolo*</label>
        <input
          required
          autoFocus
          className="w-full bg-surface/50 border border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
          placeholder="Es. Definizione Wireframes Low-Fi"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Descrizione</label>
        <textarea
          className="w-full bg-surface/50 border border-outline-variant/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
          placeholder="Aggiungi dettagli sull'attività..."
          rows={3}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <CustomSelect
        label="Progetto"
        value={formData.project_id}
        onChange={val => setFormData({...formData, project_id: val})}
        options={projects.map(p => ({ value: p.id, label: p.name }))}
      />
      <CustomSelect
        label="Stato"
        value={formData.status}
        onChange={val => setFormData({...formData, status: val})}
        options={STATUSES}
      />
      <div>
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Priorità</label>
        <div className="flex items-center gap-2 mt-1">
          {['Bassa', 'Media', 'Alta'].map((p) => (
            <label key={p} className="cursor-pointer group flex-1">
              <input
                type="radio"
                name="priority"
                className="hidden peer"
                checked={formData.priority === p}
                onChange={() => setFormData({...formData, priority: p})}
              />
              <span className={`block text-center py-2 rounded-xl border border-outline-variant/30 text-[10px] font-black uppercase transition-all peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary`}>
                {p}
              </span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Data Inizio</label>
        <div className="relative">
          <input
            type="date"
            className="w-full bg-surface/50 border border-outline-variant/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-bold text-sm shadow-sm"
            value={formData.start_date}
            onChange={e => setFormData({...formData, start_date: e.target.value})}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl">calendar_today</span>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Data Scadenza</label>
        <div className="relative">
          <input
            type="date"
            className="w-full bg-surface/50 border border-outline-variant/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-bold text-sm shadow-sm"
            value={formData.due_date}
            onChange={e => setFormData({...formData, due_date: e.target.value})}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl text-rose-500">flag</span>
        </div>
      </div>
      <div>
        <label className="block text-[10px] font-black text-on-surface-variant mb-1.5 uppercase tracking-widest px-1">Orario</label>
        <div className="relative">
          <input
            type="time"
            className="w-full bg-surface/50 border border-outline-variant/30 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-on-surface font-bold text-sm shadow-sm"
            value={formData.time}
            onChange={e => setFormData({...formData, time: e.target.value})}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-xl">schedule</span>
        </div>
      </div>
      <div className="col-span-2 pt-4 flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl border-2 border-outline-variant/10 font-bold text-on-surface-variant hover:bg-surface/50 transition-all active:scale-95"
        >
          Annulla
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? 'Salvataggio...' : (taskToEdit && taskToEdit.id ? 'Aggiorna Task' : 'Crea Task')}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
