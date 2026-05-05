import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'Project Lead',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Le password non coincidono");
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        username: formData.username,
        role: formData.role,
        avatar_url: ''
      }, formData.password);
      navigate('/login');
    } catch (err) {
      // Error handled by context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-3xl border border-white/40 shadow-2xl backdrop-blur-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crea Account</h2>
            <p className="text-slate-500 mt-2">Unisciti all'elite della gestione progetti.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">Nome Completo</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                placeholder="es. Alessandro Rossi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">Nome Utente</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                placeholder="es. alessandro.rossi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">Ruolo</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner appearance-none cursor-pointer"
              >
                <option>Project Lead</option>
                <option>Designer</option>
                <option>Developer</option>
                <option>Manager</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5 px-1">Conferma</label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50 mt-4"
            >
              {isSubmitting ? 'Registrazione...' : 'Crea Account'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Hai già un account?{' '}
              <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                Accedi
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
