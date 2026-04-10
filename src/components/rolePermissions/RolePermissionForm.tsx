import { useMemo, useState, type FormEvent } from 'react';
import type { CreateRolePermissionInput, RolePermission } from '../../types';
import { Button, Input } from '../ui';

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
  const [values, setValues] = useState<CreateRolePermissionInput>({
    role: { id: initialValues?.role.id ?? '' },
    permission: { id: initialValues?.permission.id ?? '' },
  });

  const [touched, setTouched] = useState({ roleId: false, permissionId: false });

  const errors = useMemo(() => {
    return {
      roleId: values.role.id.trim() ? '' : 'El role id es obligatorio.',
      permissionId: values.permission.id.trim() ? '' : 'El permission id es obligatorio.',
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
      <Input
        error={touched.roleId ? errors.roleId : undefined}
        id="rp-role-id"
        label="Role ID"
        onBlur={() => setTouched((prev) => ({ ...prev, roleId: true }))}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, role: { id: event.target.value } }))
        }
        placeholder="role-id"
        value={values.role.id}
      />

      <Input
        error={touched.permissionId ? errors.permissionId : undefined}
        id="rp-permission-id"
        label="Permission ID"
        onBlur={() => setTouched((prev) => ({ ...prev, permissionId: true }))}
        onChange={(event) =>
          setValues((prev) => ({ ...prev, permission: { id: event.target.value } }))
        }
        placeholder="permission-id"
        value={values.permission.id}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear relacion' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
