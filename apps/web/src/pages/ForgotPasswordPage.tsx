import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err) {
      // Always show success message to avoid email enumeration
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-kore-white border border-kore-border p-xl">
      <h2 className="font-display text-h3 text-kore-ink mb-xs">
        Passwort zurücksetzen
      </h2>
      <p className="font-body text-small text-kore-mid mb-xl">
        Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum
        Zurücksetzen.
      </p>

      {submitted ? (
        <div className="flex flex-col gap-lg">
          <p className="font-body text-small text-kore-ink">
            Falls ein Konto mit dieser E-Mail existiert, haben wir Ihnen einen
            Link zum Zurücksetzen gesendet.
          </p>
          <Link
            to="/login"
            className="font-body text-small text-kore-brass hover:underline text-center"
          >
            Zurück zum Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
          <div>
            <label className="block font-body text-small text-kore-mid mb-1">
              E-Mail
            </label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {isSubmitting ? 'Wird gesendet...' : 'Link senden'}
          </button>

          <Link
            to="/login"
            className="font-body text-small text-kore-brass hover:underline text-center"
          >
            Zurück zum Login
          </Link>
        </form>
      )}
    </div>
  );
}
