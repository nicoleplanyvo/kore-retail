import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, Award, Users, BookOpen } from 'lucide-react';

export function TrainingPage() {
  return (
    <div className="pt-14">
      {/* Hero */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">Training Academy</p>
          <h1 className="font-display text-h1 text-kore-ink max-w-3xl">
            Praxisnahe Trainings, die auf der Flaeche wirken
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 max-w-2xl">
            Von Kundenansprache bis Visual Merchandising — unsere Programme sind fuer Teams gebaut, die taeglich performen muessen.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <p className="label-default mb-8">Trainingsangebot</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-default">
              <BookOpen size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Workshops vor Ort</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Intensive Praesenz-Workshops fuer Store-Teams. Verkaufspsychologie, Kundentypen, Upselling-Techniken und Service Excellence — praxisnah und interaktiv.
              </p>
            </div>
            <div className="card-default">
              <Smartphone size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">KORE Train Platform</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Digitale Lernpfade auf dem Smartphone. Kurze Module, interaktive Quizzes und Video-Content — perfekt fuer den Retail-Alltag.
              </p>
            </div>
            <div className="card-default">
              <Users size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Team-Entwicklung</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Langfristige Entwicklungsprogramme fuer Fuehrungskraefte und High Potentials. Store Manager Coaching, Talent Development und Succession Planning.
              </p>
            </div>
            <div className="card-default">
              <Award size={24} className="text-kore-brass mb-4" />
              <h3 className="font-display text-h3 text-kore-ink mb-3">Zertifizierung</h3>
              <p className="font-body text-small font-light text-kore-mid">
                Abschluss mit KORE-Zertifikat. Nachweisbare Qualifikation fuer Mitarbeiter und ein klares Signal an Kunden und Partner.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Themen */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-8">Trainingsthemen</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'Kundenansprache & Bedarfsanalyse',
              'Upselling & Cross-Selling',
              'Visual Merchandising',
              'Service Excellence',
              'Beschwerdemanagement',
              'KPI-Verstaendnis fuer Teams',
              'Zeitmanagement auf der Flaeche',
              'Clienteling & CRM',
              'Fuehrung im Retail',
            ].map((topic) => (
              <div key={topic} className="border-l-[3px] border-l-kore-brass pl-4 py-2">
                <p className="font-body text-body font-light text-kore-ink">{topic}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            Trainings, die Ergebnisse liefern
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            Lassen Sie uns ueber ein massgeschneidertes Trainingsprogramm fuer Ihr Team sprechen.
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
