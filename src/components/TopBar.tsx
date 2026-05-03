import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Link, useLocation } from 'react-router-dom';

interface TopBarProps {
  onNewProject?: () => void;
  onNewTask?: () => void;
}

const TopBar: React.FC<TopBarProps> = () => {
  const { user, searchQuery, setSearchQuery, notifications, removeNotification, setNotifications } = useAppContext();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  const isProjectsPage = location.pathname === '/projects';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPageTitle = () => {
    if (location.pathname === '/dashboard') return 'Dashboard';
    if (location.pathname === '/projects') return 'Progetti';
    if (location.pathname === '/kanban') return 'Tasks';
    if (location.pathname === '/calendar') return 'Calendario';
    if (location.pathname === '/settings') return 'Impostazioni';
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
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-on-surface-variant hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-full transition-all"
            >
              <span className="material-symbols-outlined">notifications</span>
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-surface"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-outline-variant/20 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-5 border-b border-outline-variant/20 flex justify-between items-center bg-surface/80">
                  <h3 className="font-black text-on-surface text-lg">Notifiche</h3>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-black">{notifications.length}</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <p className="text-sm font-bold text-on-surface-variant">Nessuna nuova notifica</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-outline-variant/5">
                      {notifications.map((n) => (
                        <div key={n.id} className="p-4 hover:bg-surface/50 border-b border-outline-variant/5 transition-colors flex gap-3 group relative">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            n.type === 'success' ? 'bg-green-100 text-green-700' : n.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            <span className="material-symbols-outlined text-sm">
                              {n.type === 'success' ? 'check_circle' : n.type === 'error' ? 'report' : 'info'}
                            </span>
                          </div>
                          <div className="flex-1 pr-6">
                            <p className="text-xs font-bold text-on-surface line-clamp-2">{n.message}</p>
                            <p className="text-[9px] font-black text-outline uppercase tracking-widest mt-1">Appena ora</p>
                          </div>
                          <button
                            onClick={() => removeNotification(n.id)}
                            className="absolute top-4 right-4 p-1 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 bg-surface/30 border-t border-outline-variant/10 text-center">
                    <button
                      onClick={() => setNotifications([])}
                      className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                    >
                      Segna tutte come lette
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

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
