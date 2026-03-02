import { Link } from 'react-router-dom';
import { ArrowRight, BarChart3, GraduationCap, Briefcase } from 'lucide-react';
import t from '../locales/de.json';

export function HomePage() {
  return (
    <div className="pt-14">
      {/* === HERO === */}
      <section className="section-padding">
        <div className="container-default">
          <div className="max-w-4xl">
            <h1 className="font-display text-display text-kore-ink leading-[0.92]">
              {t.hero.title}
            </h1>
            <p className="font-display text-h1 text-kore-mid mt-2">
              {t.hero.subtitle}
            </p>
            <p className="font-display text-lead italic text-kore-mid mt-6 max-w-xl">
              {t.hero.lead}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <Link to="/audit" className="btn-brass">
                {t.hero.cta_primary}
                <ArrowRight size={16} />
              </Link>
              <Link to="/consulting" className="btn-secondary">
                {t.hero.cta_secondary}
              </Link>
            </div>
          </div>

          {/* Stat Bar */}
          <div className="mt-16 pt-8 border-t border-kore-border flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div>
              <p className="font-display text-h2 text-kore-ink">{t.hero.stat_experience}</p>
            </div>
            <div>
              <p className="font-display text-h2 text-kore-ink">{t.hero.stat_streams}</p>
            </div>
            <div>
              <p className="font-display text-h2 text-kore-ink">{t.hero.stat_region}</p>
            </div>
          </div>
        </div>
      </section>

      {/* === SERVICES OVERVIEW === */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <p className="label-default mb-4">{t.services.heading}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <ServiceCard
              icon={<Briefcase size={24} className="text-kore-brass" />}
              title={t.services.consulting.title}
              description={t.services.consulting.description}
              href="/consulting"
            />
            <ServiceCard
              icon={<GraduationCap size={24} className="text-kore-brass" />}
              title={t.services.training.title}
              description={t.services.training.description}
              href="/training"
            />
            <ServiceCard
              icon={<BarChart3 size={24} className="text-kore-brass" />}
              title={t.services.suite.title}
              description={t.services.suite.description}
              href="/suite"
            />
          </div>
        </div>
      </section>

      {/* === WARUM KORE === */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">{t.why.heading}</p>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="border-l-[3px] border-l-kore-brass pl-8">
              <blockquote className="font-display text-h1 text-kore-ink italic">
                &ldquo;{t.why.quote}&rdquo;
              </blockquote>
            </div>
            <div className="flex flex-col gap-6">
              <p className="font-body text-body font-light text-kore-ink">
                {t.why.text_1}
              </p>
              <p className="font-body text-body font-light text-kore-mid">
                {t.why.text_2}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === CASE STUDIES === */}
      <section className="section-padding bg-kore-surface">
        <div className="container-default">
          <p className="label-default mb-4">{t.caseStudies.heading}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {t.caseStudies.cases.map((cs, i) => (
              <div key={i} className="card-accent">
                <p className="font-body text-caption uppercase tracking-[0.16em] text-kore-mid mb-3">
                  {cs.client}
                </p>
                <p className="font-display text-h3 text-kore-ink mb-4">
                  {cs.result}
                </p>
                <p className="font-body text-small font-light text-kore-mid">
                  {cs.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === KORE SUITE TEASER === */}
      <section className="section-padding">
        <div className="container-default">
          <p className="label-default mb-4">{t.suiteTeaser.heading}</p>
          <p className="font-display text-lead italic text-kore-mid mt-2 mb-10">
            {t.suiteTeaser.lead}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {t.suiteTeaser.tools.map((tool, i) => (
              <div key={i} className="card-default">
                <h3 className="font-display text-h3 text-kore-ink mb-3">
                  {tool.name}
                </h3>
                <p className="font-body text-small font-light text-kore-mid">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Link to="/suite" className="btn-secondary">
              {t.suiteTeaser.cta}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* === KONTAKT / CTA === */}
      <section className="section-padding bg-kore-ink">
        <div className="container-narrow text-center">
          <h2 className="font-display text-h1 text-kore-white">
            {t.contactCta.heading}
          </h2>
          <p className="font-display text-lead italic text-kore-faint mt-4 mb-10">
            {t.contactCta.lead}
          </p>
          <Link to="/audit" className="btn-brass">
            {t.contactCta.cta}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link to={href} className="card-default group hover:border-kore-brass-lt transition-colors duration-200 block">
      <div className="mb-4">{icon}</div>
      <h3 className="font-display text-h3 text-kore-ink mb-3 group-hover:text-kore-brass transition-colors">
        {title}
      </h3>
      <p className="font-body text-small font-light text-kore-mid">
        {description}
      </p>
      <div className="mt-4 flex items-center gap-2 text-kore-brass font-body text-caption uppercase tracking-widest">
        Mehr erfahren <ArrowRight size={12} />
      </div>
    </Link>
  );
}
