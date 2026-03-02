import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kore-cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('kore-cookie-consent', 'essential');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('kore-cookie-consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-kore-white border-t border-kore-border shadow-lg">
      <div className="container-default py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
        <p className="font-body text-small font-light text-kore-ink max-w-2xl">
          Wir verwenden nur technisch notwendige Cookies, um die Website-Funktionalitaet sicherzustellen. Keine Tracking-Cookies, kein Google Analytics.{' '}
          <a href="/legal#datenschutz" className="underline hover:text-kore-brass">
            Mehr erfahren
          </a>
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={handleDecline} className="btn-secondary text-[0.6rem] py-2 px-4">
            Ablehnen
          </button>
          <button onClick={handleAccept} className="btn-primary text-[0.6rem] py-2 px-4">
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}
