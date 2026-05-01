import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        role: 'Project Manager',
        avatar_url: ''
      }, password);
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
            <p className="text-slate-500 mt-2">Unisciti alla gestione d'élite.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Nome Completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                placeholder="es. Alessandro Rossi"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                placeholder="es. nome@esempio.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 px-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/40 border border-white/30 rounded-2xl px-4 py-3.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-inner"
                placeholder="Almeno 8 caratteri"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Registrazione...' : 'Crea account'}
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
