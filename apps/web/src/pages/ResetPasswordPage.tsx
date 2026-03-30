import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';

export function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

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
      await api('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });
      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Passwort konnte nicht zurückgesetzt werden.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-kore-white border border-kore-border p-xl">
      <h2 className="font-display text-h3 text-kore-ink mb-xs">
        Neues Passwort festlegen
      </h2>

      {success ? (
        <div className="flex flex-col gap-lg">
          <p className="font-body text-small text-kore-ink">
            Ihr Passwort wurde erfolgreich geändert.
          </p>
          <Link
            to="/login"
            className="bg-kore-ink text-white px-lg py-sm text-sm uppercase tracking-wider hover:opacity-90 transition-opacity w-full disabled:opacity-50 text-center block"
          >
            Zum Login
          </Link>
        </div>
      ) : (
        <>
          <p className="font-body text-small text-kore-mid mb-xl">
            Wählen Sie ein neues Passwort für Ihr Konto.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
            <div>
              <label className="block font-body text-small text-kore-mid mb-1">
                Neues Passwort
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
              {isSubmitting ? 'Wird gespeichert...' : 'Passwort speichern'}
            </button>

            <Link
              to="/login"
              className="font-body text-small text-kore-brass hover:underline text-center"
            >
              Zurück zum Login
            </Link>
          </form>
        </>
      )}
    </div>
  );
}
