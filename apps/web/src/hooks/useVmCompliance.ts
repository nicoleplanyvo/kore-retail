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

export function useVmAreas() {
  return useQuery({ queryKey: ['vmc', 'areas'], queryFn: () => api<any[]>('/api/tools/vm-compliance/areas') });
}

export function useVmSubmissions(opts: { page?: number; status?: string; storeId?: string; guidelineId?: string } = {}) {
  const { page = 1, status, storeId, guidelineId } = opts;
  return useQuery({
    queryKey: ['vmc', 'submissions', page, status, storeId, guidelineId],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (status) params.set('status', status);
      if (storeId) params.set('storeId', storeId);
      if (guidelineId) params.set('guidelineId', guidelineId);
      return api<{ data: any[]; total: number }>(`/api/tools/vm-compliance/submissions?${params}`);
    },
  });
}

// VM Areas CRUD
export function useCreateVmArea() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
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
    mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string; isActive?: boolean; sortOrder?: number }) =>
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

// Pending checks for review queue
export function useVmCompliancePendingChecks(page = 1) {
  return useQuery({
    queryKey: ['vmc', 'checks', 'pending', page],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20', status: 'PENDING' });
      return api<{ data: any[]; total: number }>(`/api/tools/vm-compliance/checks?${params}`);
    },
  });
}

// Overdue checks (checks pending for more than 48h)
export function useVmOverdueChecks() {
  return useQuery({
    queryKey: ['vmc', 'checks', 'overdue'],
    queryFn: async () => {
      const result = await api<{ data: any[]; total: number }>('/api/tools/vm-compliance/checks?status=PENDING&pageSize=50');
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      return (result.data ?? []).filter((c: any) => new Date(c.submittedAt).getTime() < cutoff);
    },
  });
}

// Escalate checks (stub — marks as high priority via review note)
export function useEscalateVmChecks() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      Promise.all(ids.map((id) =>
        api<any>(`/api/tools/vm-compliance/checks/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'REJECTED', reviewNote: 'Eskaliert — ueberfaellig' }),
        })
      )),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc'] }); },
  });
}

// Alias for cleaner imports
export const useVmGuidelines = useVmComplianceGuidelines;

export function useCreateVmGuideline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; category?: string }) =>
      api<any>('/api/tools/vm-compliance/guidelines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'guidelines'] }); },
  });
}

export function useUpdateVmGuideline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: string; name?: string; description?: string; category?: string; isActive?: boolean; sortOrder?: number }) =>
      api<any>(`/api/tools/vm-compliance/guidelines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'guidelines'] }); },
  });
}

export function useDeleteVmGuideline() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`/api/tools/vm-compliance/guidelines/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'guidelines'] }); },
  });
}

export function useUploadGuidelinePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
      apiUpload<any>(`/api/tools/vm-compliance/guidelines/${id}/photo`, formData),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vmc', 'guidelines'] }); },
  });
}
