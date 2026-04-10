import { useState } from 'react';
import { PermissionForm, PermissionTable } from '../components/permissions';
import { Button, Card, ConfirmDialog, Modal } from '../components/ui';
import { usePermissions } from '../hooks/usePermissions';
import type { CreatePermissionInput, Permission } from '../types';

export const PermissionsPage = () => {
  const { data, loading, error, create, update, remove } = usePermissions();

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Permission | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Permission | null>(null);

  const openCreate = () => {
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: Permission) => {
    setSelected(item);
    setMode('edit');
    setFormOpen(true);
  };

  const closeForm = () => {
    if (submitting) {
      return;
    }
    setFormOpen(false);
    setSelected(null);
  };

  const handleSubmit = async (values: CreatePermissionInput) => {
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await create(values);
      } else if (selected) {
        await update({ ...selected, ...values });
      }
      closeForm();
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    await remove(deleteTarget.id);
    setDeleteTarget(null);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Permissions</h2>
          <p className="text-sm text-slate-600">CRUD completo de permissions.</p>
        </div>
        <Button onClick={openCreate} type="button">
          Crear permiso
        </Button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <Card>
        <PermissionTable data={data} loading={loading} onDelete={setDeleteTarget} onEdit={openEdit} />
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={mode === 'create' ? 'Crear permiso' : 'Editar permiso'}>
        <PermissionForm
          key={selected?.id ?? 'create'}
          initialValues={selected ?? undefined}
          mode={mode}
          onCancel={closeForm}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Modal>

      <ConfirmDialog
        confirmLabel="Eliminar"
        isOpen={Boolean(deleteTarget)}
        message="Esta accion eliminara el permiso de forma permanente."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        title="Confirmar eliminacion"
      />
    </section>
  );
};
