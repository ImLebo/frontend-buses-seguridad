import { useEffect, useState } from 'react';
import { RoleForm, RoleTable } from '../components/roles';
import { Button, Card, ConfirmDialog, Modal } from '../components/ui';
import { useRoles } from '../hooks/useRoles';
import type { CreateRoleInput, Role } from '../types';

export const RolesPage = () => {
  const { data, loading, error, create, update, remove, getAll: fetchRoles } = useRoles();

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Role | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Role | null>(null);

  // Cargar roles al montar el componente
  useEffect(() => {
    void fetchRoles();
  }, [fetchRoles]);

  const openCreate = () => {
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: Role) => {
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

  const handleSubmit = async (values: CreateRoleInput) => {
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
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      // Error manejado por el hook
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Roles</h2>
          <p className="text-sm text-slate-600">
            Gestión completa de roles con permisos granulares por módulo y acción.
          </p>
        </div>
        <Button onClick={openCreate} type="button">
          Crear rol
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Card>
        <RoleTable data={data} loading={loading} onDelete={setDeleteTarget} onEdit={openEdit} />
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={mode === 'create' ? 'Crear rol' : 'Editar rol'} size="lg">
        <RoleForm
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
        message={
          deleteTarget
            ? `Esta acción eliminará el rol "${deleteTarget.name}" de forma permanente.`
            : 'Esta acción eliminará el rol de forma permanente.'
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        title="Confirmar eliminación"
      />
    </section>
  );
};
