import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE = '/api/tools/checklisten-audits';

// ── Types ──────────────────────────────────────────

interface StoreOption { id: string; name: string; city: string | null; }

interface PaginatedSessions {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
}

interface DashboardKpis {
  totalAudits: number;
  avgScore: number;
  avgCompletionRate: number;
  todaysSessions: number;
  overdueCount: number;
  trend: 'up' | 'down' | 'stable';
}

// ── Queries ────────────────────────────────────────

export function useCAStores() {
  return useQuery<StoreOption[]>({
    queryKey: ['ca', 'stores'],
    queryFn: () => api(`${BASE}/stores`),
  });
}

export function useCATemplates(type?: 'AUDIT' | 'CHECKLIST') {
  const qs = type ? `?type=${type}` : '';
  return useQuery<any[]>({
    queryKey: ['ca', 'templates', type],
    queryFn: () => api(`${BASE}/templates${qs}`),
  });
}

export function useCATemplate(id?: string) {
  return useQuery<any>({
    queryKey: ['ca', 'template', id],
    queryFn: () => api(`${BASE}/templates/${id}`),
    enabled: !!id,
  });
}

interface SessionParams {
  page?: number;
  pageSize?: number;
  storeId?: string;
  status?: string;
  templateType?: string;
  from?: string;
  to?: string;
}

export function useCASessions(params: SessionParams = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.pageSize) qs.set('pageSize', String(params.pageSize));
  if (params.storeId) qs.set('storeId', params.storeId);
  if (params.status) qs.set('status', params.status);
  if (params.templateType) qs.set('templateType', params.templateType);
  if (params.from) qs.set('from', params.from);
  if (params.to) qs.set('to', params.to);
  const query = qs.toString();
  return useQuery<PaginatedSessions>({
    queryKey: ['ca', 'sessions', params],
    queryFn: () => api(`${BASE}/sessions${query ? '?' + query : ''}`),
  });
}

export function useCASession(id?: string) {
  return useQuery<any>({
    queryKey: ['ca', 'session', id],
    queryFn: () => api(`${BASE}/sessions/${id}`),
    enabled: !!id,
  });
}

export function useCADashboard() {
  return useQuery<DashboardKpis>({
    queryKey: ['ca', 'dashboard'],
    queryFn: () => api(`${BASE}/reports/dashboard`),
  });
}

export function useCATrends() {
  return useQuery<any[]>({
    queryKey: ['ca', 'trends'],
    queryFn: () => api(`${BASE}/reports/trends`),
  });
}

export function useCACategoryStats() {
  return useQuery<any>({
    queryKey: ['ca', 'category-stats'],
    queryFn: () => api(`${BASE}/reports/categories`),
  });
}

export function useCAStoreRanking() {
  return useQuery<any[]>({
    queryKey: ['ca', 'store-ranking'],
    queryFn: () => api(`${BASE}/reports/stores`),
  });
}

// ── Mutations ──────────────────────────────────────

export function useCreateCASession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      storeId: string;
      templateId: string;
      storeLocation?: string;
      notes?: string;
      dueDate?: string;
    }) =>
      api<any>(`${BASE}/sessions`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca'] }); },
  });
}

export function useCompleteCASession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`${BASE}/sessions/${id}/complete`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca'] }); },
  });
}

export function useCancelCASession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`${BASE}/sessions/${id}/cancel`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca'] }); },
  });
}

export function useUpsertCAResponse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      sessionId: string;
      criterionId: string;
      scorePercent?: number | null;
      passed?: boolean | null;
      comment?: string | null;
      valueBool?: boolean | null;
      valueText?: string | null;
      valueNumber?: number | null;
    }) =>
      api<any>(`${BASE}/sessions/${data.sessionId}/responses/${data.criterionId}`, {
        method: 'PUT',
        body: JSON.stringify({
          scorePercent: data.scorePercent,
          passed: data.passed,
          comment: data.comment,
          valueBool: data.valueBool,
          valueText: data.valueText,
          valueNumber: data.valueNumber,
        }),
      }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca'] }); },
  });
}

export function useCreateCATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) =>
      api<any>(`${BASE}/templates`, { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca', 'templates'] }); },
  });
}

export function useUpdateCATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      api<any>(`${BASE}/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca', 'templates'] }); },
  });
}

export function useDeleteCATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`${BASE}/templates/${id}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca', 'templates'] }); },
  });
}

export function useCloneCATemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<any>(`${BASE}/templates/${id}/clone`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['ca', 'templates'] }); },
  });
}
