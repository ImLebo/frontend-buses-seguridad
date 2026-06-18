import { useMemo, useState, type PropsWithChildren } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useRBAC } from '../../hooks/useRBAC';
import { useCurrentUserInfo } from '../../hooks/useCurrentUserInfo';
import { getSessionProvider } from '../../services/authService';
import { Navbar } from './Navbar';
import { Sidebar, type NavItem } from './Sidebar';

interface MainLayoutProps extends PropsWithChildren {
  navItems?: NavItem[];
  onLogout?: () => void;
}

export const MainLayout = ({ children, navItems, onLogout }: MainLayoutProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const { currentUserInfo } = useCurrentUserInfo();
  const { hasPermission } = useRBAC();

  // Usar currentUserInfo si está disponible, si no, usar datos de Firebase directamente
  const displayName = currentUserInfo?.name || user?.displayName || 'Usuario';
  const userPhoto = currentUserInfo?.photo || user?.photoURL || undefined;
  const userRole = currentUserInfo?.role || currentUserInfo?.roles?.[0] || undefined;
  const oauthProvider = user?.provider || getSessionProvider() || undefined;

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

  const effectiveNavItems = useMemo<NavItem[]>(() => {
    if (Array.isArray(navItems)) {
      return navItems;
    }

    const nextItems: NavItem[] = [];

    if (hasPermission('USUARIOS', 'READ')) {
      nextItems.push({ id: 'users', label: 'Usuarios', path: '/app/users', icon: 'Users' });
      nextItems.push({ id: 'profiles', label: 'Perfiles', path: '/app/profiles', icon: 'UserCheck' });
      nextItems.push({ id: 'sessions', label: 'Sesiones', path: '/app/sessions', icon: 'Clock' });
    }

    if (hasPermission('RUTAS', 'CREATE')) {
      nextItems.push({ id: 'admin-routes-new', label: 'Crear Ruta', path: '/app/admin-routes/new', icon: 'Map' });
      nextItems.push({ id: 'admin-stops-new', label: 'Crear Paradero', path: '/app/admin-stops/new', icon: 'MapPin' });
    }

    if (hasPermission('PROGRAMACION', 'CREATE')) {
      nextItems.push({ id: 'admin-schedules-new', label: 'Programar Ruta', path: '/app/admin-schedules/new', icon: 'Calendar' });
    }

    if (hasPermission('BUSES', 'CREATE')) {
      nextItems.push({ id: 'company-buses-new', label: 'Registrar Bus', path: '/app/company-buses/new', icon: 'Truck' });
    }

    if (hasPermission('ROLES', 'READ')) {
      nextItems.push({ id: 'roles', label: 'Roles', path: '/app/roles', icon: 'Shield' });
    }

    if (hasPermission('PERMISOS', 'READ')) {
      nextItems.push({ id: 'permissions', label: 'Permisos', path: '/app/permissions', icon: 'Key' });
      nextItems.push({ id: 'role-permissions', label: 'Rol-Permisos', path: '/app/role-permissions', icon: 'Key' });
    }

    if (hasPermission('RUTAS', 'READ')) {
      nextItems.push({ id: 'citizen-routes', label: 'Rutas Disponibles', path: '/app/citizen-routes', icon: 'Map' });
      nextItems.push({ id: 'citizen-stops', label: 'Paraderos Cercanos', path: '/app/citizen-stops', icon: 'MapPin' });
    }

    if (hasPermission('BOLETOS', 'CREATE')) {
      nextItems.push({ id: 'citizen-boarding', label: 'Abordar Autobús', path: '/app/citizen-boarding', icon: 'CreditCard' });
    }

    if (hasPermission('BOLETOS', 'READ')) {
      nextItems.push({ id: 'citizen-history', label: 'Historial de Viajes', path: '/app/citizen-trips', icon: 'Clock' });
    }

    if (hasPermission('BOLETOS', 'CREATE')) {
      nextItems.push({ id: 'citizen-recharge', label: 'Recargar Tarjeta', path: '/app/citizen-recharge', icon: 'CreditCard' });
    }

    if (hasPermission('TURNOS', 'UPDATE')) {
      nextItems.push({ id: 'driver-shift', label: 'Mi Turno', path: '/app/driver-shift', icon: 'Truck' });
    }

    if (hasPermission('REPORTES', 'READ')) {
      nextItems.push({ id: 'admin-revenue', label: 'Reporte Ingresos', path: '/app/admin-revenue', icon: 'BarChart' });
      nextItems.push({ id: 'admin-demographics', label: 'Demografía Pasajeros', path: '/app/admin-demographics', icon: 'Users' });
    }

    return nextItems;
  }, [hasPermission, navItems]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex min-h-screen">
        <Sidebar isOpen={isSidebarOpen} items={effectiveNavItems} onClose={() => setSidebarOpen(false)} />

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
