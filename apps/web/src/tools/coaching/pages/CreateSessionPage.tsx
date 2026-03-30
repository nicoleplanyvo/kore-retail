import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Save } from 'lucide-react';
import {
  useCoachingStores,
  useCoachingUsers,
  useCoachingTemplates,
  useCreateCoachingSession,
} from '../../../hooks/useCoaching';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { FormField } from '../../../components/FormField';
import { LoadingButton } from '../../../components/LoadingButton';

const TOPICS = ['Verkauf', 'Kundenservice', 'Führung', 'Produktwissen', 'Soft Skills'];

const GROW_SECTIONS = [
  { key: 'goalText', label: 'Goal (Ziel)', placeholder: 'Was möchten Sie in dieser Session erreichen?' },
  { key: 'realityText', label: 'Reality (Realität)', placeholder: 'Wie ist die aktuelle Situation?' },
  { key: 'optionsText', label: 'Options (Optionen)', placeholder: 'Welche Möglichkeiten gibt es?' },
  { key: 'wayForwardText', label: 'Way Forward (Weg)', placeholder: 'Welche konkreten Schritte werden unternommen?' },
];

const SMART_SECTIONS = [
  { key: 'goalText', label: 'Specific (Spezifisch)', placeholder: 'Was genau soll erreicht werden?' },
  { key: 'realityText', label: 'Measurable (Messbar)', placeholder: 'Woran messen wir den Erfolg?' },
  { key: 'optionsText', label: 'Achievable (Erreichbar)', placeholder: 'Ist das Ziel realistisch erreichbar?' },
  { key: 'wayForwardText', label: 'Relevant (Relevant)', placeholder: 'Warum ist dieses Ziel wichtig?' },
  { key: 'timelineText', label: 'Time-bound (Terminiert)', placeholder: 'Bis wann soll das Ziel erreicht werden?' },
];

export function CreateSessionPage() {
  const navigate = useNavigate();
  const { data: stores } = useCoachingStores();
  const { data: users } = useCoachingUsers();
  const { data: templates } = useCoachingTemplates();
  const create = useCreateCoachingSession();

  const [form, setForm] = useState({
    storeId: '',
    coacheeId: '',
    scheduledAt: '',
    duration: 30,
    type: 'REGULAR',
    framework: 'GROW',
    topic: '',
    category: '',
    goalText: '',
    realityText: '',
    optionsText: '',
    wayForwardText: '',
    timelineText: '',
    notes: '',
    templateId: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: any) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (formErrors[key]) setFormErrors((e) => ({ ...e, [key]: '' }));
  };

  const applyTemplate = (templateId: string) => {
    set('templateId', templateId);
    if (!templateId) return;
    const tpl = (templates ?? []).find((t: any) => t.id === templateId);
    if (!tpl) return;
    setForm((f) => ({
      ...f,
      templateId,
      framework: tpl.framework ?? f.framework,
      topic: tpl.topic ?? f.topic,
      category: tpl.category ?? f.category,
      goalText: tpl.goalText ?? f.goalText,
      realityText: tpl.realityText ?? f.realityText,
      optionsText: tpl.optionsText ?? f.optionsText,
      wayForwardText: tpl.wayForwardText ?? f.wayForwardText,
      timelineText: tpl.timelineText ?? f.timelineText,
      notes: tpl.notes ?? f.notes,
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!form.storeId) errors.storeId = 'Pflichtfeld';
    if (!form.coacheeId) errors.coacheeId = 'Pflichtfeld';
    if (!form.scheduledAt) errors.scheduledAt = 'Pflichtfeld';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    create.mutate(
      { ...form, duration: Number(form.duration) },
      { onSuccess: () => navigate('/tools/coaching') },
    );
  };

  const sections = form.framework === 'SMART' ? SMART_SECTIONS : form.framework === 'GROW' ? GROW_SECTIONS : [];

  return (
    <div className="p-xl max-w-4xl">
      <Breadcrumb items={[{ label: 'Coaching', href: '/app/tools/coaching' }, { label: 'Neue Session' }]} />
      <div className="flex items-center gap-md mb-2xl">
        <Link to="/tools/coaching" className="text-kore-mid hover:text-kore-ink transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-h1 text-kore-ink flex items-center gap-sm">
            <MessageSquare size={24} /> Neue Coaching-Session
          </h1>
          <p className="text-body text-kore-mid mt-xs">Session planen und Framework wählen</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="bg-kore-white border border-kore-border p-lg mb-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Grunddaten</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            <FormField label="Store" required error={formErrors.storeId}>
              <select value={form.storeId} onChange={(e) => set('storeId', e.target.value)} className={`w-full border px-md py-sm text-body ${formErrors.storeId ? 'border-red-500' : 'border-kore-border'}`}>
                <option value="">Store wählen...</option>
                {(stores ?? []).map((s: any) => (
                  <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ''}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Coachee" required error={formErrors.coacheeId}>
              <select value={form.coacheeId} onChange={(e) => set('coacheeId', e.target.value)} className={`w-full border px-md py-sm text-body ${formErrors.coacheeId ? 'border-red-500' : 'border-kore-border'}`}>
                <option value="">Mitarbeiter wählen...</option>
                {(users ?? []).map((u: any) => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Termin" required error={formErrors.scheduledAt}>
              <input type="datetime-local" value={form.scheduledAt} onChange={(e) => set('scheduledAt', e.target.value)} className={`w-full border px-md py-sm text-body ${formErrors.scheduledAt ? 'border-red-500' : 'border-kore-border'}`} />
            </FormField>
            <FormField label="Dauer (Minuten)" hint="Zwischen 5 und 480 Minuten">
              <input type="number" value={form.duration} onChange={(e) => set('duration', e.target.value)} min={5} max={480} className="w-full border border-kore-border px-md py-sm text-body" />
            </FormField>
            <FormField label="Typ">
              <select value={form.type} onChange={(e) => set('type', e.target.value)} className="w-full border border-kore-border px-md py-sm text-body">
                <option value="REGULAR">Regulär</option>
                <option value="AD_HOC">Ad-hoc</option>
                <option value="FOLLOW_UP">Follow-up</option>
              </select>
            </FormField>
            <FormField label="Framework" required>
              <select value={form.framework} onChange={(e) => set('framework', e.target.value)} className="w-full border border-kore-border px-md py-sm text-body">
                <option value="GROW">GROW (Goal, Reality, Options, Way forward)</option>
                <option value="SMART">SMART (Specific, Measurable, Achievable, Relevant, Time-bound)</option>
                <option value="FREE">Frei (ohne Framework)</option>
              </select>
            </FormField>
            <FormField label="Thema">
              <select value={form.topic} onChange={(e) => set('topic', e.target.value)} className="w-full border border-kore-border px-md py-sm text-body">
                <option value="">Kein Thema</option>
                {TOPICS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </FormField>
            <FormField label="Kategorie">
              <input value={form.category} onChange={(e) => set('category', e.target.value)} placeholder="Optional" className="w-full border border-kore-border px-md py-sm text-body" />
            </FormField>
          </div>
        </div>

        {/* Template Selection */}
        {templates && templates.length > 0 && (
          <div className="bg-kore-white border border-kore-border p-lg mb-xl">
            <h2 className="font-display text-h3 text-kore-ink mb-md">Vorlage anwenden</h2>
            <select value={form.templateId} onChange={(e) => applyTemplate(e.target.value)} className="w-full border border-kore-border px-md py-sm text-body">
              <option value="">Keine Vorlage</option>
              {templates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name} ({t.framework}){t.topic ? ` - ${t.topic}` : ''}</option>
              ))}
            </select>
          </div>
        )}

        {/* Framework Sections */}
        {sections.length > 0 && (
          <div className="space-y-md mb-xl">
            {sections.map((section) => (
              <div key={section.key} className="bg-kore-white border border-kore-border p-lg">
                <h2 className="font-display text-h3 text-kore-ink mb-xs">{section.label}</h2>
                <textarea
                  value={(form as any)[section.key]}
                  onChange={(e) => set(section.key, e.target.value)}
                  rows={3}
                  placeholder={section.placeholder}
                  className="w-full border border-kore-border px-md py-sm text-body"
                />
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="bg-kore-white border border-kore-border p-lg mb-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-md">Notizen</h2>
          <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={4} placeholder="Allgemeine Notizen zur Session..." className="w-full border border-kore-border px-md py-sm text-body" />
        </div>

        {/* Submit */}
        <div className="flex gap-sm">
          <LoadingButton
            type="submit"
            isLoading={create.isPending}
            loadingText="Erstellen..."
            className="flex items-center gap-xs px-lg py-sm text-small font-medium uppercase tracking-widest"
          >
            <Save size={16} /> Session erstellen
          </LoadingButton>
          <Link to="/tools/coaching" className="px-lg py-sm border border-kore-border text-small text-kore-mid hover:text-kore-ink inline-flex items-center">
            Abbrechen
          </Link>
        </div>

        {create.isError && (
          <div className="mt-md p-md bg-red-50 border border-red-200 text-red-700 text-small">
            Fehler: {(create.error as Error).message}
          </div>
        )}
      </form>
    </div>
  );
}
