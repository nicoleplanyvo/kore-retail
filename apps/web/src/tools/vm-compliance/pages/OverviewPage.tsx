import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Camera, Plus, BarChart3, Eye, Settings, AlertTriangle } from 'lucide-react';
import {
  useVmComplianceChecks,
  useVmComplianceStores,
  useVmOverdueChecks,
} from '../../../hooks/useVmCompliance';
import { ListItemSkeleton } from '../../../components/Skeleton';
import { Breadcrumb } from '../../../components/Breadcrumb';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Offen',
  APPROVED: 'Bewertet',
  REJECTED: 'Abgelehnt',
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-amber-600 bg-amber-50',
  APPROVED: 'text-emerald-600 bg-emerald-50',
  REJECTED: 'text-red-600 bg-red-50',
};

export function OverviewPage() {
  const [storeId, setStoreId] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data: stores } = useVmComplianceStores();
  const { data: result, isLoading } = useVmComplianceChecks(
    page,
    storeId || undefined,
    status || undefined,
  );
  const { data: overdueChecks } = useVmOverdueChecks();
  const checks = result?.data ?? [];
  const total = result?.total ?? 0;
  const overdueCount = (overdueChecks ?? []).length;

  return (
    <div className="p-xl max-w-5xl">
      <Breadcrumb items={[{ label: 'VM Compliance' }]} />
      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">VM Compliance</h1>
          <p className="text-body text-kore-mid mt-xs">
            Visual-Merchandising-Compliance-Checks verwalten und bewerten
          </p>
        </div>
        <div className="flex gap-md">
          <Link
            to="areas"
            className="flex items-center gap-sm border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors"
          >
            <Settings size={16} /> Bereiche
          </Link>
          <Link
            to="dashboard"
            className="flex items-center gap-sm border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors"
          >
            <BarChart3 size={16} /> Dashboard
          </Link>
          <Link
            to="submit"
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"
          >
            <Plus size={16} /> Neuer Check
          </Link>
        </div>
      </div>

      {/* Overdue alert */}
      {overdueCount > 0 && (
        <div className="bg-red-50 border border-red-200 p-lg mb-xl flex items-center justify-between">
          <div className="flex items-center gap-md">
            <AlertTriangle size={20} className="text-red-600" />
            <div>
              <span className="text-body font-medium text-red-800">
                {overdueCount} überfällige{overdueCount === 1 ? 'r' : ''} Check{overdueCount !== 1 ? 's' : ''}
              </span>
              <span className="text-small text-red-600 ml-md">
                Frist überschritten, Eskalation erforderlich
              </span>
            </div>
          </div>
          <Link
            to="dashboard"
            className="text-small text-red-600 hover:text-red-800 font-medium uppercase tracking-widest"
          >
            Details ansehen
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-md mb-xl flex-wrap">
        <select
          value={storeId}
          onChange={(e) => { setStoreId(e.target.value); setPage(1); }}
          className="border border-kore-border px-md py-sm text-small bg-kore-white"
        >
          <option value="">Alle Stores</option>
          {(stores ?? []).map((s: any) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1); }}
          className="border border-kore-border px-md py-sm text-small bg-kore-white"
        >
          <option value="">Alle Status</option>
          <option value="PENDING">Offen</option>
          <option value="APPROVED">Bewertet</option>
          <option value="REJECTED">Abgelehnt</option>
        </select>
        <span className="text-small text-kore-mid self-center">{total} Checks gesamt</span>
      </div>

      {/* Check list */}
      {isLoading ? (
        <ListItemSkeleton count={5} />
      ) : checks.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <Camera size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">Noch keine Checks</h2>
          <p className="text-body text-kore-mid mb-xl max-w-md">
            Reichen Sie den ersten VM-Compliance-Check ein, um die Einhaltung der
            Visual-Merchandising-Standards zu prüfen.
          </p>
          <Link
            to="submit"
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"
          >
            <Plus size={16} /> Ersten Check einreichen
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-md">
            {checks.map((c: any) => {
              const isOverdue =
                c.status === 'PENDING' && c.deadline && new Date(c.deadline) < new Date();
              return (
                <Link
                  key={c.id}
                  to={`checks/${c.id}`}
                  className={`block bg-kore-white border p-lg hover:border-kore-brass transition-colors ${
                    isOverdue ? 'border-red-300' : 'border-kore-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-md">
                      <Camera size={18} className="text-kore-mid" />
                      <div>
                        <span className="text-body font-medium text-kore-ink">
                          {c.guideline?.name || 'Ohne Guideline'}
                        </span>
                        {c.area?.name && (
                          <span className="text-small text-kore-brass ml-md">
                            {c.area.name}
                          </span>
                        )}
                        <span className="text-small text-kore-mid ml-md">{c.store?.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-md">
                      {isOverdue && (
                        <span className="text-caption text-red-600 uppercase tracking-widest flex items-center gap-xs">
                          <AlertTriangle size={12} /> Überfällig
                        </span>
                      )}
                      <span className="text-small text-kore-faint">
                        {new Date(c.submittedAt).toLocaleDateString('de-DE')}
                      </span>
                      <span
                        className={`text-caption px-md py-xs uppercase tracking-widest ${
                          STATUS_COLORS[c.status] || 'text-kore-mid bg-kore-bg'
                        }`}
                      >
                        {STATUS_LABELS[c.status] || c.status}
                      </span>
                      <Eye size={14} className="text-kore-faint" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {total > 20 && (
            <div className="flex justify-center gap-md mt-xl">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-md py-sm border border-kore-border text-small disabled:opacity-40 hover:bg-kore-bg transition-colors"
              >
                Zurück
              </button>
              <span className="text-small text-kore-mid self-center">
                Seite {page} von {Math.ceil(total / 20)}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page * 20 >= total}
                className="px-md py-sm border border-kore-border text-small disabled:opacity-40 hover:bg-kore-bg transition-colors"
              >
                Weiter
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
