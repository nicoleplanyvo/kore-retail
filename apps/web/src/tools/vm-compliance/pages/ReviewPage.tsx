import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  useVmCompliancePendingChecks,
  useVmComplianceCheck,
  useReviewVmCheck,
  useVmComplianceStores,
} from '../../../hooks/useVmCompliance';
import { API_URL } from '../../../lib/api';

/* ------------------------------------------------------------------ */
/*  ReviewPage — Regional Manager review queue for VM Compliance       */
/* ------------------------------------------------------------------ */

export function ReviewPage() {
  // Filter state
  const [storeId, setStoreId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);

  // Selected check for detail panel
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Data
  const { data: stores } = useVmComplianceStores();
  const { data: result, isLoading } = useVmCompliancePendingChecks(
    page,
    storeId || undefined,
    dateFrom || undefined,
    dateTo || undefined,
  );
  const checks = result?.data ?? [];
  const total = result?.total ?? 0;
  const totalPages = Math.ceil(total / 20);

  const resetFilters = () => {
    setStoreId('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const hasFilters = storeId || dateFrom || dateTo;

  return (
    <div className="p-xl max-w-6xl">
      {/* Header */}
      <Link
        to="/app/tools/vm-compliance"
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurueck zur Uebersicht
      </Link>

      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">VM Compliance Pruefen</h1>
          <p className="text-body text-kore-mid mt-xs">
            {total} ausstehende {total === 1 ? 'Einreichung' : 'Einreichungen'} zur Bewertung
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-md mb-xl flex-wrap items-end">
        <div>
          <label className="text-caption text-kore-mid uppercase tracking-widest block mb-xs">
            Store
          </label>
          <select
            value={storeId}
            onChange={(e) => {
              setStoreId(e.target.value);
              setPage(1);
            }}
            className="border border-kore-border px-md py-sm text-small bg-kore-white min-w-[180px]"
          >
            <option value="">Alle Stores</option>
            {(stores ?? []).map((s: any) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.city ? `(${s.city})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-caption text-kore-mid uppercase tracking-widest block mb-xs">
            Von
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="border border-kore-border px-md py-sm text-small bg-kore-white"
          />
        </div>
        <div>
          <label className="text-caption text-kore-mid uppercase tracking-widest block mb-xs">
            Bis
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="border border-kore-border px-md py-sm text-small bg-kore-white"
          />
        </div>
        {hasFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-xs text-small text-kore-mid hover:text-kore-ink py-sm"
          >
            <X size={14} /> Filter zuruecksetzen
          </button>
        )}
      </div>

      {/* Content area */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade ausstehende Checks...</div>
      ) : checks.length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <CheckCircle size={48} className="text-emerald-400 mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">
            Alles geprueft!
          </h2>
          <p className="text-body text-kore-mid mb-xl max-w-md">
            {hasFilters
              ? 'Keine ausstehenden Checks mit diesen Filtern gefunden.'
              : 'Es gibt derzeit keine ausstehenden VM-Compliance-Checks zur Bewertung.'}
          </p>
          <Link
            to="/app/tools/vm-compliance"
            className="flex items-center gap-sm border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors"
          >
            Zurueck zur Uebersicht
          </Link>
        </div>
      ) : (
        <>
          {/* Card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg mb-xl">
            {checks.map((check: any) => (
              <ReviewCard
                key={check.id}
                check={check}
                isSelected={selectedId === check.id}
                onSelect={() => setSelectedId(check.id)}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-md mt-xl">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                className="px-md py-sm border border-kore-border text-small disabled:opacity-40 hover:bg-kore-bg transition-colors"
              >
                Zurueck
              </button>
              <span className="text-small text-kore-mid self-center">
                Seite {page} von {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
                className="px-md py-sm border border-kore-border text-small disabled:opacity-40 hover:bg-kore-bg transition-colors"
              >
                Weiter
              </button>
            </div>
          )}
        </>
      )}

      {/* Detail / Review Panel (modal overlay) */}
      {selectedId && (
        <ReviewDetailPanel
          checkId={selectedId}
          onClose={() => setSelectedId(null)}
          onReviewed={(nextId) => {
            // After review, move to next pending item or close
            if (nextId) {
              setSelectedId(nextId);
            } else {
              setSelectedId(null);
            }
          }}
          pendingIds={checks.map((c: any) => c.id)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ReviewCard — Single card in the review grid                        */
/* ------------------------------------------------------------------ */

function ReviewCard({
  check,
  isSelected,
  onSelect,
}: {
  check: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`text-left bg-kore-white border p-lg transition-colors w-full ${
        isSelected
          ? 'border-kore-brass shadow-sm'
          : 'border-kore-border hover:border-kore-brass'
      }`}
    >
      {/* Photo thumbnail */}
      {check.photoPath ? (
        <img
          src={`${API_URL}${check.photoPath}`}
          alt="VM Check"
          className="w-full h-40 object-cover border border-kore-border mb-md"
        />
      ) : (
        <div className="w-full h-40 bg-kore-bg flex items-center justify-center border border-kore-border mb-md">
          <Camera size={32} className="text-kore-faint" />
        </div>
      )}

      {/* Card info */}
      <div className="space-y-xs">
        <h3 className="text-body font-medium text-kore-ink truncate">
          {check.guideline?.name || 'Ohne Guideline'}
        </h3>
        <div className="flex items-center gap-sm text-small text-kore-mid">
          <span>{check.store?.name}</span>
          {check.store?.city && (
            <span className="text-kore-faint">({check.store.city})</span>
          )}
        </div>
        <div className="flex items-center justify-between text-small">
          <span className="text-kore-faint">
            {new Date(check.submittedAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
          <span className="text-kore-faint">
            {check.submitter?.name || 'Unbekannt'}
          </span>
        </div>
        <div className="flex items-center gap-xs text-amber-600 text-caption uppercase tracking-widest pt-xs">
          <Clock size={12} /> Ausstehend
        </div>
      </div>

      <div className="flex items-center justify-end mt-md text-kore-brass">
        <span className="text-caption uppercase tracking-widest">
          Details anzeigen
        </span>
        <ChevronRight size={14} className="ml-xs" />
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  ReviewDetailPanel — Modal overlay with full photo + review actions */
/* ------------------------------------------------------------------ */

function ReviewDetailPanel({
  checkId,
  onClose,
  onReviewed,
  pendingIds,
}: {
  checkId: string;
  onClose: () => void;
  onReviewed: (nextId: string | null) => void;
  pendingIds: string[];
}) {
  const { data: check, isLoading } = useVmComplianceCheck(checkId);
  const reviewMutation = useReviewVmCheck();
  const [reviewNote, setReviewNote] = useState('');

  const handleReview = useCallback(
    (status: 'APPROVED' | 'REJECTED') => {
      reviewMutation.mutate(
        { id: checkId, status, reviewNote: reviewNote || undefined },
        {
          onSuccess: () => {
            setReviewNote('');
            // Find next pending item
            const currentIdx = pendingIds.indexOf(checkId);
            const nextIds = pendingIds.filter((pid) => pid !== checkId);
            if (nextIds.length > 0) {
              // Try next in list, or wrap to first
              const nextIdx = Math.min(currentIdx, nextIds.length - 1);
              onReviewed(nextIds[nextIdx] ?? null);
            } else {
              onReviewed(null);
            }
          },
        },
      );
    },
    [checkId, reviewNote, reviewMutation, pendingIds, onReviewed],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-kore-white border border-kore-border w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-lg shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-lg right-lg text-kore-mid hover:text-kore-ink z-10"
        >
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="p-3xl text-body text-kore-mid text-center">
            Lade Check-Details...
          </div>
        ) : !check ? (
          <div className="p-3xl text-body text-kore-mid text-center">
            Check nicht gefunden.
          </div>
        ) : (
          <div className="p-xl">
            {/* Header */}
            <div className="mb-xl pr-xl">
              <h2 className="font-display text-h2 text-kore-ink">
                {check.guideline?.name || 'VM Check'}
              </h2>
              <div className="flex items-center gap-md mt-sm flex-wrap">
                <span className="text-small text-kore-mid">
                  {check.store?.name}
                  {check.store?.city ? ` - ${check.store.city}` : ''}
                </span>
                <span className="text-small text-kore-faint">
                  Eingereicht von {check.submitter?.name || 'Unbekannt'}
                </span>
                <span className="text-small text-kore-faint">
                  {new Date(check.submittedAt).toLocaleDateString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              {check.guideline?.category && (
                <span className="inline-block mt-sm text-caption text-kore-mid uppercase tracking-widest bg-kore-bg px-md py-xs">
                  {check.guideline.category}
                </span>
              )}
            </div>

            {/* Photo comparison: submitted vs reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
              <div>
                <p className="text-caption text-kore-mid uppercase tracking-widest mb-sm">
                  Eingereichtes Foto
                </p>
                {check.photoPath ? (
                  <img
                    src={`${API_URL}${check.photoPath}`}
                    alt="VM Check Foto"
                    className="w-full aspect-video object-cover border border-kore-border"
                  />
                ) : (
                  <div className="w-full aspect-video bg-kore-bg flex items-center justify-center border border-kore-border text-kore-faint">
                    Kein Foto
                  </div>
                )}
              </div>
              <div>
                <p className="text-caption text-kore-mid uppercase tracking-widest mb-sm">
                  Referenzbild (Guideline)
                </p>
                {check.guideline?.referencePhoto ? (
                  <img
                    src={`${API_URL}${check.guideline.referencePhoto}`}
                    alt="Referenz"
                    className="w-full aspect-video object-cover border border-kore-border"
                  />
                ) : (
                  <div className="w-full aspect-video bg-kore-bg flex items-center justify-center border border-kore-border text-small text-kore-faint">
                    Kein Referenzbild
                  </div>
                )}
              </div>
            </div>

            {/* Submission notes */}
            {check.notes && (
              <div className="bg-kore-bg border border-kore-border p-lg mb-xl">
                <p className="text-caption text-kore-mid uppercase tracking-widest mb-sm">
                  Anmerkungen des Einreichers
                </p>
                <p className="text-body text-kore-ink">{check.notes}</p>
              </div>
            )}

            {/* Review form */}
            {check.status === 'PENDING' && (
              <div className="border-t border-kore-border pt-xl">
                <h3 className="font-display text-h3 text-kore-ink mb-lg">
                  Bewertung
                </h3>
                <div className="mb-lg">
                  <label className="text-small text-kore-mid block mb-sm">
                    Feedback / Ablehnungsgrund (optional)
                  </label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    className="w-full border border-kore-border px-md py-sm text-small resize-none focus:outline-none focus:border-kore-brass"
                    rows={3}
                    placeholder="Anmerkungen zur Compliance-Bewertung..."
                  />
                </div>
                <div className="flex gap-md justify-end">
                  <button
                    onClick={() => handleReview('REJECTED')}
                    disabled={reviewMutation.isPending}
                    className="flex items-center gap-sm border border-red-300 text-red-600 px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-red-50 transition-colors disabled:opacity-50"
                  >
                    <XCircle size={16} /> Ablehnen
                  </button>
                  <button
                    onClick={() => handleReview('APPROVED')}
                    disabled={reviewMutation.isPending}
                    className="flex items-center gap-sm bg-emerald-600 text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50"
                  >
                    <CheckCircle size={16} /> Genehmigen
                  </button>
                </div>
                {reviewMutation.isPending && (
                  <p className="text-small text-kore-mid mt-md text-right">
                    Wird gespeichert...
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
