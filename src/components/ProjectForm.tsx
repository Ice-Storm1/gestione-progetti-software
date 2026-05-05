import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { STATUSES } from '../constants';

interface ProjectFormProps {
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onCancel }) => {
  const { addProject } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sviluppo Web',
    status: 'Idea',
    date: new Date().toISOString().split('T')[0],
    time: '10:00'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addProject({
        ...formData,
        progress: 0,
        started_at: formData.date,
        members_count: 1
      });
      onCancel();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Nome Progetto</label>
          <input
            required
            autoFocus
            placeholder="es. Redesign Brand 2024"
            className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Descrizione</label>
          <textarea
            placeholder="Racconta brevemente gli obiettivi del progetto..."
            className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Categoria</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
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
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Status Iniziale</label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white appearance-none cursor-pointer"
              value={formData.status}
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Data</label>
            <input
              type="date"
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Orario</label>
            <input
              type="time"
              className="w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all dark:text-white shadow-inner"
              value={formData.time}
              onChange={e => setFormData({...formData, time: e.target.value})}
            />
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
          {isSubmitting ? 'Creazione...' : 'Crea Progetto'}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
