import { Link } from 'react-router-dom';
import { ArrowRight, Search, Wrench, Target, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { AuditMockup } from '../components/mockups';
import { usePageMeta } from '../hooks/usePageMeta';

export function ConsultingPage() {
  usePageMeta({
    title: 'Retail Consulting | Unternehmensberatung Einzelhandel — Painpoint-Analyse & Strategie | KORE',
    description: 'Operative Audits, Painpoint-Analyse und individuelle Strategieentwicklung für Premium Retail. Prozessoptimierung, Filialprozesse und maßgeschneiderte Lösungen mit Custom Tools — KORE Consulting.',
  });

  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <div className="w-12 h-[2px] bg-kore-brass mb-8" />
          <p className="label-default mb-4">Retail Consulting</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Painpoints analysieren. Strategie entwickeln. Tools bauen, die bleiben.
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Unternehmensberatung für den Einzelhandel — ohne Standardlösungen. Gemeinsam identifizieren wir operative Schwachstellen in Ihren Filialprozessen und entwickeln die Strategie und digitalen Werkzeuge, die Ihre Umsatzziele konkret unterstützen.
          </p>
        </div>
      </section>

      {/* Ansatz */}
      <section className="section-padding surface-pattern">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">Unser Ansatz</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-accent">
              <Search size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Operative Painpoint-Analyse</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Wir analysieren die echten Schwachstellen im Einzelhandel: Filialprozesse, Team-Performance, Conversion Rate, Verkaufsprozesse und Customer Experience. Keine Annahmen — nur Daten und Erfahrung.
              </p>
            </div>
            <div className="card-accent">
              <Target size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Individuelle Strategieentwicklung</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Auf Basis der Analyse entwickeln wir eine maßgeschneiderte Strategie zur Umsatzsteigerung im stationären Handel. Neue Standards, klare Kennzahlen, konkrete Maßnahmen — alles abgestimmt auf Ihren Betrieb.
              </p>
            </div>
            <div className="card-accent">
              <Wrench size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Custom Tools & Monitoring</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Wir entwickeln die digitalen Werkzeuge, die Ihre Strategie operativ unterstützen: Tracking-Systeme, KPI-Dashboards, Trainingsplattformen — individuell gebaut, nicht von der Stange.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audit-Beispiel Mockup */}
      <section className="section-padding">
        <div className="container-default">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="label-default mb-4">So sieht ein Audit aus</p>
              <h2 className="font-display text-h2 text-kore-ink mb-4">
                Datenbasiert. Visuell. Sofort umsetzbar.
              </h2>
              <p className="font-body text-body font-normal text-kore-mid leading-relaxed mb-6">
                Jedes KORE Audit liefert einen klaren Report mit Score-Bewertung, Kategorie-Analyse und konkreten Findings. Sie sehen auf einen Blick, wo Ihre größten Hebel liegen — und erhalten eine Empfehlung, die direkt in die Umsetzung gehen kann.
              </p>
              <Link to="/audit" className="btn-brass">
                Audit anfragen
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="transform lg:scale-95 origin-center">
              <AuditMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Leistungen im Detail */}
      <section className="section-padding surface-pattern">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">Leistungen im Detail</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ConsultingCard
              icon={<Search size={24} className="text-kore-brass" />}
              title="Operatives Audit & Painpoint-Analyse"
              description="Analyse aller relevanten Filialprozesse: Kundenansprache, Verkaufsprozesse, Visual Merchandising, Teamstruktur und Conversion Rate. Wir identifizieren die echten Hebel zur Umsatzsteigerung."
            />
            <ConsultingCard
              icon={<BarChart3 size={24} className="text-kore-brass" />}
              title="KPI-Dashboard & Monitoring"
              description="Individuelle KPI-Dashboards und Monitoring-Lösungen für den Einzelhandel, die Ihre Kennzahlen in Echtzeit abbilden. Revenue, Conversion, ATV und UPT — die Metriken, die für Ihren Betrieb entscheidend sind."
            />
            <ConsultingCard
              icon={<Settings size={24} className="text-kore-brass" />}
              title="Prozessoptimierung & Standards"
              description="Wir definieren gemeinsam neue operative Standards und optimieren Ihre Filialprozesse. Von Verkaufsprozessen über Servicequalität bis zur Personalplanung im Einzelhandel."
            />
            <ConsultingCard
              icon={<TrendingUp size={24} className="text-kore-brass" />}
              title="Implementierung & Custom Tools"
              description="Wir begleiten nicht nur — wir bauen. Maßgeschneiderte digitale Lösungen, die Ihre Strategie unterstützen: Trainingsplattformen, Schichtplanungstools, Performance-Tracker."
            />
          </div>
        </div>
      </section>

      {/* Prozess */}
      <section className="section-padding">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">Unser Prozess</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { step: '01', title: 'Verstehen', desc: 'Gemeinsame Analyse Ihrer Painpoints und Ziele' },
              { step: '02', title: 'Diagnostizieren', desc: 'Datenbasierte Findings und Ursachenanalyse' },
              { step: '03', title: 'Strategisieren', desc: 'Individuelle Umsatz- und Entwicklungsstrategie' },
              { step: '04', title: 'Bauen', desc: 'Custom Tools, Monitoring-Systeme und neue Standards' },
              { step: '05', title: 'Skalieren', desc: 'Laufende Optimierung und Erfolgskontrolle' },
            ].map((item) => (
              <div key={item.step} className="border-l-[3px] border-l-kore-brass pl-6">
                <p className="font-display text-h2 text-kore-brass-lt">{item.step}</p>
                <h3 className="font-display text-h3 text-kore-ink mt-2">{item.title}</h3>
                <p className="font-body text-small font-normal text-kore-mid mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding gradient-dark relative overflow-hidden">
        <div className="absolute -left-20 -bottom-20 w-[300px] h-[300px] rounded-full border border-kore-brass/10" />
        <div className="container-narrow text-center relative">
          <div className="w-12 h-[2px] bg-kore-brass mx-auto mb-8" />
          <h2 className="font-display text-h1 text-kore-white">
            Lassen Sie uns Ihre Painpoints analysieren
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            Im Audit identifizieren wir gemeinsam, wo Ihr größtes Potenzial liegt — und wie individuelle Tools Ihre Strategie unterstützen können.
          </p>
          <Link to="/audit" className="btn-brass">
            Audit anfragen
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
      <p className="font-body text-small font-normal text-kore-mid">{description}</p>
    </div>
  );
}
