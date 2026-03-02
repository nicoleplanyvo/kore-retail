import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, BarChart3, Calendar, Check } from 'lucide-react';

export function SuitePage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">KORE Suite</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Digitale Tools, gebaut fuer den stationaeren Retail
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Training, KPIs und Dienstplanung — in einer Suite, die versteht, wie Retail wirklich funktioniert.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-accent">
              <GraduationCap size={28} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">KORE Train</h3>
              <p className="font-body text-small font-light text-kore-mid mb-4">
                Interaktive Trainingsplattform fuer Retail-Teams. Lernpfade, Quizzes und Zertifikate — direkt auf dem Smartphone.
              </p>
              <span className="tag-default">Verfuegbar Q2 2026</span>
            </div>
            <div className="card-accent">
              <BarChart3 size={28} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">KORE Pulse</h3>
              <p className="font-body text-small font-light text-kore-mid mb-4">
                KPI-Dashboard fuer Store Manager. Revenue, Conversion, ATV und Team-Performance in Echtzeit.
              </p>
              <span className="tag-default">Verfuegbar Q3 2026</span>
            </div>
            <div className="card-accent">
              <Calendar size={28} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">KORE Shift</h3>
              <p className="font-body text-small font-light text-kore-mid mb-4">
                Budget-intelligenter Dienstplan. Vom Revenue-Forecast zur optimalen Stunden-Struktur und Export.
              </p>
              <span className="tag-default">Verfuegbar Q4 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">Pricing</p>
          <h2 className="font-display text-h2 text-kore-ink mb-10">
            Transparente Preise, keine versteckten Kosten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="card-default flex flex-col">
              <p className="label-default mb-2">Starter</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-h1 text-kore-ink">299&euro;</span>
                <span className="font-body text-small text-kore-mid">/Monat</span>
              </div>
              <p className="font-body text-small font-light text-kore-mid mb-6">
                Perfekt fuer einzelne Stores mit bis zu 15 Mitarbeitern.
              </p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                <PricingFeature>KORE Train — alle Features</PricingFeature>
                <PricingFeature>Bis zu 15 User</PricingFeature>
                <PricingFeature>Kurse erstellen & zuweisen</PricingFeature>
                <PricingFeature>Zertifikate</PricingFeature>
                <PricingFeature>E-Mail-Support</PricingFeature>
              </ul>
              <Link to="/contact" className="btn-secondary w-full text-center">
                Kontakt aufnehmen
              </Link>
            </div>

            {/* Professional */}
            <div className="card-default flex flex-col border-kore-brass">
              <p className="label-default text-kore-brass mb-2">Professional</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-h1 text-kore-ink">599&euro;</span>
                <span className="font-body text-small text-kore-mid">/Monat</span>
              </div>
              <p className="font-body text-small font-light text-kore-mid mb-6">
                Fuer wachsende Retailer mit mehreren Stores und Teams.
              </p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                <PricingFeature>Alles aus Starter</PricingFeature>
                <PricingFeature>Unbegrenzte User</PricingFeature>
                <PricingFeature>KORE Pulse — KPI-Dashboard</PricingFeature>
                <PricingFeature>Multi-Store Vergleich</PricingFeature>
                <PricingFeature>Priority Support</PricingFeature>
              </ul>
              <Link to="/contact" className="btn-brass w-full text-center">
                Kontakt aufnehmen
              </Link>
            </div>

            {/* Enterprise */}
            <div className="card-default flex flex-col">
              <p className="label-default mb-2">Enterprise</p>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="font-display text-h1 text-kore-ink">Custom</span>
              </div>
              <p className="font-body text-small font-light text-kore-mid mb-6">
                Fuer grosse Retailer mit individuellen Anforderungen.
              </p>
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                <PricingFeature>Alles aus Professional</PricingFeature>
                <PricingFeature>KORE Shift — Dienstplanung</PricingFeature>
                <PricingFeature>Custom Integrations</PricingFeature>
                <PricingFeature>Dedizierter Account Manager</PricingFeature>
                <PricingFeature>SLA</PricingFeature>
              </ul>
              <Link to="/contact" className="btn-secondary w-full text-center">
                Kontakt aufnehmen
              </Link>
            </div>
          </div>
          <p className="font-body text-small text-kore-mid text-center mt-6">
            Alle Preise zzgl. MwSt. Jährliche Zahlung: 2 Monate gratis.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            Interessiert?
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            Wir zeigen Ihnen die Suite in einer persoenlichen Demo — kostenlos und unverbindlich.
          </p>
          <Link to="/contact" className="btn-brass">
            Demo anfragen
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function PricingFeature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <Check size={16} className="text-kore-brass mt-0.5 shrink-0" />
      <span className="font-body text-small font-light text-kore-ink">{children}</span>
    </li>
  );
}
