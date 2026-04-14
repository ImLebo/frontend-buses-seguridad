import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface NavItem {
  id: string;
  label: string;
  path?: string;
  active?: boolean;
  icon?: string;
}

interface SidebarProps {
  items: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ items, isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();

  // Función para renderizar iconos
  const renderIcon = (iconName?: string) => {
    const iconClass = "h-5 w-5";
    switch (iconName) {
      case 'LayoutDashboard':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        );
      case 'Shield':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'Key':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        );
      case 'Users':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        );
      case 'UserCheck':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
          </svg>
        );
      case 'Clock':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx={12} cy={12} r={10} />
            <polyline points="12,6 12,12 16,14" />
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  // Rutas por defecto si no se proporcionan items
  const defaultItems: NavItem[] = [
    { id: 'console', label: 'Dashboard', path: '/app/', icon: 'LayoutDashboard' },
    { id: 'roles', label: 'Roles', path: '/app/roles', icon: 'Shield' },
    { id: 'permissions', label: 'Permisos', path: '/app/permissions', icon: 'Key' },
    { id: 'users', label: 'Usuarios', path: '/app/users', icon: 'Users' },
    { id: 'profiles', label: 'Perfiles', path: '/app/profiles', icon: 'UserCheck' },
    { id: 'sessions', label: 'Sesiones', path: '/app/sessions', icon: 'Clock' },
  ];

  const navItems = items.length > 0 ? items : defaultItems;

  return (
    <>
      <div
        className={cn(
          'fixed inset-0 z-30 bg-slate-950/40 transition-opacity md:hidden',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-white/20 bg-white/95 backdrop-blur-xl shadow-xl transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">MS Security</p>
                <p className="text-sm text-gray-600">Panel Administrativo</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === (item.path || `/${item.id}`);
                const href = item.path || `/${item.id}`;

                return (
                  <li key={item.id}>
                    <Link
                      to={href}
                      onClick={onClose}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-200 no-underline',
                        isActive
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-200/50'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      <div className={cn(
                        'flex h-8 w-8 items-center justify-center rounded-lg',
                        isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'
                      )}>
                        {renderIcon(item.icon)}
                      </div>
                      <span>{item.label}</span>
                      {isActive && (
                        <div className="ml-auto h-2 w-2 rounded-full bg-indigo-500"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200/50 p-4">
            <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-3">
              <p className="text-xs text-indigo-600 font-medium">Sistema Seguro</p>
              <p className="text-xs text-gray-600 mt-1">Versión 2.0</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
