import { useState, type PropsWithChildren } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, type NavItem } from './Sidebar';

interface MainLayoutProps extends PropsWithChildren {
  navItems?: NavItem[];
  onLogout?: () => void;
}

const defaultItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Usuarios', active: true },
  { id: 'settings', label: 'Configuracion' },
];

export const MainLayout = ({ children, navItems = defaultItems, onLogout }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} items={navItems} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onLogout={onLogout} onMenuClick={() => setSidebarOpen((previous) => !previous)} />
          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};
