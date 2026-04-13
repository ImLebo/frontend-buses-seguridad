import { useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { SecurityCrudPage } from './SecurityCrudPage';
import { RolesPage } from './RolesPage';
import { PermissionsPage } from './PermissionsPage';
import { RolePermissionsPage } from './RolePermissionsPage';
import { UsersPage } from './UsersPage';
import { ProfilesPage } from './ProfilesPage';
import { SessionsPage } from './SessionsPage';
import { clearSessionToken } from '../services/authService';

export const PrivateAppPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSessionToken();
    navigate('/login', { replace: true });
  };

  return (
    <MainLayout onLogout={handleLogout}>
      <Routes>
        <Route path="/" element={<SecurityCrudPage />} />
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/permissions" element={<PermissionsPage />} />
        <Route path="/role-permissions" element={<RolePermissionsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/profiles" element={<ProfilesPage />} />
        <Route path="/sessions" element={<SessionsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
};
