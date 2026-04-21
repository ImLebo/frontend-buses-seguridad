import { useState, type PropsWithChildren } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useCurrentUserInfo } from '../../hooks/useCurrentUserInfo';
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
  const { user } = useAuth();
  const { currentUserInfo } = useCurrentUserInfo();

  // Usar currentUserInfo si está disponible, si no, usar datos de Firebase directamente
  const displayName = currentUserInfo?.name || user?.displayName || 'Usuario';
  const userPhoto = currentUserInfo?.photo || user?.photoURL || undefined;
  const userRole = currentUserInfo?.role || currentUserInfo?.roles?.[0] || undefined;
  const oauthProvider = user?.provider;

  console.log('[MainLayout] Debug:', {
    currentUserInfo,
    user: {
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      provider: user?.provider,
    },
    final: {
      displayName,
      userPhoto,
      userRole,
      oauthProvider,
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} items={navItems} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar
            onLogout={onLogout}
            onMenuClick={() => setSidebarOpen((previous) => !previous)}
            userName={displayName}
            userPhoto={userPhoto}
            userRole={userRole}
            oauthProvider={oauthProvider}
          />

          <main className="flex-1 overflow-auto">
            <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
