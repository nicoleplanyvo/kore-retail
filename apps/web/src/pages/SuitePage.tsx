import { Link } from 'react-router-dom';
import { ArrowRight, Plus, AlertTriangle, CheckCircle, Puzzle, Wrench } from 'lucide-react';
import { ConfiguratorMockup, TrainMockup, ShiftMockup, AuditMockup } from '../components/mockups';
import { usePageMeta } from '../hooks/usePageMeta';

export function SuitePage() {
  usePageMeta({
    title: 'KORE Suite | Modulare Custom Tools — KPI-Dashboard, Schichtplanung & Audits für Einzelhandel',
    description: 'Kein Standard-SaaS: Die KORE Suite bietet maßgeschneiderte Module für KPI-Dashboards, Schichtplanung, Store Audits und Trainingsplattformen im Einzelhandel. Individuelle digitale Lösungen für Retail.',
  });

  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <div className="w-12 h-[2px] bg-kore-brass mb-8" />
          <p className="label-default mb-4">Modulare Retail Management Software</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Ihr Dashboard. Ihre Module. Ihre Lösung.
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Kein Standard-SaaS — sondern maßgeschneiderte, modulare Tools für den Einzelhandel. KPI-Dashboards, Schichtplanung, Trainingsplattformen und Store Audits, die sich exakt an Ihre operativen Herausforderungen anpassen. Und wenn es für ein Problem noch keine Lösung gibt, bauen wir sie.
          </p>
        </div>
      </section>

      {/* Konzept: So funktioniert die Suite */}
      <section className="section-padding surface-pattern">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">So funktioniert es</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-accent">
              <div className="font-display text-[2.5rem] font-light text-kore-brass-lt leading-none mb-4">01</div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">Painpoints identifizieren</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Gemeinsam analysieren wir, wo in Ihrem Betrieb die größten operativen Lücken liegen — fehlende Übersicht, ineffiziente Prozesse, mangelnde Standards.
              </p>
            </div>
            <div className="card-accent">
              <div className="font-display text-[2.5rem] font-light text-kore-brass-lt leading-none mb-4">02</div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">Module zusammenstellen</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Sie wählen aus bestehenden Modulen die Bausteine, die Ihre Herausforderungen lösen — KPI-Tracking, Training, Planung, Audits und mehr.
              </p>
            </div>
            <div className="card-accent">
              <div className="font-display text-[2.5rem] font-light text-kore-brass-lt leading-none mb-4">03</div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">Fehlende Lösungen bauen</h3>
              <p className="font-body text-small font-normal text-kore-mid">
                Gibt es für ein Problem noch kein Modul? Dann entwickeln wir es. Jede Lösung wird individuell auf Ihren Betrieb zugeschnitten.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard-Konfigurator: So stellen Sie sich Ihr Dashboard zusammen */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">Ihr Dashboard zusammenstellen</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-8">
            <div>
              <h2 className="font-display text-h2 text-kore-ink mb-4">
                Sie wählen die Module — wir bauen Ihr Dashboard
              </h2>
              <p className="font-body text-body font-normal text-kore-mid leading-relaxed mb-6">
                Kein vorgefertigtes System, das halb passt. Sie entscheiden, welche Module Sie brauchen: Audit-Tracking, Trainingsfortschritt, Schichtplanung oder etwas ganz Neues. Jedes Modul wird auf Ihren Betrieb konfiguriert und zeigt nur die Daten, die für Sie relevant sind.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Wählen Sie aus bestehenden Modulen',
                  'Jedes Modul wird auf Ihren Betrieb angepasst',
                  'Fehlende Module werden individuell entwickelt',
                  'Alle Daten in einem Dashboard vereint',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle size={14} className="text-kore-brass shrink-0" />
                    <p className="font-body text-small font-normal text-kore-ink">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <ConfiguratorMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Problem → Lösung Showcase */}
      <section className="section-padding">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-14">
            <p className="label-default">Problem → Lösung</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>

          {/* Modul 1: Training — Text links, Phone-Mockup rechts */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 items-start">
              <div>
                <ProblemSolution
                  problem="Neue Mitarbeiter brauchen Wochen bis zur vollen Produktivität. Das Onboarding im Einzelhandel ist unstrukturiert, nicht nachvollziehbar und variiert von Filiale zu Filiale."
                  solution="Eine Trainingsplattform mit Ihren Standards, Ihren Prozessen, Ihren digitalen Lernpfaden. Fortschritt wird getrackt, Zertifikate automatisch vergeben. E-Learning für den Retail-Alltag."
                  moduleName="Trainingsplattform & Onboarding"
                />
              </div>
              <div className="hidden lg:flex justify-center">
                <div className="scale-[0.85] origin-top">
                  <TrainMockup />
                </div>
              </div>
            </div>
            {/* Mobile: Mockup unter Text */}
            <div className="mt-8 lg:hidden overflow-x-auto -mx-6 px-6">
              <div className="min-w-[480px]">
                <TrainMockup />
              </div>
            </div>
          </div>

          {/* Modul 2: Shift — Mockup links, Text rechts */}
          <div className="mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">
              <div className="hidden lg:block">
                <div className="scale-[0.92] origin-top-left">
                  <ShiftMockup />
                </div>
              </div>
              <div>
                <ProblemSolution
                  problem="Die Schichtplanung im Einzelhandel läuft über Excel, ignoriert den Revenue-Forecast und führt regelmäßig zu Über- oder Unterbesetzung bei der Personalplanung."
                  solution="Ein Dienstplanungstool für den Retail, das Ihre Umsatzprognose kennt und automatisch die optimale Personalplanung vorschlägt — inklusive Budget-Kontrolle."
                  moduleName="Schichtplanung & Personalplanung"
                />
              </div>
            </div>
            {/* Mobile: Mockup unter Text */}
            <div className="mt-8 lg:hidden overflow-x-auto -mx-6 px-6">
              <div className="min-w-[520px]">
                <ShiftMockup />
              </div>
            </div>
          </div>

          {/* Modul 3: Audit — Text links, Mockup rechts */}
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-10 items-start">
              <div>
                <ProblemSolution
                  problem="Filialaudits passieren selten, sind subjektiv und die Ergebnisse verschwinden in PDF-Dateien, die niemand nachverfolgt."
                  solution="Strukturierte Store Audits mit Score-System, Kategorie-Analyse und konkreten Handlungsempfehlungen — digitale Filialrevision, nachverfolgbar und vergleichbar."
                  moduleName="Store Audit & Filialrevision"
                />
              </div>
              <div className="hidden lg:block">
                <div className="scale-[0.92] origin-top-right">
                  <AuditMockup />
                </div>
              </div>
            </div>
            {/* Mobile: Mockup unter Text */}
            <div className="mt-8 lg:hidden overflow-x-auto -mx-6 px-6">
              <div className="min-w-[480px]">
                <AuditMockup />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keine Lösung? Wir bauen sie. */}
      <section className="section-padding gradient-dark relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-[300px] h-[300px] rounded-full border border-kore-brass/10" />
        <div className="container-default relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Wrench size={24} className="text-kore-brass" />
                <p className="label-default text-kore-brass">Custom Development</p>
              </div>
              <h2 className="font-display text-h1 text-kore-white mb-6">
                Kein passendes Modul? Wir bauen es.
              </h2>
              <p className="font-body text-body font-normal text-kore-faint leading-relaxed mb-8">
                Jeder Retail-Betrieb hat individuelle Herausforderungen. Wenn unsere bestehenden Module Ihr Problem nicht lösen, entwickeln wir ein neues — exakt zugeschnitten auf Ihre Prozesse, Ihre Daten und Ihre Ziele.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  'Individuelle Anforderungsanalyse mit Ihrem Team',
                  'Entwicklung und Integration in Ihr bestehendes Dashboard',
                  'Iteratives Feedback bis die Lösung sitzt',
                  'Laufende Weiterentwicklung und Support',
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Plus size={14} className="text-kore-brass mt-1.5 shrink-0" />
                    <p className="font-body text-small font-normal text-kore-faint">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-8 lg:mt-0">
              {[
                { q: '„Wir brauchen ein Tool für Mystery Shopping."', status: 'Gebaut.' },
                { q: '„Unser Wareneingang hat keinen digitalen Prozess."', status: 'Gebaut.' },
                { q: '„Wir wollen Kundenzufriedenheit pro Store tracken."', status: 'Gebaut.' },
                { q: '„Wir haben kein System für interne Kommunikation."', status: 'In Entwicklung.' },
              ].map((example, i) => (
                <div key={i} className="bg-kore-white/5 border border-kore-white/10 rounded-md p-5">
                  <p className="font-display text-small italic text-kore-faint">{example.q}</p>
                  <p className="font-body text-caption uppercase tracking-widest text-kore-brass mt-2">{example.status}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Verfügbare Module Übersicht */}
      <section className="section-padding">
        <div className="container-default">
          <div className="flex items-center gap-4 mb-10">
            <p className="label-default">Verfügbare Module</p>
            <div className="flex-1 h-px bg-kore-border" />
          </div>
          <p className="font-body text-body font-normal text-kore-mid mb-10 max-w-2xl">
            Jede individuelle Lösung ist einzeln buchbar und lässt sich nahtlos in Ihr KORE Dashboard integrieren. Die Liste wächst — basierend auf den operativen Anforderungen unserer Kunden im Einzelhandel.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'KPI-Dashboard', status: 'live', desc: 'Kennzahlen in Echtzeit: Revenue, Conversion, ATV, UPT' },
              { name: 'Trainingsplattform', status: 'live', desc: 'E-Learning, digitale Lernpfade, Onboarding, Zertifikate' },
              { name: 'Schichtplanung', status: 'live', desc: 'Dienstplanung & Personalplanung mit Revenue-Forecast' },
              { name: 'Store Audit', status: 'live', desc: 'Digitale Filialrevision mit Score-System' },
              { name: 'Team-Kommunikation', status: 'coming', desc: 'Interne Nachrichten und Ankündigungen' },
              { name: 'Mystery Shopping', status: 'coming', desc: 'Externe Bewertungen und Tracking' },
              { name: 'Kundenzufriedenheit', status: 'coming', desc: 'NPS und Feedback pro Filiale' },
              { name: 'Wareneingang', status: 'coming', desc: 'Digitaler Wareneingangsprozess' },
              { name: 'Ihr Modul', status: 'custom', desc: 'Individuelle Lösung gesucht? Wir bauen sie maßgeschneidert.' },
            ].map((mod) => (
              <div key={mod.name} className={`border rounded-md p-5 transition-all duration-300 hover:shadow-md ${
                mod.status === 'custom'
                  ? 'border-kore-brass border-dashed bg-kore-brass/5'
                  : 'border-kore-border bg-kore-white'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display text-body text-kore-ink">{mod.name}</h4>
                  {mod.status === 'live' && (
                    <span className="inline-flex items-center gap-1 text-kore-success text-[0.65rem] uppercase tracking-widest font-medium">
                      <span className="w-1.5 h-1.5 bg-kore-success rounded-full" />
                      Live
                    </span>
                  )}
                  {mod.status === 'coming' && (
                    <span className="text-kore-mid text-[0.65rem] uppercase tracking-widest font-medium">
                      Bald
                    </span>
                  )}
                  {mod.status === 'custom' && (
                    <Puzzle size={14} className="text-kore-brass" />
                  )}
                </div>
                <p className="font-body text-small font-normal text-kore-mid">{mod.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            Welche Module brauchen Sie?
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            In einem Gespräch finden wir gemeinsam heraus, welche Bausteine Ihr operatives Problem lösen — oder ob wir etwas Neues bauen.
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

/**
 * Problem → Lösung Darstellung mit klarer visueller Trennung.
 */
function ProblemSolution({
  problem,
  solution,
  moduleName,
}: {
  problem: string;
  solution: string;
  moduleName: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Puzzle size={16} className="text-kore-brass" />
        <p className="font-display text-h3 text-kore-ink">{moduleName}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Problem */}
        <div className="bg-kore-ink/[0.03] border border-kore-border rounded-md p-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-kore-error shrink-0" />
            <p className="font-body text-caption uppercase tracking-widest text-kore-error font-medium">Problem</p>
          </div>
          <p className="font-body text-small font-normal text-kore-ink leading-relaxed">
            {problem}
          </p>
        </div>
        {/* Lösung */}
        <div className="bg-kore-brass/[0.04] border border-kore-brass/20 rounded-md p-6">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={16} className="text-kore-brass shrink-0" />
            <p className="font-body text-caption uppercase tracking-widest text-kore-brass font-medium">KORE Lösung</p>
          </div>
          <p className="font-body text-small font-normal text-kore-ink leading-relaxed">
            {solution}
          </p>
        </div>
      </div>
    </div>
  );
}
