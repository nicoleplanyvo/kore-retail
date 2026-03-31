import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '../lib/api';
/* eslint-disable @typescript-eslint/no-explicit-any */

export function useVmComplianceStores() {
  return useQuery({ queryKey: ['vmc', 'stores'], queryFn: () => api<any[]>('/api/tools/vm-compliance/stores') });
}

export function useVmComplianceGuidelines() {
  return useQuery({ queryKey: ['vmc', 'guidelines'], queryFn: () => api<any[]>('/api/tools/vm-compliance/guidelines') });
}

export function useVmComplianceChecks(page = 1, storeId?: string, status?: string) {
  return useQuery({
    queryKey: ['vmc', 'checks', page, storeId, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (status) params.set('status', status);
      return api<{ data: any[]; total: number }>(`/api/tools/vm-compliance/checks?${params}`);
    },
  });
}

export function useVmComplianceCheck(id?: string) {
  return useQuery({
    queryKey: ['vmc', 'check', id],
    queryFn: () => api<any>(`/api/tools/vm-compliance/checks/${id}`),
    enabled: !!id,
  });
}

export function useSubmitVmCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) => apiUpload<any>('/api/tools/vm-compliance/checks', formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc'] }); },
  });
}

export function useReviewVmCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) => api<any>(`/api/tools/vm-compliance/checks/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc'] }); },
  });
}

export function useVmComplianceDashboard() {
  return useQuery({
    queryKey: ['vmc', 'dashboard'],
    queryFn: () => api<any>('/api/tools/vm-compliance/dashboard'),
  });
}

/** Alias for useVmComplianceGuidelines — used by GuidelinesPage */
export const useVmGuidelines = useVmComplianceGuidelines;

/** Paginated submissions with optional filters — used by ReviewQueuePage and SubmissionDetailPage */
export function useVmSubmissions(params: { page?: number; storeId?: string; status?: string; from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ['vmc', 'submissions', params],
    queryFn: () => {
      const p = new URLSearchParams({ page: String(params.page ?? 1), pageSize: '20' });
      if (params.storeId) p.set('storeId', params.storeId);
      if (params.status) p.set('status', params.status);
      if (params.from) p.set('from', params.from);
      if (params.to) p.set('to', params.to);
      return api<{ data: any[]; total: number }>(`/api/tools/vm-compliance/checks?${p}`);
    },
  });
}

/** Fetches pending checks for the review queue with optional filters */
export function useVmCompliancePendingChecks(page = 1, storeId?: string, from?: string, to?: string) {
  return useQuery({
    queryKey: ['vmc', 'checks', 'pending', page, storeId, from, to],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20', status: 'PENDING' });
      if (storeId) params.set('storeId', storeId);
      if (from) params.set('from', from);
      if (to) params.set('to', to);
      return api<{ data: any[]; total: number }>(`/api/tools/vm-compliance/checks?${params}`);
    },
  });
}

/** Lightweight count of pending checks (for badge on overview) */
export function useVmCompliancePendingCount() {
  return useQuery({
    queryKey: ['vmc', 'checks', 'pending-count'],
    queryFn: async () => {
      const result = await api<{ data: any[]; total: number }>('/api/tools/vm-compliance/checks?status=PENDING&pageSize=1');
      return result.total;
    },
  });
}
