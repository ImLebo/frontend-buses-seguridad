import { useMemo, useState, type FormEvent } from 'react';
import type { CreateRoleInput, Role } from '../../types';
import { Button, Input } from '../ui';

interface RoleFormProps {
  mode: 'create' | 'edit';
  initialValues?: Role;
  submitting?: boolean;
  onSubmit: (values: CreateRoleInput) => Promise<void> | void;
  onCancel: () => void;
}

export const RoleForm = ({ mode, initialValues, submitting = false, onSubmit, onCancel }: RoleFormProps) => {
  const [values, setValues] = useState<CreateRoleInput>({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
  });
  const [touched, setTouched] = useState({ name: false, description: false });

  const errors = useMemo(() => {
    return {
      name: values.name.trim() ? '' : 'El nombre es obligatorio.',
      description: values.description.trim() ? '' : 'La descripcion es obligatoria.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, description: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.name ? errors.name : undefined}
        id="role-name"
        label="Nombre"
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        placeholder="ADMIN"
        value={values.name}
      />

      <Input
        error={touched.description ? errors.description : undefined}
        id="role-description"
        label="Descripcion"
        onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, description: event.target.value }))}
        placeholder="Rol administrador"
        value={values.description}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear rol' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
