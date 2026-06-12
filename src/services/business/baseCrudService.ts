import { httpClient } from '../../api/httpClient';

export const createCrudService = <T, TCreate, TUpdate extends { id: string | number }>(endpoint: string) => {
  return {
    getAll: () => httpClient.get<T[]>(endpoint),
    getById: (id: string | number) => httpClient.get<T>(`${endpoint}/${id}`),
    create: (dto: TCreate) => httpClient.post<T>(endpoint, dto),
    update: (id: string | number, dto: TUpdate) => httpClient.patch<T>(`${endpoint}/${id}`, dto),
    remove: (id: string | number) => httpClient.delete<void>(`${endpoint}/${id}`),
  };
};
export default createCrudService;
