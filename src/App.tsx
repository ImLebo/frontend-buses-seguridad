import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { AppContextProvider } from './context/AppContext';
import { RolesPage } from './pages/RolesPage';
import { PermissionsPage } from './pages/PermissionsPage';
import { RolePermissionsPage } from './pages/RolePermissionsPage';
import { UsersPage } from './pages/UsersPage';
import { ProfilesPage } from './pages/ProfilesPage';
import { SessionsPage } from './pages/SessionsPage';
import { SecurityCrudPage } from './pages/SecurityCrudPage';

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider value={{ appName: 'User Management Platform' }}>
        <MainLayout>
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
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
