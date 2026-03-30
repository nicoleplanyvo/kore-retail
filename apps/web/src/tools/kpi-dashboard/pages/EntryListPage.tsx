import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useKpiEntries, useKpiStores } from '../../../hooks/useKpi';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { Pagination } from '../../../components/Pagination';
import { usePagination } from '../../../hooks/usePagination';

export function EntryListPage() {
  const page = usePagination();
  const [storeId, setStoreId] = useState('');
  const { data: stores } = useKpiStores();
  const { data, isLoading } = useKpiEntries(page, storeId || undefined);
  const entries = data?.data ?? [];
  const total = data?.total ?? 0;
  const pageSize = 30;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="p-xl max-w-5xl">
      <Breadcrumb items={[{ label: 'KPI Dashboard', href: '/app/tools/kpi' }, { label: 'Einträge' }]} />
      <div className="flex items-center gap-md mb-2xl">
        <Link to="/app/tools/kpi" className="text-kore-mid hover:text-kore-ink transition-colors"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="font-display text-h1 text-kore-ink">KPI-Einträge</h1>
          <p className="text-body text-kore-mid mt-xs">Tägliche Kennzahlen aller Stores</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-md mb-xl">
        <select value={storeId} onChange={(e) => { setStoreId(e.target.value); }} className="border border-kore-border px-md py-sm text-small bg-kore-white">
          <option value="">Alle Stores</option>
          {(stores ?? []).map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-body text-kore-mid">Lade...</div>
      ) : entries.length === 0 ? (
        <div className="text-body text-kore-mid">Keine Einträge gefunden.</div>
      ) : (
        <>
          <div className="border border-kore-border bg-kore-white">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-kore-border bg-kore-bg">
                  <th className="text-left px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Datum</th>
                  <th className="text-left px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Store</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Umsatz</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Frequenz</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Conversion</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Bon-Wert</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">UPT</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e: any) => (
                  <tr key={e.id} className="border-b border-kore-border last:border-0 hover:bg-kore-bg/50">
                    <td className="px-lg py-md text-kore-ink">{new Date(e.date).toLocaleDateString('de-DE')}</td>
                    <td className="px-lg py-md text-kore-ink">{(e.store as any)?.name ?? '-'}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{e.revenue != null ? Number(e.revenue).toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }) : '-'}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{e.footfall != null ? String(e.footfall) : '-'}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{e.conversionRate != null ? `${Number(e.conversionRate).toFixed(1)}%` : '-'}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{e.avgBasket != null ? Number(e.avgBasket).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' }) : '-'}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{e.upt != null ? Number(e.upt).toFixed(1) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
