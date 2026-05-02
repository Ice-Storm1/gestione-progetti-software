import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ProjectFormProps {
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel }) => {
  const { addProject } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sviluppo Web',
    status: 'Attivo'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject({
      ...formData,
      progress: 0,
      started_at: new Date().toISOString().split('T')[0],
      members_count: 1
    });
    onCancel();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Nome Progetto</label>
        <input
          required
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          value={formData.name}
          onChange={e => setFormData({...formData, name: e.target.value})}
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-1">Descrizione</label>
        <textarea
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 outline-none"
          rows={3}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Categoria</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value})}
          >
            <option>Sviluppo Web</option>
            <option>UI Design</option>
            <option>Marketing</option>
            <option>Analisi Dati</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Stato</label>
          <select
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 outline-none"
            value={formData.status}
            onChange={e => setFormData({...formData, status: e.target.value})}
          >
            <option>Attivo</option>
            <option>Completato</option>
            <option>In Pausa</option>
          </select>
        </div>
      </div>
      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="flex-1 py-2 rounded-xl border border-slate-200 font-medium">Annulla</button>
        <button type="submit" className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-medium">Crea</button>
      </div>
    </form>
  );
};

export default ProjectForm;
