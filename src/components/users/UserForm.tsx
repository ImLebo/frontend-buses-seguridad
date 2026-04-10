import { useMemo, useState, type FormEvent } from 'react';
import type { CreateUserInput, User } from '../../types';
import { Button, Input } from '../ui';

interface UserFormProps {
  mode: 'create' | 'edit';
  initialValues?: User;
  submitting?: boolean;
  onSubmit: (values: CreateUserInput) => Promise<void> | void;
  onCancel: () => void;
}

const isValidEmail = (value: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
};

export const UserForm = ({ mode, initialValues, submitting = false, onSubmit, onCancel }: UserFormProps) => {
  const [values, setValues] = useState<CreateUserInput>({
    name: initialValues?.name ?? '',
    email: initialValues?.email ?? '',
    password: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  const errors = useMemo(() => {
    return {
      name: values.name.trim() ? '' : 'El nombre es obligatorio.',
      email: !values.email.trim()
        ? 'El correo es obligatorio.'
        : isValidEmail(values.email)
          ? ''
          : 'Ingresa un correo valido.',
      password:
        mode === 'create' && !values.password?.trim()
          ? 'La contrasena es obligatoria en creacion.'
          : '',
    };
  }, [mode, values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ name: true, email: true, password: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      password: values.password?.trim() || undefined,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.name ? errors.name : undefined}
        id="user-name"
        label="Nombre"
        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, name: event.target.value }))}
        placeholder="Nombre completo"
        value={values.name}
      />

      <Input
        error={touched.email ? errors.email : undefined}
        id="user-email"
        label="Email"
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, email: event.target.value }))}
        placeholder="usuario@empresa.com"
        type="email"
        value={values.email}
      />

      <Input
        error={touched.password ? errors.password : undefined}
        helperText={mode === 'edit' ? 'Deja este campo vacio para mantener la contrasena actual.' : undefined}
        id="user-password"
        label="Contrasena"
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, password: event.target.value }))}
        placeholder={mode === 'create' ? 'Contrasena de acceso' : 'Nueva contrasena (opcional)'}
        type="password"
        value={values.password ?? ''}
      />

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
