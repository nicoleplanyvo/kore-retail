import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  GripVertical,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  useRtbIndicators,
  useCreateIndicator,
  useUpdateIndicator,
  useDeleteIndicator,
  useReorderIndicators,
  type RtbIndicator,
} from '../useRaiseTheBar';

const UNIT_OPTIONS = ['%', '\u20AC', 'Stück', 'Score', 'Min', 'Std'];
const MAX_INDICATORS = 10;

// ---------- Indicator Form ----------

interface IndicatorFormData {
  name: string;
  unit: string;
  weight: number;
  targetValue: string;
  higherIsBetter: boolean;
}

function emptyForm(): IndicatorFormData {
  return { name: '', unit: '%', weight: 0, targetValue: '', higherIsBetter: true };
}

// ---------- Main ----------

export function SettingsPage() {
  const navigate = useNavigate();
  const { data: indicators, isLoading } = useRtbIndicators();
  const createMut = useCreateIndicator();
  const updateMut = useUpdateIndicator();
  const deleteMut = useDeleteIndicator();
  const reorderMut = useReorderIndicators();
  const [newForm, setNewForm] = useState<IndicatorFormData>(emptyForm());
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<IndicatorFormData>(emptyForm());

  const totalWeight = (indicators ?? []).reduce((s, i) => s + i.weight, 0);
  const weightPct = Math.round(totalWeight * 100);
  const canAdd = (indicators ?? []).length < MAX_INDICATORS;

  const handleCreate = () => {
    if (!newForm.name) return;
    createMut.mutate(
      {
        name: newForm.name,
        unit: newForm.unit,
        weight: newForm.weight / 100,
        targetValue: newForm.targetValue ? Number(newForm.targetValue) : null,
        higherIsBetter: newForm.higherIsBetter,
      },
      { onSuccess: () => setNewForm(emptyForm()) },
    );
  };

  const startEdit = (ind: RtbIndicator) => {
    setEditId(ind.id);
    setEditForm({
      name: ind.name,
      unit: ind.unit,
      weight: Math.round(ind.weight * 100),
      targetValue: ind.targetValue !== null ? String(ind.targetValue) : '',
      higherIsBetter: ind.higherIsBetter,
    });
  };

  const handleUpdate = () => {
    if (!editId || !editForm.name) return;
    updateMut.mutate(
      {
        id: editId,
        name: editForm.name,
        unit: editForm.unit,
        weight: editForm.weight / 100,
        targetValue: editForm.targetValue ? Number(editForm.targetValue) : null,
        higherIsBetter: editForm.higherIsBetter,
      },
      { onSuccess: () => setEditId(null) },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Indikator wirklich deaktivieren?')) return;
    deleteMut.mutate(id);
  };

  const handleSaveWeights = () => {
    if (!indicators) return;
    const payload = indicators.map((ind, idx) => ({
      id: ind.id,
      weight: ind.weight,
      sortOrder: idx,
    }));
    reorderMut.mutate(payload);
  };

  return (
    <div className="p-xl max-w-3xl">
      <Breadcrumb
        items={[
          { label: 'Raise the Bar', href: '/app/tools/raise-the-bar' },
          { label: 'Einstellungen' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/raise-the-bar')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück
      </button>

      <h1 className="font-display text-h1 text-kore-ink mb-sm">
        KPI-Indikatoren definieren
      </h1>
      <p className="text-body text-kore-mid mb-xl">
        Maximal {MAX_INDICATORS} Indikatoren. Die Summe der Gewichtungen muss 100% ergeben.
      </p>

      {/* Weight Sum Indicator */}
      <div className={`flex items-center gap-sm mb-xl p-md border ${
        Math.abs(weightPct - 100) <= 1
          ? 'border-emerald-200 bg-emerald-50'
          : 'border-amber-200 bg-amber-50'
      }`}>
        {Math.abs(weightPct - 100) <= 1 ? (
          <CheckCircle size={16} className="text-emerald-600" />
        ) : (
          <AlertCircle size={16} className="text-amber-600" />
        )}
        <span className="text-small font-medium">
          Gewichtungssumme: {weightPct}%
          {Math.abs(weightPct - 100) > 1 && ' (muss 100% ergeben)'}
        </span>
      </div>

      {/* Existing Indicators */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade...</div>
      ) : (
        <div className="space-y-sm mb-xl">
          {(indicators ?? []).map((ind) => (
            <div
              key={ind.id}
              className="bg-kore-white border border-kore-border p-lg"
            >
              {editId === ind.id ? (
                <IndicatorEditRow
                  form={editForm}
                  onChange={setEditForm}
                  onSave={handleUpdate}
                  onCancel={() => setEditId(null)}
                  isSaving={updateMut.isPending}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-md">
                    <GripVertical size={16} className="text-kore-faint cursor-grab" />
                    <div>
                      <span className="text-body font-medium text-kore-ink">
                        {ind.name}
                      </span>
                      <div className="flex items-center gap-md mt-xs">
                        <span className="text-small text-kore-mid">
                          Einheit: {ind.unit}
                        </span>
                        <span className="text-small text-kore-mid">
                          Gewichtung: {Math.round(ind.weight * 100)}%
                        </span>
                        {ind.targetValue !== null && (
                          <span className="text-small text-kore-mid">
                            Ziel: {ind.targetValue} {ind.unit}
                          </span>
                        )}
                        <span className="text-small text-kore-faint">
                          {ind.higherIsBetter ? 'Höher = besser' : 'Niedriger = besser'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-sm">
                    <button
                      onClick={() => startEdit(ind)}
                      className="text-small text-kore-mid hover:text-kore-ink px-sm py-xs"
                    >
                      Bearbeiten
                    </button>
                    <button
                      onClick={() => handleDelete(ind.id)}
                      className="text-small text-red-500 hover:text-red-700 px-sm py-xs"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Save Reorder */}
      {indicators && indicators.length > 0 && (
        <div className="mb-xl">
          <button
            onClick={handleSaveWeights}
            disabled={reorderMut.isPending}
            className="flex items-center gap-sm px-md py-sm border border-kore-border text-small text-kore-ink hover:bg-kore-surface disabled:opacity-50"
          >
            <Save size={14} /> Reihenfolge speichern
          </button>
        </div>
      )}

      {/* Add New Indicator */}
      {canAdd && (
        <div className="bg-kore-white border border-kore-border p-xl">
          <h3 className="font-display text-h3 text-kore-ink mb-md flex items-center gap-sm">
            <Plus size={18} /> Neuer Indikator
          </h3>
          <IndicatorEditRow
            form={newForm}
            onChange={setNewForm}
            onSave={handleCreate}
            isSaving={createMut.isPending}
          />
          {createMut.isError && (
            <div className="mt-sm flex items-center gap-sm text-small text-red-600">
              <AlertCircle size={14} />
              {(createMut.error as Error).message}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Indicator Edit Row ----------

function IndicatorEditRow({
  form,
  onChange,
  onSave,
  onCancel,
  isSaving,
}: {
  form: IndicatorFormData;
  onChange: (f: IndicatorFormData) => void;
  onSave: () => void;
  onCancel?: () => void;
  isSaving: boolean;
}) {
  return (
    <div className="space-y-md">
      <div className="grid grid-cols-2 gap-md">
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-xs">
            Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => onChange({ ...form, name: e.target.value })}
            placeholder="z.B. Umsatz/m²"
            className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-xs">
            Einheit
          </label>
          <select
            value={form.unit}
            onChange={(e) => onChange({ ...form, unit: e.target.value })}
            className="w-full border border-kore-border px-md py-sm text-body bg-white focus:outline-none focus:border-kore-brass"
          >
            {UNIT_OPTIONS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-md">
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-xs">
            Gewichtung (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={form.weight}
            onChange={(e) => onChange({ ...form, weight: Number(e.target.value) })}
            className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-xs">
            Zielwert (optional)
          </label>
          <input
            type="number"
            step="0.01"
            value={form.targetValue}
            onChange={(e) => onChange({ ...form, targetValue: e.target.value })}
            placeholder="z.B. 95"
            className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-xs">
            Richtung
          </label>
          <button
            type="button"
            onClick={() => onChange({ ...form, higherIsBetter: !form.higherIsBetter })}
            className={`w-full border px-md py-sm text-body text-left ${
              form.higherIsBetter
                ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : 'border-red-300 bg-red-50 text-red-700'
            }`}
          >
            {form.higherIsBetter ? 'Höher = besser' : 'Niedriger = besser'}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <button
          onClick={onSave}
          disabled={!form.name || isSaving}
          className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors disabled:opacity-50"
        >
          <Save size={14} /> Speichern
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-lg py-sm text-small text-kore-mid hover:text-kore-ink"
          >
            Abbrechen
          </button>
        )}
      </div>
    </div>
  );
}
