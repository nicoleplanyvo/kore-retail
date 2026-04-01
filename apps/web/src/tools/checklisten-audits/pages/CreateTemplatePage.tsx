import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useCreateCATemplate } from '../useChecklistenAudits';
import { Breadcrumb } from '../../../components/Breadcrumb';

interface CriterionDraft {
  label: string;
  description: string;
  type: 'SCORED' | 'BOOLEAN' | 'TEXT' | 'NUMBER';
  isRequired: boolean;
  photoRequired: boolean;
  weight: number;
}

interface CategoryDraft {
  name: string;
  description: string;
  weight: number;
  criteria: CriterionDraft[];
}

const EMPTY_CRITERION: CriterionDraft = {
  label: '', description: '', type: 'SCORED', isRequired: true,
  photoRequired: false, weight: 1,
};

const EMPTY_CATEGORY: CategoryDraft = {
  name: '', description: '', weight: 0, criteria: [{ ...EMPTY_CRITERION }],
};

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const createTemplate = useCreateCATemplate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateType, setTemplateType] = useState<'AUDIT' | 'CHECKLIST'>('AUDIT');
  const [recurrence, setRecurrence] = useState('');
  const [categories, setCategories] = useState<CategoryDraft[]>([{ ...EMPTY_CATEGORY }]);

  const weightSum = categories.reduce((s, c) => s + c.weight, 0);
  const isAudit = templateType === 'AUDIT';
  const weightsValid = !isAudit || Math.abs(weightSum - 100) < 0.5;

  const updateCategory = (idx: number, patch: Partial<CategoryDraft>) => {
    setCategories((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    );
  };

  const removeCategory = (idx: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== idx));
  };

  const addCategory = () => {
    setCategories((prev) => [...prev, { ...EMPTY_CATEGORY, criteria: [{ ...EMPTY_CRITERION }] }]);
  };

  const updateCriterion = (catIdx: number, critIdx: number, patch: Partial<CriterionDraft>) => {
    setCategories((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, criteria: cat.criteria.map((cr, cri) => (cri === critIdx ? { ...cr, ...patch } : cr)) }
          : cat,
      ),
    );
  };

  const removeCriterion = (catIdx: number, critIdx: number) => {
    setCategories((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, criteria: cat.criteria.filter((_, cri) => cri !== critIdx) }
          : cat,
      ),
    );
  };

  const addCriterion = (catIdx: number) => {
    setCategories((prev) =>
      prev.map((cat, ci) =>
        ci === catIdx
          ? { ...cat, criteria: [...cat.criteria, { ...EMPTY_CRITERION }] }
          : cat,
      ),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || categories.length === 0) return;

    try {
      await createTemplate.mutateAsync({
        name,
        description: description || undefined,
        templateType,
        recurrence: recurrence || undefined,
        categories: categories.map((cat, ci) => ({
          name: cat.name,
          description: cat.description || undefined,
          weight: isAudit ? cat.weight : 1,
          sortOrder: ci,
          criteria: cat.criteria.map((crit, cri) => ({
            label: crit.label,
            description: crit.description || undefined,
            type: crit.type,
            isRequired: crit.isRequired,
            photoRequired: crit.photoRequired,
            weight: crit.weight,
            sortOrder: cri,
          })),
        })),
      });
      navigate('/app/tools/checklisten-audits/templates');
    } catch { /* error handled by mutation */ }
  };

  return (
    <div className="p-xl max-w-4xl">
      <Breadcrumb items={[
        { label: 'Checklisten & Audits', href: '/app/tools/checklisten-audits' },
        { label: 'Templates', href: '/app/tools/checklisten-audits/templates' },
        { label: 'Neues Template' },
      ]} />

      <h1 className="font-display text-h1 text-kore-ink mb-2xl">Neues Template erstellen</h1>

      <form onSubmit={handleSubmit} className="space-y-xl">
        {/* Basic Info */}
        <div className="bg-kore-white border border-kore-border p-xl space-y-lg">
          <div className="grid grid-cols-2 gap-lg">
            <div>
              <label className="label-default">Name *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="input-default w-full" placeholder="Template-Name" required />
            </div>
            <div>
              <label className="label-default">Typ *</label>
              <select value={templateType} onChange={(e) => setTemplateType(e.target.value as 'AUDIT' | 'CHECKLIST')}
                className="input-default w-full">
                <option value="AUDIT">Audit (gewichteter Score)</option>
                <option value="CHECKLIST">Checkliste (Abhaken)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-default">Beschreibung</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="input-default w-full resize-none" rows={2} placeholder="Optionale Beschreibung..." />
          </div>
          {templateType === 'CHECKLIST' && (
            <div>
              <label className="label-default">Wiederholung</label>
              <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}
                className="input-default w-full">
                <option value="">Keine</option>
                <option value="daily">Täglich</option>
                <option value="weekly">Wöchentlich</option>
                <option value="monthly">Monatlich</option>
              </select>
            </div>
          )}
        </div>

        {/* Weight indicator */}
        {isAudit && (
          <div className={`text-small font-medium px-lg py-sm border ${weightsValid ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'border-red-300 bg-red-50 text-red-700'}`}>
            Kategorie-Gewichte: {weightSum} / 100 {weightsValid ? '(OK)' : '(muss 100 ergeben)'}
          </div>
        )}

        {/* Categories */}
        {categories.map((cat, catIdx) => (
          <CategoryEditor
            key={catIdx}
            category={cat}
            index={catIdx}
            isAudit={isAudit}
            onUpdate={(patch) => updateCategory(catIdx, patch)}
            onRemove={() => removeCategory(catIdx)}
            onUpdateCriterion={(critIdx, patch) => updateCriterion(catIdx, critIdx, patch)}
            onRemoveCriterion={(critIdx) => removeCriterion(catIdx, critIdx)}
            onAddCriterion={() => addCriterion(catIdx)}
          />
        ))}

        <button type="button" onClick={addCategory}
          className="flex items-center gap-sm text-small text-kore-brass hover:text-kore-brass-dk transition-colors">
          <Plus size={16} /> Kategorie hinzufügen
        </button>

        {/* Submit */}
        <div className="flex justify-end gap-md">
          <button type="button" onClick={() => navigate(-1)}
            className="px-lg py-md-sm text-small font-medium uppercase tracking-widest border border-kore-border hover:bg-kore-bg transition-colors">
            Abbrechen
          </button>
          <button type="submit" disabled={createTemplate.isPending || !name || !weightsValid}
            className="px-lg py-md-sm text-small font-medium uppercase tracking-widest bg-kore-ink text-kore-white hover:bg-kore-brass transition-colors disabled:opacity-50">
            {createTemplate.isPending ? 'Wird erstellt...' : 'Template erstellen'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ── CategoryEditor ─────────────────────────────────

function CategoryEditor({
  category, index, isAudit, onUpdate, onRemove,
  onUpdateCriterion, onRemoveCriterion, onAddCriterion,
}: {
  category: CategoryDraft;
  index: number;
  isAudit: boolean;
  onUpdate: (patch: Partial<CategoryDraft>) => void;
  onRemove: () => void;
  onUpdateCriterion: (critIdx: number, patch: Partial<CriterionDraft>) => void;
  onRemoveCriterion: (critIdx: number) => void;
  onAddCriterion: () => void;
}) {
  return (
    <div className="bg-kore-white border border-kore-border">
      <div className="flex items-center justify-between p-lg border-b border-kore-border">
        <div className="flex items-center gap-md flex-1">
          <GripVertical size={16} className="text-kore-faint" />
          <input type="text" value={category.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            className="input-default flex-1" placeholder={`Kategorie ${index + 1}`} required />
          {isAudit && (
            <div className="flex items-center gap-xs">
              <label className="text-caption text-kore-mid">Gewicht:</label>
              <input type="number" value={category.weight}
                onChange={(e) => onUpdate({ weight: parseFloat(e.target.value) || 0 })}
                className="input-default w-20 text-center" min={0} max={100} step={0.1} />
            </div>
          )}
        </div>
        <button type="button" onClick={onRemove} className="p-sm text-kore-mid hover:text-red-600 transition-colors ml-md">
          <Trash2 size={16} />
        </button>
      </div>

      <div className="p-lg space-y-sm">
        {category.criteria.map((crit, critIdx) => (
          <CriterionEditor
            key={critIdx}
            criterion={crit}
            isAudit={isAudit}
            onUpdate={(patch) => onUpdateCriterion(critIdx, patch)}
            onRemove={() => onRemoveCriterion(critIdx)}
          />
        ))}
        <button type="button" onClick={onAddCriterion}
          className="flex items-center gap-xs text-caption text-kore-brass hover:text-kore-brass-dk transition-colors">
          <Plus size={14} /> Kriterium hinzufügen
        </button>
      </div>
    </div>
  );
}

// ── CriterionEditor ────────────────────────────────

function CriterionEditor({
  criterion, isAudit, onUpdate, onRemove,
}: {
  criterion: CriterionDraft;
  isAudit: boolean;
  onUpdate: (patch: Partial<CriterionDraft>) => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-start gap-md p-md bg-kore-bg border border-kore-border">
      <div className="flex-1 space-y-sm">
        <input type="text" value={criterion.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="input-default w-full text-small" placeholder="Kriterium-Name" required />
        <div className="flex items-center gap-md">
          <select value={criterion.type}
            onChange={(e) => onUpdate({ type: e.target.value as CriterionDraft['type'] })}
            className="input-default text-caption">
            <option value="SCORED">Score (0-100%)</option>
            <option value="BOOLEAN">Ja/Nein</option>
            <option value="TEXT">Freitext</option>
            <option value="NUMBER">Zahl</option>
          </select>
          <label className="flex items-center gap-xs text-caption text-kore-mid cursor-pointer">
            <input type="checkbox" checked={criterion.isRequired}
              onChange={(e) => onUpdate({ isRequired: e.target.checked })}
              className="accent-kore-brass" />
            Pflicht
          </label>
          <label className="flex items-center gap-xs text-caption text-kore-mid cursor-pointer">
            <input type="checkbox" checked={criterion.photoRequired}
              onChange={(e) => onUpdate({ photoRequired: e.target.checked })}
              className="accent-kore-brass" />
            Foto
          </label>
        </div>
      </div>
      <button type="button" onClick={onRemove} className="p-xs text-kore-mid hover:text-red-600 transition-colors">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
