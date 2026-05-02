import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface TaskFormProps {
  onCancel: () => void;
  initialDate?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({ onCancel, initialDate }) => {
  const { addTask, projects } = useAppContext();
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
    await addTask(formData);
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="col-span-2">
        <label className="block text-sm font-bold text-slate-700 mb-1">Titolo Task</label>
        <input
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Progetto</label>
        <select
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
          value={formData.project_id}
          onChange={e => setFormData({...formData, project_id: e.target.value})}
        >
          {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Priorità</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            value={formData.priority}
            onChange={e => setFormData({...formData, priority: e.target.value})}
          >
            <option>Bassa</option>
            <option>Media</option>
            <option>Alta</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Scadenza</label>
          <input
            type="date"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            value={formData.due_date}
            onChange={e => setFormData({...formData, due_date: e.target.value})}
          />
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-xl border border-slate-200 font-medium">Annulla</button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium">Crea Task</button>
      </div>
    </form>
  );
};

export default TaskForm;
