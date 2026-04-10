import { useMemo, useState, type FormEvent } from 'react';
import type { UserFormValues, UserStatus } from '../../types';
import { Button, Input } from '../ui';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialValues?: UserFormValues;
  submitting?: boolean;
  onCancel?: () => void;
  onSubmit: (values: UserFormValues) => Promise<void> | void;
}

const roleOptions = ['admin', 'operator', 'viewer'];
const statusOptions: UserStatus[] = ['active', 'inactive'];

const defaultValues: UserFormValues = {
  name: '',
  email: '',
  role: 'viewer',
  status: 'active',
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const UserForm = ({ mode, initialValues = defaultValues, submitting = false, onCancel, onSubmit }: UserFormProps) => {
  const [values, setValues] = useState<UserFormValues>(initialValues);
  const [touched, setTouched] = useState<Record<keyof UserFormValues, boolean>>({
    name: false,
    email: false,
    role: false,
    status: false,
  });

  const errors = useMemo(() => {
    return {
      name: values.name.trim() ? '' : 'El nombre es obligatorio.',
      email: !values.email.trim() ? 'El correo es obligatorio.' : isValidEmail(values.email) ? '' : 'Ingresa un correo valido.',
      role: values.role.trim() ? '' : 'El rol es obligatorio.',
      status: values.status ? '' : 'El estado es obligatorio.',
    } satisfies Record<keyof UserFormValues, string>;
  }, [values]);

  const isValid = Object.values(errors).every((value) => value.length === 0);

  const updateField = <K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
  };

  const handleBlur = (key: keyof UserFormValues) => {
    setTouched((previous) => ({ ...previous, [key]: true }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      role: true,
      status: true,
    });

    if (!isValid) {
      return;
    }

    await onSubmit(values);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.name ? errors.name : undefined}
        id="user-name"
        label="Nombre"
        onBlur={() => handleBlur('name')}
        onChange={(event) => updateField('name', event.target.value)}
        placeholder="Nombre completo"
        value={values.name}
      />
      <Input
        error={touched.email ? errors.email : undefined}
        id="user-email"
        label="Correo"
        onBlur={() => handleBlur('email')}
        onChange={(event) => updateField('email', event.target.value)}
        placeholder="correo@empresa.com"
        type="email"
        value={values.email}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1.5 text-sm font-medium text-slate-700" htmlFor="user-role">
          Rol
          <select
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="user-role"
            onBlur={() => handleBlur('role')}
            onChange={(event) => updateField('role', event.target.value)}
            value={values.role}
          >
            {roleOptions.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          {touched.role && errors.role ? <p className="text-sm text-red-600">{errors.role}</p> : null}
        </label>

        <label className="space-y-1.5 text-sm font-medium text-slate-700" htmlFor="user-status">
          Estado
          <select
            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            id="user-status"
            onBlur={() => handleBlur('status')}
            onChange={(event) => updateField('status', event.target.value as UserStatus)}
            value={values.status}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {touched.status && errors.status ? <p className="text-sm text-red-600">{errors.status}</p> : null}
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
