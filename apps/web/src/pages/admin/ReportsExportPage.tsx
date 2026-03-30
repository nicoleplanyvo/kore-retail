import { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ExportButton } from '../../components/ExportButton';

type ReportType = 'kpi' | 'audit' | 'store-overview';

interface StoreOption {
  id: string;
  name: string;
  city: string | null;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthStart(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function ReportsExportPage() {
  const [reportType, setReportType] = useState<ReportType>('kpi');
  const [dateFrom, setDateFrom] = useState(monthStart());
  const [dateTo, setDateTo] = useState(todayStr());
  const [storeId, setStoreId] = useState('');

  // Stores laden via Admin-Endpoint
  const { data: stores } = useQuery({
    queryKey: ['admin-stores-list'],
    queryFn: () => api<StoreOption[]>('/api/admin/stores'),
  });

  const reportOptions: { value: ReportType; label: string; description: string }[] = [
    { value: 'kpi', label: 'KPI Report', description: 'Umsatz, Transaktionen, Frequenz, Conversion' },
    { value: 'audit', label: 'Audit Report', description: 'Store Excellence Audit Ergebnisse und Scores' },
    { value: 'store-overview', label: 'Store-Uebersicht', description: 'Kompletter Ueberblick eines einzelnen Stores' },
  ];

  const needsStore = reportType === 'store-overview';
  const needsDates = reportType !== 'store-overview';

  // Build export params
  const exportParams: Record<string, string> = {};
  if (needsDates) {
    if (dateFrom) exportParams['dateFrom'] = dateFrom;
    if (dateTo) exportParams['dateTo'] = dateTo;
  }
  if (storeId) exportParams['storeId'] = storeId;

  const canExport = needsStore ? !!storeId : true;

  const selectedStore = (stores ?? []).find((s) => s.id === storeId);
  const filename = reportType === 'kpi'
    ? `kpi-report-${dateFrom}.pdf`
    : reportType === 'audit'
    ? `audit-report-${dateFrom}.pdf`
    : `store-uebersicht-${selectedStore?.name?.replace(/\s/g, '-').toLowerCase() ?? 'store'}.pdf`;

  return (
    <div className="p-xl max-w-3xl">
      <Breadcrumb items={[{ label: 'Berichte & Export' }]} />

      <div className="mb-2xl">
        <h1 className="font-display text-h1 text-kore-ink">Berichte & PDF-Export</h1>
        <p className="text-body text-kore-mid mt-xs">
          Erstellen Sie PDF-Reports fuer KPIs, Audits oder einzelne Stores.
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="mb-xl">
        <label className="block text-caption text-kore-mid uppercase tracking-widest mb-sm">Berichtstyp</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
          {reportOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setReportType(opt.value)}
              className={`border p-lg text-left transition-colors ${
                reportType === opt.value
                  ? 'border-kore-brass bg-kore-brass/5'
                  : 'border-kore-border bg-kore-white hover:bg-kore-bg'
              }`}
            >
              <div className="flex items-center gap-sm mb-xs">
                <FileText size={16} className={reportType === opt.value ? 'text-kore-brass' : 'text-kore-mid'} />
                <span className={`text-small font-medium uppercase tracking-wider ${
                  reportType === opt.value ? 'text-kore-brass' : 'text-kore-ink'
                }`}>
                  {opt.label}
                </span>
              </div>
              <p className="text-caption text-kore-mid">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-kore-white border border-kore-border p-xl mb-xl">
        <h2 className="font-display text-h3 text-kore-ink mb-lg">Filter</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-lg">
          {/* Date Range */}
          {needsDates && (
            <>
              <div>
                <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Von</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full border border-kore-border px-md py-sm text-small bg-kore-white"
                />
              </div>
              <div>
                <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">Bis</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full border border-kore-border px-md py-sm text-small bg-kore-white"
                />
              </div>
            </>
          )}

          {/* Store Filter */}
          <div className={needsDates ? 'sm:col-span-2' : 'sm:col-span-2'}>
            <label className="block text-caption text-kore-mid uppercase tracking-widest mb-xs">
              Store {needsStore && <span className="text-red-500">*</span>}
            </label>
            <select
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              className="w-full border border-kore-border px-md py-sm text-small bg-kore-white"
            >
              <option value="">{needsStore ? '-- Store waehlen --' : 'Alle Stores'}</option>
              {(stores ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}{s.city ? ` (${s.city})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Export Action */}
      <div className="flex items-center justify-between bg-kore-bg border border-kore-border p-xl">
        <div>
          <p className="text-small font-medium text-kore-ink">
            {reportOptions.find((o) => o.value === reportType)?.label}
          </p>
          <p className="text-caption text-kore-mid mt-xs">
            {needsDates ? `${dateFrom} bis ${dateTo}` : ''}
            {storeId && selectedStore ? ` — ${selectedStore.name}` : needsStore ? '' : ' — Alle Stores'}
          </p>
        </div>

        {canExport ? (
          <ExportButton
            endpoint={`/api/admin/reporting/export/${reportType}`}
            params={exportParams}
            filename={filename}
            label="PDF herunterladen"
          />
        ) : (
          <button
            disabled
            className="flex items-center gap-sm border border-kore-border px-lg py-md-sm text-small font-medium uppercase tracking-widest text-kore-faint cursor-not-allowed"
          >
            <Download size={14} />
            Store waehlen
          </button>
        )}
      </div>
    </div>
  );
}
