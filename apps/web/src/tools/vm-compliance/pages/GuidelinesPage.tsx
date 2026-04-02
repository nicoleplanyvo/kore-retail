import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image, Plus, Pencil, Trash2, Upload, Save } from 'lucide-react';
import {
  useVmGuidelines,
  useCreateVmGuideline,
  useUpdateVmGuideline,
  useDeleteVmGuideline,
  useUploadGuidelinePhoto,
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
}: {
  initial: GuidelineFormData;
  onSubmit: (data: GuidelineFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  const [form, setForm] = useState<GuidelineFormData>(initial);

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
      <div>
        <label className="label-default">Beschreibung</label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="input-default w-full resize-none"
          rows={3}
          placeholder="Optionale Beschreibung..."
        />
      </div>
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

function PhotoUploadButton({ guidelineId }: { guidelineId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const uploadPhoto = useUploadGuidelinePhoto();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('photo', file);
    uploadPhoto.mutate({ id: guidelineId, formData: fd });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={uploadPhoto.isPending}
        className="flex items-center gap-xs text-small text-kore-brass hover:text-kore-brass-dk transition-colors disabled:opacity-50"
        title="Referenzbild hochladen"
      >
        <Upload size={14} /> {uploadPhoto.isPending ? 'Hochladen...' : 'Foto'}
      </button>
    </>
  );
}

export function GuidelinesPage() {
  const { data: guidelines, isLoading } = useVmGuidelines();
  const createGuideline = useCreateVmGuideline();
  const updateGuideline = useUpdateVmGuideline();
  const deleteGuideline = useDeleteVmGuideline();

  const [showCreate, setShowCreate] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleCreate = (data: GuidelineFormData) => {
    createGuideline.mutate(
      { name: data.name, description: data.description || undefined, category: data.category || undefined },
      { onSuccess: () => setShowCreate(false) },
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
            Guidelines erstellen, Referenzbilder hochladen und bearbeiten
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
            onCancel={() => setShowCreate(false)}
            isSubmitting={createGuideline.isPending}
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
            Erstellen Sie die erste VM-Guideline mit Referenzbild, damit Ihr Team weiss, worauf es achten soll.
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
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-xs text-kore-faint">
                        <Image size={28} />
                        <span className="text-caption">Kein Bild</span>
                      </div>
                    )}
                  </div>

                  {/* Info + Actions */}
                  <div className="flex-1 p-lg flex items-center justify-between">
                    <div>
                      <h3 className="text-body font-medium text-kore-ink">{g.name}</h3>
                      {g.category && (
                        <span className="text-small text-kore-brass">{g.category}</span>
                      )}
                      {g.description && (
                        <p className="text-small text-kore-mid mt-xs">{g.description}</p>
                      )}
                      <p className="text-caption text-kore-faint mt-sm">
                        {g._count?.submissions ?? 0} Einreichungen
                      </p>
                    </div>

                    <div className="flex items-center gap-md flex-shrink-0">
                      <PhotoUploadButton guidelineId={g.id} />
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
