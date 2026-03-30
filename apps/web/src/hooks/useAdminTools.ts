import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string | null;
  isActive: boolean;
}

export function useAdminTools() {
  return useQuery<ToolDefinition[]>({
    queryKey: ['admin', 'tools'],
    queryFn: () => api<ToolDefinition[]>('/api/admin/tools'),
  });
}
