import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
} from 'lucide-react';
import { useVmComplianceCheck, useReviewVmCheck } from '../../../hooks/useVmCompliance';
import { API_URL } from '../../../lib/api';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Offen',
  APPROVED: 'Genehmigt',
  REJECTED: 'Abgelehnt',
};

function DeadlineInfo({ deadline, escalatedAt, escalatedTo }: {
  deadline?: string | null;
  escalatedAt?: string | null;
  escalatedTo?: string | null;
}) {
  if (!deadline) return null;

  const dl = new Date(deadline);
  const isOverdue = dl < new Date();
  const formatted = dl.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`border p-lg mb-xl ${isOverdue ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
      <div className="flex items-center gap-md">
        {isOverdue ? (
          <AlertTriangle size={18} className="text-red-600" />
        ) : (
          <Clock size={18} className="text-amber-600" />
        )}
        <div>
          <span className={`text-body font-medium ${isOverdue ? 'text-red-800' : 'text-amber-800'}`}>
            Frist: {formatted}
          </span>
          {isOverdue && (
            <span className="text-small text-red-600 ml-md">Überfällig</span>
          )}
        </div>
      </div>
      {escalatedAt && (
        <div className="mt-sm text-small text-red-600">
          Eskaliert am {new Date(escalatedAt).toLocaleDateString('de-DE', {
            day: '2-digit', month: '2-digit', year: 'numeric',
          })}
          {escalatedTo && <span> an Vorgesetzten</span>}
        </div>
      )}
    </div>
  );
}

export function CheckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: check, isLoading } = useVmComplianceCheck(id);
  const reviewMutation = useReviewVmCheck();
  const [reviewNote, setReviewNote] = useState('');

  const handleReview = (status: string) => {
    if (!id) return;
    reviewMutation.mutate(
      { id, status, reviewNote: reviewNote || undefined },
      { onSuccess: () => navigate('/app/tools/vm-compliance') },
    );
  };

  if (isLoading) return <div className="p-xl text-body text-kore-mid">Lade...</div>;
  if (!check) return <div className="p-xl text-body text-kore-mid">Check nicht gefunden.</div>;

  return (
    <div className="p-xl max-w-4xl">
      <Link
        to="/app/tools/vm-compliance"
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück zur Übersicht
      </Link>

      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">
            {check.guideline?.name || 'VM Check'}
          </h1>
          <p className="text-body text-kore-mid mt-xs">
            {check.store?.name} {check.store?.city ? `- ${check.store.city}` : ''}
          </p>
          {check.area?.name && (
            <span className="inline-block mt-sm text-caption text-kore-brass uppercase tracking-widest bg-kore-bg px-md py-xs">
              Bereich: {check.area.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-sm">
          {check.status === 'PENDING' && <Clock size={20} className="text-amber-600" />}
          {check.status === 'APPROVED' && <CheckCircle size={20} className="text-emerald-600" />}
          {check.status === 'REJECTED' && <XCircle size={20} className="text-red-600" />}
          <span className="text-body font-medium">
            {STATUS_LABELS[check.status] || check.status}
          </span>
        </div>
      </div>

      {/* Deadline / Escalation info */}
      <DeadlineInfo
        deadline={check.deadline}
        escalatedAt={check.escalatedAt}
        escalatedTo={check.escalatedTo}
      />

      {/* PDF Guideline link */}
      {check.area?.pdfPath && (
        <div className="bg-kore-bg border border-kore-border p-lg mb-xl flex items-center gap-md">
          <FileText size={18} className="text-kore-brass" />
          <div className="flex-1">
            <span className="text-body text-kore-ink">PDF-Richtlinie für Bereich "{check.area.name}"</span>
          </div>
          <a
            href={`${API_URL}/api/tools/vm-compliance/areas/${check.area.id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small text-kore-brass hover:text-kore-ink font-medium uppercase tracking-widest"
          >
            PDF anzeigen
          </a>
        </div>
      )}

      {/* Photo comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl mb-2xl">
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg flex items-center gap-sm">
            <Camera size={18} /> Eingereichtes Foto
          </h2>
          {check.photoPath ? (
            <img
              src={`${API_URL}${check.photoPath}`}
              alt="VM Check"
              className="w-full aspect-video object-cover border border-kore-border"
            />
          ) : (
            <div className="w-full aspect-video bg-kore-bg flex items-center justify-center text-kore-faint">
              Kein Foto
            </div>
          )}
        </div>
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Referenzbild (Guideline)</h2>
          {check.guideline?.referencePhoto ? (
            <img
              src={`${API_URL}${check.guideline.referencePhoto}`}
              alt="Referenz"
              className="w-full aspect-video object-cover border border-kore-border"
            />
          ) : (
            <div className="w-full aspect-video bg-kore-bg flex items-center justify-center text-kore-faint">
              Kein Referenzbild
            </div>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-kore-white border border-kore-border p-xl mb-xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg">Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg text-small">
          <div>
            <span className="text-kore-mid">Eingereicht von:</span>{' '}
            <span className="text-kore-ink font-medium ml-sm">
              {check.submitter?.name || 'Unbekannt'}
            </span>
          </div>
          <div>
            <span className="text-kore-mid">Datum:</span>{' '}
            <span className="text-kore-ink font-medium ml-sm">
              {new Date(check.submittedAt).toLocaleDateString('de-DE', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <div>
            <span className="text-kore-mid">Kategorie:</span>{' '}
            <span className="text-kore-ink font-medium ml-sm">
              {check.guideline?.category || '-'}
            </span>
          </div>
          {check.area?.name && (
            <div>
              <span className="text-kore-mid">Bereich:</span>{' '}
              <span className="text-kore-ink font-medium ml-sm">{check.area.name}</span>
            </div>
          )}
          {check.reviewer && (
            <div>
              <span className="text-kore-mid">Bewertet von:</span>{' '}
              <span className="text-kore-ink font-medium ml-sm">{check.reviewer.name}</span>
            </div>
          )}
          {check.reviewedAt && (
            <div>
              <span className="text-kore-mid">Bewertet am:</span>{' '}
              <span className="text-kore-ink font-medium ml-sm">
                {new Date(check.reviewedAt).toLocaleDateString('de-DE')}
              </span>
            </div>
          )}
          {check.reviewNote && (
            <div className="col-span-2">
              <span className="text-kore-mid">Kommentar:</span>{' '}
              <span className="text-kore-ink ml-sm">{check.reviewNote}</span>
            </div>
          )}
        </div>
      </div>

      {/* Review form */}
      {check.status === 'PENDING' && (
        <div className="bg-kore-white border border-kore-border p-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-lg">Bewertung</h2>
          <div className="mb-lg">
            <label className="text-small text-kore-mid block mb-sm">Kommentar (optional)</label>
            <textarea
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              className="w-full border border-kore-border px-md py-sm text-small resize-none"
              rows={3}
              placeholder="Anmerkungen zur Compliance..."
            />
          </div>
          <div className="flex gap-md">
            <button
              onClick={() => handleReview('APPROVED')}
              disabled={reviewMutation.isPending}
              className="flex items-center gap-sm bg-emerald-600 text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              <CheckCircle size={16} /> Genehmigen
            </button>
            <button
              onClick={() => handleReview('REJECTED')}
              disabled={reviewMutation.isPending}
              className="flex items-center gap-sm bg-red-600 text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              <XCircle size={16} /> Ablehnen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
