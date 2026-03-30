import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { api, setAccessToken } from '../lib/api';
import type { AuthUser } from '@kore/types';

interface AcceptInviteResponse {
  accessToken: string;
  user: AuthUser;
}

export function AcceptInvitePage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }

    setIsSubmitting(true);
    try {
      setAccessToken(null);
      const res = await api<AcceptInviteResponse>('/api/auth/accept-invite', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      setAuth(res.user, res.accessToken);
      navigate('/app', { replace: true });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Einladung konnte nicht angenommen werden.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-kore-white border border-kore-border p-xl">
      <h2 className="font-display text-h3 text-kore-ink mb-xs">
        Willkommen bei KORE
      </h2>
      <p className="font-body text-small text-kore-mid mb-xl">
        Legen Sie Ihr Passwort fest, um Ihr Konto zu aktivieren.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div>
          <label className="block font-body text-small text-kore-mid mb-1">
            Passwort
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border border-kore-border px-md py-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-kore-brass/50 w-full rounded-sm"
          />
        </div>

        <div>
          <label className="block font-body text-small text-kore-mid mb-1">
            Passwort bestätigen
          </label>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border border-kore-border px-md py-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-kore-brass/50 w-full rounded-sm"
          />
        </div>

        {error && (
          <p className="font-body text-small text-kore-error">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-kore-ink text-white px-lg py-sm text-sm uppercase tracking-wider hover:opacity-90 transition-opacity w-full disabled:opacity-50 mt-xs"
        >
          {isSubmitting ? 'Wird aktiviert...' : 'Konto aktivieren'}
        </button>
      </form>
    </div>
  );
}
