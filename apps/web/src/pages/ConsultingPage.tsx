import { Link } from 'react-router-dom';
import { ArrowRight, Search, Eye, Target, TrendingUp } from 'lucide-react';

export function ConsultingPage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">Consulting</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Operative Excellence beginnt mit einer ehrlichen Analyse
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Wir decken auf, was auf der Flaeche wirklich passiert — und liefern einen konkreten Plan zur Verbesserung.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <p className="label-default mb-8">Unsere Leistungen</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConsultingCard
              icon={<Search size={24} className="text-kore-brass" />}
              title="Operatives Store Audit"
              description="Umfassende Analyse aller relevanten Touchpoints: Kundenansprache, Verkaufsprozess, Visual Merchandising, Teamstruktur und operative Ablaeufe."
            />
            <ConsultingCard
              icon={<Eye size={24} className="text-kore-brass" />}
              title="Mystery Shopping"
              description="Verdeckte Testkauefe mit detaillierter Auswertung. Wir dokumentieren die Customer Journey aus Kundenperspektive und identifizieren Optimierungspotenziale."
            />
            <ConsultingCard
              icon={<Target size={24} className="text-kore-brass" />}
              title="Performance-Strategie"
              description="Massgeschneiderte Strategien fuer Conversion-Steigerung, ATV-Optimierung und Team-Effizienz. Basierend auf realen Daten, nicht auf Annahmen."
            />
            <ConsultingCard
              icon={<TrendingUp size={24} className="text-kore-brass" />}
              title="Implementierungsbegleitung"
              description="Wir begleiten die Umsetzung vor Ort: Coaching der Fuehrungskraefte, Team-Workshops und regelmaessige Fortschrittskontrolle bis die Ergebnisse stehen."
            />
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-8">Unser Prozess</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Analyse', desc: 'Store Audit + Datenerhebung' },
              { step: '02', title: 'Diagnose', desc: 'Findings + Handlungsempfehlungen' },
              { step: '03', title: 'Strategie', desc: 'Massnahmenplan + Priorisierung' },
              { step: '04', title: 'Umsetzung', desc: 'Begleitung + Erfolgskontrolle' },
            ].map((item) => (
              <div key={item.step} className="border-l-[3px] border-l-kore-brass pl-6">
                <p className="font-display text-h2 text-kore-brass-lt">{item.step}</p>
                <h3 className="font-display text-h3 text-kore-ink mt-2">{item.title}</h3>
                <p className="font-body text-small font-light text-kore-mid mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            Starten Sie mit einem kostenlosen Audit
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            Wir analysieren Ihren Store und zeigen konkrete Optimierungspotenziale — kostenlos und unverbindlich.
          </p>
          <Link to="/audit" className="btn-brass">
            Kostenloses Audit anfragen
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ConsultingCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-default">
      <div className="mb-4">{icon}</div>
      <h3 className="font-display text-h3 text-kore-ink mb-3">{title}</h3>
      <p className="font-body text-small font-light text-kore-mid">{description}</p>
    </div>
  );
}
