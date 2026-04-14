import type { ClipboardEvent, FormEvent } from 'react';
import { Button, Input } from '../ui';

type TwoFactorFormProps = {
	maskedEmail: string;
	code: string;
	loading: boolean;
	expired: boolean;
	remainingSeconds: number;
	message?: string | null;
	onCodeChange: (value: string) => void;
	onSubmit: () => Promise<void>;
	onBackToLogin: () => void;
};

const sanitizeCode = (value: string): string => {
	return value.replace(/\D/g, '').slice(0, 6);
};

export const TwoFactorForm = ({
	maskedEmail,
	code,
	loading,
	expired,
	remainingSeconds,
	message,
	onCodeChange,
	onSubmit,
	onBackToLogin,
}: TwoFactorFormProps) => {
	const canVerify = code.length === 6 && !expired && !loading;

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!canVerify) {
			return;
		}

		await onSubmit();
	};

	const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
		event.preventDefault();
		const pastedText = event.clipboardData.getData('text');
		onCodeChange(sanitizeCode(pastedText));
	};

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<h1 className="text-3xl font-bold text-text-primary">Verificacion de seguridad</h1>
			<p className="text-sm text-text-secondary">Ingrese el codigo de 6 digitos enviado a su email {maskedEmail}</p>

			<Input
				autoComplete="one-time-code"
				helperText="Revisa spam/correo no deseado si no ves el codigo"
				id="two-factor-code"
				inputMode="numeric"
				label="Codigo de verificacion"
				maxLength={6}
				onChange={(event) => onCodeChange(sanitizeCode(event.target.value))}
				onPaste={handlePaste}
				pattern="[0-9]*"
				placeholder="123456"
				type="text"
				value={code}
			/>

			{!expired && (
				<p className="text-sm text-text-secondary">
					Tiempo restante: <span className="font-semibold text-text-primary">{remainingSeconds}s</span>
				</p>
			)}

			{expired && (
				<p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
					Codigo expirado. Vuelve a iniciar sesion.
				</p>
			)}

			{message ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</p> : null}

			<div className="flex flex-wrap gap-3">
				<Button disabled={!canVerify} loading={loading} type="submit">
					Verificar
				</Button>
				<Button onClick={onBackToLogin} type="button" variant="ghost">
					Cambiar cuenta
				</Button>
			</div>
		</form>
	);
};
