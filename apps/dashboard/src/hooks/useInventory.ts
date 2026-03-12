import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useInventoryStores() {
  return useQuery({ queryKey: ['inventory', 'stores'], queryFn: () => api.get('/tools/inventory/stores').then((r) => r.data) });
}

export function useInventoryCounts(page = 1, storeId?: string, status?: string) {
  return useQuery({
    queryKey: ['inventory', 'counts', page, storeId, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (status) params.set('status', status);
      return api.get(`/tools/inventory/counts?${params}`).then((r) => r.data);
    },
  });
}

export function useInventoryCount(id: string) {
  return useQuery({
    queryKey: ['inventory', 'count', id],
    queryFn: () => api.get(`/tools/inventory/counts/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useInventorySummary() {
  return useQuery({
    queryKey: ['inventory', 'summary'],
    queryFn: () => api.get('/tools/inventory/summary').then((r) => r.data),
  });
}
