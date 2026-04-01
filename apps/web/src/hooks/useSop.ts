import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiUpload } from '../lib/api';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ── Types ──────────────────────────────────────────

interface StoreOption { id: string; name: string; city: string | null; }

interface SopCategorySummary {
  id: string; name: string; sortOrder: number; isActive: boolean;
  _count?: { documents: number };
}

interface SopAttachment {
  id: string;
  sopId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface SopDocumentSummary {
  id: string; title: string; version: number; status: string;
  categoryId: string; publishedAt: string | null; updatedAt: string;
  deadline: string | null; isMandatory: boolean; isOverdue: boolean;
  category?: { id: string; name: string };
  creator?: { id: string; name: string };
  _count?: { acknowledgments: number; attachments: number };
}

interface SopDocumentDetail {
  id: string; tenantId: string | null; categoryId: string; title: string;
  content: string; version: number; status: string; createdBy: string;
  attachmentPath: string | null; publishedAt: string | null;
  deadline: string | null; isMandatory: boolean; isOverdue: boolean;
  createdAt: string; updatedAt: string;
  category?: { id: string; name: string };
  creator?: { id: string; name: string };
  attachments?: SopAttachment[];
  _count?: { acknowledgments: number; attachments: number };
  /** Whether the current user has already acknowledged this document */
  userAcknowledged?: boolean;
}

interface AcknowledgmentUser {
  id: string;
  name: string;
  email: string;
  acknowledgedAt: string;
}

interface AcknowledgmentResponse {
  totalReports: number;
  acknowledged: number;
  users: AcknowledgmentUser[];
}

interface AcknowledgmentStatusItem {
  sopId: string; title: string; status: string;
  category?: { id: string; name: string };
  publishedAt: string | null; acknowledgedCount: number; totalUsers: number;
  acknowledgedPercent: number;
  isMandatory: boolean;
  deadline: string | null;
  isOverdue: boolean;
}

interface ComplianceUser {
  userId: string;
  name: string;
  email: string;
  readCount: number;
  totalMandatory: number;
  readPercent: number;
}

interface ComplianceReport {
  totalMandatory: number;
  users: ComplianceUser[];
}

interface OverdueItem {
  sopId: string;
  title: string;
  deadline: string;
  category?: { id: string; name: string };
  acknowledgedCount: number;
  totalUsers: number;
  acknowledgedPercent: number;
}

interface PaginatedResponse<T> { data: T[]; total: number; page: number; pageSize: number; }

// ── Queries ────────────────────────────────────────

export function useSopStores() {
  return useQuery<StoreOption[]>({
    queryKey: ['sop', 'stores'],
    queryFn: () => api('/api/tools/sop/stores'),
  });
}

export function useSopCategories() {
  return useQuery<SopCategorySummary[]>({
    queryKey: ['sop', 'categories'],
    queryFn: () => api('/api/tools/sop/categories'),
  });
}

export function useSopDocuments(params: {
  page?: number;
  categoryId?: string;
  status?: string;
  search?: string;
  mandatory?: boolean;
  overdue?: boolean;
} = {}) {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.categoryId) qs.set('categoryId', params.categoryId);
  if (params.status) qs.set('status', params.status);
  if (params.search) qs.set('search', params.search);
  if (params.mandatory) qs.set('mandatory', 'true');
  if (params.overdue) qs.set('overdue', 'true');
  const query = qs.toString();
  return useQuery<PaginatedResponse<SopDocumentSummary>>({
    queryKey: ['sop', 'documents', params],
    queryFn: () => api(`/api/tools/sop/documents${query ? '?' + query : ''}`),
  });
}

export function useSopDocument(id?: string) {
  return useQuery<SopDocumentDetail>({
    queryKey: ['sop', 'document', id],
    queryFn: () => api(`/api/tools/sop/documents/${id}`),
    enabled: !!id,
  });
}

export function useSopAcknowledgments(sopId?: string) {
  return useQuery<AcknowledgmentResponse>({
    queryKey: ['sop', 'acknowledgments', sopId],
    queryFn: () => api(`/api/tools/sop/documents/${sopId}/acknowledgments`),
    enabled: !!sopId,
  });
}

export function useSopAcknowledgmentStatus() {
  return useQuery<AcknowledgmentStatusItem[]>({
    queryKey: ['sop', 'acknowledgment-status'],
    queryFn: () => api('/api/tools/sop/reports/acknowledgment-status'),
  });
}

export function useSopCompliance() {
  return useQuery<ComplianceReport>({
    queryKey: ['sop', 'compliance'],
    queryFn: () => api('/api/tools/sop/reports/compliance'),
  });
}

export function useSopOverdue() {
  return useQuery<OverdueItem[]>({
    queryKey: ['sop', 'overdue'],
    queryFn: () => api('/api/tools/sop/reports/overdue'),
  });
}

export function useSopAttachments(sopId?: string) {
  return useQuery<SopAttachment[]>({
    queryKey: ['sop', 'attachments', sopId],
    queryFn: () => api(`/api/tools/sop/documents/${sopId}/attachments`),
    enabled: !!sopId,
  });
}

// ── Mutations ──────────────────────────────────────

export function useCreateSop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      content: string;
      categoryId: string;
      isGlobal?: boolean;
      deadline?: string | null;
      isMandatory?: boolean;
    }) =>
      api<SopDocumentDetail>('/api/tools/sop/documents', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useUpdateSop(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title?: string;
      content?: string;
      categoryId?: string;
      deadline?: string | null;
      isMandatory?: boolean;
    }) =>
      api<SopDocumentDetail>(`/api/tools/sop/documents/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function usePublishSop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<SopDocumentDetail>(`/api/tools/sop/documents/${id}/publish`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useArchiveSop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<SopDocumentDetail>(`/api/tools/sop/documents/${id}/archive`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useAcknowledgeSop() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/tools/sop/documents/${id}/acknowledge`, { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useUploadSopAttachments(sopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      return apiUpload<SopAttachment[]>(`/api/tools/sop/documents/${sopId}/attachments`, formData);
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useDeleteSopAttachment(sopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attachmentId: string) =>
      api(`/api/tools/sop/documents/${sopId}/attachments/${attachmentId}`, { method: 'DELETE' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop'] }); },
  });
}

export function useCreateSopCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; sortOrder?: number; isGlobal?: boolean }) =>
      api('/api/tools/sop/categories', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sop', 'categories'] }); },
  });
}

// Re-export types for use in components
export type { SopDocumentSummary, SopDocumentDetail, SopAttachment, AcknowledgmentResponse, AcknowledgmentStatusItem, ComplianceReport, ComplianceUser, OverdueItem };
