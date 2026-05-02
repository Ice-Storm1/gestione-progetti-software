import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

const TopBar: React.FC<TopBarProps> = () => {
  const { user, searchQuery, setSearchQuery } = useAppContext();
  const location = useLocation();

  const isProjectsPage = location.pathname === '/projects';

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/projects') return 'Progetti';
    if (location.pathname === '/kanban') return 'Tasks';
    if (location.pathname === '/calendar') return 'Calendario';
    if (location.pathname === '/settings') return 'Impostazioni';
    if (location.pathname === '/notifications') return 'Notifiche';
    if (location.pathname === '/support') return 'Supporto';
    if (location.pathname.includes('/projects/')) return 'Dettaglio Progetto';

    const path = location.pathname.split('/').pop() || 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/65 backdrop-blur-xl border-b border-outline-variant/20 flex justify-between items-center px-8 h-16 shadow-sm transition-colors">
      <div className="flex-1 flex items-center">
        {isProjectsPage ? (
          <div className="flex items-center gap-4 bg-white/40 dark:bg-slate-800/40 px-4 py-2 rounded-full border border-outline-variant/20 w-96 max-w-md hidden md:flex transition-all">
            <span className="material-symbols-outlined text-outline">search</span>
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none text-on-surface"
              placeholder="Cerca progetti..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        ) : (
          <h2 className="text-xl font-black text-on-surface tracking-tight">
            {getPageTitle()}
          </h2>
        )}
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <Link to="/notifications" className="relative p-2 text-on-surface-variant hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-full transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
          </Link>

          <div className="flex items-center gap-3 border-l border-outline-variant/30 pl-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-on-surface leading-tight">{user?.name || 'Francesco'}</p>
              <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">{user?.role || 'Project Lead'}</p>
            </div>
            <Link to="/settings" className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm hover:ring-4 hover:ring-primary/10 transition-all">
              <img
                alt="User"
                className="w-full h-full object-cover"
                src={user?.avatar_url || "https://lh3.googleusercontent.com/aida-public/AB6AXuCAPfJENEnq64PmwAVYfqkLi6NLRihG5CBrJzx1l1tubeuNu1xJFO9RtYonE54ub9qvKhO_BI57aX4MeLSV2ZwF5KfY__fubFSNu_ElruSi-pXC9LAfDCXn_gI2tgXzC-EZ3NciXODVVd9vr11dXHIZ8ZvDqk63Loiyhik2r4-QlcifZRac1SgejTaLX9lCZt3Axry6wA8Mj8CeXVoO3KlSml_RqoCTek5Rw8JmOoHoEOg3yWgT1sqvbIp12E5p2NDrkNmfnQQb_z5v"}
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
