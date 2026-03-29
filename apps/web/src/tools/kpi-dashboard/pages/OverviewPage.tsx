import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, List, AlertCircle } from 'lucide-react';
import { useKpiStores, useKpiSummaryYoY } from '../../../hooks/useKpi';
import type { KpiYoYChange, KpiYoYMetrics, KpiYoYSummary } from '../../../hooks/useKpi';

/* ── helpers ── */

const currentYear = new Date().getFullYear();

function fmtCurrency(v: number) {
  return v.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
}

function fmtNum(v: number, decimals = 0) {
  return v.toLocaleString('de-DE', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function fmtPct(v: number) {
  const sign = v > 0 ? '+' : '';
  return `${sign}${v.toFixed(1)} %`;
}

/* ── KPI card definitions ── */

interface KpiCardDef {
  key: keyof KpiYoYMetrics & keyof KpiYoYSummary['changes'];
  label: string;
  format: (v: number) => string;
}

const KPI_CARDS: KpiCardDef[] = [
  { key: 'revenue', label: 'Umsatz', format: fmtCurrency },
  { key: 'transactions', label: 'Transaktionen', format: (v) => fmtNum(v) },
  { key: 'conversionRate', label: 'Konversionsrate', format: (v) => `${fmtNum(v, 1)} %` },
  { key: 'avgBasket', label: '\u00D8 Warenkorb', format: fmtCurrency },
  { key: 'unitsPerTransaction', label: 'Artikel pro Transaktion', format: (v) => fmtNum(v, 1) },
];

/* ── sub-components ── */

function ChangeIndicator({ change }: { change: KpiYoYChange }) {
  if (change.value === 0) {
    return <span className="text-kore-mid text-caption">&mdash; 0 %</span>;
  }
  return (
    <span className={`text-caption font-medium ${change.improved ? 'text-emerald-600' : 'text-red-600'}`}>
      {change.improved ? '\u2191' : '\u2193'} {fmtPct(change.value)}
    </span>
  );
}

function BarComparison({ current, previous, label }: { current: number; previous: number; label: string }) {
  const max = Math.max(current, previous, 1);
  const currentPct = Math.round((current / max) * 100);
  const previousPct = Math.round((previous / max) * 100);
  return (
    <div className="mt-md">
      <div className="flex items-center gap-sm mb-xs">
        <span className="text-caption text-kore-mid w-20 shrink-0">{label}</span>
        <div className="flex-1 h-3 bg-kore-bg rounded overflow-hidden">
          <div className="h-full bg-kore-ink rounded" style={{ width: `${currentPct}%` }} />
        </div>
      </div>
      <div className="flex items-center gap-sm">
        <span className="text-caption text-kore-mid w-20 shrink-0">Vorjahr</span>
        <div className="flex-1 h-3 bg-kore-bg rounded overflow-hidden">
          <div className="h-full bg-kore-faint rounded" style={{ width: `${previousPct}%` }} />
        </div>
      </div>
    </div>
  );
}

function KpiCard({ def, currentMetrics, previousMetrics, change, yearLabel }: {
  def: KpiCardDef;
  currentMetrics: KpiYoYMetrics;
  previousMetrics: KpiYoYMetrics;
  change: KpiYoYChange;
  yearLabel: number;
}) {
  const curVal = currentMetrics[def.key] as number;
  const prevVal = previousMetrics[def.key] as number;

  return (
    <div className="bg-kore-white border border-kore-border p-xl flex flex-col">
      <div className="flex items-start justify-between mb-sm">
        <span className="text-caption text-kore-mid uppercase tracking-widest">{def.label}</span>
        <ChangeIndicator change={change} />
      </div>
      <div className="font-display text-h2 text-kore-ink">{def.format(curVal)}</div>
      <div className="text-small text-kore-mid mt-xs">
        Vorjahr: {def.format(prevVal)}
      </div>
      <BarComparison current={curVal} previous={prevVal} label={String(yearLabel)} />
    </div>
  );
}

function PerformanceScorecard({ changes }: { changes: KpiYoYSummary['changes'] }) {
  const improved = Object.values(changes).filter((c) => c.improved).length;
  const total = Object.values(changes).length;
  const score = Math.round((improved / total) * 100);

  let bgColor = 'bg-emerald-50 border-emerald-200';
  let textColor = 'text-emerald-700';
  let statusLabel = 'Stark';
  if (score < 40) {
    bgColor = 'bg-red-50 border-red-200';
    textColor = 'text-red-700';
    statusLabel = 'Unter Vorjahr';
  } else if (score < 80) {
    bgColor = 'bg-amber-50 border-amber-200';
    textColor = 'text-amber-700';
    statusLabel = 'Gemischt';
  }

  return (
    <div className={`border p-xl mb-2xl ${bgColor}`}>
      <div className="flex items-center justify-between">
        <div>
          <span className="text-caption uppercase tracking-widest text-kore-mid">Gesamtbewertung</span>
          <div className={`font-display text-h1 mt-xs ${textColor}`}>{statusLabel}</div>
        </div>
        <div className="text-right">
          <div className={`font-display text-h1 ${textColor}`}>{improved}/{total}</div>
          <span className="text-caption text-kore-mid">KPIs verbessert</span>
        </div>
      </div>
    </div>
  );
}

/* ── main page ── */

export function OverviewPage() {
  const { data: stores, isLoading: storesLoading } = useKpiStores();
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // auto-select first store
  const storeId = useMemo(() => {
    if (selectedStoreId) return selectedStoreId;
    if (stores && stores.length > 0) return stores[0].id as string;
    return '';
  }, [selectedStoreId, stores]);

  const { data: yoy, isLoading: yoyLoading, isError, error } = useKpiSummaryYoY(storeId, selectedYear);

  const isLoading = storesLoading || yoyLoading;

  const yearOptions = useMemo(() => {
    const opts: number[] = [];
    for (let y = currentYear; y >= currentYear - 5; y--) opts.push(y);
    return opts;
  }, []);

  return (
    <div className="p-xl max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2xl flex-wrap gap-md">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">KPI Dashboard</h1>
          <p className="text-body text-kore-mid mt-xs">Jahresvergleich: Performance Year-over-Year</p>
        </div>
        <div className="flex gap-md">
          <Link to="/app/tools/kpi/trends" className="flex items-center gap-sm border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors">
            <TrendingUp size={16} /> Trends
          </Link>
          <Link to="/app/tools/kpi/entries" className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
            <List size={16} /> Alle Eintraege
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-md mb-2xl flex-wrap">
        <div className="flex flex-col gap-xs">
          <label className="text-caption text-kore-mid uppercase tracking-widest">Store</label>
          <select
            value={storeId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            className="border border-kore-border bg-kore-white px-md py-sm text-body text-kore-ink min-w-[200px]"
          >
            {storesLoading && <option value="">Lade...</option>}
            {stores?.map((s: any) => (
              <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ''}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-xs">
          <label className="text-caption text-kore-mid uppercase tracking-widest">Jahr</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-kore-border bg-kore-white px-md py-sm text-body text-kore-ink"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-body text-kore-mid py-3xl text-center">Lade Daten...</div>
      )}

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 p-xl flex items-center gap-md mb-2xl">
          <AlertCircle size={20} className="text-red-600 shrink-0" />
          <div>
            <p className="text-body text-red-700 font-medium">Fehler beim Laden der YoY-Daten</p>
            <p className="text-small text-red-600">{(error as Error)?.message || 'Unbekannter Fehler'}</p>
          </div>
        </div>
      )}

      {/* No store selected */}
      {!storeId && !storesLoading && (
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <BarChart3 size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">Kein Store verfuegbar</h2>
          <p className="text-body text-kore-mid max-w-md">Es sind keine Stores fuer dieses Tool hinterlegt.</p>
        </div>
      )}

      {/* YoY data */}
      {yoy && !isLoading && (
        <>
          {/* Scorecard */}
          <PerformanceScorecard changes={yoy.changes} />

          {/* Period label */}
          <div className="flex items-center gap-sm mb-xl">
            <span className="inline-block w-4 h-4 bg-kore-ink rounded" />
            <span className="text-small text-kore-ink font-medium">{yoy.year}</span>
            <span className="inline-block w-4 h-4 bg-kore-faint rounded ml-md" />
            <span className="text-small text-kore-mid font-medium">{yoy.prevYear}</span>
            <span className="text-small text-kore-mid ml-md">
              ({yoy.currentYear.entryCount} / {yoy.previousYear.entryCount} Eintraege)
            </span>
          </div>

          {/* KPI cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-xl mb-2xl">
            {KPI_CARDS.map((def) => (
              <KpiCard
                key={def.key}
                def={def}
                currentMetrics={yoy.currentYear}
                previousMetrics={yoy.previousYear}
                change={yoy.changes[def.key]}
                yearLabel={yoy.year}
              />
            ))}
          </div>

          {/* Empty data hint */}
          {yoy.currentYear.entryCount === 0 && yoy.previousYear.entryCount === 0 && (
            <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
              <BarChart3 size={48} className="text-kore-faint mb-lg" />
              <h2 className="font-display text-h2 text-kore-ink mb-md">Noch keine KPI-Daten</h2>
              <p className="text-body text-kore-mid max-w-md mb-xl">Erfassen Sie taegliche Kennzahlen, um Ihren Store-Performance-Ueberblick zu starten.</p>
              <Link to="/app/tools/kpi/entries" className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
                <List size={16} /> KPIs erfassen
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
