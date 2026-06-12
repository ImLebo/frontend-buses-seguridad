import { createContext, useContext } from 'react';

interface AppContextValue {
  appName: string;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppContextProvider = AppContext.Provider;

export const useAppContext = (): AppContextValue => {
  const value = useContext(AppContext);

  if (!value) {
    throw new Error('useAppContext must be used inside AppContextProvider');
  }

  return value;
};
