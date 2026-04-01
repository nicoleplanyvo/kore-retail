import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, FileText, Image, File } from 'lucide-react';
import {
  useSopDocument,
  useSopCategories,
  useCreateSop,
  useUpdateSop,
  useUploadSopAttachments,
  useDeleteSopAttachment,
} from '../../../hooks/useSop';

const FILE_TYPE_ICONS: Record<string, typeof FileText> = {
  pdf: FileText,
  docx: FileText,
  xlsx: FileText,
  image: Image,
  other: File,
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function CreateEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const { data: existing, isLoading: loadingDoc } = useSopDocument(isEdit ? id : undefined);
  const { data: categories, isLoading: loadingCats } = useSopCategories();
  const createMutation = useCreateSop();
  const updateMutation = useUpdateSop(id ?? '');
  const uploadMutation = useUploadSopAttachments(id ?? '');
  const deleteMutation = useDeleteSopAttachment(id ?? '');

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isMandatory, setIsMandatory] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (existing && isEdit) {
      setTitle(existing.title);
      setContent(existing.content);
      setCategoryId(existing.categoryId);
      setIsMandatory(existing.isMandatory);
      if (existing.deadline) {
        // Convert ISO to local date input format
        setDeadline(existing.deadline.slice(0, 10));
      }
    }
  }, [existing, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim() || !categoryId) {
      setError('Bitte alle Pflichtfelder ausfüllen.');
      return;
    }

    try {
      const deadlineValue = deadline
        ? new Date(deadline + 'T23:59:59Z').toISOString()
        : null;

      if (isEdit) {
        await updateMutation.mutateAsync({
          title,
          content,
          categoryId,
          deadline: deadlineValue,
          isMandatory,
        });
        navigate(`/app/tools/sop/sops/${id}`);
      } else {
        const result = await createMutation.mutateAsync({
          title,
          content,
          categoryId,
          deadline: deadlineValue,
          isMandatory,
        });
        navigate(`/app/tools/sop/sops/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.');
    }
  };

  const handleFileDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (!isEdit || !id) return;
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        uploadMutation.mutate(droppedFiles);
      }
    },
    [isEdit, id, uploadMutation],
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isEdit || !id) return;
      const selectedFiles = Array.from(e.target.files ?? []);
      if (selectedFiles.length > 0) {
        uploadMutation.mutate(selectedFiles);
      }
      e.target.value = '';
    },
    [isEdit, id, uploadMutation],
  );

  const handleDeleteAttachment = useCallback(
    (attachmentId: string) => {
      if (!confirm('Anhang wirklich löschen?')) return;
      deleteMutation.mutate(attachmentId);
    },
    [deleteMutation],
  );

  if (isEdit && loadingDoc) return <div className="p-xl text-body text-kore-mid">Lade SOP...</div>;

  return (
    <div className="p-xl max-w-4xl">
      <div className="flex items-center gap-md mb-2xl">
        <button onClick={() => navigate(-1)} className="text-kore-mid hover:text-kore-ink transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-display text-h1 text-kore-ink">
            {isEdit ? 'SOP bearbeiten' : 'Neue SOP erstellen'}
          </h1>
          <p className="text-body text-kore-mid mt-xs">
            {isEdit ? `Version ${existing?.version ?? 1} wird aktualisiert` : 'Standard Operating Procedure verfassen'}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-small px-lg py-md mb-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-xl">
        <div>
          <label className="block text-small font-medium text-kore-ink mb-sm">Titel *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="z.B. Kassenabschluss-Prozedur"
            className="w-full border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
          />
        </div>

        <div>
          <label className="block text-small font-medium text-kore-ink mb-sm">Kategorie *</label>
          {loadingCats ? (
            <div className="text-small text-kore-mid">Lade Kategorien...</div>
          ) : (
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
            >
              <option value="">Kategorie wählen...</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </div>

        {/* Deadline and Mandatory */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
          <div>
            <label className="block text-small font-medium text-kore-ink mb-sm">
              Frist (Deadline)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
            />
            <p className="text-caption text-kore-faint mt-xs">
              Bis wann muss diese SOP gelesen werden?
            </p>
          </div>
          <div>
            <label className="block text-small font-medium text-kore-ink mb-sm">
              Pflicht-SOP
            </label>
            <label className="flex items-center gap-md cursor-pointer mt-sm">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isMandatory}
                  onChange={(e) => setIsMandatory(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-kore-border peer-checked:bg-kore-ink transition-colors" />
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-kore-white transition-transform peer-checked:translate-x-5" />
              </div>
              <span className="text-body text-kore-ink">
                {isMandatory ? 'Pflicht — Muss von allen gelesen werden' : 'Optional — Freiwillige Kenntnisnahme'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-small font-medium text-kore-ink mb-sm">
            Inhalt * <span className="text-kore-faint font-normal">(Markdown unterstützt)</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="SOP-Inhalt hier eingeben..."
            rows={20}
            className="w-full border border-kore-border px-md py-sm text-body bg-kore-white font-mono text-small leading-relaxed focus:outline-none focus:border-kore-brass resize-y"
          />
        </div>

        {/* File Upload Zone (only in edit mode, since SOP must exist first) */}
        {isEdit && (
          <div>
            <label className="block text-small font-medium text-kore-ink mb-sm">
              Anhänge (PDF, Word, Excel, Bilder)
            </label>
            <div
              className={`border-2 border-dashed p-xl text-center transition-colors ${
                dragActive
                  ? 'border-kore-brass bg-amber-50/30'
                  : 'border-kore-border hover:border-kore-brass'
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleFileDrop}
            >
              <Upload size={32} className="mx-auto text-kore-faint mb-md" />
              <p className="text-body text-kore-mid mb-sm">
                Dateien hierher ziehen oder{' '}
                <label className="text-kore-brass cursor-pointer hover:underline">
                  auswählen
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </label>
              </p>
              <p className="text-caption text-kore-faint">
                Max. 20 MB pro Datei. PDF, Word, Excel, JPEG, PNG, WebP.
              </p>
              {uploadMutation.isPending && (
                <p className="text-small text-kore-brass mt-md">Wird hochgeladen...</p>
              )}
            </div>

            {/* Existing attachments */}
            {existing?.attachments && existing.attachments.length > 0 && (
              <div className="mt-lg space-y-sm">
                {existing.attachments.map((att) => {
                  const Icon = FILE_TYPE_ICONS[att.fileType] ?? File;
                  return (
                    <div
                      key={att.id}
                      className="flex items-center justify-between bg-kore-white border border-kore-border px-md py-sm"
                    >
                      <div className="flex items-center gap-md min-w-0">
                        <Icon size={16} className="text-kore-mid flex-shrink-0" />
                        <a
                          href={`/api/uploads/${att.filePath}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-small text-kore-ink hover:text-kore-brass truncate"
                        >
                          {att.fileName}
                        </a>
                        <span className="text-caption text-kore-faint flex-shrink-0">
                          {formatFileSize(att.fileSize)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteAttachment(att.id)}
                        disabled={deleteMutation.isPending}
                        className="text-kore-faint hover:text-red-600 transition-colors flex-shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-md pt-lg border-t border-kore-border">
          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {createMutation.isPending || updateMutation.isPending
              ? 'Wird gespeichert...'
              : isEdit ? 'Aktualisieren' : 'SOP erstellen'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-xl py-md-sm text-small text-kore-mid hover:text-kore-ink transition-colors"
          >
            Abbrechen
          </button>
        </div>
      </form>
    </div>
  );
}
