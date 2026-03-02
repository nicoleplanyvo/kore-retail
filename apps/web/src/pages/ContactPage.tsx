import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, type ContactFormInput } from '@kore/validators';
import { Send } from 'lucide-react';
import t from '../locales/de.json';

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormInput) => {
    // TODO: API call to backend
    console.log('Contact form data:', data);
    setSubmitted(true);
  };

  return (
    <div className="pt-14">
      <section className="section-padding">
        <div className="container-narrow">
          <p className="label-default mb-4">{t.contact.heading}</p>
          <h1 className="font-display text-h1 text-kore-ink">
            {t.contact.heading}
          </h1>
          <p className="font-display text-lead italic text-kore-mid mt-4 mb-12">
            {t.contact.lead}
          </p>

          {submitted ? (
            <div className="card-accent">
              <p className="font-display text-h3 text-kore-ink mb-2">Vielen Dank!</p>
              <p className="font-body text-body font-light text-kore-mid">
                {t.contact.form.success}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <div>
                <label className="label-default block mb-2">{t.contact.form.name}</label>
                <input
                  {...register('name')}
                  className="input-default"
                  placeholder="Max Mustermann"
                />
                {errors.name && (
                  <p className="font-body text-small text-kore-error mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="label-default block mb-2">{t.contact.form.email}</label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-default"
                  placeholder="max@example.com"
                />
                {errors.email && (
                  <p className="font-body text-small text-kore-error mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="label-default block mb-2">{t.contact.form.company}</label>
                <input
                  {...register('company')}
                  className="input-default"
                  placeholder="Unternehmen GmbH"
                />
              </div>

              <div>
                <label className="label-default block mb-2">{t.contact.form.message}</label>
                <textarea
                  {...register('message')}
                  className="input-default min-h-[150px] resize-y"
                  placeholder="Wie koennen wir Ihnen helfen?"
                />
                {errors.message && (
                  <p className="font-body text-small text-kore-error mt-1">{errors.message.message}</p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting} className="btn-primary self-start">
                <Send size={16} />
                {t.contact.form.submit}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
