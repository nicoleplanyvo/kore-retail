import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useKpiTrends, useKpiStores } from '../../../hooks/useKpi';
import { Breadcrumb } from '../../../components/Breadcrumb';
import { KoreLineChart } from '../../../components/Charts';
import { ExportButton } from '../../../components/ExportButton';

export function TrendsPage() {
  const [storeId, setStoreId] = useState('');
  const { data: stores } = useKpiStores();
  const { data: trends, isLoading } = useKpiTrends(storeId || undefined);
  const trendData = (trends ?? []) as Array<any>;

  // Find max values for chart scaling
  const maxRevenue = Math.max(1, ...trendData.map((t) => Number(t.avgRevenue ?? 0)));

  // Transform data for recharts
  const chartData = useMemo(() => trendData.map((t) => ({
    date: t.date,
    Umsatz: Math.round(Number(t.avgRevenue ?? 0)),
    Frequenz: Math.round(Number(t.avgFootfall ?? 0)),
    Conversion: Number(Number(t.avgConversion ?? 0).toFixed(1)),
    Bon: Math.round(Number(t.avgBasket ?? 0)),
  })), [trendData]);

  return (
    <div className="p-xl max-w-5xl">
      <Breadcrumb items={[{ label: 'KPI Dashboard', href: '/app/tools/kpi' }, { label: 'Trends' }]} />
      <div className="flex items-center justify-between mb-2xl">
        <div className="flex items-center gap-md">
          <Link to="/tools/kpi" className="text-kore-mid hover:text-kore-ink transition-colors"><ArrowLeft size={20} /></Link>
          <div>
            <h1 className="font-display text-h1 text-kore-ink">KPI-Trends</h1>
            <p className="text-body text-kore-mid mt-xs">Entwicklung der Kennzahlen ueber Zeit</p>
          </div>
        </div>
        <ExportButton
          endpoint="/api/admin/reporting/export/kpi"
          params={storeId ? { storeId } : {}}
          filename="kpi-trends-report.pdf"
        />
      </div>

      <div className="flex gap-md mb-xl">
        <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="border border-kore-border px-md py-sm text-small bg-kore-white">
          <option value="">Alle Stores</option>
          {(stores ?? []).map((s: { id: string; name: string }) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="text-body text-kore-mid">Lade...</div>
      ) : trendData.length === 0 ? (
        <div className="text-body text-kore-mid">Keine Trend-Daten vorhanden.</div>
      ) : (
        <div className="space-y-2xl">
          {/* Umsatz & Frequenz Trend-Chart */}
          <div className="bg-kore-white border border-kore-border p-xl">
            <h2 className="font-display text-h3 text-kore-ink mb-lg">Umsatz & Frequenz</h2>
            <KoreLineChart
              data={chartData}
              xKey="date"
              lines={[
                { key: 'Umsatz', label: 'Ø Umsatz (EUR)', color: '#b08d57' },
                { key: 'Frequenz', label: 'Ø Frequenz', color: '#2563eb' },
              ]}
              height={320}
            />
          </div>

          {/* Conversion & Bon Trend-Chart */}
          <div className="bg-kore-white border border-kore-border p-xl">
            <h2 className="font-display text-h3 text-kore-ink mb-lg">Conversion & Bon</h2>
            <KoreLineChart
              data={chartData}
              xKey="date"
              lines={[
                { key: 'Conversion', label: 'Ø Conversion (%)', color: '#059669' },
                { key: 'Bon', label: 'Ø Bon (EUR)', color: '#7c3aed' },
              ]}
              height={280}
            />
          </div>

          {/* Kennzahlen-Tabelle */}
          <div className="bg-kore-white border border-kore-border">
            <table className="w-full text-small">
              <thead>
                <tr className="border-b border-kore-border bg-kore-bg">
                  <th className="text-left px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Datum</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Ø Umsatz</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Ø Frequenz</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Ø Conversion</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Ø Bon</th>
                  <th className="text-right px-lg py-md text-caption text-kore-mid uppercase tracking-widest">Eintraege</th>
                </tr>
              </thead>
              <tbody>
                {trendData.map((t) => (
                  <tr key={t.date} className="border-b border-kore-border last:border-0">
                    <td className="px-lg py-md text-kore-ink">{t.date}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{Number(t.avgRevenue ?? 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{Math.round(Number(t.avgFootfall ?? 0))}</td>
                    <td className="px-lg py-md text-right text-kore-ink">{Number(t.avgConversion ?? 0).toFixed(1)}%</td>
                    <td className="px-lg py-md text-right text-kore-ink">{Number(t.avgBasket ?? 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</td>
                    <td className="px-lg py-md text-right text-kore-mid">{t.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
