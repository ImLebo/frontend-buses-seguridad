import { useMemo, useState } from 'react';
import type { User } from '../types';

const seedUsers: User[] = [
  {
    id: 'u-1',
    name: 'Laura Martinez',
    email: 'laura.martinez@empresa.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: 'u-2',
    name: 'Carlos Perez',
    email: 'carlos.perez@empresa.com',
    role: 'operator',
    status: 'inactive',
  },
  {
    id: 'u-3',
    name: 'Andrea Rojas',
    email: 'andrea.rojas@empresa.com',
    role: 'viewer',
    status: 'active',
  },
];

export const useUsers = () => {
  const [users] = useState<User[]>(seedUsers);

  const metrics = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === 'active').length,
      inactive: users.filter((user) => user.status === 'inactive').length,
    };
  }, [users]);

  return {
    users,
    metrics,
  };
};
