import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routers/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContextProvider value={{ appName: 'User Management Platform' }}>
          <AppRouter />
        </AppContextProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
