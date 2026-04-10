import { Table, type TableColumn } from '../ui';
import type { User } from '../../types';
import { BadgeStatus } from './shared';
import { Button } from '../ui';

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const LoadingState = () => {
  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="animate-pulse space-y-3">
        <div className="h-8 rounded bg-slate-100" />
        <div className="h-8 rounded bg-slate-100" />
        <div className="h-8 rounded bg-slate-100" />
      </div>
    </div>
  );
};

export const UserTable = ({ users, loading = false, onEdit, onDelete }: UserTableProps) => {
  const columns: TableColumn<User>[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Rol' },
    {
      key: 'status',
      header: 'Estado',
      render: (user) => <BadgeStatus status={user.status} />,
    },
    {
      key: 'actions',
      header: 'Acciones',
      render: (user) => (
        <div className="flex gap-2">
          <Button onClick={() => onEdit(user)} size="sm" type="button" variant="ghost">
            Editar
          </Button>
          <Button onClick={() => onDelete(user)} size="sm" type="button" variant="danger">
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingState />;
  }

  return <Table columns={columns} data={users} emptyMessage="No hay usuarios para mostrar." rowKey={(user) => user.id} />;
};
