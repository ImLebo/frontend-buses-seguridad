import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '../ui';

type RegisterFormProps = {
  loading: boolean;
  onSubmit: (payload: { name: string; email: string; password: string }) => Promise<void>;
};

export const RegisterForm = ({ loading, onSubmit }: RegisterFormProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos una letra mayúscula';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password = 'La contraseña debe contener al menos un carácter especial (!@#$%^&*()_+-=[]{}|;:\'",./<>?)';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const canSubmit = name.trim() && email.trim() && password && confirmPassword && !loading;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm() || !canSubmit) {
      return;
    }

    await onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        autoComplete="name"
        id="name"
        label="Nombre completo"
        onChange={(event) => setName(event.target.value)}
        placeholder="Ingresa tu nombre completo"
        required
        type="text"
        value={name}
        error={errors.name}
      />
      <Input
        autoComplete="email"
        id="email"
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="usuario@correo.com"
        required
        type="email"
        value={email}
        error={errors.email}
      />
      <Input
        autoComplete="new-password"
        id="password"
        label="Contraseña"
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Ingresa tu contraseña"
        required
        type="password"
        value={password}
        error={errors.password}
        helperText="Mínimo 8 caracteres, al menos una mayúscula y un carácter especial"
      />
      <Input
        autoComplete="new-password"
        id="confirmPassword"
        label="Confirmar contraseña"
        onChange={(event) => setConfirmPassword(event.target.value)}
        placeholder="Confirma tu contraseña"
        required
        type="password"
        value={confirmPassword}
        error={errors.confirmPassword}
      />
      <Button
        className="w-full"
        disabled={!canSubmit}
        loading={loading}
        type="submit"
      >
        Crear cuenta
      </Button>
    </form>
  );
};