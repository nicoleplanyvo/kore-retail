import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import t from '../locales/de.json';

const navLinks = [
  { label: t.nav.consulting, href: '/consulting' },
  { label: t.nav.training, href: '/training' },
  { label: t.nav.suite, href: '/suite' },
  { label: t.nav.about, href: '/about' },
  { label: t.nav.contact, href: '/contact' },
];

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 bg-kore-bg/[0.94] backdrop-blur-[10px] border-b border-kore-border">
      <div className="container-default h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-light tracking-wide text-kore-ink hover:text-kore-ink">
          KORE
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`font-body text-small font-light transition-colors duration-200 hover:text-kore-brass ${
                location.pathname === link.href ? 'text-kore-brass' : 'text-kore-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/audit" className="btn-brass text-[0.65rem] py-2 px-5">
            {t.nav.cta}
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-kore-ink"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Menue schliessen' : 'Menue oeffnen'}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-kore-bg border-b border-kore-border">
          <div className="container-default py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className={`font-body text-body font-light py-2 transition-colors duration-200 hover:text-kore-brass ${
                  location.pathname === link.href ? 'text-kore-brass' : 'text-kore-ink'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/audit"
              onClick={() => setMobileOpen(false)}
              className="btn-brass text-center mt-2"
            >
              {t.nav.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
