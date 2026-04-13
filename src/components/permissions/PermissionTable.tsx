import { Button, Table, type TableColumn } from '../ui';
import type { Permission } from '../../types';

interface PermissionTableProps {
  data: Permission[];
  loading: boolean;
  onEdit: (item: Permission) => void;
  onDelete: (item: Permission) => void;
}

export const PermissionTable = ({ data, loading, onEdit, onDelete }: PermissionTableProps) => {
  const columns: TableColumn<Permission>[] = [
    { key: 'module', header: 'Módulo' },
    { key: 'action', header: 'Acción' },
    { key: 'createdBy', header: 'Creado Por' },
    {
      key: 'isActive',
      header: 'Activo',
      render: (item) => (
        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
          item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {item.isActive ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
      className: 'text-right',
      render: (item) => (
        <div className="flex justify-end gap-2">
          <Button onClick={() => onEdit(item)} size="sm" type="button" variant="ghost">
            <span className="inline-flex items-center gap-1.5">
              <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M14.69 2.86a1.5 1.5 0 0 1 2.12 2.12l-8.48 8.49-3.3.7.7-3.3 8.48-8.5Z" /></svg>
              Editar
            </span>
          </Button>
          <Button onClick={() => onDelete(item)} size="sm" type="button" variant="danger">
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
    return <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">Cargando permisos...</div>;
  }

  if (data.length === 0) {
    return <div className="rounded-lg border border-slate-200 p-4 text-sm text-slate-500">No hay permisos registrados.</div>;
  }

  return <Table columns={columns} data={data} emptyMessage="No hay permisos registrados." rowKey={(row) => row.id} />;
};
