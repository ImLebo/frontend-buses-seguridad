import type { ReactNode } from 'react';
import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { RolesPage } from './RolesPage';
import { PermissionsPage } from './PermissionsPage';
import { RolePermissionsPage } from './RolePermissionsPage';
import { UsersPage } from './UsersPage';
import { ProfilesPage } from './ProfilesPage';
import { SessionsPage } from './SessionsPage';
import { CitizenRoutesPage } from './CitizenRoutesPage';
import { CitizenStopsPage } from './CitizenStopsPage';
import { CitizenBoardingPage } from './CitizenBoardingPage';
import { CitizenTripHistoryPage } from './CitizenTripHistoryPage';
import { DriverShiftPage } from './DriverShiftPage';
import { AdminRouteCreatePage } from './AdminRouteCreatePage';
import { AdminStopCreatePage } from './AdminStopCreatePage';
import { AdminScheduleCreatePage } from './AdminScheduleCreatePage';
import { CompanyBusCreatePage } from './CompanyBusCreatePage';
import { CitizenRechargePage } from './CitizenRechargePage';
import { AdminRevenueReportPage } from './AdminRevenueReportPage';
import { AdminAgeDemographicsPage } from './AdminAgeDemographicsPage';
import { useRBAC } from '../hooks/useRBAC';
import { useCurrentUserInfo } from '../hooks/useCurrentUserInfo';
import { clearSessionToken } from '../services/authService';

type PermissionGateProps = {
  module: string;
  action: string;
  children: ReactNode;
};

const PermissionGate = ({ module, action, children }: PermissionGateProps) => {
  const { loading, hasPermission } = useRBAC();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Validando permisos...</div>;
  }

  if (!hasPermission(module, action)) {
    return <Navigate replace to="/app/unauthorized" />;
  }

  return <>{children}</>;
};

const UnauthorizedPage = () => {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
      <h2 className="text-lg font-semibold">Acceso denegado</h2>
      <p className="mt-2 text-sm">No tienes permisos para acceder a este módulo.</p>
    </section>
  );
};

export const PrivateAppPage = () => {
  const navigate = useNavigate();
  const { hasPermission, loading: rbacLoading } = useRBAC();
  const { currentUserInfo, loading: userLoading } = useCurrentUserInfo();

  const getDefaultAuthorizedPath = () => {
    // 1) First check by role for direct redirection
    const role = currentUserInfo?.role || currentUserInfo?.roles?.[0];
    if (role) {
      const normalizedRole = role.trim().toLowerCase();
      if (normalizedRole === 'administrador sistema' || normalizedRole === 'admin') {
        return '/app/users';
      }
      if (
        normalizedRole === 'ciudadano' ||
        normalizedRole === 'conductor' ||
        normalizedRole === 'supervisor' ||
        normalizedRole === 'administrador empresa'
      ) {
        return '/app/citizen-routes';
      }
    }

    // 2) Fallback to permission checks
    if (hasPermission('USUARIOS', 'READ')) {
      return '/app/users';
    }
    if (hasPermission('ROLES', 'READ')) {
      return '/app/roles';
    }
    if (hasPermission('PERMISOS', 'READ')) {
      return '/app/permissions';
    }
    if (hasPermission('RUTAS', 'READ')) {
      return '/app/citizen-routes';
    }

    return '/app/unauthorized';
  };

  const handleLogout = () => {
    clearSessionToken();
    navigate('/login', { replace: true });
  };

  if (rbacLoading || userLoading) {
    return <div className="flex items-center justify-center min-h-screen">Cargando aplicación...</div>;
  }

  return (
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultAuthorizedPath()} replace />} />
        <Route path="/roles" element={<PermissionGate module="ROLES" action="READ"><RolesPage /></PermissionGate>} />
        <Route path="/permissions" element={<PermissionGate module="PERMISOS" action="READ"><PermissionsPage /></PermissionGate>} />
        <Route path="/role-permissions" element={<PermissionGate module="PERMISOS" action="READ"><RolePermissionsPage /></PermissionGate>} />
        <Route path="/users" element={<PermissionGate module="USUARIOS" action="READ"><UsersPage /></PermissionGate>} />
        <Route path="/profiles" element={<PermissionGate module="USUARIOS" action="READ"><ProfilesPage /></PermissionGate>} />
        <Route path="/sessions" element={<PermissionGate module="USUARIOS" action="READ"><SessionsPage /></PermissionGate>} />
        <Route path="/admin-routes/new" element={<PermissionGate module="RUTAS" action="CREATE"><AdminRouteCreatePage /></PermissionGate>} />
        <Route path="/admin-stops/new" element={<PermissionGate module="RUTAS" action="CREATE"><AdminStopCreatePage /></PermissionGate>} />
        <Route path="/company-buses/new" element={<PermissionGate module="BUSES" action="CREATE"><CompanyBusCreatePage /></PermissionGate>} />
        <Route path="/admin-schedules/new" element={<PermissionGate module="PROGRAMACION" action="CREATE"><AdminScheduleCreatePage /></PermissionGate>} />
        <Route path="/citizen-routes" element={<PermissionGate module="RUTAS" action="READ"><CitizenRoutesPage /></PermissionGate>} />
        <Route path="/citizen-stops" element={<PermissionGate module="RUTAS" action="READ"><CitizenStopsPage /></PermissionGate>} />
        <Route path="/citizen-boarding" element={<PermissionGate module="BOLETOS" action="CREATE"><CitizenBoardingPage /></PermissionGate>} />
        <Route path="/citizen-trips" element={<PermissionGate module="BOLETOS" action="READ"><CitizenTripHistoryPage /></PermissionGate>} />
        <Route path="/citizen-recharge" element={<PermissionGate module="BOLETOS" action="CREATE"><CitizenRechargePage /></PermissionGate>} />
        <Route path="/admin-revenue" element={<PermissionGate module="REPORTES" action="READ"><AdminRevenueReportPage /></PermissionGate>} />
        <Route path="/admin-demographics" element={<PermissionGate module="REPORTES" action="READ"><AdminAgeDemographicsPage /></PermissionGate>} />
        <Route path="/driver-shift" element={<PermissionGate module="TURNOS" action="UPDATE"><DriverShiftPage /></PermissionGate>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<Navigate to={getDefaultAuthorizedPath()} replace />} />
      </Routes>
    </MainLayout>
  );
};
