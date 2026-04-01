import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Settings,
  PenLine,
  Upload,
  GitCompareArrows,
  Medal,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  useRtbRankings,
  useRtbIndicators,
  useRecalculateRankings,
  getCurrentPeriod,
  formatPeriod,
  scoreColor,
  scoreBg,
} from '../useRaiseTheBar';

// ---------- Period Selector ----------

function PeriodSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type="month"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
    />
  );
}

// ---------- Rank Badge ----------

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-400 text-yellow-900 font-display font-bold text-body">
        <Medal size={16} />
      </span>
    );
  if (rank === 2)
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-700 font-display font-bold text-body">
        {rank}
      </span>
    );
  if (rank === 3)
    return (
      <span className="inline-flex items-center justify-center w-8 h-8 bg-amber-600 text-white font-display font-bold text-body">
        {rank}
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center w-8 h-8 bg-kore-surface text-kore-mid font-display font-bold text-body">
      {rank}
    </span>
  );
}

// ---------- Trend Arrow ----------

function TrendArrow({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined) return <Minus size={14} className="text-kore-faint" />;
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return <Minus size={14} className="text-kore-faint" />;
  if (diff > 0) return <TrendingUp size={14} className="text-emerald-500" />;
  return <TrendingDown size={14} className="text-red-500" />;
}

// ---------- Score Cell ----------

function ScoreCell({ score }: { score: number }) {
  const pct = Math.round(score);
  return (
    <div className="flex items-center gap-sm">
      <div className="w-12 h-1.5 bg-gray-100 overflow-hidden">
        <div
          className={`h-full ${scoreBg(pct)} transition-all`}
          style={{ width: `${Math.min(100, pct)}%` }}
        />
      </div>
      <span className={`text-small font-medium ${scoreColor(pct)}`}>{pct}</span>
    </div>
  );
}

// ---------- Main ----------

export function RankingPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState(getCurrentPeriod);
  const { data: rankingData, isLoading } = useRtbRankings(period);
  const { data: indicators } = useRtbIndicators();
  const recalcMut = useRecalculateRankings();

  const rankings = rankingData?.data ?? [];

  return (
    <div className="p-xl max-w-6xl">
      <Breadcrumb items={[{ label: 'Raise the Bar' }]} />

      {/* Header */}
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink flex items-center gap-sm">
            <Trophy size={24} /> Raise the Bar
          </h1>
          <p className="text-body text-kore-mid mt-xs">
            Store-Ranking nach gewichteten KPI-Indikatoren.
            Periode: {formatPeriod(period)}.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/data-entry')}
            className="flex items-center gap-xs px-md py-sm border border-kore-border text-kore-ink text-small hover:bg-kore-surface"
          >
            <PenLine size={14} /> Daten eingeben
          </button>
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/import')}
            className="flex items-center gap-xs px-md py-sm border border-kore-border text-kore-ink text-small hover:bg-kore-surface"
          >
            <Upload size={14} /> Import
          </button>
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/comparison')}
            className="flex items-center gap-xs px-md py-sm border border-kore-border text-kore-ink text-small hover:bg-kore-surface"
          >
            <GitCompareArrows size={14} /> Vergleich
          </button>
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/settings')}
            className="flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90"
          >
            <Settings size={14} /> Einstellungen
          </button>
        </div>
      </div>

      {/* Period + Recalculate */}
      <div className="flex items-center gap-md mb-xl">
        <PeriodSelector value={period} onChange={setPeriod} />
        <button
          onClick={() => recalcMut.mutate(period)}
          disabled={recalcMut.isPending}
          className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-ink hover:bg-kore-surface disabled:opacity-50"
        >
          <RefreshCw size={14} className={recalcMut.isPending ? 'animate-spin' : ''} />
          Neu berechnen
        </button>
      </div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Ranking...</div>
      ) : rankings.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-xl text-center">
          <p className="text-body text-kore-mid mb-md">
            Keine Daten für {formatPeriod(period)}. Bitte Daten eingeben.
          </p>
          <button
            onClick={() => navigate('/app/tools/raise-the-bar/data-entry')}
            className="inline-flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90"
          >
            <PenLine size={16} /> Daten eingeben
          </button>
        </div>
      ) : (
        <div className="bg-kore-white border border-kore-border overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-kore-border bg-kore-surface">
                <th className="px-lg py-md text-small text-kore-mid uppercase tracking-widest font-medium w-12">
                  #
                </th>
                <th className="px-lg py-md text-small text-kore-mid uppercase tracking-widest font-medium">
                  Store
                </th>
                <th className="px-lg py-md text-small text-kore-mid uppercase tracking-widest font-medium w-28">
                  Gesamt
                </th>
                {(indicators ?? []).map((ind) => (
                  <th
                    key={ind.id}
                    className="px-md py-md text-small text-kore-mid uppercase tracking-widest font-medium text-center"
                    title={`${ind.name} (${Math.round(ind.weight * 100)}%)`}
                  >
                    {ind.name.length > 12 ? `${ind.name.slice(0, 12)}...` : ind.name}
                  </th>
                ))}
                <th className="px-md py-md text-small text-kore-mid uppercase tracking-widest font-medium w-12">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {rankings.map((r) => {
                const isTop3 = r.rank <= 3;
                return (
                  <tr
                    key={r.storeId}
                    className={`border-b border-kore-border last:border-0 ${
                      isTop3 ? 'bg-amber-50/40' : ''
                    } hover:bg-kore-surface/50 transition-colors`}
                  >
                    <td className="px-lg py-md">
                      <RankBadge rank={r.rank} />
                    </td>
                    <td className="px-lg py-md">
                      <span className="text-body font-medium text-kore-ink">
                        {r.storeName}
                      </span>
                    </td>
                    <td className="px-lg py-md">
                      <span className={`font-display text-h3 ${scoreColor(r.totalScore)}`}>
                        {Math.round(r.totalScore)}
                      </span>
                    </td>
                    {(indicators ?? []).map((ind) => {
                      const is = r.indicators.find((i) => i.indicatorId === ind.id);
                      return (
                        <td key={ind.id} className="px-md py-md text-center">
                          {is ? <ScoreCell score={is.score} /> : <span className="text-kore-faint">-</span>}
                        </td>
                      );
                    })}
                    <td className="px-md py-md text-center">
                      <TrendArrow current={r.totalScore} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Chart Summary */}
      {rankings.length > 0 && (
        <div className="mt-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-md">
            Übersicht
          </h2>
          <div className="space-y-sm">
            {rankings.map((r) => (
              <div key={r.storeId} className="flex items-center gap-md">
                <span className="text-small text-kore-ink w-32 truncate">
                  {r.storeName}
                </span>
                <div className="flex-1 h-6 bg-gray-100 overflow-hidden relative">
                  <div
                    className={`h-full ${scoreBg(r.totalScore)} transition-all`}
                    style={{ width: `${Math.min(100, r.totalScore)}%` }}
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center text-small font-medium text-kore-ink">
                    {Math.round(r.totalScore)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
