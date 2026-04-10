import { MainLayout } from './components/layout';
import { AppContextProvider } from './context/AppContext';
import { SecurityCrudPage } from './pages/SecurityCrudPage';

function App() {
  return (
    <AppContextProvider value={{ appName: 'User Management Platform' }}>
      <MainLayout>
        <SecurityCrudPage />
      </MainLayout>
    </AppContextProvider>
  );
}

export default App;
