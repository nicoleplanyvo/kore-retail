import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useKpiStores() {
  return useQuery({ queryKey: ['kpi', 'stores'], queryFn: () => api.get('/tools/kpi/stores').then((r) => r.data) });
}

export function useKpiEntries(page = 1, storeId?: string, dateFrom?: string, dateTo?: string) {
  return useQuery({
    queryKey: ['kpi', 'entries', page, storeId, dateFrom, dateTo],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '30' });
      if (storeId) params.set('storeId', storeId);
      if (dateFrom) params.set('dateFrom', dateFrom);
      if (dateTo) params.set('dateTo', dateTo);
      return api.get(`/tools/kpi/entries?${params}`).then((r) => r.data);
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
      return api.get(`/tools/kpi/summary?${params}`).then((r) => r.data);
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
      return api.get(`/tools/kpi/trends?${params}`).then((r) => r.data);
    },
  });
}
