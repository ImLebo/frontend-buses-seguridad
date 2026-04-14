import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TwoFactorForm } from '../components/auth';
import {
  clearLoginChallenge,
  getLoginChallenge,
  isApiError,
  saveSessionToken,
  verifyTwoFactorCode,
} from '../services/authService';

const calculateRemainingSeconds = (expiresAt: number): number => {
  return Math.floor((expiresAt - Date.now()) / 1000);
};

export const TwoFactorPage = () => {
  const navigate = useNavigate();
  const challenge = useMemo(() => getLoginChallenge(), []);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    challenge ? Math.max(0, calculateRemainingSeconds(challenge.expiresAt)) : 0,
  );

  useEffect(() => {
    if (!challenge) {
      navigate('/login', { replace: true });
      return;
    }

    const intervalId = window.setInterval(() => {
      const nextRemaining = Math.max(0, calculateRemainingSeconds(challenge.expiresAt));
      setRemainingSeconds(nextRemaining);

      if (nextRemaining <= 0) {
        window.clearInterval(intervalId);
      }
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [challenge, navigate]);

  const handleBackToLogin = () => {
    clearLoginChallenge();
    navigate('/login', { replace: true });
  };

  const handleVerify = async () => {
    if (!challenge || remainingSeconds <= 0) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const payload = await verifyTwoFactorCode({
        sessionId: challenge.sessionId,
        code,
      });

      saveSessionToken(payload.token);
      clearLoginChallenge();
      navigate('/app', { replace: true });
    } catch (caughtError) {
      if (isApiError(caughtError)) {
        if (caughtError.status === 400) {
          setMessage(caughtError.message);
          return;
        }

        if (caughtError.status === 401) {
          clearLoginChallenge();
          navigate('/login?error=two_factor_expired', { replace: true });
          return;
        }
      }

      setMessage('No se pudo verificar el codigo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!challenge) {
    return null;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-blue-100 via-teal-50 to-white" />

      <section className="w-full max-w-lg rounded-3xl border border-border bg-white/95 p-8 shadow-lg backdrop-blur">
        <TwoFactorForm
          code={code}
          expired={remainingSeconds <= 0}
          loading={loading}
          maskedEmail={challenge.maskedEmail}
          message={message}
          onBackToLogin={handleBackToLogin}
          onCodeChange={setCode}
          onSubmit={handleVerify}
          remainingSeconds={remainingSeconds}
        />
      </section>
    </div>
  );
};