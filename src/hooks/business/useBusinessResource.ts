import { useState, useEffect, useCallback } from 'react';

export const useBusinessResource = <T, TCreate, TUpdate extends { id: string | number }>(
  service: {
    getAll: () => Promise<T[]>;
    getById: (id: string | number) => Promise<T>;
    create: (dto: TCreate) => Promise<T>;
    update: (id: string | number, dto: TUpdate) => Promise<T>;
    remove: (id: string | number) => Promise<void>;
  }
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await service.getAll();
      setData(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const create = async (dto: TCreate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.create(dto);
      setData((prev) => [...prev, result]);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string | number, dto: TUpdate) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.update(id, dto);
      setData((prev) => prev.map((item: any) => {
        const itemId = item.id ?? item.bus_id ?? item.persona_id ?? item.ciudadano_id ?? item.conductor_id;
        return itemId === id ? result : item;
      }));
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      await service.remove(id);
      setData((prev) => prev.filter((item: any) => {
        const itemId = item.id ?? item.bus_id ?? item.persona_id ?? item.ciudadano_id ?? item.conductor_id;
        return itemId !== id;
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    refetch: fetchAll,
    create,
    update,
    remove,
  };
};
export default useBusinessResource;
