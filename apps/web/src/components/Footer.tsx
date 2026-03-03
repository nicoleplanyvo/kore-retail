import { Link } from 'react-router-dom';
import t from '../locales/de.json';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-kore-ink text-kore-white py-16">
      <div className="container-default">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <span className="font-display text-2xl font-light">KORE</span>
            <p className="font-body text-small font-normal text-kore-faint mt-3">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body font-medium text-caption uppercase tracking-[0.16em] text-kore-faint mb-4">
              Navigation
            </h4>
            <div className="flex flex-col">
              <Link to="/consulting" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.links.consulting}
              </Link>
              <Link to="/training" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.links.training}
              </Link>
              <Link to="/suite" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.links.suite}
              </Link>
              <Link to="/about" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.links.about}
              </Link>
              <Link to="/contact" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.links.contact}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-body font-medium text-caption uppercase tracking-[0.16em] text-kore-faint mb-4">
              Rechtliches
            </h4>
            <div className="flex flex-col">
              <Link to="/legal" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.legal.imprint}
              </Link>
              <Link to="/legal#datenschutz" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                {t.footer.legal.privacy}
              </Link>
              <Link to="/legal#agb" className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors">
                AGB
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem('kore-cookie-consent');
                  window.location.reload();
                }}
                className="py-1.5 font-body text-small font-normal text-kore-faint hover:text-kore-brass-lt transition-colors text-left cursor-pointer"
              >
                Cookie-Einstellungen
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6">
          <p className="font-body text-small font-normal text-kore-faint">
            &copy; {year} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
