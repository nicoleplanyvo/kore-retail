import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { Breadcrumb } from '../../../components/Breadcrumb';
import {
  useRtbIndicators,
  useRtbStores,
  useImportEntries,
  getCurrentPeriod,
  type ImportResult,
} from '../useRaiseTheBar';

// ---------- Main ----------

export function ImportPage() {
  const navigate = useNavigate();
  const { data: indicators } = useRtbIndicators();
  const { data: stores } = useRtbStores();
  const importMut = useImportEntries();
  const fileRef = useRef<HTMLInputElement>(null);

  const [period, setPeriod] = useState(getCurrentPeriod);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleImport = () => {
    if (!file || !period) return;
    importMut.mutate(
      { file, period },
      {
        onSuccess: (data) => {
          setResult(data);
          setFile(null);
        },
      },
    );
  };

  const handleDownloadTemplate = () => {
    if (!indicators || !stores) return;

    // Generate CSV template
    const headers = ['Store', ...(indicators.map((i) => i.name))];
    const rows = (stores ?? []).map((s) => [
      s.name,
      ...indicators.map(() => ''),
    ]);

    const csvContent = [
      headers.join(';'),
      ...rows.map((r) => r.join(';')),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `raise-the-bar-template-${period}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-xl max-w-3xl">
      <Breadcrumb
        items={[
          { label: 'Raise the Bar', href: '/app/tools/raise-the-bar' },
          { label: 'Excel-Import' },
        ]}
      />
      <button
        onClick={() => navigate('/app/tools/raise-the-bar')}
        className="flex items-center gap-sm text-small text-kore-mid hover:text-kore-ink mb-xl"
      >
        <ArrowLeft size={16} /> Zurück
      </button>

      <h1 className="font-display text-h1 text-kore-ink mb-2xl flex items-center gap-sm">
        <FileSpreadsheet size={24} /> Excel/CSV-Import
      </h1>

      {/* Period */}
      <div className="mb-xl">
        <label className="block text-small text-kore-mid uppercase tracking-widest mb-sm">
          Periode
        </label>
        <input
          type="month"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border border-kore-border px-md py-sm text-body bg-kore-white focus:outline-none focus:border-kore-brass"
        />
      </div>

      {/* Template Download */}
      <div className="mb-xl">
        <button
          onClick={handleDownloadTemplate}
          disabled={!indicators || indicators.length === 0}
          className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-ink hover:bg-kore-surface disabled:opacity-30"
        >
          <Download size={14} /> Vorlage herunterladen (CSV)
        </button>
        <p className="text-small text-kore-faint mt-xs">
          Die Vorlage enthält alle Stores und Indikatoren als Spalten.
        </p>
      </div>

      {/* Drag & Drop Upload */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-2xl text-center transition-colors ${
          isDragOver
            ? 'border-kore-brass bg-amber-50'
            : 'border-kore-border bg-kore-white'
        }`}
      >
        <Upload size={32} className="mx-auto text-kore-mid mb-md" />
        <p className="text-body text-kore-ink mb-sm">
          {file ? file.name : 'Datei hierher ziehen oder klicken'}
        </p>
        <p className="text-small text-kore-faint mb-md">
          Unterstützte Formate: .xlsx, .xls, .csv
        </p>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div className="flex items-center justify-center gap-sm">
          {file ? (
            <>
              <button
                onClick={() => setFile(null)}
                className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-mid hover:bg-kore-surface"
              >
                <X size={14} /> Entfernen
              </button>
              <button
                onClick={handleImport}
                disabled={importMut.isPending}
                className="flex items-center gap-xs px-md py-sm bg-kore-ink text-kore-white text-small hover:opacity-90 disabled:opacity-50"
              >
                <Upload size={14} />
                {importMut.isPending ? 'Importiere...' : 'Importieren'}
              </button>
            </>
          ) : (
            <button
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-xs px-md py-sm border border-kore-border text-small text-kore-ink hover:bg-kore-surface"
            >
              <Upload size={14} /> Datei auswählen
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="mt-xl border border-kore-border bg-kore-white p-lg">
          <div className="flex items-center gap-sm mb-md">
            <CheckCircle size={16} className="text-emerald-600" />
            <span className="text-body font-medium text-kore-ink">
              Import abgeschlossen
            </span>
          </div>
          <p className="text-body text-kore-ink mb-sm">
            {result.imported} Werte erfolgreich importiert.
          </p>
          {result.errors.length > 0 && (
            <div className="mt-md">
              <p className="text-small text-red-600 font-medium mb-xs">
                {result.errors.length} Fehler:
              </p>
              <ul className="list-disc list-inside space-y-xs">
                {result.errors.map((err, i) => (
                  <li key={i} className="text-small text-red-500">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {importMut.isError && (
        <div className="mt-xl flex items-center gap-sm text-small text-red-600">
          <AlertCircle size={14} />
          {(importMut.error as Error).message}
        </div>
      )}
    </div>
  );
}
