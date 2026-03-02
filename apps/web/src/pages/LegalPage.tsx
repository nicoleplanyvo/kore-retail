export function LegalPage() {
  return (
    <div className="pt-14">
      {/* Impressum */}
      <section className="section-padding">
        <div className="container-narrow">
          <p className="label-default mb-4">Rechtliches</p>
          <h1 className="font-display text-h1 text-kore-ink mb-12">Impressum</h1>

          <div className="flex flex-col gap-6 font-body text-body font-light text-kore-ink">
            <div>
              <p className="font-body font-medium text-kore-ink">gadplan GmbH</p>
              <p>Meerbusch, Deutschland</p>
            </div>
            <div>
              <p className="label-default mb-2">Kontakt</p>
              <p>E-Mail: hello@koreretail.de</p>
            </div>
            <div>
              <p className="label-default mb-2">Vertretungsberechtigt</p>
              <p>Geschaeftsfuehrung der gadplan GmbH</p>
            </div>
            <div>
              <p className="label-default mb-2">Handelsregister</p>
              <p className="text-kore-mid">
                Angaben werden nach Eintragung ergaenzt.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Datenschutz */}
      <section id="datenschutz" className="section-padding bg-kore-surface">
        <div className="container-narrow">
          <h2 className="font-display text-h1 text-kore-ink mb-12">Datenschutzerklaerung</h2>

          <div className="flex flex-col gap-8 font-body text-body font-light text-kore-ink">
            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">1. Verantwortlicher</h3>
              <p>
                Verantwortlich fuer die Datenverarbeitung auf dieser Website ist die gadplan GmbH, Meerbusch. Kontakt: hello@koreretail.de
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">2. Erhobene Daten</h3>
              <p>
                Beim Besuch unserer Website werden automatisch technisch notwendige Daten erhoben (IP-Adresse, Browsertyp, Zugriffszeit). Diese Daten werden nicht mit anderen Datenquellen zusammengefuehrt.
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">3. Kontaktformular</h3>
              <p>
                Wenn Sie unser Kontakt- oder Audit-Formular nutzen, werden die von Ihnen eingegebenen Daten (Name, E-Mail, Unternehmen, Nachricht) zwecks Bearbeitung Ihrer Anfrage gespeichert. Diese Daten werden nicht ohne Ihre Einwilligung weitergegeben. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">4. Cookies</h3>
              <p>
                Diese Website verwendet ausschliesslich technisch notwendige Cookies. Es werden keine Tracking-Cookies oder Marketing-Cookies eingesetzt. Wir verwenden kein Google Analytics oder vergleichbare Tracking-Tools.
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">5. Hosting</h3>
              <p>
                Diese Website wird bei Vercel Inc. gehostet. Vercel kann technisch bedingt Zugriffsdaten (Server-Logfiles) erheben. Weitere Informationen finden Sie in der Datenschutzerklaerung von Vercel.
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">6. Ihre Rechte</h3>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Loeschung und Einschraenkung der Verarbeitung Ihrer personenbezogenen Daten. Darueber hinaus haben Sie ein Widerspruchsrecht gegen die Verarbeitung sowie das Recht auf Datenuebertragbarkeit. Kontaktieren Sie uns unter hello@koreretail.de.
              </p>
            </div>

            <div>
              <h3 className="font-display text-h3 text-kore-ink mb-3">7. Beschwerderecht</h3>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehoerde ueber die Verarbeitung Ihrer personenbezogenen Daten zu beschweren.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
