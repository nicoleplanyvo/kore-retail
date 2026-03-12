import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

export function useLossStores() {
  return useQuery({ queryKey: ['loss', 'stores'], queryFn: () => api.get('/tools/loss-prevention/stores').then((r) => r.data) });
}

export function useLossIncidents(page = 1, storeId?: string, status?: string, category?: string) {
  return useQuery({
    queryKey: ['loss', 'incidents', page, storeId, status, category],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (status) params.set('status', status);
      if (category) params.set('category', category);
      return api.get(`/tools/loss-prevention/incidents?${params}`).then((r) => r.data);
    },
  });
}

export function useLossIncident(id: string) {
  return useQuery({
    queryKey: ['loss', 'incident', id],
    queryFn: () => api.get(`/tools/loss-prevention/incidents/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useLossSummary() {
  return useQuery({
    queryKey: ['loss', 'summary'],
    queryFn: () => api.get('/tools/loss-prevention/summary').then((r) => r.data),
  });
}
