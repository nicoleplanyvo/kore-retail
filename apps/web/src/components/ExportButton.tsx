import { Download } from 'lucide-react';
import { useState } from 'react';
import { getAccessToken, API_URL } from '../lib/api';

interface ExportButtonProps {
  endpoint: string;
  params?: Record<string, string>;
  filename?: string;
  label?: string;
}

export function ExportButton({ endpoint, params, filename, label = 'PDF Export' }: ExportButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const url = new URL(`${API_URL}${endpoint}`, window.location.origin);
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v) url.searchParams.set(k, v);
        });
      }
      const token = getAccessToken();
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Export fehlgeschlagen');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'report.pdf';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-sm border border-kore-border px-lg py-md-sm text-small font-medium uppercase tracking-widest text-kore-ink hover:bg-kore-bg disabled:opacity-30 transition-colors"
    >
      <Download size={14} />
      {loading ? 'Exportiere...' : label}
    </button>
  );
}
