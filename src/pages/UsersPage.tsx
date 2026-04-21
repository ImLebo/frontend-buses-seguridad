import { useEffect, useState } from 'react';
import { Alert, Button, Card, ConfirmDialog, Input, Modal } from '../components/ui';
import { UserForm } from '../components/users/UserForm';
import { UserTable } from '../components/users/UserTable';
import { useRoles } from '../hooks/useRoles';
import { useUsers, useUserSearch } from '../hooks/useUsers';
import { userService } from '../services/userService';
import type { CreateUserInput, Role, User } from '../types';

export const UsersPage = () => {
  // CRUD básico
  const { data, loading, error, authError, create, update, remove, clearError } = useUsers();
  const { data: roles } = useRoles();

  const [isFormOpen, setFormOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  // Gestión de roles
  const [searchQuery, setSearchQuery] = useState('');
  const { results: searchResults } = useUserSearch(searchQuery);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<User | null>(null);
  const [_userRoles, setUserRoles] = useState<Role[]>([]);  // TODO: use in UI
  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [roleError, setRoleError] = useState<string | null>(null);

  // Cargar roles del usuario cuando se selecciona
  useEffect(() => {
    if (selectedUserForRoles) {
      loadUserRoles(selectedUserForRoles.id);
    }
  }, [selectedUserForRoles]);

  const loadUserRoles = async (userId: string) => {
    try {
      setLoadingRoles(true);
      setRoleError(null);
      const info = await userService.getUserWithRoles(userId);
      if (info) {
        setUserRoles(info.roles);
        setSelectedRoleIds(info.roles.map((r: Role) => r.id));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los roles del usuario';
      console.error('Error cargando roles del usuario', err);
      setRoleError(errorMessage);
    } finally {
      setLoadingRoles(false);
    }
  };

  // ... métodos CRUD existentes ...

  const openCreate = () => {
    clearError();
    setSelected(null);
    setMode('create');
    setFormOpen(true);
  };

  const openEdit = (item: User) => {
    clearError();
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
    clearError();
  };

  const handleSubmit = async (values: CreateUserInput) => {
    setSubmitting(true);
    try {
      if (mode === 'create') {
        await create(values);
      } else if (selected) {
        await update({ ...selected, ...values });
      }
      closeForm();
    } catch (err) {
      // El hook (`useCrudResource`) ya deja el mensaje en `error/authError` para mostrarlo en UI.
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

  // Nuevos métodos para gestión de roles
  const handleOpenRoleModal = (user: User) => {
    setSelectedUserForRoles(user);
    setRoleError(null);
    setIsRoleModalOpen(true);
  };

  const handleSaveRoles = async () => {
    if (!selectedUserForRoles) {
      setRoleError('Error: Usuario no seleccionado');
      return;
    }

    if (!selectedUserForRoles.id) {
      setRoleError('Error: ID de usuario no válido. Intente nuevamente.');
      return;
    }

    if (selectedRoleIds.length === 0) {
      setRoleError('Por favor, seleccione al menos un rol');
      return;
    }

    try {
      setLoadingRoles(true);
      setRoleError(null);
      console.log('Guardando roles para usuario:', selectedUserForRoles.id);
      console.log('Roles a asignar:', selectedRoleIds);

      const response = await userService.updateRoles(selectedUserForRoles.id, selectedRoleIds);

      console.log('Respuesta del servidor:', response);

      // Mostrar éxito
      setIsRoleModalOpen(false);
      setSelectedUserForRoles(null);
      setSelectedRoleIds([]);

      // Recargar usuarios después de 1 segundo
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('Error guardando roles:', err);
      const apiError = err as any;
      const status = apiError?.status as number | undefined;
      const isAuthError = status === 401 || status === 403;
      
      if (isAuthError) {
        setRoleError('No estas autorizado para asignar roles a este usuario');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido al guardar los roles';
        setRoleError(errorMessage);
      }
    } finally {
      setLoadingRoles(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const displayUsers = searchQuery ? searchResults : data;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Usuarios</h2>
          <p className="text-sm text-slate-600">Gestión de usuarios y asignación de roles.</p>
        </div>
        <Button onClick={openCreate} type="button">
          Crear usuario
        </Button>
      </div>

      {authError && (
        <Alert
          type="error"
          title="Acceso Denegado"
          message={authError}
          onClose={() => clearError()}
          autoClose={true}
          autoCloseDuration={7000}
        />
      )}

      {error && !authError && (
        <Alert
          type="error"
          title="Error"
          message={error.message || 'Ocurrió un error al cargar los datos'}
          onClose={() => clearError()}
          autoClose={false}
        />
      )}

      <Card>
        <div className="space-y-4">
          <Input
            id="search-users"
            label="Buscar usuario"
            placeholder="Nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <UserTable
            data={displayUsers}
            loading={loading}
            onDelete={setDeleteTarget}
            onEdit={openEdit}
            onAssignRoles={handleOpenRoleModal}
          />
        </div>
      </Card>

      <Modal isOpen={isFormOpen} onClose={closeForm} title={mode === 'create' ? 'Crear usuario' : 'Editar usuario'} size="md">
        {authError && (
          <Alert
            type="error"
            title="Acceso Denegado"
            message={authError}
            onClose={() => clearError()}
            autoClose={true}
            autoCloseDuration={7000}
          />
        )}

        {error && !authError && (
          <Alert
            type="error"
            title="Error"
            message={error.message || 'Ocurrió un error al procesar la solicitud'}
            onClose={() => clearError()}
            autoClose={false}
          />
        )}

        <UserForm
          key={selected?.id ?? 'create'}
          initialValues={selected ?? undefined}
          mode={mode}
          onCancel={closeForm}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Modal>

      <Modal isOpen={isRoleModalOpen} onClose={() => setIsRoleModalOpen(false)} title="Asignar Roles" size="md">
        {selectedUserForRoles && (
          <div className="space-y-4 max-h-[calc(90vh-150px)] overflow-y-auto">
            {roleError && (
              <Alert
                type="error"
                title="Error"
                message={roleError}
                onClose={() => setRoleError(null)}
                autoClose={false}
              />
            )}

            <div className="rounded-lg bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{selectedUserForRoles.name}</p>
              <p className="text-sm text-slate-600">{selectedUserForRoles.email}</p>
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-900">Roles Disponibles</h3>
              <div className="max-h-48 overflow-y-auto space-y-2 border border-slate-200 rounded-lg p-2">
                {roles.map((role: Role) => (
                  <label key={role.id} className="flex items-center gap-2 p-2 rounded hover:bg-slate-100 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedRoleIds.includes(role.id)}
                      onChange={() => toggleRole(role.id)}
                      disabled={loadingRoles}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                    />
                    <span className="text-sm text-slate-700">{role.name}</span>
                    <span className="text-xs text-slate-500">({role.description})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-semibold">Información:</p>
              <p>
                Roles seleccionados: <strong>{selectedRoleIds.length}</strong>
              </p>
              <p>El usuario recibirá un email con los cambios realizados.</p>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 sticky bottom-0 bg-white">
              <Button
                onClick={() => setIsRoleModalOpen(false)}
                type="button"
                variant="ghost"
                disabled={loadingRoles}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveRoles}
                type="button"
                disabled={loadingRoles}
                loading={loadingRoles}
              >
                Guardar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        confirmLabel="Eliminar"
        isOpen={Boolean(deleteTarget)}
        message="Esta acción eliminará el usuario de forma permanente."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void confirmDelete()}
        title="Confirmar eliminación"
      />
    </section>
  );
};
