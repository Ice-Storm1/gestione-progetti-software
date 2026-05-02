import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onNewProject, onNewTask }) => {
  const { user } = useAppContext();

  return (
    <header className="sticky top-0 z-40 bg-white/65 backdrop-blur-xl border-b border-white/20 flex justify-between items-center px-8 h-16 shadow-sm">
      <div className="flex items-center gap-4 bg-white/40 px-4 py-2 rounded-full border border-white/20 w-96 max-w-md hidden md:flex">
        <span className="material-symbols-outlined text-slate-400" data-icon="search">search</span>
        <input className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none" placeholder="Cerca progetti o task..." type="text"/>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          {onNewTask && (
            <button
              onClick={onNewTask}
              className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-slate-600 hover:bg-white/40 transition-all text-sm font-medium"
            >
              <span className="material-symbols-outlined text-lg">add_task</span>
              Nuova Task
            </button>
          )}
          {onNewProject && (
            <button
              onClick={onNewProject}
              className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Nuovo Progetto
            </button>
          )}
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900 leading-tight">{user?.name || 'Guest'}</p>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{user?.role || 'User'}</p>
          </div>
          <Link to="/settings" className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-indigo-500/20 transition-all">
            <img
              alt="User"
              className="w-full h-full object-cover"
              src={user?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAPfJENEnq64PmwAVYfqkLi6NLRihG5CBrJzx1l1tubeuNu1xJFO9RtYonE54ub9qvKhO_BI57aX4MeLSV2ZwF5KfY__fubFSNu_ElruSi-pXC9LAfDCXn_gI2tgXzC-EZ3NciXODVVd9vr11dXHIZ8ZvDqk63Loiyhik2r4-QlcifZRac1SgejTaLX9lCZt3Axry6wA8Mj8CeXVoO3KlSml_RqoCTek5Rw8JmOoHoEOg3yWgT1sqvbIp12E5p2NDrkNmfnQQb_z5v"}
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
