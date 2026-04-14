import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Input } from '../ui';

type LoginFormProps = {
	loading: boolean;
	error?: string | null;
	onSubmit: (payload: { email: string; password: string }) => Promise<void>;
};

export const LoginForm = ({ loading, error, onSubmit }: LoginFormProps) => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const canSubmit = email.trim().length > 0 && password.length > 0;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit || loading) {
			return;
		}

		await onSubmit({
			email: email.trim(),
			password,
		});
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<Input
				autoComplete="email"
				id="email"
				label="Email"
				onChange={(event) => setEmail(event.target.value)}
				placeholder="usuario@correo.com"
				required
				type="email"
				value={email}
			/>
			<Input
				autoComplete="current-password"
				id="password"
				label="Contrasena"
				onChange={(event) => setPassword(event.target.value)}
				placeholder="Ingresa tu contrasena"
				required
				type="password"
				value={password}
			/>

			{error ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

			<Button className="w-full" disabled={!canSubmit} loading={loading} size="lg" type="submit">
				Ingresar
			</Button>
		</form>
	);
};
