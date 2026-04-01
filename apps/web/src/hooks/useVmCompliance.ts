import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '../lib/api';
/* eslint-disable @typescript-eslint/no-explicit-any */

/* ================================================================== */
/*  STORES                                                             */
/* ================================================================== */

export function useVmComplianceStores() {
  return useQuery({
    queryKey: ['vmc', 'stores'],
    queryFn: () => api<any[]>('/api/tools/vm-compliance/stores'),
  });
}

/* ================================================================== */
/*  AREAS — Bereiche                                                   */
/* ================================================================== */

export function useVmAreas(showAll = false) {
  return useQuery({
    queryKey: ['vmc', 'areas', showAll],
    queryFn: () => {
      const params = showAll ? '?showAll=true' : '';
      return api<any[]>(`/api/tools/vm-compliance/areas${params}`);
    },
  });
}

export function useCreateVmArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; sortOrder?: number }) =>
      api<any>('/api/tools/vm-compliance/areas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'areas'] }); },
  });
}

export function useUpdateVmArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api<any>(`/api/tools/vm-compliance/areas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'areas'] }); },
  });
}

export function useDeleteVmArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`/api/tools/vm-compliance/areas/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'areas'] }); },
  });
}

export function useUploadAreaPdf() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiUpload<any>(`/api/tools/vm-compliance/areas/${id}/pdf`, formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'areas'] }); },
  });
}

/* ================================================================== */
/*  GUIDELINES                                                         */
/* ================================================================== */

export function useVmComplianceGuidelines() {
  return useQuery({
    queryKey: ['vmc', 'guidelines'],
    queryFn: () => api<any[]>('/api/tools/vm-compliance/guidelines'),
  });
}

/** Alias for useVmComplianceGuidelines — used by GuidelinesPage */
export const useVmGuidelines = useVmComplianceGuidelines;

/* ================================================================== */
/*  CHECKS                                                             */
/* ================================================================== */

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
    mutationFn: (formData: FormData) =>
      apiUpload<any>('/api/tools/vm-compliance/checks', formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc'] }); },
  });
}

export function useReviewVmCheck() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: any) =>
      api<any>(`/api/tools/vm-compliance/checks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc'] }); },
  });
}

/* ================================================================== */
/*  DASHBOARD                                                          */
/* ================================================================== */

export function useVmComplianceDashboard() {
  return useQuery({
    queryKey: ['vmc', 'dashboard'],
    queryFn: () => api<any>('/api/tools/vm-compliance/dashboard'),
  });
}

/* ================================================================== */
/*  OVERDUE / ESCALATION                                               */
/* ================================================================== */

export function useVmOverdueChecks() {
  return useQuery({
    queryKey: ['vmc', 'checks', 'overdue'],
    queryFn: () => api<any[]>('/api/tools/vm-compliance/checks/overdue'),
  });
}

export function useEscalateVmChecks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      api<{ escalatedCount: number; escalatedIds: string[] }>(
        '/api/tools/vm-compliance/checks/escalate',
        { method: 'POST' },
      ),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['vmc'] });
    },
  });
}

/* ================================================================== */
/*  LEGACY COMPAT                                                      */
/* ================================================================== */

/** Paginated submissions with optional filters */
export function useVmSubmissions(params: {
  page?: number;
  storeId?: string;
  status?: string;
  from?: string;
  to?: string;
} = {}) {
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
export function useVmCompliancePendingChecks(
  page = 1,
  storeId?: string,
  from?: string,
  to?: string,
) {
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
      const result = await api<{ data: any[]; total: number }>(
        '/api/tools/vm-compliance/checks?status=PENDING&pageSize=1',
      );
      return result.total;
    },
  });
}
