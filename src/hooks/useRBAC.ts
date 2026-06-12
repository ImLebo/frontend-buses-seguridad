import { useContext } from 'react';
import { PermissionContext, type PermissionContextValue } from '../contexts/PermissionContext';

export const useRBAC = (): PermissionContextValue => {
  const context = useContext(PermissionContext);

  if (!context) {
    throw new Error('useRBAC debe ser usado dentro de PermissionProvider');
  }

  return context;
};
export type { PermissionContextValue as RBACContextValue };
