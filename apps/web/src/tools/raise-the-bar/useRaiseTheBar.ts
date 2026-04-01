import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '../../lib/api';

// ---------- Types ----------

export interface RtbStore {
  id: string;
  name: string;
  city: string | null;
}

export interface RtbIndicator {
  id: string;
  tenantId: string;
  name: string;
  unit: string;
  weight: number;
  targetValue: number | null;
  higherIsBetter: boolean;
  sortOrder: number;
  isActive: boolean;
}

export interface RtbEntry {
  id: string;
  storeId: string;
  indicatorId: string;
  period: string;
  value: number;
  indicator?: RtbIndicator;
  store?: { id: string; name: string };
}

export interface IndicatorScore {
  indicatorId: string;
  name: string;
  unit: string;
  value: number;
  score: number;
  weight: number;
}

export interface StoreRanking {
  storeId: string;
  storeName: string;
  totalScore: number;
  rank: number;
  indicators: IndicatorScore[];
}

export interface ImportResult {
  imported: number;
  errors: string[];
}

// ---------- Stores ----------

export function useRtbStores() {
  return useQuery<RtbStore[]>({
    queryKey: ['rtb', 'stores'],
    queryFn: async () => {
      const res = await api<{ data: RtbStore[] }>('/api/tools/raise-the-bar/stores');
      return res.data;
    },
  });
}

// ---------- Indicators ----------

export function useRtbIndicators() {
  return useQuery<RtbIndicator[]>({
    queryKey: ['rtb', 'indicators'],
    queryFn: async () => {
      const res = await api<{ data: RtbIndicator[] }>('/api/tools/raise-the-bar/indicators');
      return res.data;
    },
  });
}

export function useCreateIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      unit: string;
      weight: number;
      targetValue?: number | null;
      higherIsBetter: boolean;
    }) =>
      api<RtbIndicator>('/api/tools/raise-the-bar/indicators', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'indicators'] });
    },
  });
}

export function useUpdateIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<{
      name: string;
      unit: string;
      weight: number;
      targetValue: number | null;
      higherIsBetter: boolean;
    }>) =>
      api<RtbIndicator>(`/api/tools/raise-the-bar/indicators/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'indicators'] });
    },
  });
}

export function useReorderIndicators() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (indicators: { id: string; weight: number; sortOrder: number }[]) =>
      api<{ data: RtbIndicator[] }>('/api/tools/raise-the-bar/indicators/reorder', {
        method: 'PUT',
        body: JSON.stringify({ indicators }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'indicators'] });
    },
  });
}

export function useDeleteIndicator() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/tools/raise-the-bar/indicators/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'indicators'] });
    },
  });
}

// ---------- Entries ----------

export function useRtbEntries(period: string, storeId?: string) {
  return useQuery<RtbEntry[]>({
    queryKey: ['rtb', 'entries', period, storeId],
    queryFn: async () => {
      const params = new URLSearchParams({ period });
      if (storeId) params.set('storeId', storeId);
      const res = await api<{ data: RtbEntry[] }>(`/api/tools/raise-the-bar/entries?${params}`);
      return res.data;
    },
    enabled: !!period,
  });
}

export function useBulkUpsertEntries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { storeId: string; period: string; values: Record<string, number> }) =>
      api('/api/tools/raise-the-bar/entries', {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'entries'] });
      qc.invalidateQueries({ queryKey: ['rtb', 'rankings'] });
    },
  });
}

export function useImportEntries() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, period }: { file: File; period: string }) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('period', period);
      return apiUpload<ImportResult>('/api/tools/raise-the-bar/entries/import', formData);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'entries'] });
      qc.invalidateQueries({ queryKey: ['rtb', 'rankings'] });
    },
  });
}

// ---------- Rankings ----------

export function useRtbRankings(period: string) {
  return useQuery<{ data: StoreRanking[]; period: string }>({
    queryKey: ['rtb', 'rankings', period],
    queryFn: () =>
      api<{ data: StoreRanking[]; period: string }>(
        `/api/tools/raise-the-bar/rankings?period=${period}`,
      ),
    enabled: !!period,
  });
}

export function useRtbTrend(months?: number) {
  return useQuery({
    queryKey: ['rtb', 'trend', months],
    queryFn: () =>
      api<{
        data: Record<string, { storeName: string; data: { period: string; totalScore: number; rank: number }[] }>;
        periods: string[];
      }>(`/api/tools/raise-the-bar/rankings/trend?months=${months ?? 6}`),
  });
}

export function useRtbComparison(storeIds: string[], period: string) {
  return useQuery<{ data: StoreRanking[]; period: string }>({
    queryKey: ['rtb', 'comparison', storeIds, period],
    queryFn: () =>
      api<{ data: StoreRanking[]; period: string }>(
        `/api/tools/raise-the-bar/rankings/comparison?storeIds=${storeIds.join(',')}&period=${period}`,
      ),
    enabled: storeIds.length >= 2 && !!period,
  });
}

export function useRecalculateRankings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (period: string) =>
      api('/api/tools/raise-the-bar/rankings/recalculate', {
        method: 'POST',
        body: JSON.stringify({ period }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['rtb', 'rankings'] });
      qc.invalidateQueries({ queryKey: ['rtb', 'trend'] });
    },
  });
}

// ---------- Helpers ----------

export function getCurrentPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

export function formatPeriod(period: string): string {
  const [year, month] = period.split('-');
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  const idx = parseInt(month ?? '1', 10) - 1;
  return `${months[idx]} ${year}`;
}

export function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 60) return 'text-amber-600';
  return 'text-red-600';
}

export function scoreBg(score: number): string {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-amber-500';
  return 'bg-red-500';
}
