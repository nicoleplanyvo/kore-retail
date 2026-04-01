import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2, FileText, Upload } from 'lucide-react';
import {
  useVmAreas,
  useCreateVmArea,
  useUpdateVmArea,
  useDeleteVmArea,
  useUploadAreaPdf,
} from '../../../hooks/useVmCompliance';
import { API_URL } from '../../../lib/api';

/* ------------------------------------------------------------------ */
/*  Area Form (create / edit)                                          */
/* ------------------------------------------------------------------ */

function AreaForm({
  initial,
  onSave,
  onCancel,
  isPending,
}: {
  initial?: { name: string; description: string; sortOrder: number };
  onSave: (data: { name: string; description: string; sortOrder: number }) => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [sortOrder, setSortOrder] = useState(initial?.sortOrder ?? 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), description: description.trim(), sortOrder });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-kore-white border border-kore-border p-xl mb-xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-lg">
        <div>
          <label className="text-small text-kore-mid block mb-sm">Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-kore-border px-md py-sm text-small"
            placeholder="z.B. Schaufenster"
            required
          />
        </div>
        <div>
          <label className="text-small text-kore-mid block mb-sm">Beschreibung</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-kore-border px-md py-sm text-small"
            placeholder="Optionale Beschreibung"
          />
        </div>
        <div>
          <label className="text-small text-kore-mid block mb-sm">Reihenfolge</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-full border border-kore-border px-md py-sm text-small"
            min={0}
          />
        </div>
      </div>
      <div className="flex gap-md">
        <button
          type="submit"
          disabled={!name.trim() || isPending}
          className="bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors disabled:opacity-50"
        >
          {isPending ? 'Speichern...' : 'Speichern'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-kore-border text-kore-ink px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-bg transition-colors"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/*  PDF Upload Button                                                  */
/* ------------------------------------------------------------------ */

function PdfUploadButton({ areaId }: { areaId: string }) {
  const uploadMutation = useUploadAreaPdf();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('pdf', file);
    uploadMutation.mutate({ id: areaId, formData });
    e.target.value = '';
  };

  return (
    <label className="flex items-center gap-xs text-small text-kore-mid hover:text-kore-ink cursor-pointer">
      <Upload size={14} />
      {uploadMutation.isPending ? 'Hochladen...' : 'PDF hochladen'}
      <input type="file" accept="application/pdf" onChange={handleFileSelect} className="hidden" />
    </label>
  );
}

/* ------------------------------------------------------------------ */
/*  AreasSettingsPage                                                  */
/* ------------------------------------------------------------------ */

export function AreasSettingsPage() {
  const { data: areas, isLoading } = useVmAreas(true);
  const createMutation = useCreateVmArea();
  const updateMutation = useUpdateVmArea();
  const deleteMutation = useDeleteVmArea();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingArea = editingId
    ? (areas ?? []).find((a: any) => a.id === editingId)
    : null;

  const handleCreate = (data: { name: string; description: string; sortOrder: number }) => {
    createMutation.mutate(data, { onSuccess: () => setShowForm(false) });
  };

  const handleUpdate = (data: { name: string; description: string; sortOrder: number }) => {
    if (!editingId) return;
    updateMutation.mutate(
      { id: editingId, ...data },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const handleDelete = (id: string) => {
    if (!confirm('Bereich wirklich deaktivieren?')) return;
    deleteMutation.mutate(id);
  };

  return (
    <div className="p-xl max-w-5xl">
      <Link
        to="/app/tools/vm-compliance"
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück
      </Link>

      <div className="flex items-center justify-between mb-2xl">
        <div>
          <h1 className="font-display text-h1 text-kore-ink">Bereiche verwalten</h1>
          <p className="text-body text-kore-mid mt-xs">
            VM-Compliance-Bereiche definieren und PDF-Richtlinien hochladen
          </p>
        </div>
        {!showForm && !editingId && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-sm bg-kore-ink text-kore-white px-lg py-md-sm text-small font-medium uppercase tracking-widest hover:bg-kore-brass transition-colors"
          >
            <Plus size={16} /> Neuer Bereich
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <AreaForm
          onSave={handleCreate}
          onCancel={() => setShowForm(false)}
          isPending={createMutation.isPending}
        />
      )}

      {/* Edit form */}
      {editingArea && (
        <AreaForm
          initial={{
            name: editingArea.name,
            description: editingArea.description ?? '',
            sortOrder: editingArea.sortOrder ?? 0,
          }}
          onSave={handleUpdate}
          onCancel={() => setEditingId(null)}
          isPending={updateMutation.isPending}
        />
      )}

      {/* Area list */}
      {isLoading ? (
        <div className="text-body text-kore-mid">Lade Bereiche...</div>
      ) : (areas ?? []).length === 0 ? (
        <div className="bg-kore-white border border-kore-border p-3xl text-center">
          <p className="text-body text-kore-mid">
            Noch keine Bereiche definiert. Erstellen Sie den ersten Bereich.
          </p>
        </div>
      ) : (
        <div className="space-y-md">
          {(areas as any[]).map((area: any) => (
            <div
              key={area.id}
              className={`bg-kore-white border border-kore-border p-lg ${
                !area.isActive ? 'opacity-50' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-md flex-1">
                  <div>
                    <span className="text-body font-medium text-kore-ink">{area.name}</span>
                    {area.description && (
                      <span className="text-small text-kore-mid ml-md">{area.description}</span>
                    )}
                    {!area.isActive && (
                      <span className="text-caption text-red-500 ml-md uppercase tracking-widest">
                        Deaktiviert
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-lg">
                  {/* PDF status */}
                  {area.pdfPath ? (
                    <a
                      href={`${API_URL}/api/tools/vm-compliance/areas/${area.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-xs text-small text-emerald-600 hover:text-emerald-700"
                    >
                      <FileText size={14} /> PDF vorhanden
                    </a>
                  ) : (
                    <span className="text-small text-kore-faint">Kein PDF</span>
                  )}

                  <PdfUploadButton areaId={area.id} />

                  <span className="text-caption text-kore-faint">
                    {area._count?.submissions ?? 0} Checks
                  </span>

                  <button
                    onClick={() => setEditingId(area.id)}
                    className="text-kore-mid hover:text-kore-ink"
                    title="Bearbeiten"
                  >
                    <Pencil size={16} />
                  </button>

                  {area.isActive && (
                    <button
                      onClick={() => handleDelete(area.id)}
                      className="text-kore-mid hover:text-red-600"
                      title="Deaktivieren"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
