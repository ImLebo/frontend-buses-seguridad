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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="space-y-8 p-6 lg:p-8">
        {/* Header Section */}
        <section className="rounded-3xl border border-white/20 bg-white/90 backdrop-blur-sm p-8 shadow-2xl shadow-indigo-500/10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold uppercase tracking-wider text-indigo-600">Consola Operativa</p>
                <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  MS Security CRUD Console
                </h1>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  Gestión modular de entidades principales con hooks y servicios desacoplados para máxima seguridad y eficiencia.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 border border-green-200">
                <p className="text-xs font-semibold text-green-700">Sistema Activo</p>
                <p className="text-sm font-bold text-green-800">v2.0</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Usuarios</p>
                <p className="text-2xl font-bold text-gray-900">1,234</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Roles</p>
                <p className="text-2xl font-bold text-gray-900">56</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Permisos</p>
                <p className="text-2xl font-bold text-gray-900">89</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm p-6 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx={12} cy={12} r={10} />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sesiones</p>
                <p className="text-2xl font-bold text-gray-900">342</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="rounded-2xl border border-white/20 bg-white/90 backdrop-blur-sm p-4 shadow-xl shadow-indigo-500/5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {(Object.keys(sectionLabels) as CrudSection[]).map((section) => (
              <button
                className={cn(
                  'rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 border',
                  activeSection === section
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 border-indigo-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:shadow-md hover:border-gray-300',
                )}
                key={section}
                onClick={() => setActiveSection(section)}
                type="button"
              >
                {sectionLabels[section]}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="rounded-3xl border border-white/20 bg-white/90 backdrop-blur-sm shadow-2xl shadow-indigo-500/10 overflow-hidden">
          {content}
        </div>
      </div>
    </div>
  );
};
