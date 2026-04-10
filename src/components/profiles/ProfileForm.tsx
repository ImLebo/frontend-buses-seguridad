import { useMemo, useState, type FormEvent } from 'react';
import type { CreateProfileInput, Profile } from '../../types';
import { Button, Input } from '../ui';

interface ProfileFormProps {
  mode: 'create' | 'edit';
  initialValues?: Profile;
  submitting?: boolean;
  onSubmit: (values: CreateProfileInput) => Promise<void> | void;
  onCancel: () => void;
}

export const ProfileForm = ({ mode, initialValues, submitting = false, onSubmit, onCancel }: ProfileFormProps) => {
  const [values, setValues] = useState<CreateProfileInput>({
    phone: initialValues?.phone ?? '',
    photo: initialValues?.photo ?? '',
  });

  const [touched, setTouched] = useState({ phone: false, photo: false });

  const errors = useMemo(() => {
    return {
      phone: values.phone.trim() ? '' : 'El telefono es obligatorio.',
      photo: values.photo.trim() ? '' : 'La URL de foto es obligatoria.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ phone: true, photo: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      phone: values.phone.trim(),
      photo: values.photo.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.phone ? errors.phone : undefined}
        id="profile-phone"
        label="Telefono"
        onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, phone: event.target.value }))}
        placeholder="3001234567"
        value={values.phone}
      />

      <Input
        error={touched.photo ? errors.photo : undefined}
        id="profile-photo"
        label="URL foto"
        onBlur={() => setTouched((prev) => ({ ...prev, photo: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, photo: event.target.value }))}
        placeholder="https://..."
        value={values.photo}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear profile' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
