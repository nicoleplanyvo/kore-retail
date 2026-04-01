import { ArrowLeft, TrendingUp, TrendingDown, Minus, AlertTriangle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCADashboard, useCATrends, useCACategoryStats, useCAStoreRanking } from '../useChecklistenAudits';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ScoreRing } from '../components/ScoreRing';

export function DashboardPage() {
  const { data: kpis } = useCADashboard();
  const { data: trends } = useCATrends();
  const { data: categoryData } = useCACategoryStats();
  const { data: storeRanking } = useCAStoreRanking();

  const trendIcon = kpis?.trend === 'up'
    ? <TrendingUp size={14} className="text-emerald-600" />
    : kpis?.trend === 'down'
      ? <TrendingDown size={14} className="text-red-600" />
      : <Minus size={14} className="text-kore-mid" />;

  return (
    <div className="p-xl max-w-6xl">
      <Breadcrumb items={[
        { label: 'Checklisten & Audits', href: '/app/tools/checklisten-audits' },
        { label: 'Dashboard' },
      ]} />

      <h1 className="font-display text-h1 text-kore-ink mb-2xl">Dashboard</h1>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-lg mb-2xl">
          <KpiCard label="Gesamt" value={kpis.totalAudits} />
          <KpiCard label="Ø Score" value={`${kpis.avgScore}%`} />
          <KpiCard label="Ø Erledigung" value={`${kpis.avgCompletionRate}%`} />
          <div className="bg-kore-white border border-kore-border p-lg">
            <span className="text-caption text-kore-mid uppercase tracking-widest">Trend</span>
            <div className="flex items-center gap-sm mt-sm">
              {trendIcon}
              <span className="text-body text-kore-ink capitalize">
                {kpis.trend === 'up' ? 'Aufwärts' : kpis.trend === 'down' ? 'Abwärts' : 'Stabil'}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-xl mb-2xl">
        {/* Score Trends */}
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Score-Verlauf</h2>
          {trends && trends.length > 0 ? (
            <TrendsChart trends={trends} />
          ) : (
            <p className="text-small text-kore-mid">Noch keine Daten vorhanden.</p>
          )}
        </div>

        {/* Category Performance */}
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Kategorie-Performance</h2>
          {categoryData?.categoryAverages?.length > 0 ? (
            <div className="space-y-md">
              {categoryData.categoryAverages.map((cat: any) => (
                <CategoryBar key={cat.categoryName} category={cat} />
              ))}
            </div>
          ) : (
            <p className="text-small text-kore-mid">Noch keine Daten vorhanden.</p>
          )}
        </div>
      </div>

      {/* Store Ranking */}
      <div className="bg-kore-white border border-kore-border p-xl mb-2xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg">Store-Ranking</h2>
        {storeRanking && storeRanking.length > 0 ? (
          <div className="space-y-sm">
            {storeRanking.map((store: any, idx: number) => (
              <StoreRankRow key={store.storeId} store={store} rank={idx + 1} />
            ))}
          </div>
        ) : (
          <p className="text-small text-kore-mid">Noch keine Daten vorhanden.</p>
        )}
      </div>

      {/* Overdue */}
      {kpis && kpis.overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 p-xl mb-2xl">
          <div className="flex items-center gap-md mb-lg">
            <AlertTriangle size={18} className="text-red-600" />
            <h2 className="font-display text-h3 text-red-700">
              {kpis.overdueCount} überfällige Checklisten
            </h2>
          </div>
          <p className="text-small text-red-600">
            Bitte überprüfen Sie die offenen Sessions in der Übersicht.
          </p>
        </div>
      )}

      <Link to="/app/tools/checklisten-audits"
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink transition-colors">
        <ArrowLeft size={16} /> Zurück zur Übersicht
      </Link>
    </div>
  );
}

// ── Sub-Components ─────────────────────────────────

function KpiCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-kore-white border border-kore-border p-lg">
      <span className="text-caption text-kore-mid uppercase tracking-widest">{label}</span>
      <div className="font-display text-h2 text-kore-ink mt-sm">{value}</div>
    </div>
  );
}

function TrendsChart({ trends }: { trends: any[] }) {
  // Simple bar-style representation
  const maxScore = Math.max(...trends.map((t) => t.overallScore ?? 0), 1);

  return (
    <div className="space-y-sm max-h-64 overflow-y-auto">
      {trends.map((t: any, idx: number) => (
        <div key={idx} className="flex items-center gap-md">
          <span className="text-caption text-kore-mid w-20 flex-shrink-0">
            {t.completedAt ? new Date(t.completedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' }) : '—'}
          </span>
          <div className="flex-1 bg-kore-bg h-5 relative">
            <div
              className="h-full bg-kore-brass transition-all"
              style={{ width: `${((t.overallScore ?? 0) / maxScore) * 100}%` }}
            />
          </div>
          <span className="text-caption font-medium text-kore-ink w-12 text-right">
            {t.overallScore?.toFixed(0) ?? 0}%
          </span>
        </div>
      ))}
    </div>
  );
}

function CategoryBar({ category }: { category: any }) {
  const color = category.averageScore >= 80 ? 'bg-emerald-500' : category.averageScore >= 60 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div>
      <div className="flex items-center justify-between text-small mb-xs">
        <span className="text-kore-ink">{category.categoryName}</span>
        <span className="font-medium text-kore-ink">{category.averageScore}%</span>
      </div>
      <div className="w-full bg-kore-bg h-3 relative">
        <div className={`h-full ${color} transition-all`} style={{ width: `${category.averageScore}%` }} />
      </div>
      <div className="flex justify-between text-caption text-kore-mid mt-xs">
        <span>Pass-Rate: {category.passRate}%</span>
        <span>{category.sampleCount} Stichproben</span>
      </div>
    </div>
  );
}

function StoreRankRow({ store, rank }: { store: any; rank: number }) {
  return (
    <div className="flex items-center gap-lg p-md bg-kore-bg border border-kore-border">
      <div className="flex items-center justify-center w-8 h-8 flex-shrink-0">
        {rank <= 3 ? (
          <Trophy size={16} className={rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-gray-400' : 'text-amber-700'} />
        ) : (
          <span className="text-small font-medium text-kore-mid">{rank}</span>
        )}
      </div>
      <div className="flex-1">
        <span className="text-small font-medium text-kore-ink">{store.storeName}</span>
        {store.city && <span className="text-caption text-kore-mid ml-md">{store.city}</span>}
      </div>
      <div className="flex items-center gap-xl">
        <div className="text-right">
          <span className="text-caption text-kore-mid">Ø Score</span>
          <div className="text-small font-medium text-kore-ink">{store.avgScore}%</div>
        </div>
        <div className="text-right">
          <span className="text-caption text-kore-mid">Sessions</span>
          <div className="text-small font-medium text-kore-ink">{store.sessionCount}</div>
        </div>
      </div>
    </div>
  );
}
