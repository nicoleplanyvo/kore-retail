import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, TrendingUp, TrendingDown, Minus, List, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useKpiSummaryYoY, useKpiStores, type YoYPeriodData, type YoYChanges } from '../../../hooks/useKpi';
import { StatCardsSkeleton } from '../../../components/Skeleton';
import { Breadcrumb } from '../../../components/Breadcrumb';

/* ---------- helpers ---------- */

function fmtEur(n: number, decimals = 0): string {
  return n.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: decimals });
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function currentMonthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Return month label like "Maerz 2026" */
function monthLabel(dateStr: string): string {
  const months = ['Januar', 'Februar', 'Maerz', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  const d = new Date(dateStr);
  return `${months[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---------- period presets ---------- */

type PeriodPreset = 'mtd' | 'qtd' | 'ytd' | 'custom';

function getPeriodDates(preset: PeriodPreset): { from: string; to: string } {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const today = todayStr();
  switch (preset) {
    case 'mtd':
      return { from: `${y}-${String(m + 1).padStart(2, '0')}-01`, to: today };
    case 'qtd': {
      const qStart = Math.floor(m / 3) * 3;
      return { from: `${y}-${String(qStart + 1).padStart(2, '0')}-01`, to: today };
    }
    case 'ytd':
      return { from: `${y}-01-01`, to: today };
    default:
      return { from: currentMonthStart(), to: today };
  }
}

/* ---------- Ampel (traffic light) ---------- */

function ampelColor(change: number | null): 'green' | 'red' | 'neutral' {
  if (change === null) return 'neutral';
  if (change > 0) return 'green';
  if (change < 0) return 'red';
  return 'neutral';
}

function ChangeIndicator({ change, label, invertColor }: { change: number | null; label?: string; invertColor?: boolean }) {
  if (change === null) {
    return (
      <span className="inline-flex items-center gap-1 text-kore-faint text-small">
        <Minus size={12} />
        <span>vs. VJ: k.A.</span>
      </span>
    );
  }

  // For conversion, higher is always better. For some KPIs lower might be better (invertColor)
  const effectiveChange = invertColor ? -change : change;
  const isPositive = effectiveChange > 0;
  const isNegative = effectiveChange < 0;

  const colorClass = isPositive
    ? 'text-emerald-600'
    : isNegative
    ? 'text-red-600'
    : 'text-kore-faint';

  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : Minus;

  return (
    <span className={`inline-flex items-center gap-1 ${colorClass} text-small font-medium`}>
      <Icon size={13} strokeWidth={2.5} />
      <span>vs. VJ: {change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
      {label && <span className="text-kore-faint font-normal ml-1">({label})</span>}
    </span>
  );
}

function AmpelDot({ change }: { change: number | null }) {
  const c = ampelColor(change);
  const bg = c === 'green' ? 'bg-emerald-500' : c === 'red' ? 'bg-red-500' : 'bg-gray-300';
  return <span className={`inline-block w-2.5 h-2.5 rounded-full ${bg}`} />;
}

/* ---------- KPI Card ---------- */

interface KpiCardProps {
  title: string;
  currentValue: string;
  lastYearValue: string;
  change: number | null;
  /** If true, a decrease is good (e.g. cost metrics) */
  invertColor?: boolean;
  /** Optional target value */
  target?: string;
  /** Optional target achievement percentage */
  targetPct?: number;
}

function KpiCard({ title, currentValue, lastYearValue, change, invertColor, target, targetPct }: KpiCardProps) {
  const ampel = ampelColor(invertColor ? (change !== null ? -change : null) : change);
  const borderAccent = ampel === 'green'
    ? 'border-l-emerald-500'
    : ampel === 'red'
    ? 'border-l-red-500'
    : 'border-l-gray-300';

  return (
    <div className={`bg-kore-white border border-kore-border border-l-4 ${borderAccent} p-xl flex flex-col gap-sm`}>
      {/* Header row */}
      <div className="flex items-center justify-between">
        <span className="text-caption text-kore-mid uppercase tracking-widest">{title}</span>
        <AmpelDot change={invertColor ? (change !== null ? -change : null) : change} />
      </div>

      {/* Main value */}
      <div className="font-display text-h2 text-kore-ink leading-tight">{currentValue}</div>

      {/* Last year value */}
      <div className="text-small text-kore-faint">
        VJ: {lastYearValue}
      </div>

      {/* Change indicator */}
      <ChangeIndicator change={change} invertColor={invertColor} />

      {/* Optional target bar */}
      {target && targetPct !== undefined && (
        <div className="mt-sm pt-sm border-t border-kore-border/50">
          <div className="flex items-center justify-between text-small mb-xs">
            <span className="text-kore-mid">Soll: {target}</span>
            <span className={`font-medium ${targetPct >= 95 ? 'text-emerald-600' : targetPct >= 80 ? 'text-amber-600' : 'text-red-600'}`}>
              {targetPct.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-kore-bg h-1.5">
            <div
              className={`h-full transition-all ${targetPct >= 95 ? 'bg-emerald-500' : targetPct >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, targetPct)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Summary Row ---------- */

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-kore-white border border-kore-border p-lg">
      <span className="text-caption text-kore-mid uppercase tracking-widest">{label}</span>
      <div className="font-display text-h3 text-kore-ink mt-xs">{value}</div>
      {sub && <span className="text-small text-kore-faint">{sub}</span>}
    </div>
  );
}

/* ---------- YoY Mini Bar Chart ---------- */

function YoYBarComparison({ current, lastYear, changes }: { current: YoYPeriodData; lastYear: YoYPeriodData; changes: YoYChanges }) {
  const metrics = [
    { label: 'Umsatz', current: current.totalRevenue, ly: lastYear.totalRevenue, change: changes.revenue, fmt: (n: number) => fmtEur(n) },
    { label: 'Frequenz', current: current.avgFootfall, ly: lastYear.avgFootfall, change: changes.footfall, fmt: (n: number) => Math.round(n).toLocaleString('de-DE') },
    { label: 'Conversion', current: current.avgConversion, ly: lastYear.avgConversion, change: changes.conversion, fmt: (n: number) => fmtPct(n) },
    { label: 'Bon-Wert', current: current.avgBasket, ly: lastYear.avgBasket, change: changes.avgBasket, fmt: (n: number) => fmtEur(n, 2) },
    { label: 'UPT', current: current.avgUpt, ly: lastYear.avgUpt, change: changes.upt, fmt: (n: number) => n.toFixed(1) },
  ];

  return (
    <div className="bg-kore-white border border-kore-border p-xl">
      <h2 className="font-display text-h3 text-kore-ink mb-lg">Vorjahresvergleich -- Detailuebersicht</h2>
      <div className="space-y-lg">
        {metrics.map((m) => {
          const maxVal = Math.max(m.current, m.ly, 1);
          const currentPct = (m.current / maxVal) * 100;
          const lyPct = (m.ly / maxVal) * 100;
          const changeColor = m.change !== null && m.change > 0
            ? 'text-emerald-600'
            : m.change !== null && m.change < 0
            ? 'text-red-600'
            : 'text-kore-faint';

          return (
            <div key={m.label}>
              <div className="flex items-center justify-between mb-xs">
                <span className="text-small font-medium text-kore-ink">{m.label}</span>
                <span className={`text-small font-medium ${changeColor}`}>
                  {m.change !== null ? `${m.change > 0 ? '+' : ''}${m.change.toFixed(1)}%` : 'k.A.'}
                </span>
              </div>
              {/* Current year bar */}
              <div className="flex items-center gap-md mb-1">
                <span className="text-caption text-kore-mid w-14 flex-shrink-0">Aktuell</span>
                <div className="flex-1 bg-kore-bg h-5 relative">
                  <div className="bg-kore-ink h-full transition-all" style={{ width: `${currentPct}%` }} />
                </div>
                <span className="text-small text-kore-ink w-24 text-right flex-shrink-0">{m.fmt(m.current)}</span>
              </div>
              {/* Last year bar */}
              <div className="flex items-center gap-md">
                <span className="text-caption text-kore-faint w-14 flex-shrink-0">Vorjahr</span>
                <div className="flex-1 bg-kore-bg h-5 relative">
                  <div className="bg-kore-brass/40 h-full transition-all" style={{ width: `${lyPct}%` }} />
                </div>
                <span className="text-small text-kore-faint w-24 text-right flex-shrink-0">{m.fmt(m.ly)}</span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-lg mt-xl pt-md border-t border-kore-border/50">
        <div className="flex items-center gap-xs text-small text-kore-mid">
          <span className="inline-block w-3 h-3 bg-kore-ink" /> Aktueller Zeitraum
        </div>
        <div className="flex items-center gap-xs text-small text-kore-mid">
          <span className="inline-block w-3 h-3 bg-kore-brass/40" /> Vorjahr
        </div>
      </div>
    </div>
  );
}

/* ---------- Performance Scorecard ---------- */

function PerformanceScorecard({ changes }: { changes: YoYChanges }) {
  const metrics = [
    { label: 'Umsatz', change: changes.revenue },
    { label: 'Frequenz', change: changes.footfall },
    { label: 'Conversion', change: changes.conversion },
    { label: 'Bon-Wert', change: changes.avgBasket },
    { label: 'UPT', change: changes.upt },
  ];

  const positiveCount = metrics.filter(m => m.change !== null && m.change > 0).length;
  const negativeCount = metrics.filter(m => m.change !== null && m.change < 0).length;
  const totalValid = metrics.filter(m => m.change !== null).length;

  const overallStatus = totalValid === 0
    ? 'neutral'
    : positiveCount > negativeCount
    ? 'positive'
    : positiveCount < negativeCount
    ? 'negative'
    : 'neutral';

  const statusConfig = {
    positive: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: TrendingUp, label: 'Positive Entwicklung' },
    negative: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: TrendingDown, label: 'Ruecklaeufige Entwicklung' },
    neutral: { bg: 'bg-kore-bg', border: 'border-kore-border', text: 'text-kore-ink', icon: Minus, label: 'Stabile Entwicklung' },
  };

  const cfg = statusConfig[overallStatus];
  const StatusIcon = cfg.icon;

  return (
    <div className={`${cfg.bg} border ${cfg.border} p-lg flex items-center gap-md`}>
      <StatusIcon size={20} className={cfg.text} />
      <div>
        <span className={`text-small font-medium ${cfg.text}`}>{cfg.label}</span>
        <span className="text-small text-kore-mid ml-md">
          {positiveCount} von {totalValid} KPIs ueber Vorjahr
        </span>
      </div>
    </div>
  );
}

/* ========== MAIN PAGE ========== */

export function OverviewPage() {
  const [preset, setPreset] = useState<PeriodPreset>('mtd');
  const [customFrom, setCustomFrom] = useState(currentMonthStart());
  const [customTo, setCustomTo] = useState(todayStr());
  const [storeId, setStoreId] = useState('');

  const { data: stores } = useKpiStores();

  const period = useMemo(() => {
    if (preset === 'custom') return { from: customFrom, to: customTo };
    return getPeriodDates(preset);
  }, [preset, customFrom, customTo]);

  const { data: yoy, isLoading } = useKpiSummaryYoY(period.from, period.to, storeId || undefined);

  const presetLabels: Record<PeriodPreset, string> = {
    mtd: 'Monat',
    qtd: 'Quartal',
    ytd: 'Jahr',
    custom: 'Benutzerdefiniert',
  };

  return (
    <div className="p-xl max-w-6xl">
      <Breadcrumb items={[{ label: 'KPI Dashboard' }]} />
      {/* Header */}
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">KPI Dashboard</h1>
          <p className="text-body text-kore-mid mt-xs">Kennzahlen mit Vorjahresvergleich und Zielerreichung</p>
        </div>
        <div className="flex gap-md">
          <Link to="/tools/kpi/trends" className="flex items-center gap-sm border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors"><TrendingUp size={16} /> Trends</Link>
          <Link to="/tools/kpi/entries" className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"><List size={16} /> Alle Eintraege</Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-md mb-xl">
        {/* Period presets */}
        <div>
          <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Zeitraum</label>
          <div className="flex border border-kore-border">
            {(['mtd', 'qtd', 'ytd', 'custom'] as PeriodPreset[]).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={`px-md py-sm text-small font-medium uppercase tracking-wider transition-colors ${
                  preset === p
                    ? 'bg-kore-ink text-kore-white'
                    : 'bg-kore-white text-kore-mid hover:bg-kore-bg'
                }`}
              >
                {presetLabels[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Custom date inputs */}
        {preset === 'custom' && (
          <>
            <div>
              <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Von</label>
              <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)} className="border border-kore-border px-md py-sm text-small bg-kore-white" />
            </div>
            <div>
              <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Bis</label>
              <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)} className="border border-kore-border px-md py-sm text-small bg-kore-white" />
            </div>
          </>
        )}

        {/* Store filter */}
        <div>
          <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Store</label>
          <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="border border-kore-border px-md py-sm text-small bg-kore-white">
            <option value="">Alle Stores</option>
            {(stores ?? []).map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Period info banner */}
      {yoy && (
        <div className="flex items-center gap-sm text-small text-kore-mid bg-kore-bg border border-kore-border px-lg py-sm mb-xl">
          <Calendar size={14} />
          <span>
            {monthLabel(period.from)} -- Vergleich mit {monthLabel(yoy.lastYearPeriod.from)}
          </span>
          <span className="text-kore-faint mx-sm">|</span>
          <span>{yoy.current.totalEntries} Eintraege aktuell, {yoy.lastYear.totalEntries} Eintraege Vorjahr</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-xl">
          <StatCardsSkeleton count={5} />
          <StatCardsSkeleton count={4} />
        </div>
      ) : yoy && yoy.current.totalEntries > 0 ? (
        <>
          {/* Performance Scorecard */}
          <div className="mb-xl">
            <PerformanceScorecard changes={yoy.changes} />
          </div>

          {/* KPI Cards with YoY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-lg mb-2xl">
            <KpiCard
              title="Umsatz"
              currentValue={fmtEur(yoy.current.totalRevenue)}
              lastYearValue={fmtEur(yoy.lastYear.totalRevenue)}
              change={yoy.changes.revenue}
            />
            <KpiCard
              title="Ø Kundenfrequenz"
              currentValue={Math.round(yoy.current.avgFootfall).toLocaleString('de-DE')}
              lastYearValue={Math.round(yoy.lastYear.avgFootfall).toLocaleString('de-DE')}
              change={yoy.changes.footfall}
            />
            <KpiCard
              title="Conversion"
              currentValue={fmtPct(yoy.current.avgConversion)}
              lastYearValue={fmtPct(yoy.lastYear.avgConversion)}
              change={yoy.changes.conversion}
            />
            <KpiCard
              title="Ø Bon-Wert"
              currentValue={fmtEur(yoy.current.avgBasket, 2)}
              lastYearValue={fmtEur(yoy.lastYear.avgBasket, 2)}
              change={yoy.changes.avgBasket}
            />
            <KpiCard
              title="UPT"
              currentValue={yoy.current.avgUpt.toFixed(1)}
              lastYearValue={yoy.lastYear.avgUpt.toFixed(1)}
              change={yoy.changes.upt}
            />
          </div>

          {/* Summary stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-2xl">
            <SummaryCard
              label="Eintraege gesamt"
              value={String(yoy.current.totalEntries)}
              sub={`VJ: ${yoy.lastYear.totalEntries}`}
            />
            <SummaryCard
              label="Stores"
              value={String(yoy.current.storeCount)}
            />
            <SummaryCard
              label="Ø Umsatz/Tag"
              value={fmtEur(yoy.current.avgRevenue)}
              sub={`VJ: ${fmtEur(yoy.lastYear.avgRevenue)}`}
            />
            <SummaryCard
              label="Transaktionen"
              value={yoy.current.totalTransactions.toLocaleString('de-DE')}
              sub={`VJ: ${yoy.lastYear.totalTransactions.toLocaleString('de-DE')}`}
            />
          </div>

          {/* YoY Bar Chart Comparison */}
          <div className="mb-2xl">
            <YoYBarComparison current={yoy.current} lastYear={yoy.lastYear} changes={yoy.changes} />
          </div>
        </>
      ) : yoy && yoy.current.totalEntries === 0 && yoy.lastYear.totalEntries > 0 ? (
        /* No current data but last year data exists */
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <Calendar size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">Keine aktuellen Daten</h2>
          <p className="text-body text-kore-mid max-w-md mb-md">
            Fuer den gewaehlten Zeitraum liegen noch keine KPI-Eintraege vor.
          </p>
          <p className="text-small text-kore-faint mb-xl">
            Vorjahreszeitraum: {yoy.lastYear.totalEntries} Eintraege verfuegbar
          </p>
          <Link to="/tools/kpi/entries" className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"><List size={16} /> KPIs erfassen</Link>
        </div>
      ) : (
        /* No data at all */
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <BarChart3 size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">Noch keine KPI-Daten</h2>
          <p className="text-body text-kore-mid max-w-md mb-xl">Erfassen Sie taegliche Kennzahlen, um Ihren Store-Performance-Ueberblick mit Vorjahresvergleich zu starten.</p>
          <Link to="/tools/kpi/entries" className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"><List size={16} /> KPIs erfassen</Link>
        </div>
      )}
    </div>
  );
}
