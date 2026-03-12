import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useBudgetStores() {
  return useQuery({ queryKey: ['budget', 'stores'], queryFn: () => api.get('/tools/budget/stores').then((r) => r.data) });
}

export function useBudgetPeriods(page = 1, storeId?: string) {
  return useQuery({
    queryKey: ['budget', 'periods', page, storeId],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      return api.get(`/tools/budget/periods?${params}`).then((r) => r.data);
    },
  });
}

export function useBudgetPeriod(id: string) {
  return useQuery({
    queryKey: ['budget', 'period', id],
    queryFn: () => api.get(`/tools/budget/periods/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useBudgetSummary(period?: string) {
  return useQuery({
    queryKey: ['budget', 'summary', period],
    queryFn: () => {
      const params = new URLSearchParams();
      if (period) params.set('period', period);
      return api.get(`/tools/budget/summary?${params}`).then((r) => r.data);
    },
  });
}
