import { useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Input } from '../ui';

type PasswordRecoveryFormProps = {
	loading: boolean;
	error?: string | null;
	success?: string | null;
	onSubmit: (email: string) => Promise<void>;
};

export const PasswordRecoveryForm = ({ loading, error, success, onSubmit }: PasswordRecoveryFormProps) => {
	const [email, setEmail] = useState('');

	const canSubmit = email.trim().length > 0 && !loading;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canSubmit) {
			return;
		}

		await onSubmit(email.trim());
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

			{success ? (
				<p className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
					{success}
				</p>
			) : null}

			{error ? (
				<p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
					{error}
				</p>
			) : null}

			<Button className="w-full" disabled={!canSubmit} loading={loading} size="lg" type="submit">
				Enviar código de recuperación
			</Button>
		</form>
	);
};