import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  Plus,
  ChevronRight,
  Trash2,
  BarChart3,
  CheckCircle2,
  TrendingUp,
  ListChecks,
} from 'lucide-react';
import {
  useStdStores,
  useStdEvaluations,
  useStdSummary,
  useDeleteEvaluation,
} from '../useStoreStandards';
import { ScoreBar } from '../components/ScoreBar';

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status === 'COMPLETED';
  return (
    <span
      className={`inline-flex items-center px-md py-xs text-caption font-medium border ${
        isCompleted
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      }`}
    >
      {isCompleted ? 'Abgeschlossen' : 'In Arbeit'}
    </span>
  );
}

export function OverviewPage() {
  const navigate = useNavigate();
  const { data: stores } = useStdStores();
  const { data: summary } = useStdSummary();
  const [storeId, setStoreId] = useState('');
  const { data: evalData, isLoading } = useStdEvaluations(
    storeId || undefined,
  );
  const deleteMut = useDeleteEvaluation();

  useEffect(() => {
    if (!storeId && stores?.length) {
      setStoreId(stores[0].id);
    }
  }, [stores, storeId]);

  const evaluations = evalData?.data ?? [];

  const handleDelete = (id: string) => {
    if (!confirm('Bewertung wirklich loeschen?')) return;
    deleteMut.mutate(id);
  };

  return (
    <div className="p-xl max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink flex items-center gap-sm">
            <ClipboardCheck size={24} /> Store Standards
          </h1>
          <p className="text-body text-kore-mid mt-xs">
            Store Standards bewerten und verfolgen. Systematische Pruefung aller
            Qualitaetsstandards.
          </p>
        </div>
        <button
          onClick={() => navigate('/app/tools/store-standards/new')}
          className="flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90"
        >
          <Plus size={16} /> Neue Bewertung
        </button>
      </div>

      {/* KPI Tiles */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
          <div className="bg-kore-ink text-kore-white p-lg">
            <div className="flex items-center gap-xs text-small opacity-75 mb-xs">
              <ListChecks size={14} /> Bewertungen
            </div>
            <p className="font-display text-h2">{summary.totalEvaluations}</p>
          </div>
          <div className="bg-kore-ink text-kore-white p-lg">
            <div className="flex items-center gap-xs text-small opacity-75 mb-xs">
              <CheckCircle2 size={14} /> Abgeschlossen
            </div>
            <p className="font-display text-h2">
              {summary.completedEvaluations}
            </p>
          </div>
          <div className="bg-kore-ink text-kore-white p-lg">
            <div className="flex items-center gap-xs text-small opacity-75 mb-xs">
              <BarChart3 size={14} /> Durchschnitt
            </div>
            <p className="font-display text-h2">{summary.averageScore}%</p>
          </div>
          <div className="bg-kore-ink text-kore-white p-lg">
            <div className="flex items-center gap-xs text-small opacity-75 mb-xs">
              <TrendingUp size={14} /> Bestehensquote
            </div>
            <p className="font-display text-h2">{summary.passRate}%</p>
          </div>
        </div>
      )}

      {/* Store Filter */}
      <div className="mb-xl">
        <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
          Store
        </label>
        <select
          value={storeId}
          onChange={(e) => setStoreId(e.target.value)}
          className="w-full max-w-sm border border-kore-border px-md py-sm text-body bg-kore-white"
        >
          <option value="">Alle Stores</option>
          {(stores ?? []).map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
              {s.city ? ` (${s.city})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Evaluations List */}
      <h2 className="font-display text-h3 text-kore-ink mb-md">
        Bewertungen
      </h2>

      {isLoading ? (
        <div className="text-body text-kore-mid">Lade...</div>
      ) : evaluations.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-xl text-center">
          <p className="text-body text-kore-mid mb-md">
            Noch keine Bewertungen vorhanden.
          </p>
          <button
            onClick={() => navigate('/app/tools/store-standards/new')}
            className="inline-flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90"
          >
            <Plus size={16} /> Erste Bewertung starten
          </button>
        </div>
      ) : (
        <div className="space-y-sm">
          {evaluations.map((ev) => (
            <div
              key={ev.id}
              className="bg-kore-white border border-kore-border p-lg flex items-center justify-between hover:border-kore-brass transition-colors"
            >
              <Link
                to={`/app/tools/store-standards/${ev.id}`}
                className="flex-1 flex items-center justify-between mr-md"
              >
                <div>
                  <span className="text-body font-medium text-kore-ink">
                    {ev.store?.name ?? 'Store'}
                  </span>
                  <div className="flex items-center gap-md mt-xs">
                    <span className="text-small text-kore-mid">
                      {ev.period}
                    </span>
                    <span className="text-small text-kore-faint">
                      {new Date(ev.evaluatedAt).toLocaleDateString('de-DE')}
                    </span>
                    {ev.evaluator?.name && (
                      <span className="text-small text-kore-faint">
                        von {ev.evaluator.name}
                      </span>
                    )}
                    <StatusBadge status={ev.status} />
                  </div>
                </div>
                <div className="flex items-center gap-md flex-shrink-0">
                  {ev.overallScore !== null && ev.overallScore !== undefined && (
                    <div className="w-32">
                      <ScoreBar score={ev.overallScore} />
                    </div>
                  )}
                  <ChevronRight size={16} className="text-kore-mid" />
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(ev.id);
                }}
                className="px-sm py-xs text-small text-red-500 hover:text-red-700"
                title="Loeschen"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
