import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, Plus, Pencil, Trash2, Upload, Save, Camera, X, FileText } from 'lucide-react';
import {
  useVmGuidelines,
  useCreateVmGuideline,
  useUpdateVmGuideline,
  useDeleteVmGuideline,
  useUploadGuidelinePhoto,
  useUploadGuidelinePdf,
} from '../../../hooks/useVmCompliance';
import { API_URL } from '../../../lib/api';

interface GuidelineFormData {
  name: string;
  description: string;
  category: string;
}

const EMPTY_FORM: GuidelineFormData = { name: '', description: '', category: '' };

function GuidelineForm({
  initial,
  onSubmit,
  onCancel,
  isSubmitting,
  showFileUploads = false,
  onPhotoSelected,
  photoPreview,
  onRemovePhoto,
  onPdfSelected,
  pdfName,
  onRemovePdf,
}: {
  initial: GuidelineFormData;
  onSubmit: (data: GuidelineFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  showFileUploads?: boolean;
  onPhotoSelected?: (file: File) => void;
  photoPreview?: string | null;
  onRemovePhoto?: () => void;
  onPdfSelected?: (file: File) => void;
  pdfName?: string | null;
  onRemovePdf?: () => void;
}) {
  const [form, setForm] = useState<GuidelineFormData>(initial);
  const photoRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-kore-white border border-kore-border p-lg space-y-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <label className="label-default">Name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-default w-full"
            placeholder="z.B. Schaufenster-Display"
            required
          />
        </div>
        <div>
          <label className="label-default">Kategorie</label>
          <input
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-default w-full"
            placeholder="z.B. Schaufenster, Eingang, Kasse"
          />
        </div>
      </div>
      <div>
        <label className="label-default">Beschreibung</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-default w-full resize-none"
          rows={2}
          placeholder="Optionale Beschreibung..."
        />
      </div>

      {showFileUploads && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {/* Referenzbild */}
          <div>
            <label className="label-default">Referenzbild</label>
            {photoPreview ? (
              <div className="relative inline-block">
                <img src={photoPreview} alt="Vorschau" className="h-28 w-auto border border-kore-border object-cover" />
                <button
                  type="button"
                  onClick={onRemovePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <>
                <input ref={photoRef} type="file" accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f && onPhotoSelected) onPhotoSelected(f); }} className="hidden" />
                <button
                  type="button"
                  onClick={() => photoRef.current?.click()}
                  className="flex items-center gap-sm border-2 border-dashed border-kore-border px-lg py-md text-small text-kore-mid hover:border-kore-brass hover:text-kore-brass transition-colors w-full justify-center"
                >
                  <Camera size={16} /> Bild auswaehlen
                </button>
              </>
            )}
          </div>

          {/* PDF */}
          <div>
            <label className="label-default">PDF-Guideline</label>
            {pdfName ? (
              <div className="flex items-center gap-sm border border-kore-border px-md py-sm">
                <FileText size={16} className="text-red-500 flex-shrink-0" />
                <span className="text-small text-kore-ink truncate flex-1">{pdfName}</span>
                <button
                  type="button"
                  onClick={onRemovePdf}
                  className="text-red-500 hover:text-red-700 flex-shrink-0"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <>
                <input ref={pdfRef} type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f && onPdfSelected) onPdfSelected(f); }} className="hidden" />
                <button
                  type="button"
                  onClick={() => pdfRef.current?.click()}
                  className="flex items-center gap-sm border-2 border-dashed border-kore-border px-lg py-md text-small text-kore-mid hover:border-kore-brass hover:text-kore-brass transition-colors w-full justify-center"
                >
                  <FileText size={16} /> PDF auswaehlen
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-md pt-sm">
        <button
          type="button"
          onClick={onCancel}
          className="px-lg py-md-sm text-small font-medium uppercase tracking-widest border border-kore-border hover:bg-kore-bg transition-colors"
        >
          Abbrechen
        </button>
        <button
          type="submit"
          disabled={isSubmitting || !form.name.trim()}
          className="flex items-center gap-sm px-lg py-md-sm text-small font-medium uppercase tracking-widest bg-kore-ink text-kore-white hover:bg-kore-brass transition-colors disabled:opacity-50"
        >
          <Save size={14} /> {isSubmitting ? 'Speichern...' : 'Speichern'}
        </button>
      </div>
    </form>
  );
}

function FileUploadButtons({ guidelineId, hasPdf }: { guidelineId: string; hasPdf: boolean }) {
  const photoRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);
  const uploadPhoto = useUploadGuidelinePhoto();
  const uploadPdf = useUploadGuidelinePdf();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    uploadPhoto.mutate({ id: guidelineId, formData: fd });
    if (photoRef.current) photoRef.current.value = '';
  };

  const handlePdf = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('pdf', file);
    uploadPdf.mutate({ id: guidelineId, formData: fd });
    if (pdfRef.current) pdfRef.current.value = '';
  };

  return (
    <>
      <input ref={photoRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
      <button
        type="button"
        onClick={() => photoRef.current?.click()}
        disabled={uploadPhoto.isPending}
        className="flex items-center gap-xs text-small text-kore-brass hover:text-kore-brass-dk transition-colors disabled:opacity-50"
        title="Referenzbild hochladen"
      >
        <Camera size={14} /> {uploadPhoto.isPending ? '...' : 'Foto'}
      </button>

      <input ref={pdfRef} type="file" accept=".pdf" onChange={handlePdf} className="hidden" />
      <button
        type="button"
        onClick={() => pdfRef.current?.click()}
        disabled={uploadPdf.isPending}
        className="flex items-center gap-xs text-small text-kore-brass hover:text-kore-brass-dk transition-colors disabled:opacity-50"
        title="PDF-Guideline hochladen"
      >
        <FileText size={14} /> {uploadPdf.isPending ? '...' : 'PDF'}
      </button>
    </>
  );
}

export function GuidelinesPage() {
  const { data: guidelines, isLoading } = useVmGuidelines();
  const createGuideline = useCreateVmGuideline();
  const updateGuideline = useUpdateVmGuideline();
  const deleteGuideline = useDeleteVmGuideline();
  const uploadPhoto = useUploadGuidelinePhoto();
  const uploadPdf = useUploadGuidelinePdf();

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [pendingPhoto, setPendingPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [pendingPdf, setPendingPdf] = useState<File | null>(null);

  const handlePhotoSelected = (file: File) => {
    setPendingPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPendingPhoto(null);
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoPreview(null);
  };

  const handlePdfSelected = (file: File) => setPendingPdf(file);
  const handleRemovePdf = () => setPendingPdf(null);

  const resetForm = () => {
    handleRemovePhoto();
    handleRemovePdf();
    setShowCreate(false);
  };

  const handleCreate = (data: GuidelineFormData) => {
    createGuideline.mutate(
      { name: data.name, description: data.description || undefined, category: data.category || undefined },
      {
        onSuccess: (newGuideline: any) => {
          const id = newGuideline?.id;
          if (!id) { resetForm(); return; }

          // Upload-Queue: erst Foto, dann PDF
          const uploads: Promise<unknown>[] = [];

          if (pendingPhoto) {
            const fd = new FormData();
            fd.append('photo', pendingPhoto);
            uploads.push(
              new Promise((resolve) => uploadPhoto.mutate({ id, formData: fd }, { onSettled: resolve }))
            );
          }
          if (pendingPdf) {
            const fd = new FormData();
            fd.append('pdf', pendingPdf);
            uploads.push(
              new Promise((resolve) => uploadPdf.mutate({ id, formData: fd }, { onSettled: resolve }))
            );
          }

          if (uploads.length > 0) {
            Promise.all(uploads).then(() => resetForm());
          } else {
            resetForm();
          }
        },
      },
    );
  };

  const handleUpdate = (id: string, data: GuidelineFormData) => {
    updateGuideline.mutate(
      { id, name: data.name, description: data.description || undefined, category: data.category || undefined },
      { onSuccess: () => setEditId(null) },
    );
  };

  const handleDelete = (id: string, name: string) => {
    if (!window.confirm(`Guideline "${name}" wirklich loeschen?`)) return;
    deleteGuideline.mutate(id);
  };

  const isSaving = createGuideline.isPending || uploadPhoto.isPending || uploadPdf.isPending;

  return (
    <div className="p-xl max-w-5xl">
      <Link
        to="/app/tools/vm-compliance"
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurueck
      </Link>

      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">VM Guidelines verwalten</h1>
          <p className="text-body text-kore-mid mt-xs">
            Guidelines erstellen, Referenzbilder und PDFs hochladen
          </p>
        </div>
        {!showCreate && (
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"
          >
            <Plus size={16} /> Neue Guideline
          </button>
        )}
      </div>

      {showCreate && (
        <div className="mb-xl">
          <h2 className="font-display text-h3 text-kore-ink mb-md">Neue Guideline erstellen</h2>
          <GuidelineForm
            initial={EMPTY_FORM}
            onSubmit={handleCreate}
            onCancel={resetForm}
            isSubmitting={isSaving}
            showFileUploads
            onPhotoSelected={handlePhotoSelected}
            photoPreview={photoPreview}
            onRemovePhoto={handleRemovePhoto}
            onPdfSelected={handlePdfSelected}
            pdfName={pendingPdf?.name ?? null}
            onRemovePdf={handleRemovePdf}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Guidelines...</div>
      ) : (guidelines ?? []).length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-3xl flex flex-col items-center text-center">
          <Image size={48} className="text-kore-faint mb-lg" />
          <h2 className="font-display text-h2 text-kore-ink mb-md">Keine Guidelines</h2>
          <p className="text-body text-kore-mid mb-xl max-w-md">
            Erstellen Sie die erste VM-Guideline mit Referenzbild und PDF.
          </p>
          {!showCreate && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-sm bg-kore-ink text-kore-white px-xl py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"
            >
              <Plus size={16} /> Erste Guideline erstellen
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-lg">
          {(guidelines ?? []).map((g: any) => (
            <div key={g.id} className="bg-kore-white border border-kore-border overflow-hidden">
              {editId === g.id ? (
                <div className="p-lg">
                  <h3 className="font-display text-h3 text-kore-ink mb-md">Guideline bearbeiten</h3>
                  <GuidelineForm
                    initial={{
                      name: g.name,
                      description: g.description || '',
                      category: g.category || '',
                    }}
                    onSubmit={(data) => handleUpdate(g.id, data)}
                    onCancel={() => setEditId(null)}
                    isSubmitting={updateGuideline.isPending}
                  />
                </div>
              ) : (
                <div className="flex gap-lg">
                  {/* Referenzbild */}
                  <div className="w-48 min-h-[120px] flex-shrink-0 bg-kore-bg flex items-center justify-center">
                    {g.referencePhoto ? (
                      <img
                        src={`${API_URL}${g.referencePhoto}`}
                        alt={g.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-xs text-kore-faint">
                        <Image size={28} />
                        <span className="text-caption">Kein Bild</span>
                      </div>
                    )}
                  </div>

                  {/* Info + Actions */}
                  <div className="flex-1 p-lg flex items-start justify-between gap-md">
                    <div className="min-w-0">
                      <h3 className="text-body font-medium text-kore-ink">{g.name}</h3>
                      {g.category && (
                        <span className="text-small text-kore-brass">{g.category}</span>
                      )}
                      {g.description && (
                        <p className="text-small text-kore-mid mt-xs">{g.description}</p>
                      )}
                      <div className="flex items-center gap-md mt-sm">
                        <span className="text-caption text-kore-faint">
                          {g._count?.submissions ?? 0} Einreichungen
                        </span>
                        {g.pdfPath && (
                          <a
                            href={`${API_URL}${g.pdfPath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-xs text-caption text-red-600 hover:text-red-800"
                          >
                            <FileText size={12} /> PDF ansehen
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-md flex-shrink-0 flex-wrap justify-end">
                      <FileUploadButtons guidelineId={g.id} hasPdf={!!g.pdfPath} />
                      <button
                        onClick={() => setEditId(g.id)}
                        className="flex items-center gap-xs text-small text-kore-mid hover:text-kore-ink transition-colors"
                        title="Bearbeiten"
                      >
                        <Pencil size={14} /> Bearbeiten
                      </button>
                      <button
                        onClick={() => handleDelete(g.id, g.name)}
                        className="flex items-center gap-xs text-small text-red-500 hover:text-red-700 transition-colors"
                        title="Loeschen"
                      >
                        <Trash2 size={14} /> Loeschen
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
