import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useMutationWithToast } from './useMutationWithToast';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Stores ────────────────────────────────────────────────
export function useChecklistStores() {
  return useQuery<any[]>({
    queryKey: ['checklisten', 'stores'],
    queryFn: () => api('/api/tools/checklisten/stores'),
  });
}

// ── Templates ─────────────────────────────────────────────
export function useChecklistTemplates(storeId?: string) {
  return useQuery<any[]>({
    queryKey: ['checklisten', 'templates', storeId],
    queryFn: () => {
      const params = storeId ? `?storeId=${storeId}` : '';
      return api(`/api/tools/checklisten/templates${params}`);
    },
  });
}

export function useCreateTemplate() {
  return useMutationWithToast({
    mutationFn: (data: any) => api('/api/tools/checklisten/templates', { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['checklisten', 'templates']],
    successMessage: 'Vorlage erstellt.',
    errorMessage: 'Vorlage konnte nicht erstellt werden.',
  });
}

export function useUpdateTemplate() {
  return useMutationWithToast({
    mutationFn: ({ id, ...data }: any) => api(`/api/tools/checklisten/templates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    invalidateKeys: [['checklisten', 'templates']],
    successMessage: 'Vorlage gespeichert.',
    errorMessage: 'Vorlage konnte nicht gespeichert werden.',
  });
}

export function useDeleteTemplate() {
  return useMutationWithToast({
    mutationFn: (id: string) => api(`/api/tools/checklisten/templates/${id}`, { method: 'DELETE' }),
    invalidateKeys: [['checklisten', 'templates']],
    successMessage: 'Vorlage gelöscht.',
    errorMessage: 'Vorlage konnte nicht gelöscht werden.',
  });
}

// ── Checklists (Sessions) ─────────────────────────────────
export function useChecklists(page = 1, storeId?: string, status?: string, date?: string) {
  return useQuery<{ data: any[]; total: number; page: number; pageSize: number }>({
    queryKey: ['checklisten', 'list', page, storeId, status, date],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (status) params.set('status', status);
      if (date) params.set('date', date);
      return api(`/api/tools/checklisten/checklists?${params}`);
    },
  });
}

export function useChecklist(id: string) {
  return useQuery<any>({
    queryKey: ['checklisten', 'detail', id],
    queryFn: () => api(`/api/tools/checklisten/checklists/${id}`),
    enabled: !!id,
  });
}

export function useCreateChecklist() {
  return useMutationWithToast({
    mutationFn: (data: any) => api('/api/tools/checklisten/checklists', { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['checklisten']],
    successMessage: 'Checkliste gestartet.',
    errorMessage: 'Checkliste konnte nicht erstellt werden.',
  });
}

export function useToggleCheckItem() {
  const qc = useQueryClient();
  return useMutationWithToast<any, Error, { checklistId: string; itemId: string }>({
    mutationFn: ({ checklistId, itemId }) =>
      api(`/api/tools/checklisten/checklists/${checklistId}/items/${itemId}`, { method: 'PUT', body: '{}' }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['checklisten', 'detail', vars.checklistId] });
      qc.invalidateQueries({ queryKey: ['checklisten', 'list'] });
      qc.invalidateQueries({ queryKey: ['checklisten', 'dashboard'] });
    },
    errorMessage: 'Punkt konnte nicht aktualisiert werden.',
  });
}

// ── Session list item shape ────────────────────────────────
export interface ChecklistSessionListItem {
  id: string;
  status: string;
  completionRate: number | null;
  startedAt: string;
  completedAt: string | null;
  store: { id: string; name: string; city?: string | null } | null;
  template: { id: string; name: string } | null;
}

// ── Session detail shape (minimal, for type safety in pages) ─────
interface ChecklistSessionData {
  id: string;
  status: string;
  completionRate: number | null;
  notes: string | null;
  startedAt: string | null;
  completedAt: string | null;
  store: { id: string; name: string; city?: string | null } | null;
  template: {
    name: string;
    sections: {
      id: string;
      name: string;
      items: { id: string; text: string; type: string }[];
    }[];
  } | null;
  entries: {
    id: string;
    itemId: string;
    valueBool: boolean | null;
    valueText: string | null;
    valueNumber: number | null;
    photoPath: string | null;
    comment: string | null;
  }[];
}

// ── Aliases for session-named imports ─────────────────────
export function useChecklistSession(id?: string) {
  return useQuery<ChecklistSessionData>({
    queryKey: ['checklisten', 'detail', id],
    queryFn: () => api(`/api/tools/checklisten/checklists/${id}`),
    enabled: !!id,
  });
}

export function useChecklistSessions(page = 1, storeId?: string, status?: string, date?: string) {
  return useQuery<{ data: ChecklistSessionListItem[]; total: number; page: number; pageSize: number }>({
    queryKey: ['checklisten', 'list', page, storeId, status, date],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), pageSize: '20' });
      if (storeId) params.set('storeId', storeId);
      if (status) params.set('status', status);
      if (date) params.set('date', date);
      return api(`/api/tools/checklisten/checklists?${params}`);
    },
  });
}

// ── Dashboard ─────────────────────────────────────────────
export function useChecklistDashboard(storeId?: string) {
  return useQuery<any>({
    queryKey: ['checklisten', 'dashboard', storeId],
    queryFn: () => {
      const params = storeId ? `?storeId=${storeId}` : '';
      return api(`/api/tools/checklisten/dashboard${params}`);
    },
  });
}
