import type { User, UserFormValues } from '../types';

const LATENCY_MS = 700;

let usersDb: User[] = [
  {
    id: 'u-1001',
    name: 'Laura Martinez',
    email: 'laura.martinez@empresa.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'u-1002',
    name: 'Carlos Perez',
    email: 'carlos.perez@empresa.com',
    role: 'operator',
    status: 'inactive',
  },
  {
    id: 'u-1003',
    name: 'Andrea Rojas',
    email: 'andrea.rojas@empresa.com',
    role: 'viewer',
    status: 'active',
  },
];

const delay = <T,>(value: T): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), LATENCY_MS);
  });
};

const cloneUsers = (users: User[]): User[] => users.map((user) => ({ ...user }));

const nextId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `u-${Math.random().toString(36).slice(2, 10)}`;
};

export const userService = {
  async getUsers(): Promise<User[]> {
    return delay(cloneUsers(usersDb));
  },

  async createUser(values: UserFormValues): Promise<User> {
    const newUser: User = {
      id: nextId(),
      ...values,
    };

    usersDb = [newUser, ...usersDb];

    return delay({ ...newUser });
  },

  async updateUser(user: User): Promise<User> {
    usersDb = usersDb.map((current) => (current.id === user.id ? { ...user } : current));

    return delay({ ...user });
  },

  async deleteUser(id: string): Promise<void> {
    usersDb = usersDb.filter((user) => user.id !== id);

    return delay(undefined);
  },
};
