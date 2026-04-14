import { Link } from 'react-router-dom';
import { PasswordRecoveryForm } from '../components/auth/PasswordRecoveryForm';
import { usePasswordRecovery } from '../hooks/usePasswordRecovery';

export const PasswordRecoveryPage = () => {
	const { loading, error, success, requestRecovery } = usePasswordRecovery();

	const handleSubmit = async (email: string) => {
		await requestRecovery(email);
	};

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
					<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
						<svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Recuperar contraseña</h1>
					<p className="text-gray-600">Ingresa tu email para recibir un código de recuperación</p>
				</div>

				<div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl p-8">
					<div className="text-center mb-6">
						<p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">Recuperación Segura</p>
						<h2 className="text-xl font-semibold text-gray-900">Restablecer contraseña</h2>
					</div>

					<div className="mb-6">
						<PasswordRecoveryForm
							error={error}
							loading={loading}
							success={success}
							onSubmit={handleSubmit}
						/>
					</div>

					<div className="text-center">
						<Link
							to="/login"
							className="text-sm text-blue-600 hover:text-blue-800 font-medium"
						>
							← Volver al inicio de sesión
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
};