import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useMutationWithToast } from './useMutationWithToast';
/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE = '/api/tools/shift-planning';

// ── Stores & Users ───────────────────────────────────
export function useShiftStores() {
  return useQuery({ queryKey: ['shift', 'stores'], queryFn: () => api<any[]>(`${BASE}/stores`) });
}

export function useShiftUsers(storeId?: string) {
  const sp = new URLSearchParams();
  if (storeId) sp.set('storeId', storeId);
  return useQuery({ queryKey: ['shift', 'users', storeId], queryFn: () => api<any[]>(`${BASE}/users?${sp}`) });
}

// ── Shifts ───────────────────────────────────────────
export function useShifts(params?: { storeId?: string; weekStart?: string; weekEnd?: string; userId?: string }) {
  const sp = new URLSearchParams();
  if (params?.storeId) sp.set('storeId', params.storeId);
  if (params?.weekStart) sp.set('weekStart', params.weekStart);
  if (params?.weekEnd) sp.set('weekEnd', params.weekEnd);
  if (params?.userId) sp.set('userId', params.userId);
  return useQuery({
    queryKey: ['shift', 'shifts', params],
    queryFn: () => api<any[]>(`${BASE}/shifts?${sp}`),
  });
}

export function useCreateShift() {
  return useMutationWithToast({
    mutationFn: (data: any) => api<any>(`${BASE}/shifts`, { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Schicht erstellt.',
    errorMessage: 'Schicht konnte nicht erstellt werden.',
  });
}

export function useUpdateShift() {
  return useMutationWithToast({
    mutationFn: ({ id, ...data }: any) => api<any>(`${BASE}/shifts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Schicht gespeichert.',
    errorMessage: 'Schicht konnte nicht gespeichert werden.',
  });
}

export function useDeleteShift() {
  return useMutationWithToast({
    mutationFn: (id: string) => api<any>(`${BASE}/shifts/${id}`, { method: 'DELETE' }),
    invalidateKeys: [['shift']],
    successMessage: 'Schicht gelöscht.',
    errorMessage: 'Schicht konnte nicht gelöscht werden.',
  });
}

export function usePublishWeek() {
  return useMutationWithToast({
    mutationFn: (data: { storeId: string; weekStart: string }) => api<any>(`${BASE}/shifts/publish`, { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Woche veröffentlicht.',
    errorMessage: 'Woche konnte nicht veröffentlicht werden.',
  });
}

// ── Availability ─────────────────────────────────────
export function useAvailability(params?: { storeId?: string; userId?: string; from?: string; to?: string }) {
  const sp = new URLSearchParams();
  if (params?.storeId) sp.set('storeId', params.storeId);
  if (params?.userId) sp.set('userId', params.userId);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  return useQuery({
    queryKey: ['shift', 'availability', params],
    queryFn: () => api<any[]>(`${BASE}/availability?${sp}`),
  });
}

export function useSetAvailability() {
  return useMutationWithToast({
    mutationFn: (data: any) => api<any>(`${BASE}/availability`, { method: 'PUT', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Verfügbarkeit gespeichert.',
    errorMessage: 'Verfügbarkeit konnte nicht gespeichert werden.',
  });
}

// ── Swap Requests ────────────────────────────────────
export function useCreateSwapRequest() {
  return useMutationWithToast({
    mutationFn: (data: any) => api<any>(`${BASE}/swap-requests`, { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Tauschanfrage erstellt.',
    errorMessage: 'Tauschanfrage konnte nicht erstellt werden.',
  });
}

export function useUpdateSwapRequest() {
  return useMutationWithToast({
    mutationFn: ({ id, ...data }: any) => api<any>(`${BASE}/swap-requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Tauschanfrage aktualisiert.',
    errorMessage: 'Tauschanfrage konnte nicht aktualisiert werden.',
  });
}

// ── Time Tracking ────────────────────────────────────
export function useClock() {
  return useMutationWithToast({
    mutationFn: (data: { storeId: string; action: string; note?: string }) => api<any>(`${BASE}/clock`, { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['shift']],
    successMessage: 'Zeitstempel erfasst.',
    errorMessage: 'Zeitstempel konnte nicht erfasst werden.',
  });
}

export function useTimeEntries(params?: { storeId?: string; userId?: string; from?: string; to?: string }) {
  const sp = new URLSearchParams();
  if (params?.storeId) sp.set('storeId', params.storeId);
  if (params?.userId) sp.set('userId', params.userId);
  if (params?.from) sp.set('from', params.from);
  if (params?.to) sp.set('to', params.to);
  return useQuery({
    queryKey: ['shift', 'time-entries', params],
    queryFn: () => api<any>(`${BASE}/time-entries?${sp}`),
  });
}

// ── Dashboard ────────────────────────────────────────
export function useShiftDashboard(storeId?: string) {
  const sp = new URLSearchParams();
  if (storeId) sp.set('storeId', storeId);
  return useQuery({
    queryKey: ['shift', 'dashboard', storeId],
    queryFn: () => api<any>(`${BASE}/dashboard?${sp}`),
  });
}

// ── Templates ─────────────────────────────────────────
export function useShiftTemplates() {
  return useQuery({
    queryKey: ['shift', 'templates'],
    queryFn: () => api<any[]>(`${BASE}/templates`),
  });
}

export function useCreateShiftTemplate() {
  return useMutationWithToast({
    mutationFn: (data: any) => api<any>(`${BASE}/templates`, { method: 'POST', body: JSON.stringify(data) }),
    invalidateKeys: [['shift', 'templates']],
    successMessage: 'Vorlage erstellt.',
    errorMessage: 'Vorlage konnte nicht erstellt werden.',
  });
}

// ── Shift Entries (alias with from/to params) ─────────
export function useShiftEntries(params?: { storeId?: string; from?: string; to?: string; userId?: string }) {
  const sp = new URLSearchParams();
  if (params?.storeId) sp.set('storeId', params.storeId);
  if (params?.from) sp.set('weekStart', params.from);
  if (params?.to) sp.set('weekEnd', params.to);
  if (params?.userId) sp.set('userId', params.userId);
  return useQuery({
    queryKey: ['shift', 'entries', params],
    queryFn: () => api<any[]>(`${BASE}/shifts?${sp}`),
  });
}

export const useCreateShiftEntry = useCreateShift;
