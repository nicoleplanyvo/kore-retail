import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitCompareArrows } from 'lucide-react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  useRtbStores,
  useRtbComparison,
  useRtbIndicators,
  getCurrentPeriod,
  formatPeriod,
  scoreColor,
  scoreBg,
} from '../useRaiseTheBar';

// ---------- Radar-like visual (horizontal bars per indicator) ----------

function ComparisonChart({
  indicators,
  stores,
}: {
  indicators: { id: string; name: string }[];
  stores: { storeName: string; indicators: { indicatorId: string; score: number; value: number }[] }[];
}) {
  const storeColors = [
    'bg-blue-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
  ];

  return (
    <div className="space-y-lg">
      {indicators.map((ind) => (
        <div key={ind.id}>
          <p className="text-small text-kore-mid uppercase tracking-widest mb-sm">
            {ind.name}
          </p>
          <div className="space-y-xs">
            {stores.map((store, sIdx) => {
              const is = store.indicators.find((i) => i.indicatorId === ind.id);
              const score = is?.score ?? 0;
              return (
                <div key={store.storeName} className="flex items-center gap-sm">
                  <span className="text-small text-kore-ink w-28 truncate">
                    {store.storeName}
                  </span>
                  <div className="flex-1 h-5 bg-gray-100 overflow-hidden relative">
                    <div
                      className={`h-full ${storeColors[sIdx % storeColors.length]} opacity-80 transition-all`}
                      style={{ width: `${Math.min(100, score)}%` }}
                    />
                  </div>
                  <span className="text-small font-medium text-kore-ink w-16 text-right">
                    {is?.value ?? '-'} ({Math.round(score)})
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- Main ----------

export function ComparisonPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(getCurrentPeriod);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const { data: stores } = useRtbStores();
  const { data: indicators } = useRtbIndicators();
  const { data: comparisonData } = useRtbComparison(selectedIds, period);

  const toggleStore = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };

  const comparison = comparisonData?.data ?? [];

  return (
    <div className="p-xl max-w-5xl">
      <Breadcrumb
        items={[
          { label: 'Raise the Bar', href: '/app/tools/raise-the-bar' },
          { label: 'Vergleich' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/raise-the-bar')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück
      </button>

      <h1 className="font-display text-h1 text-kore-ink mb-2xl flex items-center gap-sm">
        <GitCompareArrows size={24} /> Store-Vergleich
      </h1>

      {/* Period + Store Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-xl">
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Periode
          </label>
          <input
            type="month"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
          />
        </div>
        <div>
          <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
            Stores auswählen (2-4)
          </label>
          <div className="flex flex-wrap gap-sm">
            {(stores ?? []).map((s) => {
              const isSelected = selectedIds.includes(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => toggleStore(s.id)}
                  className={`px-md py-xs text-small border transition-colors ${
                    isSelected
                      ? 'bg-kore-ink text-kore-white border-kore-ink'
                      : 'bg-kore-white text-kore-ink border-kore-border hover:bg-kore-surface'
                  }`}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedIds.length < 2 ? (
        <div className="bg-kore-white border border-kore-border p-xl text-center">
          <p className="text-body text-kore-mid">
            Bitte mindestens 2 Stores auswählen (aktuell: {selectedIds.length}).
          </p>
        </div>
      ) : comparison.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-xl text-center">
          <p className="text-body text-kore-mid">
            Keine Daten für {formatPeriod(period)}.
          </p>
        </div>
      ) : (
        <>
          {/* Side-by-side table */}
          <div className="bg-kore-white border border-kore-border overflow-x-auto mb-xl">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-kore-border bg-kore-surface">
                  <th className="px-lg py-md text-small text-kore-mid uppercase tracking-widest font-medium">
                    Indikator
                  </th>
                  {comparison.map((c) => (
                    <th
                      key={c.storeId}
                      className="px-lg py-md text-small text-kore-mid uppercase tracking-widest font-medium text-center"
                    >
                      {c.storeName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Total Score Row */}
                <tr className="border-b border-kore-border bg-gray-50 font-medium">
                  <td className="px-lg py-md text-body text-kore-ink">
                    Gesamtscore
                  </td>
                  {comparison.map((c) => (
                    <td key={c.storeId} className="px-lg py-md text-center">
                      <span className={`font-display text-h3 ${scoreColor(c.totalScore)}`}>
                        {Math.round(c.totalScore)}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* Indicator Rows */}
                {(indicators ?? []).map((ind) => (
                  <tr key={ind.id} className="border-b border-kore-border last:border-0">
                    <td className="px-lg py-md">
                      <span className="text-body text-kore-ink">{ind.name}</span>
                      <span className="text-small text-kore-faint ml-sm">
                        ({ind.unit})
                      </span>
                    </td>
                    {comparison.map((c) => {
                      const is = c.indicators.find((i) => i.indicatorId === ind.id);
                      return (
                        <td key={c.storeId} className="px-lg py-md text-center">
                          {is ? (
                            <div>
                              <span className="text-body font-medium text-kore-ink">
                                {is.value}
                              </span>
                              <div className="mt-xs">
                                <div className="w-16 h-1.5 bg-gray-100 mx-auto overflow-hidden">
                                  <div
                                    className={`h-full ${scoreBg(is.score)}`}
                                    style={{ width: `${Math.min(100, is.score)}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <span className="text-kore-faint">-</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Visual comparison */}
          <h2 className="font-display text-h3 text-kore-ink mb-md">
            Visueller Vergleich
          </h2>
          <div className="bg-kore-white border border-kore-border p-xl">
            <ComparisonChart
              indicators={indicators ?? []}
              stores={comparison}
            />
          </div>
        </>
      )}
    </div>
  );
}
