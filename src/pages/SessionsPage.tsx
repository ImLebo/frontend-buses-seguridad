import { useState } from 'react';
import { SessionForm, SessionTable } from '../components/sessions';
import { Button, Card, ConfirmDialog, Modal } from '../components/ui';
import { useRBAC } from '../hooks/useRBAC';
import { useSessions } from '../hooks/useSessions';
import type { CreateSessionRequest as CreateSessionInput, Session } from '../models';

export const SessionsPage = () => {
  const { data, loading, error, authError, create, update, remove } = useSessions();
  const { hasPermission } = useRBAC();
  const canCreate = hasPermission('USUARIOS', 'CREATE');
  const canUpdate = hasPermission('USUARIOS', 'UPDATE');
  const canDelete = hasPermission('USUARIOS', 'DELETE');

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  const openCreate = () => {
    if (!canCreate) {
      return;
    }
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: Session) => {
    if (!canUpdate) {
      return;
    }
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

  const handleSubmit = async (values: CreateSessionInput) => {
    if ((mode === 'create' && !canCreate) || (mode === 'edit' && !canUpdate)) {
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'create') {
        await create(values);
      } else if (selected) {
        await update({ ...selected, ...values });
      }
      closeForm();
    } catch (err) {
      // Error manejado por el hook.
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !canDelete) {
      return;
    }
    try {
      await remove(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      // Error manejado por el hook.
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Sessions</h2>
          <p className="text-sm text-slate-600">CRUD completo de sessions.</p>
        </div>
        {canCreate ? (
          <Button onClick={openCreate} type="button">
            Crear sesion
          </Button>
        ) : null}
      </div>

      {authError || error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {authError ?? error?.message}
        </div>
      ) : null}

      <Card>
        <SessionTable
          data={data}
          loading={loading}
          onDelete={canDelete ? setDeleteTarget : undefined}
          onEdit={canUpdate ? openEdit : undefined}
        />
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={mode === 'create' ? 'Crear sesion' : 'Editar sesion'}>
        {authError || error ? (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {authError ?? error?.message}
          </div>
        ) : null}
        <SessionForm
          key={selected?.id ?? 'create'}
          initialValues={selected ?? undefined}
          mode={mode}
          onCancel={closeForm}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Modal>

      {canDelete ? (
        <ConfirmDialog
          confirmLabel="Eliminar"
          isOpen={Boolean(deleteTarget)}
          message="Esta accion eliminara la sesion de forma permanente."
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => void confirmDelete()}
          title="Confirmar eliminacion"
        />
      ) : null}
    </section>
  );
};
