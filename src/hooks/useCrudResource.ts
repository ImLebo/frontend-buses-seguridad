import { useCallback, useEffect, useState } from 'react';
import type { ApiError } from '../services/api';

interface CrudResourceConfig<T, TCreate, TUpdate extends { id: string }> {
  getAll: () => Promise<T[]>;
  create: (input: TCreate) => Promise<T>;
  update: (input: TUpdate) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export interface CrudError {
  message: string;
  status?: number;
  isForbidden?: boolean;
  isAuthError?: boolean;
}

export const useCrudResource = <T extends { id: string }, TCreate, TUpdate extends { id: string }>(
  config: CrudResourceConfig<T, TCreate, TUpdate>,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<CrudError | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const isAuthStatus = (status?: number): boolean => status === 401 || status === 403;

  const getAuthErrorMessage = (status?: number): string => {
    if (status === 401) {
      return 'No estas autenticado. Inicia sesion nuevamente.';
    }

    return 'No estas autorizado para realizar esta accion.';
  };

  const getAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setAuthError(null);

    try {
      const response = await config.getAll();
      setData(response);
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      const status = apiError?.status;
      const isForbidden = status === 403;
      const isAuthError = isAuthStatus(status);
      const message = apiError.message || 'No fue posible cargar los datos.';
      
      setError({
        message,
        status,
        isForbidden,
        isAuthError,
      });

      if (isAuthError) {
        setAuthError(getAuthErrorMessage(status));
      }
    } finally {
      setLoading(false);
    }
  }, [config]);

  const create = async (input: TCreate) => {
    setError(null);
    setAuthError(null);

    try {
      const created = await config.create(input);
      setData((previous) => [created, ...previous]);
      return created;
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      const status = apiError?.status;
      const isForbidden = status === 403;
      const isAuthError = isAuthStatus(status);
      const message = apiError.message || 'No fue posible crear el registro.';
      
      setError({
        message,
        status,
        isForbidden,
        isAuthError,
      });

      if (isAuthError) {
        setAuthError(getAuthErrorMessage(status));
      }

      throw caughtError;
    }
  };

  const update = async (input: TUpdate) => {
    setError(null);
    setAuthError(null);

    try {
      const updated = await config.update(input);
      setData((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      const status = apiError?.status;
      const isForbidden = status === 403;
      const isAuthError = isAuthStatus(status);
      const message = apiError.message || 'No fue posible actualizar el registro.';
      
      setError({
        message,
        status,
        isForbidden,
        isAuthError,
      });

      if (isAuthError) {
        setAuthError(getAuthErrorMessage(status));
      }

      throw caughtError;
    }
  };

  const remove = async (id: string) => {
    setError(null);
    setAuthError(null);

    try {
      await config.remove(id);
      setData((previous) => previous.filter((item) => item.id !== id));
    } catch (caughtError) {
      const apiError = caughtError as ApiError;
      const status = apiError?.status;
      const isForbidden = status === 403;
      const isAuthError = isAuthStatus(status);
      const message = apiError.message || 'No fue posible eliminar el registro.';
      
      setError({
        message,
        status,
        isForbidden,
        isAuthError,
      });

      if (isAuthError) {
        setAuthError(getAuthErrorMessage(status));
      }

      throw caughtError;
    }
  };

  const clearError = useCallback(() => {
    setError(null);
    setAuthError(null);
  }, []);

  useEffect(() => {
    void getAll();
  }, [getAll]);

  return {
    data,
    loading,
    error,
    authError,
    getAll,
    create,
    update,
    remove,
    clearError,
  };
};
