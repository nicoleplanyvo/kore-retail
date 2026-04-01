import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  CheckCircle,
  AlertCircle,
  Copy,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  useRtbStores,
  useRtbIndicators,
  useRtbEntries,
  useBulkUpsertEntries,
  getCurrentPeriod,
  formatPeriod,
} from '../useRaiseTheBar';

// ---------- Helpers ----------

function getPreviousPeriod(period: string): string {
  const [yearStr, monthStr] = period.split('-');
  const year = parseInt(yearStr ?? '2026', 10);
  const month = parseInt(monthStr ?? '1', 10);
  const prev = month === 1 ? new Date(year - 1, 11, 1) : new Date(year, month - 2, 1);
  return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
}

// ---------- Main ----------

export function DataEntryPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(getCurrentPeriod);
  const [storeId, setStoreId] = useState('');
  const { data: stores } = useRtbStores();
  const { data: indicators } = useRtbIndicators();
  const { data: entries } = useRtbEntries(period, storeId || undefined);
  const prevPeriod = useMemo(() => getPreviousPeriod(period), [period]);
  const { data: prevEntries } = useRtbEntries(prevPeriod, storeId || undefined);
  const saveMut = useBulkUpsertEntries();

  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  // Populate from existing entries
  useEffect(() => {
    if (!entries) return;
    const next: Record<string, string> = {};
    for (const e of entries) {
      next[e.indicatorId] = String(e.value);
    }
    setValues(next);
    setSaved(false);
  }, [entries]);

  // Auto-select first store
  useEffect(() => {
    if (!storeId && stores?.length) {
      setStoreId(stores[0].id);
    }
  }, [stores, storeId]);

  const handleChange = (indicatorId: string, val: string) => {
    setValues((prev) => ({ ...prev, [indicatorId]: val }));
    setSaved(false);
  };

  const handleFillFromPrev = () => {
    if (!prevEntries) return;
    const next: Record<string, string> = { ...values };
    for (const e of prevEntries) {
      if (!next[e.indicatorId]) {
        next[e.indicatorId] = String(e.value);
      }
    }
    setValues(next);
    setSaved(false);
  };

  const handleSave = () => {
    if (!storeId || !period) return;
    const numericValues: Record<string, number> = {};
    for (const [key, val] of Object.entries(values)) {
      const num = parseFloat(val);
      if (!isNaN(num)) numericValues[key] = num;
    }
    saveMut.mutate(
      { storeId, period, values: numericValues },
      { onSuccess: () => setSaved(true) },
    );
  };

  return (
    <div className="p-xl max-w-3xl">
      <Breadcrumb
        items={[
          { label: 'Raise the Bar', href: '/app/tools/raise-the-bar' },
          { label: 'Daten eingeben' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/raise-the-bar')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück
      </button>

      <h1 className="font-display text-h1 text-kore-ink mb-2xl">
        Daten eingeben
      </h1>

      {/* Selectors */}
      <div className="grid grid-cols-2 gap-md mb-xl">
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Periode
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="w-full border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Store
          </label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            className="w-full border border-kore-border px-md py-sm text-body bg-white focus:outline-none focus:border-kore-brass"
          >
            <option value="">Store wählen...</option>
            {(stores ?? []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
                {s.city ? ` (${s.city})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Fill Button */}
      <div className="flex items-center gap-sm mb-xl">
        <button
          onClick={handleFillFromPrev}
          disabled={!prevEntries || prevEntries.length === 0}
          className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-ink hover:bg-kore-surface disabled:opacity-30"
        >
          <Copy size={14} /> Aus {formatPeriod(prevPeriod)} übernehmen
        </button>
      </div>

      {/* Indicator Inputs */}
      {!indicators || indicators.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-xl text-center">
          <p className="text-body text-kore-mid mb-md">
            Noch keine Indikatoren definiert.
          </p>
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/settings')}
            className="inline-flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90"
          >
            Einstellungen öffnen
          </button>
        </div>
      ) : (
        <div className="bg-kore-white border border-kore-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-kore-border bg-kore-surface">
                <th className="px-lg py-md text-left text-small text-kore-mid uppercase tracking-widest font-medium">
                  Indikator
                </th>
                <th className="px-lg py-md text-left text-small text-kore-mid uppercase tracking-widest font-medium w-24">
                  Einheit
                </th>
                <th className="px-lg py-md text-left text-small text-kore-mid uppercase tracking-widest font-medium w-32">
                  Ziel
                </th>
                <th className="px-lg py-md text-left text-small text-kore-mid uppercase tracking-widest font-medium w-40">
                  Wert
                </th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((ind) => (
                <tr key={ind.id} className="border-b border-kore-border last:border-0">
                  <td className="px-lg py-md">
                    <span className="text-body font-medium text-kore-ink">
                      {ind.name}
                    </span>
                    <span className="text-small text-kore-faint ml-sm">
                      ({Math.round(ind.weight * 100)}%)
                    </span>
                  </td>
                  <td className="px-lg py-md text-small text-kore-mid">
                    {ind.unit}
                  </td>
                  <td className="px-lg py-md text-small text-kore-mid">
                    {ind.targetValue !== null ? `${ind.targetValue} ${ind.unit}` : '-'}
                  </td>
                  <td className="px-lg py-md">
                    <input
                      type="number"
                      step="0.01"
                      value={values[ind.id] ?? ''}
                      onChange={(e) => handleChange(ind.id, e.target.value)}
                      placeholder="0"
                      className="w-full border border-kore-border px-md py-sm text-body focus:outline-none focus:border-kore-brass"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Save */}
      <div className="mt-xl flex items-center gap-md">
        <button
          onClick={handleSave}
          disabled={!storeId || saveMut.isPending}
          className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors disabled:opacity-50"
        >
          <Save size={16} /> Speichern
        </button>
        {saved && (
          <span className="flex items-center gap-xs text-small text-emerald-600">
            <CheckCircle size={14} /> Gespeichert!
          </span>
        )}
        {saveMut.isError && (
          <span className="flex items-center gap-xs text-small text-red-600">
            <AlertCircle size={14} />
            {(saveMut.error as Error).message}
          </span>
        )}
      </div>
    </div>
  );
}
