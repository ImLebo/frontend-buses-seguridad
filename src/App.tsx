import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { AppRouter } from './routers/AppRouter';

function App() {
  return (
    <AppContextProvider value={{ appName: 'User Management Platform' }}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppContextProvider>
  );
}

export default App;
