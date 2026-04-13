import { Button, Table, type TableColumn } from '../ui';
import type { User } from '../../types';

interface UserTableProps {
  data: User[];
  loading: boolean;
  onEdit: (item: User) => void;
  onDelete: (item: User) => void;
  onAssignRoles?: (item: User) => void;
}

const LoadingRows = () => {
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

export const UserTable = ({ data, loading, onEdit, onDelete, onAssignRoles }: UserTableProps) => {
  const columns: TableColumn<User>[] = [
    { key: 'name', header: 'Nombre' },
    { key: 'email', header: 'Email' },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: (user) => (
        <div className="flex justify-end gap-2">
          {onAssignRoles && (
            <Button onClick={() => onAssignRoles(user)} size="sm" type="button" variant="secondary">
              <span className="inline-flex items-center gap-1.5">
                <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm-4 9a6 6 0 0 0-6 6v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2a6 6 0 0 0-6-6h-4zm9-1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" /></svg>
                Roles
              </span>
            </Button>
          )}
          <Button onClick={() => onEdit(user)} size="sm" type="button" variant="ghost">
            <span className="inline-flex items-center gap-1.5">
              <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M14.69 2.86a1.5 1.5 0 0 1 2.12 2.12l-8.48 8.49-3.3.7.7-3.3 8.48-8.5Z" /></svg>
              Editar
            </span>
          </Button>
          <Button onClick={() => onDelete(user)} size="sm" type="button" variant="danger">
            <span className="inline-flex items-center gap-1.5">
              <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M8 2a1 1 0 0 0-1 1v1H4.5a.5.5 0 0 0 0 1h.54l.76 10.18A2 2 0 0 0 7.8 17h4.4a2 2 0 0 0 1.99-1.82L14.95 5h.55a.5.5 0 1 0 0-1H13V3a1 1 0 0 0-1-1H8Zm1 2V3h2v1H9Z" /></svg>
              Eliminar
            </span>
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return <LoadingRows />;
  }

  return <Table columns={columns} data={data} emptyMessage="No hay usuarios registrados." rowKey={(row) => row.id} />;
};
