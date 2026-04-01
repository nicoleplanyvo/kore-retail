import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, CheckCircle, Clock, FileText, Send, Archive, Users,
  Download, Shield, AlertTriangle, File, Image, Paperclip,
} from 'lucide-react';
import {
  useSopDocument,
  useSopAcknowledgments,
  usePublishSop,
  useArchiveSop,
  useAcknowledgeSop,
} from '../../../hooks/useSop';

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Entwurf',
  PUBLISHED: 'Freigegeben',
  ARCHIVED: 'Archiviert',
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'text-amber-600 bg-amber-50 border-amber-200',
  PUBLISHED: 'text-emerald-700 bg-emerald-50 border-emerald-200',
  ARCHIVED: 'text-kore-faint bg-kore-bg border-kore-border',
};

const FILE_TYPE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileText,
  image: Image,
  other: File,
};

function isOverdue(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SopDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sop, isLoading } = useSopDocument(id);
  const { data: ackData } = useSopAcknowledgments(id);
  const publishMutation = usePublishSop();
  const archiveMutation = useArchiveSop();
  const acknowledgeMutation = useAcknowledgeSop();

  if (isLoading) return <div className="p-xl text-body text-kore-mid">Lade SOP...</div>;
  if (!sop) return <div className="p-xl text-body text-kore-mid">SOP nicht gefunden.</div>;

  const handlePublish = async () => {
    if (!confirm('SOP wirklich freigeben?')) return;
    await publishMutation.mutateAsync(sop.id);
  };

  const handleArchive = async () => {
    if (!confirm('SOP wirklich archivieren?')) return;
    await archiveMutation.mutateAsync(sop.id);
  };

  const handleAcknowledge = async () => {
    await acknowledgeMutation.mutateAsync(sop.id);
  };

  const deadlineOverdue = isOverdue(sop.deadline);

  return (
    <div className="p-xl max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-md mb-xl">
        <button onClick={() => navigate(-1)} className="text-kore-mid hover:text-kore-ink transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-md flex-wrap">
            <h1 className="font-display text-h1 text-kore-ink truncate">{sop.title}</h1>
            <span className={`text-caption px-md py-xs border ${STATUS_COLORS[sop.status] ?? ''} uppercase tracking-widest flex-shrink-0`}>
              {STATUS_LABELS[sop.status] ?? sop.status}
            </span>
            {sop.isMandatory && (
              <span className="flex items-center gap-xs text-caption px-md py-xs border border-blue-200 bg-blue-50 text-blue-700 uppercase tracking-widest flex-shrink-0">
                <Shield size={10} /> Pflicht
              </span>
            )}
            {deadlineOverdue && (
              <span className="flex items-center gap-xs text-caption px-md py-xs border border-red-200 bg-red-50 text-red-700 uppercase tracking-widest flex-shrink-0">
                <AlertTriangle size={10} /> Überfällig
              </span>
            )}
          </div>
          <div className="flex items-center gap-lg text-small text-kore-mid mt-xs flex-wrap">
            {sop.category && <span>{sop.category.name}</span>}
            <span className="flex items-center gap-xs"><Clock size={12} /> Version {sop.version}</span>
            {sop.creator && <span>von {sop.creator.name}</span>}
            <span>Erstellt: {new Date(sop.createdAt).toLocaleDateString('de-DE')}</span>
            <span>Aktualisiert: {new Date(sop.updatedAt).toLocaleDateString('de-DE')}</span>
            {sop.deadline && (
              <span className={`flex items-center gap-xs ${deadlineOverdue ? 'text-red-600 font-medium' : ''}`}>
                <Clock size={12} /> Frist: {new Date(sop.deadline).toLocaleDateString('de-DE')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-sm mb-xl">
        <Link
          to={`/app/tools/sop/sops/${sop.id}/edit`}
          className="flex items-center gap-xs px-md py-sm border border-kore-border text-small hover:bg-kore-bg transition-colors"
        >
          <FileText size={14} /> Bearbeiten
        </Link>
        {sop.status === 'DRAFT' && (
          <button
            onClick={handlePublish}
            disabled={publishMutation.isPending}
            className="flex items-center gap-xs px-md py-sm bg-emerald-600 text-kore-white text-small hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Send size={14} /> {publishMutation.isPending ? 'Wird freigegeben...' : 'Freigeben'}
          </button>
        )}
        {sop.status === 'PUBLISHED' && (
          <>
            <button
              onClick={handleAcknowledge}
              disabled={acknowledgeMutation.isPending}
              className="flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:bg-kore-brass transition-colors disabled:opacity-50"
            >
              <CheckCircle size={14} /> {acknowledgeMutation.isPending ? 'Wird bestätigt...' : 'Gelesen bestätigen'}
            </button>
            <button
              onClick={handleArchive}
              disabled={archiveMutation.isPending}
              className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-mid hover:bg-kore-bg transition-colors disabled:opacity-50"
            >
              <Archive size={14} /> Archivieren
            </button>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">
        {/* Content */}
        <div className="lg:col-span-2 space-y-xl">
          <div className="bg-kore-white border border-kore-border p-xl">
            <div
              className="prose prose-sm max-w-none text-kore-ink"
              dangerouslySetInnerHTML={{ __html: formatContent(sop.content) }}
            />
          </div>

          {/* Attachments */}
          {sop.attachments && sop.attachments.length > 0 && (
            <div className="bg-kore-white border border-kore-border p-lg">
              <h3 className="text-body font-medium text-kore-ink mb-md flex items-center gap-xs">
                <Paperclip size={16} /> Anhänge ({sop.attachments.length})
              </h3>
              <div className="space-y-sm">
                {sop.attachments.map((att) => {
                  const Icon = FILE_TYPE_ICONS[att.fileType] ?? File;
                  return (
                    <a
                      key={att.id}
                      href={`/api/uploads/${att.filePath}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-sm border border-kore-border hover:border-kore-brass transition-colors"
                    >
                      <div className="flex items-center gap-md min-w-0">
                        <Icon size={16} className="text-kore-mid flex-shrink-0" />
                        <span className="text-small text-kore-ink truncate">{att.fileName}</span>
                        <span className="text-caption text-kore-faint flex-shrink-0">
                          {formatFileSize(att.fileSize)}
                        </span>
                      </div>
                      <Download size={14} className="text-kore-mid flex-shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-lg">
          {/* Version Info */}
          <div className="bg-kore-white border border-kore-border p-lg">
            <h3 className="text-body font-medium text-kore-ink mb-md flex items-center gap-xs">
              <Clock size={16} /> Versionierung
            </h3>
            <div className="space-y-sm text-small text-kore-mid">
              <div className="flex justify-between">
                <span>Aktuelle Version</span>
                <span className="font-medium text-kore-ink">v{sop.version}</span>
              </div>
              <div className="flex justify-between">
                <span>Erstellt</span>
                <span>{new Date(sop.createdAt).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex justify-between">
                <span>Letzte Änderung</span>
                <span>{new Date(sop.updatedAt).toLocaleDateString('de-DE')}</span>
              </div>
              {sop.publishedAt && (
                <div className="flex justify-between">
                  <span>Freigegeben</span>
                  <span>{new Date(sop.publishedAt).toLocaleDateString('de-DE')}</span>
                </div>
              )}
              {sop.deadline && (
                <div className="flex justify-between">
                  <span>Frist</span>
                  <span className={deadlineOverdue ? 'text-red-600 font-medium' : ''}>
                    {new Date(sop.deadline).toLocaleDateString('de-DE')}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Typ</span>
                <span className={sop.isMandatory ? 'text-blue-700 font-medium' : ''}>
                  {sop.isMandatory ? 'Pflicht' : 'Optional'}
                </span>
              </div>
            </div>
          </div>

          {/* Acknowledgments (hierarchy-filtered) */}
          <div className="bg-kore-white border border-kore-border p-lg">
            <h3 className="text-body font-medium text-kore-ink mb-md flex items-center gap-xs">
              <Users size={16} /> Lesebestätigung
              {ackData && (
                <span className="text-kore-faint font-normal ml-xs">
                  ({ackData.acknowledged} / {ackData.totalReports})
                </span>
              )}
            </h3>
            {ackData && ackData.totalReports > 0 && (
              <div className="mb-md">
                <div className="flex items-center justify-between text-caption text-kore-mid mb-xs">
                  <span>{ackData.acknowledged} von {ackData.totalReports} gelesen</span>
                  <span>
                    {ackData.totalReports > 0
                      ? Math.round((ackData.acknowledged / ackData.totalReports) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full bg-kore-bg h-2">
                  <div
                    className="bg-kore-ink h-full transition-all"
                    style={{
                      width: `${
                        ackData.totalReports > 0
                          ? Math.min(100, Math.round((ackData.acknowledged / ackData.totalReports) * 100))
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
            {ackData && ackData.users.length > 0 ? (
              <div className="space-y-sm max-h-64 overflow-y-auto">
                {ackData.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between text-small">
                    <span className="text-kore-ink">{user.name}</span>
                    <span className="text-kore-faint">
                      {new Date(user.acknowledgedAt).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-small text-kore-faint">Noch keine Lesebestätigung vorhanden.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Simple markdown-like rendering */
function formatContent(content: string): string {
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}
