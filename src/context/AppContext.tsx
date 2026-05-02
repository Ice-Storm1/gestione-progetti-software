import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: string;
  category: string;
  started_at: string;
  members_count: number;
  date?: string;
  time?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string;
  time: string;
  risk: number;
  project_id?: string;
  created_at?: string;
}

export interface User {
  name: string;
  role: string;
  avatar_url: string;
  username: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications_enabled: boolean;
  };
}

export interface WhiteboardElement {
  id: string;
  x: number;
  y: number;
  text: string;
  element_type: string;
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (id: string, status: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  register: (user: Omit<User, 'preferences'>, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => Promise<void>;
  getWhiteboard: (project_id: string) => Promise<WhiteboardElement[]>;
  saveWhiteboard: (project_id: string, elements: WhiteboardElement[]) => Promise<void>;
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
  status: 'active' | 'completed';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type, status: 'active' }]);
    setTimeout(() => {
      setNotifications((prev) => prev.map(n => n.id === id ? { ...n, status: 'completed' } : n));
    }, 3000); // Updated to 3000ms
  }, []);

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const refreshProjects = async () => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const data = await invoke<Project[]>('get_projects');
        setProjects(data);
      }
    } catch (err) {
      console.error('Failed to fetch projects', err);
    }
  };

  const refreshTasks = async () => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const data = await invoke<Task[]>('get_tasks');
        setTasks(data);
      }
    } catch (err) {
      console.error('Failed to fetch tasks', err);
    }
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const newProject = await invoke<Project>('create_project', { project: { ...project, id: '' } });
        setProjects((prev) => [...prev, newProject]);
        addNotification('Progetto creato con successo', 'success');
        return newProject;
      } else {
        const mockProject = { ...project, id: Math.random().toString(), created_at: new Date().toISOString() } as Project;
        setProjects((prev) => [...prev, mockProject]);
        addNotification('Progetto creato (Mock)', 'success');
        return mockProject;
      }
    } catch (err) {
      addNotification('Errore nella creazione del progetto', 'error');
      throw err;
    }
  };

  const updateProject = async (project: Project) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('update_project', { project });
      }
      setProjects((prev) => prev.map(p => p.id === project.id ? project : p));
      addNotification('Progetto aggiornato', 'success');
    } catch (err) {
      addNotification('Errore aggiornamento progetto', 'error');
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('delete_project', { id });
      }
      setProjects((prev) => prev.filter(p => p.id !== id));
      setTasks((prev) => prev.filter(t => t.project_id !== id));
      addNotification('Progetto eliminato', 'info');
    } catch (err) {
      addNotification('Errore eliminazione progetto', 'error');
    }
  };

  const addTask = async (task: Omit<Task, 'id'>) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const newTask = await invoke<Task>('create_task', { task: { ...task, id: '' } });
        setTasks((prev) => [...prev, newTask]);
        addNotification('Task creato con successo', 'success');
        return newTask;
      } else {
        const mockTask = { ...task, id: Math.random().toString(), created_at: new Date().toISOString() } as Task;
        setTasks((prev) => [...prev, mockTask]);
        addNotification('Task creato (Mock)', 'success');
        return mockTask;
      }
    } catch (err) {
      addNotification('Errore nella creazione del task', 'error');
      throw err;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('update_task', { task });
      }
      setTasks((prev) => prev.map(t => t.id === task.id ? task : t));
      addNotification('Task aggiornato', 'success');
    } catch (err) {
      addNotification('Errore aggiornamento task', 'error');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('delete_task', { id });
      }
      setTasks((prev) => prev.filter(t => t.id !== id));
      addNotification('Task eliminato', 'info');
    } catch (err) {
      addNotification('Errore eliminazione task', 'error');
    }
  };

  const updateTaskStatus = async (id: string, status: string) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('update_task_status', { id, status });
      }
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status } : t))
      );
    } catch (err) {
      addNotification('Errore aggiornamento task', 'error');
    }
  };

  const login = async (username: string, password: string) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        const userData = await invoke<User>('login', { username, password });
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('protype_session', JSON.stringify(userData));
        addNotification(`Bentornato, ${userData.name}`, 'info');
      } else {
        if (username === 'admin' && password === 'admin') {
          const mockUser: User = {
            name: 'Alessandro Rossi',
            role: 'Project Lead',
            avatar_url: '',
            username,
            preferences: { theme: 'light', notifications_enabled: true }
          };
          setUser(mockUser);
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid credentials');
        }
      }
    } catch (err) {
      addNotification('Credenziali non valide', 'error');
      throw err;
    }
  };

  const register = async (userData: Omit<User, 'preferences'>, password: string) => {
    try {
      const fullUser: User = { ...userData, preferences: { theme: 'light', notifications_enabled: true } };
      if (window.__TAURI_INTERNALS__) {
        await invoke('register', { user: { ...fullUser, password } });
        addNotification('Registrazione completata! Accedi ora.', 'success');
      } else {
        addNotification('Registrazione mock completata', 'success');
      }
    } catch (err) {
      addNotification('Errore registrazione', 'error');
      throw err;
    }
  };

  const updateUser = async (updatedUser: User) => {
    try {
      if (window.__TAURI_INTERNALS__) {
        await invoke('update_user', { user: updatedUser });
      }
      setUser(updatedUser);
      localStorage.setItem('protype_session', JSON.stringify(updatedUser));
      addNotification('Profilo aggiornato', 'success');
    } catch (err) {
      addNotification('Errore aggiornamento profilo', 'error');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('protype_session');
    addNotification('Disconnesso', 'info');
  };

  const getWhiteboard = async (project_id: string) => {
    if (window.__TAURI_INTERNALS__) {
      return await invoke<WhiteboardElement[]>('get_whiteboard', { project_id });
    }
    return [];
  };

  const saveWhiteboard = async (project_id: string, elements: WhiteboardElement[]) => {
    if (window.__TAURI_INTERNALS__) {
      await invoke('save_whiteboard', { project_id, elements });
    }
  };

  useEffect(() => {
    if (user?.preferences.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences.theme]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const savedSession = localStorage.getItem('protype_session');
      if (savedSession) {
        try {
          const u = JSON.parse(savedSession);
          setUser(u);
          setIsAuthenticated(true);
        } catch (e) {}
      }

      try {
        if (window.__TAURI_INTERNALS__) {
          await Promise.all([refreshProjects(), refreshTasks()]);
        } else {
          setProjects([
            { id: '1', name: 'Brand Identity 2024', description: 'Ridefinizione completa dell\'immagine coordinata per il lancio internazionale del Q3.', progress: 65, status: 'In corso', category: 'Design', started_at: '2024-01-12', members_count: 12, created_at: '2024-01-12T10:00:00Z' }
          ]);
          setTasks([
            { id: '1', title: 'Task Mock', description: 'Descrizione task mock', status: 'In corso', priority: 'Media', due_date: '2024-10-12', time: '10:00', risk: 10, project_id: '1', created_at: '2024-10-12T10:00:00Z' }
          ]);
        }
      } catch (err) {
        console.error('Initialization failed', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <AppContext.Provider
      value={{
        projects,
        tasks,
        user,
        loading,
        isAuthenticated,
        searchQuery,
        setSearchQuery,
        refreshProjects,
        refreshTasks,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        updateTaskStatus,
        login,
        register,
        logout,
        updateUser,
        getWhiteboard,
        saveWhiteboard,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
