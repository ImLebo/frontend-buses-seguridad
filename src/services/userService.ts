import type { CreateUserInput, UpdateUserInput, User } from '../types';
import { apiRequest } from './api';

export const userService = {
  getAll: () => apiRequest<User[]>('/users'),
  create: (input: CreateUserInput) => apiRequest<User>('/users', { method: 'POST', body: input }),
  update: (input: UpdateUserInput) => apiRequest<User>(`/users/${input.id}`, { method: 'PUT', body: input }),
  remove: (id: string) => apiRequest<void>(`/users/${id}`, { method: 'DELETE' }),
};
