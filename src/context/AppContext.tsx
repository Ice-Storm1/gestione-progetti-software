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
}

export interface User {
  name: string;
  role: string;
  avatar_url: string;
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  user: User | null;
  loading: boolean;
  refreshProjects: () => Promise<void>;
  refreshTasks: () => Promise<void>;
  addProject: (project: Omit<Project, 'id'>) => Promise<Project>;
  addTask: (task: Omit<Task, 'id'>) => Promise<Task>;
  updateTaskStatus: (id: string, status: string) => Promise<void>;
  notifications: Notification[];
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: number) => void;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
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
        const mockProject = { ...project, id: Math.random().toString() } as Project;
        setProjects((prev) => [...prev, mockProject]);
        addNotification('Progetto creato (Mock Mode)', 'success');
        return mockProject;
      }
    } catch (err) {
      console.error('Failed to create project', err);
      addNotification('Errore nella creazione del progetto', 'error');
      throw err;
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
        const mockTask = { ...task, id: Math.random().toString() } as Task;
        setTasks((prev) => [...prev, mockTask]);
        addNotification('Task creato (Mock Mode)', 'success');
        return mockTask;
      }
    } catch (err) {
      console.error('Failed to create task', err);
      addNotification('Errore nella creazione del task', 'error');
      throw err;
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
      if (!window.__TAURI_INTERNALS__) {
        addNotification('Stato aggiornato (Mock Mode)', 'info');
      }
    } catch (err) {
      console.error('Failed to update task status', err);
      addNotification('Errore nell\'aggiornamento dello stato', 'error');
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        if (window.__TAURI_INTERNALS__) {
          await Promise.all([
            refreshProjects(),
            refreshTasks(),
            invoke<User>('get_current_user').then(setUser)
          ]);
        } else {
          // Mock initial data
          setProjects([
            { id: '1', name: 'Brand Identity 2024', description: 'Descrizione mock', progress: 65, status: 'Attivo', category: 'Design', started_at: '10/10/2023', members_count: 5 }
          ]);
          setTasks([
            { id: '1', title: 'Task Mock', description: 'Descrizione task mock', status: 'Da fare', priority: 'Media', due_date: 'Domani', time: '10:00', risk: 10 }
          ]);
          setUser({ name: 'Alessandro Rossi', role: 'Project Lead', avatar_url: '' });
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
        refreshProjects,
        refreshTasks,
        addProject,
        addTask,
        updateTaskStatus,
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
