import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Dashboard from '../pages/Dashboard';
import Projects from '../pages/Projects';
import Kanban from '../pages/Kanban';
import Calendar from '../pages/Calendar';
import Settings from '../pages/Settings';

const Layout: React.FC = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'kanban':
        return <Kanban />;
      case 'calendar':
        return <Calendar />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 ml-[280px]">
        <TopBar />
        <main className="mt-16 p-8 min-h-[calc(100vh-64px)]">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default Layout;
