import { useMemo, useState, type FormEvent } from 'react';
import type { CreateSessionInput, Session } from '../../types';
import { Button, Input } from '../ui';

interface SessionFormProps {
  mode: 'create' | 'edit';
  initialValues?: Session;
  submitting?: boolean;
  onSubmit: (values: CreateSessionInput) => Promise<void> | void;
  onCancel: () => void;
}

export const SessionForm = ({ mode, initialValues, submitting = false, onSubmit, onCancel }: SessionFormProps) => {
  const [values, setValues] = useState<CreateSessionInput>({
    token: initialValues?.token ?? '',
    expiration: initialValues?.expiration ?? '',
    code2FA: initialValues?.code2FA ?? '',
  });

  const [touched, setTouched] = useState({ token: false, expiration: false, code2FA: false });

  const errors = useMemo(() => {
    return {
      token: values.token.trim() ? '' : 'El token es obligatorio.',
      expiration: values.expiration.trim() ? '' : 'La expiracion es obligatoria.',
      code2FA: values.code2FA.trim() ? '' : 'El codigo 2FA es obligatorio.',
    };
  }, [values]);

  const isValid = Object.values(errors).every((error) => error.length === 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched({ token: true, expiration: true, code2FA: true });

    if (!isValid) {
      return;
    }

    await onSubmit({
      token: values.token.trim(),
      expiration: values.expiration.trim(),
      code2FA: values.code2FA.trim(),
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        error={touched.token ? errors.token : undefined}
        id="session-token"
        label="Token"
        onBlur={() => setTouched((prev) => ({ ...prev, token: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, token: event.target.value }))}
        placeholder="JWT o token"
        value={values.token}
      />

      <Input
        error={touched.expiration ? errors.expiration : undefined}
        id="session-expiration"
        label="Expiracion"
        onBlur={() => setTouched((prev) => ({ ...prev, expiration: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, expiration: event.target.value }))}
        placeholder="2026-12-31T23:59:59Z"
        value={values.expiration}
      />

      <Input
        error={touched.code2FA ? errors.code2FA : undefined}
        id="session-code"
        label="Codigo 2FA"
        onBlur={() => setTouched((prev) => ({ ...prev, code2FA: true }))}
        onChange={(event) => setValues((prev) => ({ ...prev, code2FA: event.target.value }))}
        placeholder="123456"
        value={values.code2FA}
      />

      <div className="flex justify-end gap-2">
        <Button onClick={onCancel} type="button" variant="ghost">
          Cancelar
        </Button>
        <Button disabled={!isValid || submitting} loading={submitting} type="submit">
          {mode === 'create' ? 'Crear sesion' : 'Guardar cambios'}
        </Button>
      </div>
    </form>
  );
};
