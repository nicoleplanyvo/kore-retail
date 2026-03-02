import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">Ueber KORE</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Retail-Expertise, geboren auf der Flaeche
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            KORE wurde von einer Fuehrungskraft mit ueber einem Jahrzehnt Erfahrung im Premium Retail gegruendet.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding bg-kore-surface">
        <div className="container-narrow">
          <div className="flex flex-col gap-8">
            <div className="border-l-[3px] border-l-kore-brass pl-8">
              <blockquote className="font-display text-h2 text-kore-ink italic">
                &ldquo;Ich habe ueber zehn Jahre lang Stores gefuehrt, Teams aufgebaut und operative Performance gemessen. KORE ist alles, was ich mir als Store Manager gewuenscht haette.&rdquo;
              </blockquote>
              <p className="font-body text-caption uppercase tracking-[0.16em] text-kore-mid mt-4">
                Gruenderin, KORE
              </p>
            </div>

            <p className="font-body text-body font-light text-kore-ink">
              KORE entstand aus der Ueberzeugung, dass der stationaere Retail bessere Werkzeuge verdient. Nicht generische Management-Frameworks, nicht akademische Theorien — sondern praxiserprobte Methoden und digitale Tools, die fuer den Alltag auf der Flaeche gebaut sind.
            </p>

            <p className="font-body text-body font-light text-kore-mid">
              Die Gruenderin bringt ueber ein Jahrzehnt Erfahrung im Premium-Segment mit — von der Kundenberatung bis zur strategischen Steuerung ganzer Stores. Dieses Wissen fliesst direkt in jedes Consulting-Projekt, jedes Training und jedes digitale Tool von KORE.
            </p>

            <p className="font-body text-body font-light text-kore-mid">
              Heute vereint KORE persoenliche Beratung mit skalierbaren SaaS-Produkten unter einem Dach. Das Ziel: Die operative Performance im stationaeren Retail messbar und nachhaltig verbessern — vom einzelnen Store bis zur gesamten Retail-Organisation.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-8">Was uns antreibt</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-accent">
              <h3 className="font-display text-h3 text-kore-ink mb-3">Praxisnaehe</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Jede Empfehlung basiert auf echten Erfahrungen auf der Flaeche. Kein Elfenbeinturm, kein Buzzword-Bingo.
              </p>
            </div>
            <div className="card-accent">
              <h3 className="font-display text-h3 text-kore-ink mb-3">Messbarkeit</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Was sich nicht messen laesst, laesst sich nicht verbessern. Wir arbeiten mit klaren KPIs und nachvollziehbaren Ergebnissen.
              </p>
            </div>
            <div className="card-accent">
              <h3 className="font-display text-h3 text-kore-ink mb-3">Nachhaltigkeit</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Quick Fixes sind nicht unser Ding. Wir bauen Strukturen und Faehigkeiten, die langfristig wirken.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Entity */}
      <section className="section-padding bg-kore-surface">
        <div className="container-narrow">
          <p className="label-default mb-4">Unternehmen</p>
          <p className="font-body text-body font-light text-kore-ink">
            KORE ist eine Marke der gadplan GmbH mit Sitz in Meerbusch, Deutschland. Wir beraten Retailer im gesamten DACH-Raum.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            Lassen Sie uns sprechen
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            Erzaehlen Sie uns von Ihren Herausforderungen — wir finden eine Loesung.
          </p>
          <Link to="/contact" className="btn-brass">
            Kontakt aufnehmen
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
