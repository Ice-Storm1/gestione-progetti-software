import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

interface ProjectFormProps {
  onClose: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onClose }) => {
  const { addProject } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Sviluppo Web',
    status: 'Attivo',
    progress: 0,
    members_count: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addProject({
      ...formData,
      started_at: new Date().toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-6 gap-y-4 mt-4">
      <div className="col-span-2">
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Nome Progetto*</label>
        <input
          required
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          placeholder="Es. Re-branding Protype"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Descrizione</label>
        <textarea
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          placeholder="Aggiungi dettagli sul progetto..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Categoria</label>
        <select
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm appearance-none"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option>Sviluppo Web</option>
          <option>Mobile App</option>
          <option>Design UI/UX</option>
          <option>Marketing</option>
          <option>Cybersecurity</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase tracking-wider">Membri Team</label>
        <input
          type="number"
          min="1"
          className="w-full bg-white/40 border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          value={formData.members_count}
          onChange={(e) => setFormData({ ...formData, members_count: parseInt(e.target.value) || 1 })}
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
          Crea Progetto
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
