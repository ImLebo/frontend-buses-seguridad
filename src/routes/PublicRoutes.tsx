import { Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { PasswordRecoveryPage } from '../pages/PasswordRecoveryPage';
import { PasswordRecoveryConfirmPage } from '../pages/PasswordRecoveryConfirmPage';
import { TwoFactorPage } from '../pages/TwoFactorPage';
import { RegisterTwoFactorPage } from '../pages/RegisterTwoFactorPage';
import { GoogleCallbackPage } from '../pages/GoogleCallbackPage';
import { GitHubCallbackPage } from '../pages/GitHubCallbackPage';
import { MicrosoftCallbackPage } from '../pages/MicrosoftCallbackPage';

export const PublicRoutes = (
  <>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/password-recovery" element={<PasswordRecoveryPage />} />
    <Route path="/password-recovery/confirm" element={<PasswordRecoveryConfirmPage />} />
    <Route path="/login/2fa" element={<TwoFactorPage />} />
    <Route path="/register/2fa" element={<RegisterTwoFactorPage />} />
    <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
    <Route path="/auth/github/callback" element={<GitHubCallbackPage />} />
    <Route path="/auth/microsoft/callback" element={<MicrosoftCallbackPage />} />
  </>
);
