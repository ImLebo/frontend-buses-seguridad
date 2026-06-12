import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionProvider>
          <AppContextProvider value={{ appName: 'User Management Platform' }}>
            <AppRoutes />
          </AppContextProvider>
        </PermissionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
