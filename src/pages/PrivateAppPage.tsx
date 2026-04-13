import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { SecurityCrudPage } from './SecurityCrudPage';
import { clearSessionToken } from '../services/authService';

export const PrivateAppPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearSessionToken();
    navigate('/login', { replace: true });
  };

  return (
    <MainLayout onLogout={handleLogout}>
      <SecurityCrudPage />
    </MainLayout>
  );
};
