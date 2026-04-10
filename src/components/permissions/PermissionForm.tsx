import { useMemo, useState, type FormEvent } from 'react';
import type { CreatePermissionInput, Permission } from '../../types';
import { Button, Input } from '../ui';

interface PermissionFormProps {
  mode: 'create' | 'edit';
  initialValues?: Permission;
  submitting?: boolean;
  onSubmit: (values: CreatePermissionInput) => Promise<void> | void;
  onCancel: () => void;
}

export const PermissionForm = ({ mode, initialValues, submitting = false, onSubmit, onCancel }: PermissionFormProps) => {
  const [values, setValues] = useState<CreatePermissionInput>({
    url: initialValues?.url ?? '',
    method: initialValues?.method ?? 'GET',
    model: initialValues?.model ?? '',
  });

  const [touched, setTouched] = useState({ url: false, method: false, model: false });

  const errors = useMemo(() => {
    return {
      url: values.url.trim() ? '' : 'La URL es obligatoria.',
      method: values.method.trim() ? '' : 'El metodo es obligatorio.',
      model: values.model.trim() ? '' : 'El modelo es obligatorio.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ url: true, method: true, model: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      url: values.url.trim(),
      method: values.method.trim().toUpperCase(),
      model: values.model.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.url ? errors.url : undefined}
        id="permission-url"
        label="URL"
        onBlur={() => setTouched((prev) => ({ ...prev, url: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, url: event.target.value }))}
        placeholder="/users"
        value={values.url}
      />

      <Input
        error={touched.method ? errors.method : undefined}
        id="permission-method"
        label="Metodo"
        onBlur={() => setTouched((prev) => ({ ...prev, method: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, method: event.target.value }))}
        placeholder="GET"
        value={values.method}
      />

      <Input
        error={touched.model ? errors.model : undefined}
        id="permission-model"
        label="Modelo"
        onBlur={() => setTouched((prev) => ({ ...prev, model: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, model: event.target.value }))}
        placeholder="User"
        value={values.model}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear permiso' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
