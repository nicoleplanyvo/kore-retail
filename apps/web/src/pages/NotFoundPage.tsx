import { MapPin, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-kore-bg">
      <div className="h-[56px] bg-kore-white border-b border-kore-border flex items-center px-xl">
        <Link to="/app" className="font-display text-h3 text-kore-ink tracking-wider">KORE</Link>
      </div>
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="text-center max-w-[400px] px-md">
          <div className="w-[56px] h-[56px] bg-kore-surface rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={28} className="text-kore-mid" />
          </div>
          <h1 className="font-display text-2xl text-kore-ink mb-2">Seite nicht gefunden</h1>
          <p className="font-body text-sm text-kore-mid mb-8">
            Die angeforderte Seite existiert nicht oder wurde verschoben.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 font-body text-sm text-kore-brass hover:text-kore-brass-dk transition-colors"
          >
            <ArrowLeft size={16} />
            Zurück zur Übersicht
          </Link>
        </div>
      </div>
    </div>
  );
}
