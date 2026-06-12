import { httpClient } from '../api/httpClient';
import { ENDPOINTS } from '../api/endpoints';
import type { UserWithRolesResponse } from '../models';

export const usersQueryService = {
  search: (query: string) =>
    httpClient.get<UserWithRolesResponse[]>(`${ENDPOINTS.USERS_QUERY.BASE}?q=${encodeURIComponent(query)}`),
};
