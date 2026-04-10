import { MainLayout } from './components/layout';
import { AppContextProvider } from './context/AppContext';
import { UsersPage } from './pages';

function App() {
  return (
    <AppContextProvider value={{ appName: 'User Management Platform' }}>
      <MainLayout>
        <UsersPage />
      </MainLayout>
    </AppContextProvider>
  );
}

export default App;
