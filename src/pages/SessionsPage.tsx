import { useState } from 'react';
import { SessionForm, SessionTable } from '../components/sessions';
import { Button, Card, ConfirmDialog, Modal } from '../components/ui';
import { useSessions } from '../hooks/useSessions';
import type { CreateSessionInput, Session } from '../types';

export const SessionsPage = () => {
  const { data, loading, error, authError, create, update, remove } = useSessions();

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Session | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Session | null>(null);

  const openCreate = () => {
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: Session) => {
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
    if (!deleteTarget) {
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
        <Button onClick={openCreate} type="button">
          Crear sesion
        </Button>
      </div>

      {authError || error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {authError ?? error?.message}
        </div>
      ) : null}

      <Card>
        <SessionTable data={data} loading={loading} onDelete={setDeleteTarget} onEdit={openEdit} />
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

      <ConfirmDialog
        confirmLabel="Eliminar"
        isOpen={Boolean(deleteTarget)}
        message="Esta accion eliminara la sesion de forma permanente."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        title="Confirmar eliminacion"
      />
    </section>
  );
};
