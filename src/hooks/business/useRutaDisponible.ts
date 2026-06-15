import { useState, useEffect, useCallback } from 'react';
import type { RutaDisponible } from '../../models';
import { rutaService } from '../../services/business/rutaService';

export const useRutaDisponible = (nombreFilter?: string) => {
  const [data, setData] = useState<RutaDisponible[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDisponibles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await rutaService.getDisponibles(nombreFilter);
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar rutas disponibles');
    } finally {
      setLoading(false);
    }
  }, [nombreFilter]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchDisponibles();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [fetchDisponibles]);

  return {
    data,
    loading,
    error,
    refetch: fetchDisponibles,
  };
};

export default useRutaDisponible;
