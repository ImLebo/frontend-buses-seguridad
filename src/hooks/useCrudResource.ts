import { useCallback, useEffect, useState } from 'react';

interface CrudResourceConfig<T, TCreate, TUpdate extends { id: string }> {
  getAll: () => Promise<T[]>;
  create: (input: TCreate) => Promise<T>;
  update: (input: TUpdate) => Promise<T>;
  remove: (id: string) => Promise<void>;
}

export const useCrudResource = <T extends { id: string }, TCreate, TUpdate extends { id: string }>(
  config: CrudResourceConfig<T, TCreate, TUpdate>,
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await config.getAll();
      setData(response);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No fue posible cargar los datos.');
    } finally {
      setLoading(false);
    }
  }, [config]);

  const create = async (input: TCreate) => {
    setError(null);

    try {
      const created = await config.create(input);
      setData((previous) => [created, ...previous]);
      return created;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No fue posible crear el registro.');
      throw caughtError;
    }
  };

  const update = async (input: TUpdate) => {
    setError(null);

    try {
      const updated = await config.update(input);
      setData((previous) => previous.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No fue posible actualizar el registro.');
      throw caughtError;
    }
  };

  const remove = async (id: string) => {
    setError(null);

    try {
      await config.remove(id);
      setData((previous) => previous.filter((item) => item.id !== id));
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'No fue posible eliminar el registro.');
      throw caughtError;
    }
  };

  useEffect(() => {
    void getAll();
  }, [getAll]);

  return {
    data,
    loading,
    error,
    getAll,
    create,
    update,
    remove,
  };
};
