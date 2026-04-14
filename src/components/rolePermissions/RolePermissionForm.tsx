import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useRoles } from '../../hooks/useRoles';
import type { CreateRolePermissionInput, RolePermission } from '../../types';
import { Button, Select } from '../ui';

interface RolePermissionFormProps {
  mode: 'create' | 'edit';
  initialValues?: RolePermission;
  submitting?: boolean;
  onSubmit: (values: CreateRolePermissionInput) => Promise<void> | void;
  onCancel: () => void;
}

export const RolePermissionForm = ({
  mode,
  initialValues,
  submitting = false,
  onSubmit,
  onCancel,
}: RolePermissionFormProps) => {
  const { data: roles, loading: rolesLoading, getAll: getAllRoles } = useRoles();
  const { data: permissions, loading: permissionsLoading, getAll: getAllPermissions } = usePermissions();

  const [values, setValues] = useState<CreateRolePermissionInput>({
    role: { id: initialValues?.role.id ?? '' },
    permission: { id: initialValues?.permission.id ?? '' },
  });

  const [touched, setTouched] = useState({ roleId: false, permissionId: false });

  useEffect(() => {
    getAllRoles();
    getAllPermissions();
  }, [getAllRoles, getAllPermissions]);

  const roleOptions = useMemo(() => {
    return roles.map((role) => ({
      value: role.id,
      label: role.name,
    }));
  }, [roles]);

  const permissionOptions = useMemo(() => {
    return permissions.map((permission) => ({
      value: permission.id,
      label: permission.module && permission.action
        ? `${permission.module} - ${permission.action}`
        : permission.url && permission.method
        ? `${permission.method} ${permission.url}`
        : `Permiso ${permission.id}`,
    }));
  }, [permissions]);

  const errors = useMemo(() => {
    return {
      roleId: values.role.id.trim() ? '' : 'Debe seleccionar un rol.',
      permissionId: values.permission.id.trim() ? '' : 'Debe seleccionar un permiso.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ roleId: true, permissionId: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      role: { id: values.role.id.trim() },
      permission: { id: values.permission.id.trim() },
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select
        error={touched.roleId ? errors.roleId : undefined}
        id="rp-role-id"
        label="Rol"
        onBlur={() => setTouched((prev) => ({ ...prev, roleId: true }))}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, role: { id: event.target.value } }))
        }
        options={roleOptions}
        value={values.role.id}
        disabled={rolesLoading}
      />

      <Select
        error={touched.permissionId ? errors.permissionId : undefined}
        id="rp-permission-id"
        label="Permiso"
        onBlur={() => setTouched((prev) => ({ ...prev, permissionId: true }))}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, permission: { id: event.target.value } }))
        }
        options={permissionOptions}
        value={values.permission.id}
        disabled={permissionsLoading}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting || rolesLoading || permissionsLoading} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear relación' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
