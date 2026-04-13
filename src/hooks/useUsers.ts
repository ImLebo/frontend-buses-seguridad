import type { CreateUserInput, UpdateUserInput, User } from '../types';
import { userService } from '../services/userService';
import { useCrudResource } from './useCrudResource';
import { useEffect, useState, useCallback } from 'react';

export const useUsers = () => {
  return useCrudResource<User, CreateUserInput, UpdateUserInput>(userService);
};

export const useUserSearch = (query: string) => {
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await userService.searchUsers(searchQuery);
      setResults(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en la búsqueda');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(query);
  }, [query, search]);

  return { results, loading, error, search };
};

