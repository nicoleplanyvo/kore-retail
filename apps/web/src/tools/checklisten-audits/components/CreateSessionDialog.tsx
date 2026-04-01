import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus } from 'lucide-react';

interface Store { id: string; name: string; city: string | null; }

interface Props {
  type: 'AUDIT' | 'CHECKLIST';
  stores: Store[];
  templates: any[];
  onSubmit: (data: { storeId: string; templateId: string; notes?: string; dueDate?: string }) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function CreateSessionDialog({ type, stores, templates, onSubmit, onClose, isSubmitting }: Props) {
  const navigate = useNavigate();
  const [storeId, setStoreId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [notes, setNotes] = useState('');
  const [dueDate, setDueDate] = useState('');

  const filteredTemplates = templates.filter(
    (t: any) => t.templateType === type,
  );

  const title = type === 'AUDIT' ? 'Neues Audit starten' : 'Neue Checkliste starten';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId || !templateId) return;
    onSubmit({
      storeId,
      templateId,
      notes: notes || undefined,
      dueDate: dueDate || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-kore-white border border-kore-border w-full max-w-lg mx-4 p-xl">
        <div className="flex items-center justify-between mb-xl">
          <h2 className="font-display text-h2 text-kore-ink">{title}</h2>
          <button onClick={onClose} className="text-kore-mid hover:text-kore-ink transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-lg">
          <div>
            <label className="label-default">Store *</label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="input-default w-full"
              required
            >
              <option value="">Store auswählen...</option>
              {stores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-default">Template *</label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="input-default w-full"
              required
            >
              <option value="">Template auswählen...</option>
              {filteredTemplates.map((t: any) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            {filteredTemplates.length === 0 && (
              <div className="mt-sm p-md bg-kore-bg border border-kore-border">
                <p className="text-small text-kore-mid mb-sm">
                  Keine {type === 'CHECKLIST' ? 'Checklisten' : 'Audit'}-Templates vorhanden.
                </p>
                <button
                  type="button"
                  onClick={() => { onClose(); navigate('/app/tools/checklisten-audits/templates/new'); }}
                  className="flex items-center gap-xs text-small font-medium text-kore-brass hover:text-kore-brass-dk transition-colors"
                >
                  <Plus size={14} /> Jetzt Template erstellen
                </button>
              </div>
            )}
          </div>

          {type === 'CHECKLIST' && (
            <div>
              <label className="label-default">Fällig am</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input-default w-full"
              />
            </div>
          )}

          <div>
            <label className="label-default">Notizen</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Optionale Notizen..."
              rows={3}
              className="input-default w-full resize-none"
            />
          </div>

          <div className="flex justify-end gap-md pt-md">
            <button type="button" onClick={onClose}
              className="px-lg py-md-sm text-small font-medium uppercase tracking-widest border border-kore-border hover:bg-kore-bg transition-colors">
              Abbrechen
            </button>
            <button type="submit" disabled={isSubmitting || !storeId || !templateId}
              className="px-lg py-md-sm text-small font-medium uppercase tracking-widest bg-kore-ink text-kore-white hover:bg-kore-brass transition-colors disabled:opacity-50">
              {isSubmitting ? 'Wird erstellt...' : 'Starten'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
