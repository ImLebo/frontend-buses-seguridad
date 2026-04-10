import type { PropsWithChildren } from 'react';
import { Navbar } from './Navbar';
import { Sidebar, type NavItem } from './Sidebar';

interface MainLayoutProps extends PropsWithChildren {
  navItems?: NavItem[];
}

const defaultItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'users', label: 'Usuarios', active: true },
  { id: 'settings', label: 'Configuracion' },
];

export const MainLayout = ({ children, navItems = defaultItems }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <div className="mx-auto flex max-w-7xl flex-col md:flex-row">
        <Sidebar items={navItems} />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};
