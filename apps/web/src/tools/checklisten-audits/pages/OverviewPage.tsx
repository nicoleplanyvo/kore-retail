import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, ClipboardCheck, TrendingUp, TrendingDown, Minus,
  List, BarChart3, Settings, AlertTriangle, CheckSquare,
} from 'lucide-react';
import { useCASessions, useCAStores, useCADashboard, useCATemplates, useCreateCASession } from '../useChecklistenAudits';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { CreateSessionDialog } from '../components/CreateSessionDialog';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  IN_PROGRESS: 'In Bearbeitung',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Abgebrochen',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-kore-faint bg-kore-bg border-kore-border',
  IN_PROGRESS: 'text-blue-600 bg-blue-50 border-blue-200',
  COMPLETED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  CANCELLED: 'text-red-600 bg-red-50 border-red-200',
};

const TYPE_TABS = [
  { key: '', label: 'Alle' },
  { key: 'AUDIT', label: 'Audits' },
  { key: 'CHECKLIST', label: 'Checklisten' },
] as const;

export function OverviewPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [storeId, setStoreId] = useState('');
  const [status, setStatus] = useState('');
  const [templateType, setTemplateType] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState<'AUDIT' | 'CHECKLIST' | null>(null);

  const { data: stores } = useCAStores();
  const { data: kpis } = useCADashboard();
  const { data: result, isLoading } = useCASessions({
    page,
    storeId: storeId || undefined,
    status: status || undefined,
    templateType: templateType || undefined,
  });
  const { data: templates } = useCATemplates(showCreateDialog ?? undefined);
  const createSession = useCreateCASession();

  const totalPages = result ? Math.ceil(result.total / result.pageSize) : 0;

  const trendIcon = kpis?.trend === 'up'
    ? <TrendingUp size={14} className="text-emerald-600" />
    : kpis?.trend === 'down'
      ? <TrendingDown size={14} className="text-red-600" />
      : <Minus size={14} className="text-kore-mid" />;

  const handleCreateSession = async (data: { storeId: string; templateId: string; notes?: string; dueDate?: string }) => {
    try {
      const session = await createSession.mutateAsync(data);
      setShowCreateDialog(null);
      navigate(`sessions/${session.id}/conduct`);
    } catch { /* error handled by mutation */ }
  };

  return (
    <div className="p-xl max-w-6xl">
      <Breadcrumb items={[{ label: 'Checklisten & Audits' }]} />

      {/* Header */}
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">Checklisten & Audits</h1>
          <p className="text-body text-kore-mid mt-xs">
            Audits durchführen, Checklisten abhaken und Ergebnisse vergleichen
          </p>
        </div>
        <div className="flex gap-md">
          <Link to="templates" className="flex items-center gap-sm border border-kore-border px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors">
            <Settings size={16} /> Templates
          </Link>
          <Link to="dashboard" className="flex items-center gap-sm border border-kore-border px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors">
            <BarChart3 size={16} /> Dashboard
          </Link>
          <button onClick={() => setShowCreateDialog('AUDIT')} className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
            <Plus size={16} /> Neues Audit
          </button>
          <button onClick={() => setShowCreateDialog('CHECKLIST')} className="flex items-center gap-sm border-2 border-kore-ink text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-ink hover:text-kore-white transition-colors">
            <CheckSquare size={16} /> Neue Checkliste
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {kpis && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-lg mb-2xl">
          <KpiCard label="Gesamt" value={kpis.totalAudits} />
          <KpiCard label="Ø Score" value={`${kpis.avgScore}%`} />
          <KpiCard label="Heute" value={kpis.todaysSessions} />
          <KpiCard label="Überfällig" value={kpis.overdueCount} icon={kpis.overdueCount > 0 ? <AlertTriangle size={14} className="text-red-500" /> : undefined} />
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

      {/* Type Tabs + Filters */}
      <div className="flex flex-wrap items-center gap-md mb-xl">
        <div className="flex border border-kore-border">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setTemplateType(tab.key); setPage(1); }}
              className={`px-lg py-sm text-small font-medium uppercase tracking-widest transition-colors ${
                templateType === tab.key
                  ? 'bg-kore-ink text-kore-white'
                  : 'bg-kore-white text-kore-mid hover:bg-kore-bg'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <select
          value={storeId}
          onChange={(e) => { setStoreId(e.target.value); setPage(1); }}
          className="border border-kore-border px-md py-sm text-small bg-kore-white"
        >
          <option value="">Alle Stores</option>
          {(stores ?? []).map((s) => (
            <option key={s.id} value={s.id}>{s.name}{s.city ? ` (${s.city})` : ''}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-kore-border px-md py-sm text-small bg-kore-white"
        >
          <option value="">Alle Status</option>
          <option value="IN_PROGRESS">In Bearbeitung</option>
          <option value="COMPLETED">Abgeschlossen</option>
          <option value="CANCELLED">Abgebrochen</option>
        </select>
      </div>

      {/* Session List */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Sessions...</div>
      ) : !result || result.data.length === 0 ? (
        <EmptyState onCreateAudit={() => setShowCreateDialog('AUDIT')} />
      ) : (
        <>
          <div className="space-y-sm">
            {result.data.map((session: any) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination page={page} totalPages={totalPages} total={result.total} onPageChange={setPage} />
          )}
        </>
      )}

      {/* Create Dialog */}
      {showCreateDialog && (
        <CreateSessionDialog
          type={showCreateDialog}
          stores={stores ?? []}
          templates={templates ?? []}
          onSubmit={handleCreateSession}
          onClose={() => setShowCreateDialog(null)}
          isSubmitting={createSession.isPending}
        />
      )}
    </div>
  );
}

// ── Sub-Components ─────────────────────────────────

function KpiCard({ label, value, icon }: { label: string; value: string | number; icon?: React.ReactNode }) {
  return (
    <div className="bg-kore-white border border-kore-border p-lg">
      <span className="text-caption text-kore-mid uppercase tracking-widest">{label}</span>
      <div className="flex items-center gap-sm mt-sm">
        {icon}
        <span className="font-display text-h2 text-kore-ink">{value}</span>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: any }) {
  const isAudit = session.template?.templateType === 'AUDIT';
  const scoreDisplay = isAudit && session.overallScore != null
    ? `${session.overallScore.toFixed(1)}%`
    : session.completionRate > 0
      ? `${session.completionRate}% erledigt`
      : null;

  return (
    <Link
      to={session.status === 'IN_PROGRESS' ? `sessions/${session.id}/conduct` : `sessions/${session.id}`}
      className="block bg-kore-white border border-kore-border p-lg hover:border-kore-brass transition-colors"
    >
      <div className="flex items-start justify-between gap-lg">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-md mb-xs">
            {isAudit
              ? <ClipboardCheck size={16} className="text-kore-brass flex-shrink-0" />
              : <CheckSquare size={16} className="text-blue-600 flex-shrink-0" />
            }
            <h3 className="text-body font-medium text-kore-ink truncate">
              {session.store?.name ?? 'Store'} — {session.template?.name ?? 'Template'}
            </h3>
            <span className={`text-caption px-sm py-px border ${isAudit ? 'border-kore-brass text-kore-brass' : 'border-blue-300 text-blue-600'} uppercase tracking-widest`}>
              {isAudit ? 'Audit' : 'Checkliste'}
            </span>
          </div>
          <div className="flex items-center gap-lg text-small text-kore-mid">
            {session.store?.city && <span>{session.store.city}</span>}
            <span>{new Date(session.createdAt).toLocaleDateString('de-DE')}</span>
            {scoreDisplay && <span className="font-medium text-kore-ink">{scoreDisplay}</span>}
            <span>{session._count?.responses ?? 0} Bewertungen</span>
          </div>
        </div>
        <span className={`text-caption px-md py-xs border ${STATUS_COLORS[session.status] ?? ''} uppercase tracking-widest flex-shrink-0`}>
          {STATUS_LABELS[session.status] ?? session.status}
        </span>
      </div>
    </Link>
  );
}

function EmptyState({ onCreateAudit }: { onCreateAudit: () => void }) {
  return (
    <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
      <ClipboardCheck size={48} className="text-kore-faint mb-lg" />
      <h2 className="font-display text-h2 text-kore-ink mb-md">Keine Sessions gefunden</h2>
      <p className="text-body text-kore-mid max-w-md mb-xl">
        Starten Sie Ihr erstes Audit oder Ihre erste Checkliste, um die Performance zu bewerten.
      </p>
      <button onClick={onCreateAudit} className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
        <Plus size={16} /> Erste Session starten
      </button>
    </div>
  );
}

function Pagination({ page, totalPages, total, onPageChange }: { page: number; totalPages: number; total: number; onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between mt-xl">
      <span className="text-small text-kore-mid">
        {total} Sessions gesamt — Seite {page} von {totalPages}
      </span>
      <div className="flex gap-sm">
        <button onClick={() => onPageChange(Math.max(1, page - 1))} disabled={page <= 1}
          className="px-md py-xs border border-kore-border text-small hover:bg-kore-bg disabled:opacity-40 transition-colors">Zurück</button>
        <button onClick={() => onPageChange(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
          className="px-md py-xs border border-kore-border text-small hover:bg-kore-bg disabled:opacity-40 transition-colors">Weiter</button>
      </div>
    </div>
  );
}
