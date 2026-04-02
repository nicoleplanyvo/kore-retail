import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';

// ---------- Types ----------

export interface StdStore {
  id: string;
  name: string;
  city: string | null;
}

export interface StdCategory {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  definitions: StdDefinition[];
}

export interface StdDefinition {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  unit: string | null;
  targetValue: number;
  operator: string;
  weight: number;
  category?: { id: string; name: string };
}

export interface StdScore {
  id: string;
  evaluationId: string;
  definitionId: string;
  actualValue: number;
  passed: boolean;
  score: number;
  comment: string | null;
  definition?: StdDefinition & { category?: { id: string; name: string } };
}

export interface StdEvaluation {
  id: string;
  tenantId: string;
  storeId: string;
  evaluatedBy: string;
  period: string;
  overallScore: number | null;
  notes: string | null;
  status: 'IN_PROGRESS' | 'COMPLETED';
  evaluatedAt: string;
  completedAt: string | null;
  store?: { id: string; name: string; city: string | null };
  evaluator?: { id: string; name: string };
  scores?: StdScore[];
  _count?: { scores: number };
}

export interface EvaluationListResponse {
  data: StdEvaluation[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ScoreInput {
  definitionId: string;
  actualValue: number;
  comment?: string;
}

// ---------- Stores ----------

export function useStdStores() {
  return useQuery<StdStore[]>({
    queryKey: ['standards', 'stores'],
    queryFn: () => api('/api/tools/store-standards/stores'),
  });
}

// ---------- Categories ----------

export function useStdCategories() {
  return useQuery<StdCategory[]>({
    queryKey: ['standards', 'categories'],
    queryFn: () => api('/api/tools/store-standards/categories'),
  });
}

// ---------- Evaluations ----------

export function useStdEvaluations(storeId?: string, status?: string) {
  const params = new URLSearchParams();
  if (storeId) params.set('storeId', storeId);
  if (status) params.set('status', status);
  return useQuery<EvaluationListResponse>({
    queryKey: ['standards', 'evaluations', storeId, status],
    queryFn: () => api(`/api/tools/store-standards/evaluations?${params}`),
  });
}

export function useStdEvaluation(id?: string) {
  return useQuery<StdEvaluation>({
    queryKey: ['standards', 'evaluation', id],
    queryFn: () => api(`/api/tools/store-standards/evaluations/${id}`),
    enabled: !!id,
  });
}

export function useCreateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { storeId: string; period: string; notes?: string }) =>
      api<StdEvaluation>('/api/tools/store-standards/evaluations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['standards', 'evaluations'] });
    },
  });
}

export function useUpdateEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      scores,
      notes,
    }: {
      id: string;
      scores?: ScoreInput[];
      notes?: string;
    }) =>
      api<StdEvaluation>(`/api/tools/store-standards/evaluations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ scores, notes }),
      }),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['standards', 'evaluation', variables.id] });
      qc.invalidateQueries({ queryKey: ['standards', 'evaluations'] });
    },
  });
}

export function useSaveScore() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      evaluationId,
      definitionId,
      actualValue,
      comment,
    }: {
      evaluationId: string;
      definitionId: string;
      actualValue: number;
      comment?: string;
    }) =>
      api<StdScore>(
        `/api/tools/store-standards/evaluations/${evaluationId}/scores/${definitionId}`,
        {
          method: 'PUT',
          body: JSON.stringify({ actualValue, comment }),
        },
      ),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ['standards', 'evaluation', variables.evaluationId],
      });
    },
  });
}

export function useCompleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api<StdEvaluation>(
        `/api/tools/store-standards/evaluations/${id}/complete`,
        { method: 'POST' },
      ),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ['standards', 'evaluation', id] });
      qc.invalidateQueries({ queryKey: ['standards', 'evaluations'] });
    },
  });
}

export function useDeleteEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api(`/api/tools/store-standards/evaluations/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['standards', 'evaluations'] });
    },
  });
}

// ---------- Reports ----------

export interface StdSummary {
  totalEvaluations: number;
  completedEvaluations: number;
  averageScore: number;
  passRate: number;
  totalDefinitions: number;
}

export function useStdSummary() {
  return useQuery<StdSummary>({
    queryKey: ['standards', 'summary'],
    queryFn: () => api('/api/tools/store-standards/reports/summary'),
  });
}

// ---------- Score calculation (client-side preview) ----------

export function evaluateScorePreview(
  actualValue: number,
  targetValue: number,
  operator: string,
): { passed: boolean; score: number } {
  let passed = false;
  switch (operator) {
    case 'GTE': passed = actualValue >= targetValue; break;
    case 'LTE': passed = actualValue <= targetValue; break;
    case 'EQ':  passed = actualValue === targetValue; break;
    case 'GT':  passed = actualValue > targetValue; break;
    case 'LT':  passed = actualValue < targetValue; break;
    default:    passed = actualValue >= targetValue;
  }

  if (passed) return { passed, score: 100 };

  let score = 0;
  if (operator === 'GTE' || operator === 'GT') {
    score = targetValue > 0 ? Math.max(0, Math.round((actualValue / targetValue) * 100)) : 0;
  } else if (operator === 'LTE' || operator === 'LT') {
    score = actualValue > 0 ? Math.max(0, Math.round((targetValue / actualValue) * 100)) : 100;
  }

  return { passed, score: Math.min(100, score) };
}
