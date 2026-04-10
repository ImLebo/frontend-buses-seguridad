import { useEffect, useMemo, useState } from 'react';
import { UserFilters, UserForm, UserTable } from '../components/users';
import { Button, Card, Modal } from '../components/ui';
import { userService } from '../services/userService';
import type { User, UserFilters as UserFiltersValues, UserFormValues } from '../types';

const initialFilters: UserFiltersValues = {
  search: '',
  role: 'all',
  status: 'all',
};

const initialFormValues: UserFormValues = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
};

export const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [filters, setFilters] = useState<UserFiltersValues>(initialFilters);
  const [isFormOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await userService.getUsers();
      setUsers(result);
    } catch {
      setErrorMessage('No fue posible cargar los usuarios. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const search = filters.search.toLowerCase();

    return users.filter((user) => {
      const bySearch =
        search.length === 0 ||
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);
      const byRole = filters.role === 'all' || user.role === filters.role;
      const byStatus = filters.status === 'all' || user.status === filters.status;

      return bySearch && byRole && byStatus;
    });
  }, [users, filters]);

  const metrics = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === 'active').length,
      inactive: users.filter((user) => user.status === 'inactive').length,
    };
  }, [users]);

  const openCreateModal = () => {
    setSelectedUser(null);
    setFormMode('create');
    setFormOpen(true);
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setFormMode('edit');
    setFormOpen(true);
  };

  const closeFormModal = () => {
    if (isFormSubmitting) {
      return;
    }

    setFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = async (values: UserFormValues) => {
    setIsFormSubmitting(true);
    setErrorMessage(null);

    try {
      if (formMode === 'create') {
        await userService.createUser(values);
      } else if (selectedUser) {
        await userService.updateUser({
          ...selectedUser,
          ...values,
        });
      }

      await loadUsers();
      setFormOpen(false);
      setSelectedUser(null);
    } catch {
      setErrorMessage('No fue posible guardar los cambios. Intenta de nuevo.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  const openDeleteModal = (user: User) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    setErrorMessage(null);

    try {
      await userService.deleteUser(deleteTarget.id);
      await loadUsers();
      closeDeleteModal();
    } catch {
      setErrorMessage('No fue posible eliminar el usuario. Intenta de nuevo.');
    }
  };

  const formValues: UserFormValues = selectedUser
    ? {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        status: selectedUser.status,
      }
    : initialFormValues;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Gestion de usuarios</h2>
          <p className="text-sm text-slate-600">Administra altas, ediciones y bajas con una arquitectura modular escalable.</p>
        </div>
        <Button onClick={openCreateModal} type="button">
          Crear usuario
        </Button>
      </section>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {errorMessage}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <Card title="Usuarios totales">
          <p className="text-2xl font-semibold text-slate-900">{metrics.total}</p>
        </Card>
        <Card title="Activos">
          <p className="text-2xl font-semibold text-emerald-700">{metrics.active}</p>
        </Card>
        <Card title="Inactivos">
          <p className="text-2xl font-semibold text-slate-700">{metrics.inactive}</p>
        </Card>
      </section>

      <UserFilters onChange={setFilters} value={filters} />

      <Card description="Vista tabular para operaciones administrativas masivas." title="Tabla de usuarios">
        <UserTable loading={loading} onDelete={openDeleteModal} onEdit={openEditModal} users={filteredUsers} />
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeFormModal} title={formMode === 'create' ? 'Crear usuario' : 'Editar usuario'}>
        <UserForm
          key={selectedUser?.id ?? 'create'}
          initialValues={formValues}
          mode={formMode}
          onCancel={closeFormModal}
          onSubmit={handleFormSubmit}
          submitting={isFormSubmitting}
        />
      </Modal>

      <Modal isOpen={isDeleteOpen} onClose={closeDeleteModal} title="Confirmar eliminacion">
        <div className="space-y-4">
          <p className="text-sm text-slate-700">¿Estas seguro de eliminar este usuario? Esta accion no se puede deshacer.</p>
          {deleteTarget ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="font-medium text-slate-900">{deleteTarget.name}</p>
              <p className="text-slate-600">{deleteTarget.email}</p>
            </div>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button onClick={closeDeleteModal} type="button" variant="ghost">
              Cancelar
            </Button>
            <Button onClick={confirmDelete} type="button" variant="danger">
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
