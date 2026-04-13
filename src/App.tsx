import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './context/AppContext';
import { AppRouter } from './routers/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AppContextProvider value={{ appName: 'User Management Platform' }}>
        <AppRouter />
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;
