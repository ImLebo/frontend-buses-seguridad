import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button, Input } from '../ui';

type PasswordRecoveryConfirmFormProps = {
	loading: boolean;
	error?: string | null;
	success?: string | null;
	onSubmit: (code: string, newPassword: string) => Promise<void>;
};

// Validación de política de contraseña
const validatePassword = (password: string): string | null => {
	if (password.length < 8) {
		return 'La contraseña debe tener al menos 8 caracteres';
	}

	if (!/[A-Z]/.test(password)) {
		return 'La contraseña debe contener al menos una letra mayúscula';
	}

	if (!/[a-z]/.test(password)) {
		return 'La contraseña debe contener al menos una letra minúscula';
	}

	if (!/\d/.test(password)) {
		return 'La contraseña debe contener al menos un número';
	}

	if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
		return 'La contraseña debe contener al menos un carácter especial';
	}

	return null;
};

export const PasswordRecoveryConfirmForm = ({ loading, error, success, onSubmit }: PasswordRecoveryConfirmFormProps) => {
	const [code, setCode] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [passwordError, setPasswordError] = useState<string | null>(null);

	const canSubmit = code.trim().length > 0 && newPassword.length > 0 && confirmPassword.length > 0 && !loading && !passwordError;

	const handlePasswordChange = (password: string) => {
		setNewPassword(password);
		const validationError = validatePassword(password);
		setPasswordError(validationError);
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			return;
		}

		if (newPassword !== confirmPassword) {
			setPasswordError('Las contraseñas no coinciden');
			return;
		}

		await onSubmit(code.trim(), newPassword);
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<Input
				id="code"
				label="Código de recuperación"
				onChange={(event) => setCode(event.target.value)}
				placeholder="Ingresa el código recibido"
				required
				type="text"
				value={code}
			/>

			<Input
				autoComplete="new-password"
				id="newPassword"
				label="Nueva contraseña"
				onChange={(event) => handlePasswordChange(event.target.value)}
				placeholder="Ingresa tu nueva contraseña"
				required
				type="password"
				value={newPassword}
			/>

			<Input
				autoComplete="new-password"
				id="confirmPassword"
				label="Confirmar contraseña"
				onChange={(event) => setConfirmPassword(event.target.value)}
				placeholder="Confirma tu nueva contraseña"
				required
				type="password"
				value={confirmPassword}
			/>

			{/* Indicadores de política de contraseña */}
			<div className="text-xs text-gray-600 space-y-1">
				<p className="font-medium">La contraseña debe contener:</p>
				<ul className="list-disc list-inside space-y-1 ml-2">
					<li className={newPassword.length >= 8 ? 'text-green-600' : ''}>Al menos 8 caracteres</li>
					<li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>Una letra mayúscula</li>
					<li className={/[a-z]/.test(newPassword) ? 'text-green-600' : ''}>Una letra minúscula</li>
					<li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>Un número</li>
					<li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword) ? 'text-green-600' : ''}>Un carácter especial</li>
				</ul>
			</div>

			{success ? (
				<p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					{success}
				</p>
			) : null}

			{error || passwordError ? (
				<p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error || passwordError}
				</p>
			) : null}

			<Button className="w-full" disabled={!canSubmit} loading={loading} size="lg" type="submit">
				Cambiar contraseña
			</Button>
		</form>
	);
};