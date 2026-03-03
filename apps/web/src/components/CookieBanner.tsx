import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kore-cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('kore-cookie-consent', 'analytics');
    setVisible(false);
    window.location.reload(); // Reload to trigger GA4 loading
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('kore-cookie-consent', 'essential');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-kore-white border-t border-kore-border shadow-lg">
      <div className="container-default py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <div className="max-w-2xl">
          <p className="font-body text-small text-kore-ink">
            Wir verwenden technisch notwendige Cookies und optional Google Analytics (mit anonymisierter IP) zur Verbesserung unserer Website.{' '}
            <a href="/legal#datenschutz" className="underline hover:text-kore-brass">
              Datenschutzerklärung
            </a>
          </p>
        </div>
        <div className="flex gap-3 shrink-0 w-full sm:w-auto">
          <button onClick={handleEssentialOnly} className="btn-secondary text-[0.7rem] py-3 px-5 flex-1 sm:flex-none">
            Nur notwendige
          </button>
          <button onClick={handleAcceptAll} className="btn-primary text-[0.7rem] py-3 px-5 flex-1 sm:flex-none">
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
