import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { StoreToolAssignment } from '@kore/types';

/**
 * Holt alle Tools, auf die der aktuelle User Zugriff hat.
 * Ruft GET /api/tools auf (user-scoped, nicht admin-katalog).
 * Gibt deduplizierte Tool-Assignments zurueck.
 */
export function useMyTools() {
  return useQuery<StoreToolAssignment[]>({
    queryKey: ['my-tools'],
    queryFn: () => api('/api/tools'),
  });
}
