import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Play } from 'lucide-react';
import { useCASession, useCancelCASession } from '../useChecklistenAudits';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { ScoreRing } from '../components/ScoreRing';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  IN_PROGRESS: 'In Bearbeitung',
  COMPLETED: 'Abgeschlossen',
  CANCELLED: 'Abgebrochen',
};

export function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: session, isLoading } = useCASession(id);
  const cancelSession = useCancelCASession();

  if (isLoading) {
    return <div className="p-xl"><div className="text-body text-kore-mid">Lade Session...</div></div>;
  }

  if (!session) {
    return <div className="p-xl"><div className="text-body text-red-600">Session nicht gefunden.</div></div>;
  }

  const isAudit = session.template?.templateType === 'AUDIT';
  const categories = session.template?.categories ?? [];
  const responseMap = new Map<string, any>(
    (session.responses ?? []).map((r: any) => [r.criterionId, r]),
  );

  const handleCancel = async () => {
    if (!confirm('Session wirklich abbrechen?')) return;
    try {
      await cancelSession.mutateAsync(id!);
      navigate('/app/tools/checklisten-audits');
    } catch { /* handled */ }
  };

  return (
    <div className="p-xl max-w-4xl">
      <Breadcrumb items={[
        { label: 'Checklisten & Audits', href: '/app/tools/checklisten-audits' },
        { label: session.template?.name ?? 'Session' },
      ]} />

      {/* Header */}
      <div className="flex items-start justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">
            {session.store?.name} — {session.template?.name}
          </h1>
          <div className="flex items-center gap-lg text-small text-kore-mid mt-sm">
            <span>{isAudit ? 'Audit' : 'Checkliste'}</span>
            <span>{new Date(session.createdAt).toLocaleDateString('de-DE')}</span>
            <span className="font-medium">{STATUS_LABELS[session.status] ?? session.status}</span>
            {session.store?.city && <span>{session.store.city}</span>}
          </div>
        </div>
        <div className="flex gap-md">
          {session.status === 'IN_PROGRESS' && (
            <>
              <Link to={`/app/tools/checklisten-audits/sessions/${id}/conduct`}
                className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors">
                <Play size={16} /> Fortsetzen
              </Link>
              <button onClick={handleCancel}
                className="flex items-center gap-sm border border-red-300 text-red-600 px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-red-50 transition-colors">
                <XCircle size={16} /> Abbrechen
              </button>
            </>
          )}
        </div>
      </div>

      {/* Score Overview */}
      {session.status === 'COMPLETED' && (
        <div className="bg-kore-white border border-kore-border p-xl mb-xl flex items-center gap-2xl">
          <ScoreRing score={isAudit ? (session.overallScore ?? 0) : session.completionRate} />
          <div>
            <h2 className="font-display text-h2 text-kore-ink">
              {isAudit
                ? `Gesamtscore: ${session.overallScore?.toFixed(1) ?? 0}%`
                : `Erledigt: ${session.completionRate?.toFixed(1) ?? 0}%`
              }
            </h2>
            {session.completedAt && (
              <p className="text-small text-kore-mid mt-xs">
                Abgeschlossen am {new Date(session.completedAt).toLocaleDateString('de-DE')}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Category Breakdown */}
      <div className="space-y-xl">
        {categories.map((cat: any) => (
          <CategoryDetail key={cat.id} category={cat} responseMap={responseMap} isAudit={isAudit} />
        ))}
      </div>

      {/* Notes */}
      {session.notes && (
        <div className="mt-xl bg-kore-white border border-kore-border p-lg">
          <h3 className="text-small font-medium text-kore-ink mb-sm">Notizen</h3>
          <p className="text-small text-kore-mid">{session.notes}</p>
        </div>
      )}

      <div className="mt-xl">
        <Link to="/app/tools/checklisten-audits"
          className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink transition-colors">
          <ArrowLeft size={16} /> Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}

// ── Sub-Components ─────────────────────────────────

function CategoryDetail({
  category, responseMap, isAudit,
}: {
  category: any;
  responseMap: Map<string, any>;
  isAudit: boolean;
}) {
  const criteria = category.criteria ?? [];

  return (
    <div className="bg-kore-white border border-kore-border">
      <div className="flex items-center justify-between p-lg border-b border-kore-border">
        <h3 className="text-body font-medium text-kore-ink">{category.name}</h3>
        {isAudit && <span className="text-caption text-kore-mid">Gewicht: {category.weight}%</span>}
      </div>
      <div className="divide-y divide-kore-border">
        {criteria.map((crit: any) => {
          const resp = responseMap.get(crit.id);
          return (
            <div key={crit.id} className="p-lg">
              <div className="flex items-start justify-between gap-lg">
                <div className="flex-1">
                  <span className="text-small text-kore-ink">{crit.name}</span>
                  {crit.description && (
                    <p className="text-caption text-kore-mid mt-xs">{crit.description}</p>
                  )}
                </div>
                <ResponseDisplay criterion={crit} response={resp} />
              </div>
              {resp?.comment && (
                <p className="text-caption text-kore-mid mt-sm italic">Kommentar: {resp.comment}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ResponseDisplay({ criterion, response }: { criterion: any; response: any }) {
  if (!response) {
    return <span className="text-caption text-kore-faint">Nicht bewertet</span>;
  }

  const type = criterion.type ?? 'SCORED';

  if (type === 'SCORED') {
    return (
      <div className="flex items-center gap-md">
        {response.scorePercent != null && (
          <span className="text-small font-medium text-kore-ink">{response.scorePercent}%</span>
        )}
        {response.passed === true && <CheckCircle size={16} className="text-emerald-600" />}
        {response.passed === false && <XCircle size={16} className="text-red-600" />}
      </div>
    );
  }

  if (type === 'BOOLEAN') {
    const val = response.valueBool ?? response.passed;
    return val === true
      ? <CheckCircle size={18} className="text-emerald-600" />
      : val === false
        ? <XCircle size={18} className="text-red-600" />
        : <Clock size={18} className="text-kore-faint" />;
  }

  if (type === 'TEXT') {
    return <span className="text-small text-kore-ink max-w-xs truncate">{response.valueText || '—'}</span>;
  }

  if (type === 'NUMBER') {
    return <span className="text-small font-medium text-kore-ink">{response.valueNumber ?? '—'}</span>;
  }

  return null;
}
