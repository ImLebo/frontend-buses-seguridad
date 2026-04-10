import { useMemo, useState } from 'react';
import { cn } from '../utils/cn';
import { PermissionsPage } from './PermissionsPage';
import { ProfilesPage } from './ProfilesPage';
import { RolePermissionsPage } from './RolePermissionsPage';
import { RolesPage } from './RolesPage';
import { SessionsPage } from './SessionsPage';
import { UsersPage } from './UsersPage';

type CrudSection =
  | 'users'
  | 'profiles'
  | 'roles'
  | 'permissions'
  | 'sessions'
  | 'rolePermissions';

const sectionLabels: Record<CrudSection, string> = {
  users: 'Users',
  profiles: 'Profiles',
  roles: 'Roles',
  permissions: 'Permissions',
  sessions: 'Sessions',
  rolePermissions: 'RolePermissions',
};

export const SecurityCrudPage = () => {
  const [activeSection, setActiveSection] = useState<CrudSection>('users');

  const content = useMemo(() => {
    switch (activeSection) {
      case 'profiles':
        return <ProfilesPage />;
      case 'roles':
        return <RolesPage />;
      case 'permissions':
        return <PermissionsPage />;
      case 'sessions':
        return <SessionsPage />;
      case 'rolePermissions':
        return <RolePermissionsPage />;
      case 'users':
      default:
        return <UsersPage />;
    }
  }, [activeSection]);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Consola operativa</p>
        <h2 className="mt-2 text-xl font-semibold text-text-primary lg:text-2xl">MS Security CRUD Console</h2>
        <p className="mt-2 max-w-3xl text-sm text-text-secondary">
          Gestion modular de entidades principales con hooks y servicios desacoplados.
        </p>
      </section>

      <nav className="grid gap-2 rounded-2xl border border-border bg-white p-3 sm:grid-cols-3 lg:grid-cols-6">
        {(Object.keys(sectionLabels) as CrudSection[]).map((section) => (
          <button
            className={cn(
              'rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200',
              activeSection === section
                ? 'bg-primary text-white shadow-sm'
                : 'bg-slate-100 text-text-secondary hover:bg-slate-200',
            )}
            key={section}
            onClick={() => setActiveSection(section)}
            type="button"
          >
            {sectionLabels[section]}
          </button>
        ))}
      </nav>

      {content}
    </div>
  );
};
