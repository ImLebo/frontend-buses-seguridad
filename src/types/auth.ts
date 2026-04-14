export type LoginRequest = {
	email: string;
	password: string;
};

export type RegisterRequest = {
	name: string;
	email: string;
	password: string;
};

export type LoginChallenge = {
	sessionId: string;
	expiresAt: number;
	remainingAttempts: number;
	maskedEmail: string;
};

export type LoginResponse =
	| {
			requires2FA: true;
			token?: never;
			sessionId: string;
			expiresAt: number;
			remainingAttempts: number;
			maskedEmail: string;
			message?: string;
		}
	| {
			requires2FA: false;
			token: string;
			sessionId?: never;
			expiresAt?: never;
			remainingAttempts?: never;
			maskedEmail?: never;
			message?: string;
		};

export type RegisterResponse = LoginResponse;

export type VerifyTwoFactorRequest = {
	sessionId: string;
	code: string;
};

export type VerifyTwoFactorResponse = {
	token: string;
	requires2FA: false;
	message: string;
};
