import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { PasswordRecoveryConfirmForm } from '../components/auth/PasswordRecoveryConfirmForm';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';

export const PasswordRecoveryConfirmPage = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();
	const { loading, error, success, confirmRecovery } = usePasswordRecovery();
	const [email, setEmail] = useState('');

	useEffect(() => {
		const emailParam = searchParams.get('email');
		if (emailParam) {
			setEmail(decodeURIComponent(emailParam));
		} else {
			// Si no hay email, redirigir a la página de solicitud
			navigate('/password-recovery', { replace: true });
		}
	}, [searchParams, navigate]);

	const handleSubmit = async (code: string, newPassword: string) => {
		await confirmRecovery(email, code, newPassword);
	};

	const handleSuccess = useCallback(() => {
		// Después de éxito, redirigir al login después de un delay
		setTimeout(() => {
			navigate('/login', { replace: true });
		}, 3000);
	}, [navigate]);

	useEffect(() => {
		if (success) {
			handleSuccess();
		}
	}, [success, handleSuccess]);

	if (!email) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
			{/* Background con gradiente moderno */}
			<div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />

			{/* Elementos decorativos */}
			<div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse" />
			<div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000" />
			<div className="absolute top-1/2 left-1/4 w-16 h-16 bg-indigo-200 rounded-full opacity-20 animate-pulse delay-500" />

			<section className="w-full max-w-md">
				{/* Header con logo */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl shadow-lg mb-4">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Confirmar recuperación</h1>
					<p className="text-gray-600">Ingresa el código y tu nueva contraseña</p>
				</div>

				<div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
					<div className="text-center mb-6">
						<p className="text-xs font-semibold uppercase tracking-wider text-green-600 mb-1">Código de Verificación</p>
						<h2 className="text-xl font-semibold text-gray-900">Cambiar contraseña</h2>
						<p className="text-sm text-gray-600 mt-2">
							Email: <span className="font-medium">{email}</span>
						</p>
					</div>

					<div className="mb-6">
						<PasswordRecoveryConfirmForm
							error={error}
							loading={loading}
							success={success}
							onSubmit={handleSubmit}
						/>
					</div>

					<div className="text-center space-y-2">
						<Link
							to="/password-recovery"
							className="text-sm text-blue-600 hover:text-blue-800 font-medium block"
						>
							¿No recibiste el código? Reenviar
						</Link>
						<Link
							to="/login"
							className="text-sm text-gray-600 hover:text-gray-800 font-medium block"
						>
							← Volver al inicio de sesión
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};