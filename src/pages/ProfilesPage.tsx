import { useState } from 'react';
import { ProfileForm, ProfileTable } from '../components/profiles';
import { Button, Card, ConfirmDialog, Modal } from '../components/ui';
import { useProfiles } from '../hooks/useProfiles';
import type { CreateProfileInput, Profile } from '../types';

export const ProfilesPage = () => {
  const { data, loading, error, create, update, remove } = useProfiles();

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<Profile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const openCreate = () => {
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: Profile) => {
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

  const handleSubmit = async (values: CreateProfileInput) => {
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
          <h2 className="text-xl font-semibold text-slate-900">Profiles</h2>
          <p className="text-sm text-slate-600">CRUD completo de profiles.</p>
        </div>
        <Button onClick={openCreate} type="button">
          Crear profile
        </Button>
      </div>

      {error ? <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <Card>
        <ProfileTable data={data} loading={loading} onDelete={setDeleteTarget} onEdit={openEdit} />
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={mode === 'create' ? 'Crear profile' : 'Editar profile'}>
        <ProfileForm
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
        message="Esta accion eliminara el profile de forma permanente."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        title="Confirmar eliminacion"
      />
    </section>
  );
};
