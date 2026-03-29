import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */

export function useKpiStores() {
  return useQuery({ queryKey: ['kpi', 'stores'], queryFn: () => api<any[]>('/api/tools/kpi/stores') });
}

export function useKpiEntries(page = 1, storeId?: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['kpi', 'entries', page, storeId, dateFrom, dateTo],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '30' });
      if (storeId) params.set('storeId', storeId);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      return api<{ data: any[]; total: number }>(`/api/tools/kpi/entries?${params}`);
    },
  });
}

export function useKpiSummary(dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['kpi', 'summary', dateFrom, dateTo],
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      return api<any>(`/api/tools/kpi/summary?${params}`);
    },
  });
}

export interface YoYPeriodData {
  totalRevenue: number;
  totalTransactions: number;
  totalFootfall: number;
  totalUnits: number;
  avgRevenue: number;
  avgFootfall: number;
  avgBasket: number;
  avgConversion: number;
  avgUpt: number;
  storeCount: number;
  totalEntries: number;
}

export interface YoYChanges {
  revenue: number | null;
  avgRevenue: number | null;
  footfall: number | null;
  conversion: number | null;
  avgBasket: number | null;
  upt: number | null;
}

export interface YoYResponse {
  period: { from: string; to: string };
  lastYearPeriod: { from: string; to: string };
  current: YoYPeriodData;
  lastYear: YoYPeriodData;
  changes: YoYChanges;
}

export function useKpiSummaryYoY(dateFrom?: string, dateTo?: string, storeId?: string) {
  return useQuery({
    queryKey: ['kpi', 'summary-yoy', dateFrom, dateTo, storeId],
    queryFn: () => {
      const params = new URLSearchParams();
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      if (storeId) params.set('storeId', storeId);
      return api<YoYResponse>(`/api/tools/kpi/summary/yoy?${params}`);
    },
  });
}

export function useKpiTrends(storeId?: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['kpi', 'trends', storeId, dateFrom, dateTo],
    queryFn: () => {
      const params = new URLSearchParams();
      if (storeId) params.set('storeId', storeId);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      return api<any[]>(`/api/tools/kpi/trends?${params}`);
    },
  });
}
