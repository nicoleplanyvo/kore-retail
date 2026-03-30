import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Globaler Error Boundary — Fängt Rendering-Fehler und zeigt eine
 * benutzerfreundliche Fehlermeldung statt eines weißen Bildschirms.
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Unhandled error:', error, info.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/app';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-kore-bg flex items-center justify-center p-md">
          <div className="text-center max-w-md">
            <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={28} className="text-amber-600" />
            </div>
            <h1 className="font-display text-2xl text-kore-ink mb-2">
              Etwas ist schiefgelaufen
            </h1>
            <p className="font-body text-sm text-kore-mid mb-6">
              Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut oder kehre zur Startseite zurück.
            </p>
            {this.state.error && (
              <p className="font-body text-xs text-kore-faint bg-kore-surface p-3 rounded mb-6 break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-4 py-2 rounded bg-kore-brass text-kore-white font-body text-sm hover:bg-kore-brass-dk transition-colors"
              >
                <RefreshCw size={14} />
                Neu laden
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-kore-border text-kore-ink font-body text-sm hover:bg-kore-surface transition-colors"
              >
                <Home size={14} />
                Startseite
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
