import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

export interface NavItem {
  id: string;
  label: string;
  path?: string;
  active?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ items, isOpen = false, onClose }: SidebarProps) => {
  const location = useLocation();

  // Rutas por defecto si no se proporcionan items
  const defaultItems: NavItem[] = [
    { id: 'console', label: 'Console', path: '/' },
    { id: 'roles', label: 'Roles', path: '/roles' },
    { id: 'permissions', label: 'Permissions', path: '/permissions' },
    { id: 'users', label: 'Usuarios', path: '/users' },
    { id: 'profiles', label: 'Profiles', path: '/profiles' },
    { id: 'sessions', label: 'Sessions', path: '/sessions' },
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
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-blue-900/50 bg-primary px-4 py-5 text-slate-100 transition-transform duration-200 md:static md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="mb-6 border-b border-blue-800/60 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Navegacion</p>
          <p className="mt-2 text-sm text-blue-100">Panel administrativo corporativo</p>
        </div>

        <nav>
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === (item.path || `/${item.id}`);
              const href = item.path || `/${item.id}`;

              return (
                <li key={item.id}>
                  <Link
                    to={href}
                    onClick={onClose}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-all duration-200 no-underline',
                      isActive
                        ? 'bg-white/12 text-white shadow-sm'
                        : 'text-blue-100/90 hover:bg-white/10 hover:text-white',
                    )}
                  >
                    <span className="inline-flex h-2 w-2 rounded-full bg-secondary" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};
